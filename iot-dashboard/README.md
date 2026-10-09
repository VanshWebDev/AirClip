# TBLS IoT Dashboard

A standalone Next.js dashboard that lives beside the existing AirClip Vite frontend without replacing it.

## Requirements

- Node.js 20.9+ and npm
- The AirClipServer backend on branch iot-postgres-mqtt
- PostgreSQL database tbls_iot with migrations/001_initial_postgres_schema.sql already applied
- While the Pico is unavailable, backend IOT_MODE=simulator

## Run it locally

From this folder:

~~~bash
npm install
~~~

Copy .env.example to .env.local and keep these development values unless your backend uses a different port:

~~~env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
~~~

Then run:

~~~bash
npm run dev
~~~

The dashboard runs at http://localhost:3000.

## Authentication

The IoT API and Socket.IO connection use the AirClipServer signed login cookie. Sign in through the existing AirClip Vite app in the same browser (typically http://localhost:5173/#/login) before sending commands. The backend must allow http://localhost:3000 in CORS. If the API or dashboard uses different hostnames, ensure the cookie domain and HTTPS settings are compatible; do not weaken cookie security in production just to make local development work.

## Dashboard behavior

- Controls issue POST /api/iot/devices/TBLS00001/commands with LED_ON or LED_OFF.
- Command history and events load from PostgreSQL-backed REST endpoints.
- Socket.IO listens for iot:command.created, iot:command.updated, iot:event.created, iot:device.updated, and broker status events.
- The page also refreshes persisted state every 15 seconds so a missed WebSocket event does not permanently leave the UI stale.
- Simulator results are labelled as simulated and explicitly do not claim that a real Pico acknowledged or executed the command.

The app does not connect directly to MQTT. The backend is the only MQTT publisher, so credentials stay server-side.
