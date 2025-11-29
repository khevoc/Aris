// ClearoApp.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import logo from "/logo.png";

/**
 * ClearoApp - Single-file premium fintech mockup
 * - Framer Motion + Recharts
 * - Login animation (logo rotates -180deg for 2s)
 * - Top logo animation same behavior
 * - Mobile-first responsive styles + advanced microinteractions
 *
 * Usage:
 *  - npm install framer-motion recharts
 *  - Place logo at public/logo.png
 *  - Import and render <ClearoApp />
 */

export default function ClearoApp() {
  // Theme and navigation
  const [theme, setTheme] = useState("dark"); // "dark" | "light"
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("dashboard"); // active section id
  const [loggedIn, setLoggedIn] = useState(false);

  // Animation flow states
  const [animatingLogin, setAnimatingLogin] = useState(false);
  const [logoTrigger, setLogoTrigger] = useState(0); // used to replay top logo anim

  // Mock data
  const chartData = [
    { day: "Mon", value: 125000 },
    { day: "Tue", value: 129500 },
    { day: "Wed", value: 127200 },
    { day: "Thu", value: 131800 },
    { day: "Fri", value: 134400 },
  ];

  const bankAccounts = [
    { id: "CL-001", name: "Operating - Clearo Bank", balance: 125400, currency: "USD" },
    { id: "CL-002", name: "Reserve - Global Trust", balance: 54000, currency: "USD" },
  ];

  const cards = [
    { id: "CARD-01", holder: "Clearo Corporate", type: "Debit", limit: 0 },
    { id: "CARD-02", holder: "Vendor Card", type: "Corporate Credit", limit: 50000 },
  ];

  const loans = [
    { id: "LN-1001", borrower: "Acme Real Estate", amount: 250000, status: "Active" },
    { id: "LN-1002", borrower: "GreenBuild Ltd.", amount: 120000, status: "Pending" },
  ];

  const escrows = [
    { id: "ESC-9001", parties: "Seller A ↔ Buyer B", amount: 245000, status: "Held" },
  ];

  const trades = [
    { id: "TR-3001", type: "Seller", object: "Apartment 12B", amount: 185000, status: "Draft" },
    { id: "TR-3002", type: "Buyer", object: "Warehouse #7", amount: 420000, status: "Negotiation" },
  ];

  const factoryContracts = [{ id: "FAC-01", title: "Mortgage Pool Factory", status: "Active" }];

  const advancePaymentOffers = [
    { id: "ADV-1", description: "2% discount for settlement within 7 days", discountPct: 2 },
  ];

  // color tokens
  const COLORS = {
    deepBlue: "#05264A",
    teal: "#16A085",
    lightGray: "#F2F4F6",
    darkBg: "#081018",
    cardDark: "#0f1316",
    textLight: "#F3F6F8",
    textDark: "#0b1220",
    accentWarn: "#ff692e",
  };

  // utility open section
  const openSection = (id) => {
    setActive(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Login flow: when user presses Sign In, play logo anim for 2s, then set loggedIn
  const handleSignIn = () => {
    setAnimatingLogin(true);
    // after 2s, complete and show dashboard
    setTimeout(() => {
      setAnimatingLogin(false);
      setLoggedIn(true);
      setActive("dashboard");
    }, 2000);
  };

  // Top logo click replay
  const triggerTopLogo = () => {
    setLogoTrigger((v) => v + 1);
  };

  // responsive wrapper styles computed
  const rootBg = theme === "dark" ? COLORS.darkBg : COLORS.lightGray;
  const textColor = theme === "dark" ? COLORS.textLight : COLORS.textDark;
  const cardBg = theme === "dark" ? COLORS.cardDark : "#ffffff";
  const borderColor = theme === "dark" ? "rgba(255,255,255,0.04)" : "#e8eef5";

  // small ref for focus
  const emailRef = useRef(null);

  useEffect(() => {
    if (!loggedIn) {
      // focus email input on mount
      if (emailRef.current) emailRef.current.focus();
    }
  }, [loggedIn]);

  // --- Animated Particle Background ---
useEffect(() => {
  const canvas = document.getElementById("particle-bg");
  const ctx = canvas.getContext("2d");

  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  const particles = Array.from({ length: 60 }).map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
  }));

  function draw() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
    });

    requestAnimationFrame(draw);
  }

  draw();

  const onResize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };

  window.addEventListener("resize", onResize);

  return () => window.removeEventListener("resize", onResize);
}, []);


  return (
    <div
      style={{
        background: rootBg,
        color: textColor,
        minHeight: "100vh",
        fontFamily:
          "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
        <canvas
  id="particle-bg"
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    opacity: 0.16,
  }}
></canvas>
      <style>{`
        /* Mobile-first layout + polished details */
        :root {
          --deep: ${COLORS.deepBlue};
          --teal: ${COLORS.teal};
          --light: ${COLORS.lightGray};
          --card: ${cardBg};
          --border: ${borderColor};
          --accent-warn: ${COLORS.accentWarn};
        }

        /* Reset-ish */
        * { box-sizing: border-box; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
        body, html, #root { margin:0; padding:0; height:100%; }

        /* Top navbar (mobile app style) */
        .navbar {
          height: 64px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding: 10px 16px;
          position: sticky;
          top: 0;
          z-index: 60;
          background: linear-gradient(180deg, rgba(0,0,0,0.12), transparent);
          backdrop-filter: blur(6px);
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .brand {
          display:flex; align-items:center; gap:12px;
        }

        .logo-pill {
          width:48px; height:48px; border-radius:12px;
          background: var(--deep);
          display:flex; align-items:center; justify-content:center;
          box-shadow: 0 10px 30px rgba(5,38,74,0.25), inset 0 -8px 20px rgba(0,0,0,0.18);
          cursor:pointer;
          overflow:hidden;
        }
        .logo-pill img { width: 72%; height:72%; object-fit:contain; user-drag: none; pointer-events:none; }

        .brand-title {
          display:flex; flex-direction:column;
        }
        .brand-title .title { font-weight:700; font-size:1rem; letter-spacing:0.2px; }
        .brand-title .subtitle { font-size:0.78rem; color: rgba(255,255,255,0.65); margin-top:2px; }

        .actions { display:flex; gap:10px; align-items:center; }

        /* Menu button */
        .btn {
          min-width:44px;
          padding: 8px 12px;
          border-radius:12px;
          border: 1px solid var(--border);
          background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
          color: inherit;
          font-weight:600;
          cursor:pointer;
          box-shadow: 0 6px 18px rgba(2,8,20,0.24);
          transition: transform .16s ease, box-shadow .16s ease, background .2s ease;
        }
        .btn:active { transform: translateY(1px) scale(0.995); }
        .btn.cta {
          background: linear-gradient(135deg, var(--teal), #0e9f88);
          color: white;
          border: none;
        }

        /* main wrap */
        .wrap { max-width: 1100px; margin: 0 auto; padding: 14px; }

        /* cards */
        .card {
          background: var(--card);
          border-radius: 14px;
          padding: 16px;
          border: 1px solid var(--border);
          box-shadow: 0 10px 40px rgba(2,8,24,0.28);
        }

        /* dashboard grid */
        .grid { display:grid; grid-template-columns: 1fr; gap: 14px; }
        @media(min-width: 980px) {
          .grid { grid-template-columns: 1fr 360px; gap:20px; align-items:start; }
        }

        /* table */
        table { width:100%; border-collapse: collapse; font-size:0.95rem; }
        th, td { padding: 10px 8px; text-align:left; border-bottom: 1px solid rgba(255,255,255,0.03); }
        thead th { color: rgba(255,255,255,0.55); font-weight:700; font-size:0.88rem; }

        /* micro */
        .muted { color: rgba(255,255,255,0.65); font-size:0.95rem; }
        .mini { font-size:0.88rem; color: rgba(255,255,255,0.62); }

        /* interactive list / menu overlay */
        .overlay {
          position: fixed;
          right: 12px;
          top: 74px;
          width:320px;
          max-height: 78vh;
          overflow:auto;
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          border-radius: 16px;
          padding: 12px;
          border: 1px solid var(--border);
          box-shadow: 0 30px 80px rgba(2,8,20,0.5);
          z-index: 99999;
        }
        @media(max-width:720px){
          .overlay { left: 12px; right: 12px; width: auto; top: 72px; max-height: calc(100vh - 110px); padding: 14px; }
        }

        .menu-item {
          padding: 12px; border-radius: 12px; cursor:pointer; margin-bottom: 8px;
          transition: transform .14s cubic-bezier(.2,.9,.3,1), background .14s;
          display:flex; flex-direction:column; gap:6px;
          background: linear-gradient(180deg, rgba(255,255,255,0.01), transparent);
        }
        .menu-item:hover { transform: translateX(6px); background: linear-gradient(90deg, rgba(22,160,133,0.12), rgba(22,160,133,0.06)); box-shadow: 0 8px 30px rgba(12,85,78,0.06); color: white; }
        .hint { font-size:0.88rem; color: rgba(255,255,255,0.6); }

        /* inputs */
        .input {
          width:100%; padding:12px 14px; border-radius:12px; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); color: inherit;
        }

        /* Fancy small cards */
        .stat {
          display:flex; justify-content:space-between; align-items:center; gap:8px; padding:14px; border-radius:12px;
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.03);
        }

        /* subtle button group */
        .seg { display:flex; gap:8px; }
        .pill { padding:8px 10px; border-radius:999px; font-weight:700; background: rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.04); cursor:pointer; }

        /* footer small */
        .tiny { font-size:0.82rem; color: rgba(255,255,255,0.5); }

      `}</style>

      {/* Intro overlay during login animation */}
      <AnimatePresence>
        {animatingLogin && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: COLORS.deepBlue,
              zIndex: 999998,
            }}
          >
            <motion.img
              src={logo}
              alt="Clearo"
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: -180, opacity: 1 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: 140, height: 140, borderRadius: 18, boxShadow: "0 24px 60px rgba(2,8,20,0.6)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
        
      {/* Main top navbar */}
      <header className="navbar" role="banner">
        <div className="brand" style={{ marginLeft: 6 }}>
          <motion.div
            className="logo-pill"
            onClick={() => {
              // play small top animation
              setLogoTrigger((v) => v + 1);
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* top logo uses logoTrigger to animate */}
            <AnimatePresence mode="wait">
              <motion.img
                key={logoTrigger}
                src={logo}
                alt="Clearo"
                initial={{ rotate: 0, opacity: 0 }}
                animate={{ rotate: -180, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: "70%", height: "70%", objectFit: "contain", pointerEvents: "none" }}
              />
            </AnimatePresence>
          </motion.div>

          <div className="brand-title" style={{ marginLeft: 4 }}>
            <div className="title">Clearo</div>
            <div className="subtitle">Banking · Escrow · Finance Ops</div>
          </div>
        </div>

        <div className="actions" style={{ marginRight: 6 }}>
          <button
            className="btn"
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen((s) => !s)}
            title="Open menu"
          >
            Menu ▾
          </button>

          <button
            className="btn cta"
            onClick={() => {
              // quick call to go to dashboard
              setActive("dashboard");
              setMenuOpen(false);
            }}
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="wrap" role="main">
        {/* LOGIN (mock) */}
        {!loggedIn ? (
          <div style={{ maxWidth: 540, margin: "64px auto" }} className="card" aria-live="polite">
            <motion.h2 initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
              Welcome to Clearo
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}>
              Securely manage bank accounts, escrow and finance operations.
            </motion.p>

            <div style={{ marginTop: 14 }}>
              <input ref={emailRef} className="input" placeholder="Email or username" />
              <input className="input" placeholder="Password" type="password" style={{ marginTop: 10 }} />
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                className="btn cta"
                onClick={() => {
                  // start animation then sign in
                  setAnimatingLogin(true);
                  // 2s animation then set logged in - handled in handleSignIn
                  handleSignIn();
                }}
                style={{ flex: 1 }}
              >
                Sign In
              </button>

              <button
                className="btn"
                onClick={() => alert("Demo: password reset flow")}
                aria-label="Forgot password"
              >
                Forgot
              </button>
            </div>

            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="tiny">Demo credentials: any email / password</div>
              <div style={{ display: "flex", gap: 8 }}>
                <div className="mini" style={{ color: "rgba(255,255,255,0.5)" }}>Theme:</div>
                <div className="seg">
                  <button className="pill" onClick={() => setTheme("dark")}>Dark</button>
                  <button className="pill" onClick={() => setTheme("light")}>Light</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Menu overlay */}
            <AnimatePresence>
              {menuOpen && (
                <motion.nav
                  className="overlay"
                  id="main-menu"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.99 }}
                  transition={{ duration: 0.28, ease: [0.2, 0.9, 0.3, 1] }}
                >
                  <div className="menu-item" onClick={() => openSection("dashboard")}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong>Dashboard</strong>
                      <span className="mini muted">Overview</span>
                    </div>
                    <div className="hint">Balances, cashflow and activity</div>
                  </div>

                  <div className="menu-item" onClick={() => openSection("bankaccounts")}>
                    <strong>Bank Accounts</strong>
                    <div className="hint">Link IBANs, SWIFT, verify accounts</div>
                  </div>

                  <div className="menu-item" onClick={() => openSection("cards")}>
                    <strong>Card Management</strong>
                    <div className="hint">Issue, limit and monitor cards</div>
                  </div>

                  <div className="menu-item" onClick={() => openSection("loans")}>
                    <strong>Loans & Credits</strong>
                    <div className="hint">Create and manage credit facilities</div>
                  </div>

                  <div className="menu-item" onClick={() => openSection("escrow")}>
                    <strong>Escrow</strong>
                    <div className="hint">Create and release escrow contracts</div>
                  </div>

                  <div className="menu-item" onClick={() => openSection("factory")}>
                    <strong>Factory</strong>
                    <div className="hint">Structured products & pooled finance</div>
                  </div>

                  <div className="menu-item" onClick={() => openSection("advance")}>
                    <strong>Advance Payment</strong>
                    <div className="hint">Early payment discounts</div>
                  </div>

                  <div className="menu-item" onClick={() => openSection("trades")}>
                    <strong>Real Estate Trades</strong>
                    <div className="hint">Seller / buyer contract flow (non-crypto)</div>
                  </div>

                  <div className="menu-item" onClick={() => openSection("release")}>
                    <strong>Release Payment</strong>
                    <div className="hint">Approve or reject escrow releases</div>
                  </div>

                  <div className="menu-item" onClick={() => openSection("user")}>
                    <strong>User Profile</strong>
                    <div className="hint">Roles, 2FA and audit logs</div>
                  </div>

                  <div style={{ height: 1, background: "rgba(255,255,255,0.03)", margin: "12px 0", borderRadius: 2 }} />

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <div className="mini muted">Theme</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                        <button className="pill" onClick={() => setTheme("dark")}>Dark</button>
                        <button className="pill" onClick={() => setTheme("light")}>Light</button>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <button className="btn" onClick={() => { setLoggedIn(false); setMenuOpen(false); }}>Sign Out</button>
                    </div>
                  </div>
                </motion.nav>
              )}
            </AnimatePresence>

            {/* Main sections container */}
            <div className="grid" style={{ marginTop: 18 }}>
              <div>
                {/* Dashboard */}
                <AnimatePresence mode="wait">
                  {active === "dashboard" && (
                    <motion.section
                      className="card"
                      key="dashboard"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.28 }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                        <div>
                          <h3 style={{ margin: 0 }}>Total Liquidity</h3>
                          <div className="muted">Combined bank balances & cash equivalents</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 800, fontSize: 20 }}>$179,400</div>
                          <div className="tiny muted">Updated: Today</div>
                        </div>
                      </div>

                      <div style={{ height: 260, marginTop: 14 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#071722" : "#eef6fb"} />
                            <XAxis dataKey="day" stroke={theme === "dark" ? "#8fa3a7" : "#64748b"} />
                            <YAxis stroke={theme === "dark" ? "#8fa3a7" : "#64748b"} />
                            <Tooltip contentStyle={{ background: theme === "dark" ? "#071017" : "#fff" }} />
                            <Line type="monotone" dataKey="value" stroke={COLORS.teal} strokeWidth={3} dot={{ r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                        <button className="btn cta" onClick={() => openSection("bankaccounts")}>New Transfer</button>
                        <button className="btn cta" onClick={() => openSection("escrow")} style={{ background: "linear-gradient(135deg,#0f8e78,#14ac93)" }}>Create Escrow</button>
                        <button className="btn" onClick={() => alert("Reports demo")}>Reports</button>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>

                {/* Bank Accounts */}
                <AnimatePresence mode="wait">
                  {active === "bankaccounts" && (
                    <motion.section className="card" key="bankaccounts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.24 }}>
                      <h3 style={{ margin: 0 }}>Bank Account Management</h3>
                      <div className="muted" style={{ marginTop: 6 }}>Add, verify and manage external bank accounts (IBAN, SWIFT)</div>

                      <div style={{ marginTop: 12 }}>
                        <table>
                          <thead><tr><th>Account</th><th>Ref</th><th>Balance</th><th></th></tr></thead>
                          <tbody>
                            {bankAccounts.map(a => (
                              <tr key={a.id}>
                                <td>{a.name}</td>
                                <td className="mini muted">{a.id}</td>
                                <td style={{ fontWeight: 700 }}>${a.balance.toLocaleString()}</td>
                                <td><button className="btn" onClick={() => alert("Account details demo")}>View</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                          <button className="btn cta">Link Bank Account</button>
                          <button className="btn" onClick={() => alert("Verify via micro-deposits demo")}>Verify</button>
                        </div>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>

                {/* Cards */}
                <AnimatePresence mode="wait">
                  {active === "cards" && (
                    <motion.section className="card" key="cards" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.24 }}>
                      <h3 style={{ margin: 0 }}>Card Management</h3>
                      <div className="muted" style={{ marginTop: 6 }}>Issue cards, set spend limits, manage vendors.</div>

                      <div style={{ marginTop: 12 }}>
                        <table>
                          <thead><tr><th>Card</th><th>Holder</th><th>Type</th><th>Limit</th><th></th></tr></thead>
                          <tbody>
                            {cards.map(c => (
                              <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.holder}</td>
                                <td>{c.type}</td>
                                <td>{c.limit ? `$${c.limit.toLocaleString()}` : "—"}</td>
                                <td><button className="btn" onClick={() => alert("Manage card demo")}>Manage</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                          <button className="btn cta">Issue New Card</button>
                          <button className="btn" onClick={() => alert("Export demo")}>Export</button>
                        </div>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>

                {/* Loans */}
                <AnimatePresence mode="wait">
                  {active === "loans" && (
                    <motion.section className="card" key="loans" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.24 }}>
                      <h3 style={{ margin: 0 }}>Loans & Credit Lines</h3>
                      <div className="muted" style={{ marginTop: 6 }}>View active loans and manage schedules</div>

                      <div style={{ marginTop: 12 }}>
                        <table>
                          <thead><tr><th>ID</th><th>Borrower</th><th>Amount</th><th>Status</th><th></th></tr></thead>
                          <tbody>
                            {loans.map(l => (
                              <tr key={l.id}>
                                <td>{l.id}</td>
                                <td>{l.borrower}</td>
                                <td>${l.amount.toLocaleString()}</td>
                                <td className="mini muted">{l.status}</td>
                                <td><button className="btn" onClick={() => alert("Loan details demo")}>Details</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                          <button className="btn cta">Create Loan</button>
                          <button className="btn" onClick={() => alert("Run credit check demo")}>Run Credit Check</button>
                        </div>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>

                {/* Escrow */}
                <AnimatePresence mode="wait">
                  {active === "escrow" && (
                    <motion.section className="card" key="escrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.24 }}>
                      <h3 style={{ margin: 0 }}>Escrow Management</h3>
                      <div className="muted" style={{ marginTop: 6 }}>Create, review and release escrow contracts</div>

                      <div style={{ marginTop: 12 }}>
                        <table>
                          <thead><tr><th>ID</th><th>Parties</th><th>Amount</th><th>Status</th><th></th></tr></thead>
                          <tbody>
                            {escrows.map(e => (
                              <tr key={e.id}>
                                <td>{e.id}</td>
                                <td>{e.parties}</td>
                                <td>${e.amount.toLocaleString()}</td>
                                <td className="mini muted">{e.status}</td>
                                <td><button className="btn cta" onClick={() => alert("View escrow demo")}>View</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                          <button className="btn cta" onClick={() => alert("Create escrow demo")}>Create Escrow Contract</button>
                          <button className="btn" onClick={() => alert("Assign custodian demo")}>Assign Custodian</button>
                        </div>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>

                {/* Factory */}
                <AnimatePresence mode="wait">
                  {active === "factory" && (
                    <motion.section className="card" key="factory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.24 }}>
                      <h3 style={{ margin: 0 }}>Finance Factory</h3>
                      <div className="muted" style={{ marginTop: 6 }}>Pooled products & mortgage structuring</div>

                      <div style={{ marginTop: 12 }}>
                        <div className="mini muted">Existing factories</div>
                        <ul style={{ marginTop: 8 }}>
                          {factoryContracts.map(f => <li key={f.id}><strong>{f.title}</strong> — {f.status}</li>)}
                        </ul>

                        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                          <button className="btn cta">Create Factory</button>
                          <button className="btn" onClick={() => alert("Model cashflows demo")}>Model Cashflows</button>
                        </div>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>

                {/* Advance Payment */}
                <AnimatePresence mode="wait">
                  {active === "advance" && (
                    <motion.section className="card" key="advance" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.24 }}>
                      <h3 style={{ margin: 0 }}>Advance Payment Offers</h3>
                      <div className="muted" style={{ marginTop: 6 }}>Offer discounts to counterparties for faster settlement</div>

                      <div style={{ marginTop: 12 }}>
                        <table>
                          <thead><tr><th>Offer</th><th>Discount</th><th>Description</th><th></th></tr></thead>
                          <tbody>
                            {advancePaymentOffers.map(a => (
                              <tr key={a.id}>
                                <td>{a.id}</td>
                                <td>{a.discountPct}%</td>
                                <td>{a.description}</td>
                                <td><button className="btn cta" onClick={() => alert("Apply advance demo")}>Apply</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>

                {/* Trades */}
                <AnimatePresence mode="wait">
                  {active === "trades" && (
                    <motion.section className="card" key="trades" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.24 }}>
                      <h3 style={{ margin: 0 }}>Real Estate Trade Flow</h3>
                      <div className="muted" style={{ marginTop: 6 }}>Seller / Buyer contract lifecycle (property deals)</div>

                      <div style={{ marginTop: 12 }}>
                        <table>
                          <thead><tr><th>ID</th><th>Role</th><th>Asset</th><th>Amount</th><th>Status</th></tr></thead>
                          <tbody>
                            {trades.map(t => (
                              <tr key={t.id}>
                                <td>{t.id}</td>
                                <td>{t.type}</td>
                                <td>{t.object}</td>
                                <td>${t.amount.toLocaleString()}</td>
                                <td className="mini muted">{t.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                          <button className="btn cta">New Trade Contract</button>
                          <button className="btn" onClick={() => alert("Match counterparty demo")}>Match Counterparty</button>
                        </div>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>

                {/* Release Payment */}
                <AnimatePresence mode="wait">
                  {active === "release" && (
                    <motion.section className="card" key="release" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.24 }}>
                      <h3 style={{ margin: 0 }}>Release Payment</h3>
                      <div className="muted" style={{ marginTop: 6 }}>Approve or reject escrow releases after verification</div>

                      <div style={{ marginTop: 12 }}>
                        <table>
                          <thead><tr><th>Escrow ID</th><th>Amount</th><th>Requested by</th><th>Status</th><th></th></tr></thead>
                          <tbody>
                            {escrows.map(e => (
                              <tr key={e.id}>
                                <td>{e.id}</td>
                                <td>${e.amount.toLocaleString()}</td>
                                <td>Buyer B</td>
                                <td className="mini muted">{e.status}</td>
                                <td>
                                  <button className="btn cta" onClick={() => alert("Release funds demo")}>Release</button>
                                  <button className="btn" onClick={() => alert("Reject demo")}>Reject</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>

                {/* User */}
                <AnimatePresence mode="wait">
                  {active === "user" && (
                    <motion.section className="card" key="user" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.24 }}>
                      <h3 style={{ margin: 0 }}>User Profile</h3>
                      <div className="muted" style={{ marginTop: 6 }}>Account info, roles, security and audits</div>

                      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                          <div className="mini muted">Name</div>
                          <div style={{ fontWeight: 700 }}>Alex Morgan</div>

                          <div className="mini muted" style={{ marginTop: 8 }}>Email</div>
                          <div>alex.morgan@clearo.com</div>
                        </div>

                        <div>
                          <div className="mini muted">Role</div>
                          <div style={{ fontWeight: 700 }}>Operator</div>

                          <div className="mini muted" style={{ marginTop: 8 }}>2FA</div>
                          <div>Enabled</div>
                        </div>
                      </div>

                      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                        <button className="btn cta">Edit Profile</button>
                        <button className="btn" onClick={() => alert("Change password demo")}>Change Password</button>
                        <button className="btn" onClick={() => alert("View audits demo")}>Audit Logs</button>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>

                {/* Admin */}
                <AnimatePresence mode="wait">
                  {active === "admin" && (
                    <motion.section className="card" key="admin" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.24 }}>
                      <h3 style={{ margin: 0 }}>Administration</h3>
                      <div className="muted" style={{ marginTop: 6 }}>Manage roles, access and global platform settings</div>

                      <div style={{ marginTop: 12 }}>
                        <div className="mini muted">Roles overview</div>
                        <ul style={{ marginTop: 8 }}>
                          <li><strong>Super Admin</strong> — Full control</li>
                          <li><strong>Operator</strong> — Manage operations & escrows</li>
                          <li><strong>Auditor</strong> — Read-only logs & reports</li>
                        </ul>

                        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                          <button className="btn cta">Create User</button>
                          <button className="btn" onClick={() => alert("View audit trail demo")}>View Audit Trail</button>
                        </div>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>
              </div>

              {/* Right column - persistent widgets */}
              <aside>
                <div className="card" style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div className="mini muted">Account</div>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>$137,940</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                      <div className="mini muted">Available</div>
                      <div style={{ fontWeight: 700 }}>$74,200</div>
                    </div>
                  </div>

                  <div style={{ height: 12 }} />

                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn cta" style={{ flex: 1 }} onClick={() => openSection("bankaccounts")}>New Transfer</button>
                    <button className="btn" onClick={() => openSection("escrow")}>Escrow</button>
                  </div>
                </div>

                <div className="card" style={{ marginBottom: 14 }}>
                  <h4 style={{ margin: 0 }}>Quick Actions</h4>
                  <div className="muted small">Frequent</div>
                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                    <button className="btn cta" onClick={() => openSection("escrow")}>Create Escrow</button>
                    <button className="btn" onClick={() => openSection("advance")}>Offer Advance</button>
                    <button className="btn" onClick={() => openSection("trades")}>Open Trade</button>
                  </div>
                </div>

                <div className="card">
                  <h4 style={{ margin: 0 }}>Notifications</h4>
                  <div className="muted small">Recent</div>
                  <ul style={{ marginTop: 10 }}>
                    <li>Incoming transfer $5,000 posted</li>
                    <li>Escrow ESC-9001 awaiting release</li>
                    <li>Loan LN-1002 has pending approval</li>
                  </ul>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
