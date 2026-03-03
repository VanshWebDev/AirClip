import { useNavigate } from "react-router-dom";
import styles from "../../styles/component/home/IfNotLogin.module.css";

export default function IfNotLogin() {
  const navigate = useNavigate();

  const navigateToLogin = (route: string) => {
    navigate(`${route}`);
  };

  return (
    <div className={styles.wrapper}>
      {/* Background decorative blobs */}
      <div className={styles.blobTopRight} />
      <div className={styles.blobBottomLeft} />

      {/* Hero Section */}
      <main className={styles.main}>
        <div className={styles.heroContainer}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Now in public beta
          </div>

          <h1 className={styles.heroTitle}>
            Everything your
            <br />
            <span className={styles.heroAccent}>team needs,</span>
            <br />
            in one place.
          </h1>

          <p className={styles.heroSubtitle}>
            Streamline workflows, collaborate in real time, and ship faster
            than ever. Built for teams who refuse to compromise on quality.
          </p>

          <div className={styles.ctaGroup}>
            <button
              className={styles.ctaPrimary}
              onClick={() => navigateToLogin("/signup")}
            >
              <span>Create free account</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className={styles.ctaSecondary}
              onClick={() => navigateToLogin("/login")}
            >
              Sign in to existing account
            </button>
          </div>

          <p className={styles.ctaNote}>No credit card required · Free forever plan</p>
        </div>

        {/* Feature Cards */}
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Unified Workspace</h3>
            <p className={styles.featureDesc}>
              Bring tasks, docs, and conversations into a single, focused environment.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.75"/>
                <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.75"/>
                <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.75"/>
                <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="1.75"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Real-time Collaboration</h3>
            <p className={styles.featureDesc}>
              Work together seamlessly — see changes instantly, comment in context.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Enterprise Security</h3>
            <p className={styles.featureDesc}>
              Bank-grade encryption, SSO, and fine-grained access controls built in.
            </p>
          </div>
        </div>

        {/* Social proof */}
        {/* <div className={styles.socialProof}>
          <p className={styles.socialProofLabel}>Trusted by teams at</p>
          <div className={styles.socialProofLogos}>
            {["Stripe", "Linear", "Vercel", "Notion", "Figma"].map((name) => (
              <span key={name} className={styles.socialProofLogo}>{name}</span>
            ))}
          </div>
        </div> */}
      </main>

      {/* ── Collaboration Section ── */}
      <section className={styles.collab}>
        <div className={styles.collabInner}>

          {/* Left: text + social */}
          <div className={styles.collabLeft}>
            <span className={styles.collabEyebrow}>Open Source</span>
            <h2 className={styles.collabTitle}>
              Built in public.<br />
              <span className={styles.collabTitleAccent}>Contribute & grow.</span>
            </h2>
            <p className={styles.collabDesc}>
              AirClip is open source and actively welcoming contributors. Whether you want
              to squash bugs, ship features, improve docs, or just share ideas — every
              contribution matters. Fork the repo and make it yours.
            </p>

            {/* GitHub buttons */}
            <div className={styles.collabLinks}>
              <a
                href="https://github.com/vanshwebdev"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.githubBtn}
              >
                {/* GitHub icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                View on GitHub
              </a>
              <a
                href="https://github.com/vanshwebdev"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.githubOutlineBtn}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                  <path d="M9 18c-4.51 2-5-2-7-2"/>
                </svg>
                Fork the Repo
              </a>
            </div>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/kumar_vanshx/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.instaCard}
            >
              <div className={styles.instaIcon}>
                {/* Instagram gradient icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#instaGrad)" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" stroke="url(#instaGrad)" strokeWidth="2"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="url(#instaGrad)"/>
                  <defs>
                    <linearGradient id="instaGrad" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#f9ce34"/>
                      <stop offset="0.4" stopColor="#ee2a7b"/>
                      <stop offset="1" stopColor="#6228d7"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className={styles.instaText}>
                <span className={styles.instaHandle}>@kumar_vanshx</span>
                <span className={styles.instaLabel}>Follow on Instagram</span>
              </div>
              <svg className={styles.instaArrow} width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {/* Right: tech stack + repo cards */}
          <div className={styles.collabRight}>

            {/* Tech Stack */}
            <div className={styles.stackBox}>
              <p className={styles.stackLabel}>Tech Stack</p>
              <div className={styles.stackPills}>
                {[
                  { name: "React", color: "#e8f4fd", text: "#0369a1" },
                  { name: "TypeScript", color: "#e8edf8", text: "#3451b2" },
                  { name: "Socket.IO", color: "#f0fdf4", text: "#15803d" },
                  { name: "Express.js", color: "#fafaf9", text: "#44403c" },
                  { name: "MongoDB", color: "#f0fdf4", text: "#166534" },
                  { name: "Redux Toolkit", color: "#faf5ff", text: "#7e22ce" },
                  { name: "Tailwind CSS", color: "#ecfeff", text: "#0e7490" },
                  { name: "shadcn/ui", color: "#fafaf9", text: "#292524" },
                  { name: "Vite", color: "#fff7ed", text: "#c2410c" },
                  { name: "JWT", color: "#fff1f2", text: "#be123c" },
                ].map((t) => (
                  <span
                    key={t.name}
                    className={styles.stackPill}
                    style={{ background: t.color, color: t.text }}
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Repo Cards */}
            <p className={styles.stackLabel} style={{ marginTop: "24px" }}>Repositories</p>
            <div className={styles.repoGrid}>
              {[
                { name: "AirClip", desc: "React Web App", icon: "🌐", url: "https://github.com/VanshWebDev/AirClip" },
                { name: "AirClipServer", desc: "Express.js Backend", icon: "⚙️", url: "https://github.com/VanshWebDev/AirClipServer" },
                { name: "AirClip Native", desc: "iOS & Android App", icon: "📱", url: "https://github.com/VanshWebDev/AirClip_React-native" },
                { name: "AirClip Desktop", desc: "Electron App", icon: "🖥️", url: "https://github.com/VanshWebDev/AirClip_react-electron" },
              ].map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.repoCard}
                >
                  <span className={styles.repoEmoji}>{repo.icon}</span>
                  <div>
                    <p className={styles.repoName}>{repo.name}</p>
                    <p className={styles.repoDesc}>{repo.desc}</p>
                  </div>
                  <svg className={styles.repoArrow} width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M3 13L13 3M13 3H7M13 3v6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2025 Nexus. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </footer>
    </div>
  );
}