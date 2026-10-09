"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { io, type Socket } from "socket.io-client";
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Cpu,
  Database,
  History,
  Lightbulb,
  RadioTower,
  RefreshCw,
  ShieldCheck,
  Terminal,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";

const DEVICE_ID = "TBLS00001";
const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000").replace(/\/$/, "");
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || API_BASE;

type LedState = "on" | "off" | "unknown";
type IotMode = "simulator" | "mqtt";
type CommandStatus = "pending" | "sent" | "simulated" | "succeeded" | "failed";

interface Device {
  deviceId: string;
  name: string | null;
  status: string;
  lastSeen: string | null;
  ledState: LedState;
  stateSource: string;
  createdAt: string;
  updatedAt: string;
}

interface DeviceCommand {
  commandId: string;
  deviceId: string;
  command: "LED_ON" | "LED_OFF";
  status: CommandStatus;
  requestedBy: string | null;
  result: {
    simulated?: boolean;
    ledState?: string;
    note?: string;
  } | null;
  errorMessage: string | null;
  createdAt: string;
  sentAt: string | null;
  completedAt: string | null;
}

interface DeviceEvent {
  id: number;
  deviceId: string;
  eventType: string;
  severity: "debug" | "info" | "warning" | "error";
  message: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

interface ApiErrorBody {
  message?: string;
}

async function requestJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(API_BASE + "/api/iot" + path, {
    ...options,
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const body: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? String((body as ApiErrorBody).message ?? "Request failed")
        : "Request failed with status " + response.status;
    if (response.status === 401) {
      throw new Error("Sign in to AirClip first. The dashboard uses your existing signed login cookie.");
    }
    throw new Error(message);
  }
  return body as T;
}

function prettyTime(value?: string | null) {
  if (!value) return "Never";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown"
    : date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function timeAgo(value?: string | null) {
  if (!value) return "No device heartbeat recorded";
  const milliseconds = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(milliseconds)) return "Time unavailable";
  if (milliseconds < 60_000) return "Seen less than a minute ago";
  if (milliseconds < 3_600_000) return "Seen " + Math.floor(milliseconds / 60_000) + " min ago";
  return "Seen " + Math.floor(milliseconds / 3_600_000) + " hr ago";
}

function StatusPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "green" | "amber" | "red" | "blue" }) {
  return <span className={"status-pill status-pill--" + tone}><span className="status-pill__dot" />{children}</span>;
}

function statusTone(status: string): "neutral" | "green" | "amber" | "red" | "blue" {
  if (status === "succeeded" || status === "simulated" || status === "online") return "green";
  if (status === "pending" || status === "sent" || status === "warning") return "amber";
  if (status === "failed" || status === "error") return "red";
  if (status === "info") return "blue";
  return "neutral";
}

function formatCommand(command: string) {
  return command === "LED_ON" ? "LED turned on" : command === "LED_OFF" ? "LED turned off" : command.replaceAll("_", " ");
}

export default function DashboardPage() {
  const [device, setDevice] = useState<Device | null>(null);
  const [commands, setCommands] = useState<DeviceCommand[]>([]);
  const [events, setEvents] = useState<DeviceEvent[]>([]);
  const [mode, setMode] = useState<IotMode>("simulator");
  const [socketConnected, setSocketConnected] = useState(false);
  const [mqttConnected, setMqttConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      const [deviceResponse, commandResponse, eventResponse] = await Promise.all([
        requestJson<{ devices: Device[]; mode: IotMode }>("/devices"),
        requestJson<{ commands: DeviceCommand[] }>("/devices/" + DEVICE_ID + "/commands?limit=50"),
        requestJson<{ events: DeviceEvent[] }>("/devices/" + DEVICE_ID + "/events?limit=100"),
      ]);

      setDevice(deviceResponse.devices.find((item) => item.deviceId === DEVICE_ID) ?? null);
      setMode(deviceResponse.mode);
      setCommands(commandResponse.commands);
      setEvents(eventResponse.events);
      setError("");
      setLastUpdated(new Date());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load the IoT dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const socket: Socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    const onConnect = () => {
      if (!active) return;
      setSocketConnected(true);
      socket.emit("iot:subscribe", DEVICE_ID);
    };
    const onDisconnect = () => setSocketConnected(false);
    const onConnectError = (connectError: Error) => {
      setSocketConnected(false);
      console.warn("IoT Socket.IO connection error:", connectError.message);
    };
    const onBrokerStatus = (payload: { connected?: boolean }) => {
      setMqttConnected(Boolean(payload.connected));
    };
    const onCommand = (command: DeviceCommand) => {
      setCommands((current) =>
        [command, ...current.filter((item) => item.commandId !== command.commandId)].slice(0, 50),
      );
    };
    const onEvent = (event: DeviceEvent) => {
      setEvents((current) => [event, ...current.filter((item) => item.id !== event.id)].slice(0, 100));
    };
    const onDevice = (payload: Partial<Device> & { deviceId: string }) => {
      if (payload.deviceId !== DEVICE_ID) return;
      setDevice((current) =>
        current ? { ...current, ...payload } : {
          deviceId: DEVICE_ID,
          name: "TBLS LED Test Device",
          status: payload.status ?? "offline",
          lastSeen: payload.lastSeen ?? null,
          ledState: payload.ledState ?? "unknown",
          stateSource: payload.stateSource ?? "unknown",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      );
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("iot:broker.status", onBrokerStatus);
    socket.on("iot:command.created", onCommand);
    socket.on("iot:command.updated", onCommand);
    socket.on("iot:event.created", onEvent);
    socket.on("iot:device.updated", onDevice);

    void loadDashboard();
    const refreshTimer = window.setInterval(() => void loadDashboard(), 15_000);

    return () => {
      active = false;
      window.clearInterval(refreshTimer);
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [loadDashboard]);

  const sendCommand = async (command: "LED_ON" | "LED_OFF") => {
    if (busy) return;
    setBusy(true);
    setNotice("");
    setError("");
    try {
      const response = await requestJson<{ command: DeviceCommand & { mode: IotMode; simulated: boolean } }>(
        "/devices/" + DEVICE_ID + "/commands",
        {
          method: "POST",
          body: JSON.stringify({ command }),
        },
      );
      setCommands((current) =>
        [response.command, ...current.filter((item) => item.commandId !== response.command.commandId)].slice(0, 50),
      );
      setNotice(
        response.command.mode === "simulator"
          ? "Simulated command accepted. No physical Pico was contacted."
          : "MQTT publish accepted. Waiting for a real device acknowledgement in a later firmware step.",
      );
      await loadDashboard();
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Command could not be sent.");
    } finally {
      setBusy(false);
    }
  };

  const recentCommands = useMemo(() => commands.slice(0, 8), [commands]);
  const recentEvents = useMemo(() => events.slice(0, 7), [events]);
  const isLedOn = device?.ledState === "on";
  const connectionLabel = mode === "simulator"
    ? "Simulator mode"
    : mqttConnected
      ? "MQTT connected"
      : "MQTT reconnecting";

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" aria-label="TBLS Control Center home">
          <span className="brand-mark"><Cpu size={23} strokeWidth={2.1} /></span>
          <span className="brand-copy"><strong>TBLS</strong><span>CONTROL CENTER</span></span>
        </a>

        <div className="sidebar-section-label">WORKSPACE</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <a className="nav-link nav-link--active" href="#overview"><Activity size={18} /><span>Overview</span><ChevronRight size={15} className="nav-link__chevron" /></a>
          <a className="nav-link" href="#devices"><Cpu size={18} /><span>Devices</span></a>
          <a className="nav-link" href="#commands"><Terminal size={18} /><span>Command history</span></a>
          <a className="nav-link" href="#activity"><History size={18} /><span>Activity log</span></a>
        </nav>

        <div className="sidebar-section-label sidebar-section-label--lower">SYSTEM</div>
        <div className="sidebar-system-card">
          <div className="sidebar-system-card__icon"><ShieldCheck size={18} /></div>
          <div><strong>Protected API</strong><span>AirClip session cookie</span></div>
          <span className="tiny-green-dot" />
        </div>

        <div className="sidebar-bottom">
          <div className="avatar">TB</div>
          <div className="sidebar-bottom__user"><strong>TBLS Operator</strong><span>Development workspace</span></div>
          <CircleHelp size={17} className="sidebar-help" />
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>Overview</strong></div>
          <div className="topbar-right">
            <span className="environment-label"><span /> DEVELOPMENT</span>
            <div className="connection-indicator">
              {socketConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
              <span>{socketConnected ? "Live updates connected" : "Reconnecting live updates"}</span>
            </div>
            <button className="icon-button" title="Refresh dashboard" onClick={() => void loadDashboard()}><RefreshCw size={17} /></button>
          </div>
        </header>

        <div className="content">
          <section id="overview" className="page-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> DEVICE OPERATIONS</div>
              <h1>Overview</h1>
              <p>Monitor your TBLS device and issue remote LED commands.</p>
            </div>
            <div className="last-updated"><span>LAST SYNC</span><strong>{lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "—"}</strong></div>
          </section>

          {error && <div className="alert alert--error" role="alert"><AlertCircle size={18} /><span>{error}</span><button onClick={() => setError("")} aria-label="Dismiss error">×</button></div>}
          {notice && <div className="alert alert--notice" role="status"><Check size={18} /><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss message">×</button></div>}

          <section className="stats-grid" aria-label="Device metrics">
            <article className="stat-card">
              <div className="stat-card__top"><span>REGISTERED DEVICE</span><div className="stat-icon stat-icon--blue"><Cpu size={18} /></div></div>
              <div className="stat-value">{loading ? "…" : device ? "01" : "00"}</div>
              <div className="stat-foot"><span className="stat-foot__bullet stat-foot__bullet--blue" />{device?.deviceId ?? "Device not registered"}</div>
            </article>
            <article className="stat-card">
              <div className="stat-card__top"><span>COMMANDS RECORDED</span><div className="stat-icon stat-icon--purple"><Terminal size={18} /></div></div>
              <div className="stat-value">{commands.length.toString().padStart(2, "0")}</div>
              <div className="stat-foot"><ArrowDownRight size={14} /> Latest 50 commands loaded</div>
            </article>
            <article className="stat-card">
              <div className="stat-card__top"><span>DEVICE OUTPUT</span><div className={"stat-icon " + (isLedOn ? "stat-icon--green" : "stat-icon--amber")}><Lightbulb size={18} /></div></div>
              <div className="stat-value stat-value--state">{device?.ledState ? device.ledState.toUpperCase() : "UNKNOWN"}</div>
              <div className="stat-foot"><span className={"stat-foot__bullet " + (isLedOn ? "stat-foot__bullet--green" : "stat-foot__bullet--amber")} />{device?.stateSource === "simulated" ? "Simulated device state" : device?.stateSource === "device" ? "Reported by device" : "Waiting for state"}</div>
            </article>
            <article className="stat-card">
              <div className="stat-card__top"><span>ACTIVITY EVENTS</span><div className="stat-icon stat-icon--teal"><Activity size={18} /></div></div>
              <div className="stat-value">{events.length.toString().padStart(2, "0")}</div>
              <div className="stat-foot"><span className="stat-foot__bullet stat-foot__bullet--teal" />Live and persisted records</div>
            </article>
          </section>

          <section id="devices" className="section-block">
            <div className="section-heading">
              <div><h2>Device control</h2><p>Manage outputs and inspect the device connection state.</p></div>
              <StatusPill tone={mode === "simulator" ? "amber" : mqttConnected ? "green" : "red"}>{connectionLabel}</StatusPill>
            </div>

            <div className="device-grid">
              <article className="device-card">
                <div className="device-card__header">
                  <div className="device-name-wrap">
                    <div className="device-icon"><Cpu size={22} /></div>
                    <div><h3>{device?.name || "TBLS LED Test Device"}</h3><span className="device-id">{DEVICE_ID}</span></div>
                  </div>
                  <StatusPill tone={device?.status === "online" ? "green" : "neutral"}>{device?.status ?? "loading"}</StatusPill>
                </div>
                <div className="device-meta-grid">
                  <div><span>Last seen</span><strong>{timeAgo(device?.lastSeen)}</strong></div>
                  <div><span>Communication</span><strong>{mode === "simulator" ? "Simulated" : "4G LTE · MQTT TLS"}</strong></div>
                  <div><span>Current output</span><strong className={isLedOn ? "text-green" : ""}>{device?.ledState?.toUpperCase() ?? "UNKNOWN"}</strong></div>
                  <div><span>State source</span><strong>{device?.stateSource ?? "unknown"}</strong></div>
                </div>
                <div className="device-card__footer"><span><span className="tiny-green-dot" /> Authorized device ID</span><span>Updated {prettyTime(device?.updatedAt)}</span></div>
              </article>

              <article className={"led-card " + (isLedOn ? "led-card--on" : "")}>
                <div className="led-card__top"><span className="led-card__label">OUTPUT CONTROL</span><span className="led-card__pin">GPIO15</span></div>
                <div className={"led-visual " + (isLedOn ? "led-visual--on" : "")}><Lightbulb size={38} strokeWidth={1.65} /></div>
                <h3>{isLedOn ? "LED is on" : device?.ledState === "off" ? "LED is off" : "LED output"}</h3>
                <p>{mode === "simulator" ? "Commands run in simulation while the Pico is unavailable." : "Commands are sent through MQTT. Hardware state requires a device acknowledgement."}</p>
                <div className="led-actions">
                  <button className="button button--on" disabled={busy || (mode === "mqtt" && !mqttConnected)} onClick={() => void sendCommand("LED_ON")}><Zap size={16} />{busy ? "Sending…" : "Turn ON"}</button>
                  <button className="button button--off" disabled={busy || (mode === "mqtt" && !mqttConnected)} onClick={() => void sendCommand("LED_OFF")}><Lightbulb size={16} />Turn OFF</button>
                </div>
                <div className="led-card__disclaimer"><AlertCircle size={13} />{mode === "simulator" ? "Simulated result · not a physical acknowledgement" : "Publish status is not hardware confirmation"}</div>
              </article>
            </div>
          </section>

          <section className="lower-grid">
            <article id="commands" className="panel">
              <div className="panel-heading">
                <div className="panel-heading__icon panel-heading__icon--purple"><Terminal size={18} /></div>
                <div><h2>Recent commands</h2><p>Persistent command history</p></div>
                <a className="panel-link" href="#activity">View logs <ChevronRight size={14} /></a>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>COMMAND</th><th>STATUS</th><th>TIME</th></tr></thead>
                  <tbody>
                    {recentCommands.length === 0 ? (
                      <tr><td colSpan={3} className="empty-cell">{loading ? "Loading commands…" : "No commands yet. Turn the LED on to create the first record."}</td></tr>
                    ) : recentCommands.map((item) => (
                      <tr key={item.commandId}>
                        <td><div className="command-cell"><span className={"command-symbol " + (item.command === "LED_ON" ? "command-symbol--on" : "command-symbol--off")}><Lightbulb size={14} /></span><div><strong>{item.command.replace("_", " ")}</strong><span>{item.commandId.slice(0, 8)}</span></div></div></td>
                        <td><StatusPill tone={statusTone(item.status)}>{item.status}</StatusPill></td>
                        <td className="time-cell">{prettyTime(item.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {commands[0]?.result?.simulated && <div className="simulated-footnote"><AlertCircle size={14} />Latest result was generated by the simulator, not by hardware.</div>}
            </article>

            <article className="panel system-panel">
              <div className="panel-heading">
                <div className="panel-heading__icon panel-heading__icon--teal"><RadioTower size={18} /></div>
                <div><h2>Connectivity</h2><p>Application transport status</p></div>
              </div>
              <div className="connectivity-list">
                <div className="connectivity-row"><div className="connectivity-row__icon"><Database size={17} /></div><div className="connectivity-row__main"><strong>PostgreSQL</strong><span>Command & event storage</span></div><StatusPill tone="green">API ready</StatusPill></div>
                <div className="connectivity-row"><div className="connectivity-row__icon"><Activity size={17} /></div><div className="connectivity-row__main"><strong>Socket.IO</strong><span>Live browser updates</span></div><StatusPill tone={socketConnected ? "green" : "amber"}>{socketConnected ? "Connected" : "Waiting"}</StatusPill></div>
                <div className="connectivity-row"><div className="connectivity-row__icon"><RadioTower size={17} /></div><div className="connectivity-row__main"><strong>MQTT broker</strong><span>{mode === "simulator" ? "Disabled in simulator" : "TLS connection"}</span></div><StatusPill tone={mode === "simulator" ? "amber" : mqttConnected ? "green" : "red"}>{mode === "simulator" ? "Simulated" : mqttConnected ? "Connected" : "Offline"}</StatusPill></div>
                <div className="connectivity-row"><div className="connectivity-row__icon"><Cpu size={17} /></div><div className="connectivity-row__main"><strong>TBLS00001</strong><span>Physical device heartbeat</span></div><StatusPill tone={device?.status === "online" ? "green" : "neutral"}>{device?.status ?? "Unknown"}</StatusPill></div>
              </div>
              <div className="security-note"><ShieldCheck size={16} /><span><strong>Authenticated API</strong><br />Use your AirClip login in the same browser to send commands.</span></div>
            </article>
          </section>

          <section id="activity" className="panel activity-panel">
            <div className="panel-heading">
              <div className="panel-heading__icon panel-heading__icon--blue"><History size={18} /></div>
              <div><h2>Live activity</h2><p>Command lifecycle and device events</p></div>
              <div className="live-tag"><span />LIVE</div>
            </div>
            <div className="activity-list">
              {recentEvents.length === 0 ? (
                <div className="empty-activity"><Clock3 size={19} /><span>{loading ? "Loading activity…" : "Your device events will appear here when you send your first command."}</span></div>
              ) : recentEvents.map((event) => (
                <div className="activity-row" key={event.id}>
                  <div className={"activity-marker activity-marker--" + event.severity}>{event.severity === "error" ? <AlertCircle size={15} /> : event.eventType.includes("completed") ? <Check size={15} /> : <Activity size={15} />}</div>
                  <div className="activity-row__body"><div className="activity-row__title"><strong>{event.message}</strong><StatusPill tone={statusTone(event.severity)}>{event.severity}</StatusPill></div><span>{event.eventType.replaceAll("_", " ")} · {DEVICE_ID}</span></div>
                  <time>{prettyTime(event.createdAt)}</time>
                </div>
              ))}
            </div>
            <div className="panel-footer"><span>{events.length} events loaded</span><span>Auto-refreshes every 15 seconds <RefreshCw size={12} /></span></div>
          </section>

          <footer className="page-footer"><span>TBLS CONTROL CENTER <span className="footer-separator">/</span> DEVELOPMENT BUILD</span><span>REST API · PostgreSQL · Socket.IO · MQTT</span></footer>
        </div>
      </section>
    </main>
  );
}
