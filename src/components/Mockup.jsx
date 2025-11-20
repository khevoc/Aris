// ClearoApp.jsx
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/**
 * ClearoApp - Single-file FinTech admin mockup
 * - Theme switch inside the menu
 * - Deep blue chrome & logo (#05264A)
 * - Teal primary CTA (#16A085)
 * - Light gray backgrounds (#F2F4F6)
 * - Menu overlay with high z-index (mobile full-screen)
 * - Sections: Dashboard, Bank Accounts, Cards, Loans, Escrow, Factory,
 *   Advance Payment, Real Estate Trades, User, Release Payment, Admin
 *
 * Requirements: recharts installed
 * npm install recharts
 */

export default function ClearoApp() {
  const [theme, setTheme] = useState("dark"); // "dark" | "light"
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [loggedIn, setLoggedIn] = useState(false);

  const COLORS = {
    deepBlue: "#05264A",
    teal: "#16A085",
    lightGray: "#F2F4F6",
    darkBg: "#081018",
    cardDark: "#0f1316",
    textLight: "#F3F6F8",
    textDark: "#0b1220",
  };

  // Mock data
  const chartData = [
    { day: "Mon", value: 125000 },
    { day: "Tue", value: 129500 },
    { day: "Wed", value: 127200 },
    { day: "Thu", value: 131800 },
    { day: "Fri", value: 134400 },
  ];

  const bankAccounts = [
    { id: "BRM-001", name: "Operating Account - Clearo Bank", balance: 125400, currency: "USD" },
    { id: "BRM-002", name: "Reserve Account - Global Trust", balance: 54000, currency: "USD" },
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

  const factoryContracts = [
    { id: "FAC-01", title: "Mortgage Pool Factory", status: "Active" },
  ];

  const advancePaymentOffers = [
    { id: "ADV-1", description: "Early payment - 2% discount for settlement within 7 days", discountPct: 2 },
  ];

  const rootStyle = {
    background: theme === "dark" ? COLORS.darkBg : COLORS.lightGray,
    color: theme === "dark" ? COLORS.textLight : COLORS.textDark,
    minHeight: "100vh",
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    transition: "background 0.25s ease, color 0.25s ease",
  };

  const navButton = {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.06)",
    color: "inherit",
    padding: "8px 12px",
    borderRadius: 10,
    cursor: "pointer",
  };

  const openSection = (id) => {
    setActive(id);
    setMenuOpen(false);
    // scroll to top of the main container for better UX on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={rootStyle}>
      <style>{`
        /* Basic layout */
        .wrap { max-width: 1200px; margin: 0 auto; padding: 14px; }
        h1,h2,h3 { margin: 6px 0 12px; font-weight: 700; }
        p { margin: 6px 0; color: inherit; }
        .muted { color: ${theme === "dark" ? "#9aa3a6" : "#6b7280"}; font-size: 0.95rem; }

        /* Navbar */
        .navbar {
          height: 64px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding: 8px 18px;
          position: sticky;
          top: 0;
          z-index: 60;
          background: ${theme === "dark" ? "rgba(2,6,15,0.6)" : "linear-gradient(90deg, ${COLORS.deepBlue}, #083046)"};
          backdrop-filter: blur(4px);
          border-bottom: 1px solid ${theme === "dark" ? "#0b1114" : "rgba(255,255,255,0.06)"};
        }
        .brand { display:flex; align-items:center; gap:12px; }
        .badge {
          width:44px; height:44px; border-radius:10px;
          display:flex; align-items:center; justify-content:center;
          color: white; font-weight:800;
          background: ${COLORS.deepBlue};
          box-shadow: 0 8px 24px rgba(5,38,74,0.24);
          animation: spin-slow 10s linear infinite;
        }
        @keyframes spin-slow { from {transform:rotate(0)} to {transform:rotate(360deg)} }
        .brand-title { font-size:1rem; font-weight:700; letter-spacing:0.2px; }
        .brand-sub { font-size:0.85rem; color: ${theme === "dark" ? "#9aa3a6" : "#dbeaf1"}; margin-top:2px; }

        .nav-actions { display:flex; gap:10px; align-items:center; }

        /* Menu overlay */
        .menu-overlay {
          position: fixed;
          right: 18px;
          top: 72px;
          width: 300px;
          max-height: 80vh;
          overflow: auto;
          background: ${theme === "dark" ? "#0c0e10" : "#ffffff"};
          border-radius: 12px;
          border: 1px solid ${theme === "dark" ? "#121416" : "#e6eef6"};
          box-shadow: 0 30px 80px rgba(2,8,20,0.45);
          padding: 10px;
          z-index: 99999; /* extremely high so it overlaps everything */
        }
        @media (max-width: 720px) {
          .menu-overlay { left: 12px; right: 12px; top: 76px; width: auto; max-height: calc(100vh - 100px); padding: 16px; }
        }
        .menu-item { padding: 10px 12px; border-radius:8px; cursor:pointer; display:flex; flex-direction:column; gap:4px; }
        .menu-item:hover { background: ${theme === "dark" ? "#111315" : "#f6fbfc"}; color: ${COLORS.teal}; }
        .menu-hint { font-size:0.88rem; color: ${theme === "dark" ? "#97a0a3" : "#64748b"}; }

        /* Content */
        .section { display:none; padding: 18px 0; animation: fadeIn 0.28s ease both; }
        .section.active { display:block; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }

        .grid { display:grid; grid-template-columns: 1fr 360px; gap:18px; align-items:start; }
        @media (max-width: 980px) { .grid { grid-template-columns: 1fr; } }

        .card {
          background: ${theme === "dark" ? COLORS.cardDark : "#ffffff"};
          border-radius: 12px;
          padding: 16px;
          border: 1px solid ${theme === "dark" ? "#121416" : "#e8eef5"};
          box-shadow: ${theme === "dark" ? "0 8px 26px rgba(2,8,20,0.28)" : "0 10px 30px rgba(6,18,32,0.06)"};
        }

        .cta {
          background: linear-gradient(90deg, ${COLORS.teal}, #0e9f88);
          color: white;
          padding: 10px 12px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight:700;
        }

        .small { font-size:0.92rem; color: ${theme === "dark" ? "#b9c2c4" : "#374151"}; }

        /* Responsive tweaks for mobile */
        @media (max-width: 640px) {
          .badge { width:36px; height:36px; font-size:14px; }
          .nav-actions { gap:8px; }
          .menu-overlay { top: 68px; padding: 12px; }
          .grid { gap:12px; }
        }

        /* tables */
        table { width:100%; border-collapse: collapse; }
        th, td { padding:10px 6px; text-align:left; border-bottom: 1px solid ${theme === "dark" ? "#0b0d0e" : "#f1f6fb"}; color: inherit; }
        thead th { color: ${theme === "dark" ? "#9aa3a6" : "#64748b"}; font-weight:600; font-size:0.95rem; }

        .mini { font-size:0.88rem; color: ${theme === "dark" ? "#96a2a6" : "#64748b"}; }

      `}</style>

      {/* NAV */}
      <header className="navbar">
        <div className="brand" style={{ marginLeft: 12 }}>
          <div className="badge" aria-hidden> C </div>
          <div>
            <div className="brand-title">Clearo</div>
            <div className="brand-sub">Banking & Escrow Admin</div>
          </div>
        </div>

        <div className="nav-actions" style={{ marginRight: 12 }}>
          <button
            style={{ ...navButton }}
            onClick={() => {
              setMenuOpen((s) => !s);
            }}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
          >
            Menu ▾
          </button>
          <button
            className="cta"
            onClick={() => openSection("dashboard")}
            title="Go to dashboard"
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            Open Dashboard
          </button>
        </div>
      </header>

      <main className="wrap">
        {/* LOGIN */}
        {!loggedIn ? (
          <div style={{ maxWidth: 540, margin: "64px auto" }} className="card">
            <h2>Sign in to Clearo</h2>
            <p className="muted">Demo mode — this is a mock login and will not validate credentials.</p>
            <div style={{ marginTop: 12 }}>
              <input placeholder="Email or username" style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #dbe6ea", marginBottom: 10 }} />
              <input placeholder="Password" type="password" style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #dbe6ea" }} />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="cta" style={{ flex: 1 }} onClick={() => setLoggedIn(true)}>Sign In</button>
              <button style={{ ...navButton }} onClick={() => alert("Demo: Reset password flow")}>Forgot</button>
            </div>
            <div className="muted" style={{ marginTop: 12 }}>Demo credentials: any email / password — just for demo.</div>
          </div>
        ) : (
          <>
            {/* MENU OVERLAY */}
            {menuOpen && (
              <nav id="main-menu" className="menu-overlay" role="menu" aria-label="Main navigation">
                <div className="menu-item" onClick={() => openSection("dashboard")}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>Dashboard</strong>
                    <span className="mini muted">Overview</span>
                  </div>
                  <div className="menu-hint">Summary of balances, cashflow and recent activity</div>
                </div>

                <div className="menu-item" onClick={() => openSection("bankaccounts")}>
                  <strong>Bank Accounts</strong>
                  <div className="menu-hint">Manage linked accounts, IBANs and transfers</div>
                </div>

                <div className="menu-item" onClick={() => openSection("cards")}>
                  <strong>Card Management</strong>
                  <div className="menu-hint">Issuance, limits and vendor cards</div>
                </div>

                <div className="menu-item" onClick={() => openSection("loans")}>
                  <strong>Loans & Credits</strong>
                  <div className="menu-hint">View credit lines and repayment schedules</div>
                </div>

                <div className="menu-item" onClick={() => openSection("escrow")}>
                  <strong>Escrow</strong>
                  <div className="menu-hint">Create / release escrow contracts</div>
                </div>

                <div className="menu-item" onClick={() => openSection("factory")}>
                  <strong>Factory</strong>
                  <div className="menu-hint">Finance factories & structured products</div>
                </div>

                <div className="menu-item" onClick={() => openSection("advance")}>
                  <strong>Advance Payment</strong>
                  <div className="menu-hint">Offer early-payment discounts to counterparties</div>
                </div>

                <div className="menu-item" onClick={() => openSection("trades")}>
                  <strong>Real Estate Trades</strong>
                  <div className="menu-hint">Seller / Buyer contracts for properties</div>
                </div>

                <div className="menu-item" onClick={() => openSection("release")}>
                  <strong>Release Payment</strong>
                  <div className="menu-hint">Approve or reject escrow releases</div>
                </div>

                <div className="menu-item" onClick={() => openSection("user")}>
                  <strong>User Profile</strong>
                  <div className="menu-hint">Account settings, roles and 2FA</div>
                </div>

                <div style={{ height: 1, background: theme === "dark" ? "#0b0c0d" : "#eef6fb", margin: "10px 0", borderRadius: 2 }} />

                {/* Theme & logout */}
                <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 6px" }}>
                  <div style={{ flex: 1 }}>
                    <div className="mini muted">Theme</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button onClick={() => setTheme("dark")} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #0b0b0b", background: theme === "dark" ? COLORS.deepBlue : "transparent", color: "#fff" }}>Dark</button>
                      <button onClick={() => setTheme("light")} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", background: theme === "light" ? "#efefef" : "transparent" }}>Light</button>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <button style={{ ...navButton }} onClick={() => { setLoggedIn(false); setMenuOpen(false); }}>Sign Out</button>
                  </div>
                </div>
              </nav>
            )}

            {/* Dashboard */}
            <section className={`section ${active === "dashboard" ? "active" : ""}`}>
              <div className="grid">
                <div>
                  <h2>Dashboard</h2>
                  <div className="card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h3 style={{ margin: 0 }}>Total Liquidity</h3>
                        <div className="muted small">Combined bank balances & cash equivalents</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 800, fontSize: 20 }}>$179,400</div>
                        <div className="mini muted">Updated: Today</div>
                      </div>
                    </div>

                    <div style={{ height: 260, marginTop: 16 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#0b1113" : "#eef6fb"} />
                          <XAxis dataKey="day" stroke={theme === "dark" ? "#8fa3a7" : "#64748b"} />
                          <YAxis stroke={theme === "dark" ? "#8fa3a7" : "#64748b"} />
                          <Tooltip contentStyle={{ background: theme === "dark" ? "#0c0e0f" : "#fff" }} />
                          <Line type="monotone" dataKey="value" stroke={COLORS.teal} strokeWidth={3} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
                      <button className="cta">New Transfer</button>
                      <button className="cta" style={{ background: "#0e8e78" }}>Create Escrow</button>
                      <button style={{ ...navButton }}>Reports</button>
                    </div>
                  </div>

                  <div style={{ height: 14 }} />

                  <div className="card">
                    <h3>Connected Bank Accounts</h3>
                    <div className="muted small">Manage external accounts for settlement</div>

                    <div style={{ marginTop: 12 }}>
                      <table>
                        <thead>
                          <tr><th>Account</th><th>IBAN / Ref</th><th>Balance</th></tr>
                        </thead>
                        <tbody>
                          {bankAccounts.map(a => (
                            <tr key={a.id}>
                              <td>{a.name}</td>
                              <td className="mini muted">{a.id}</td>
                              <td style={{ fontWeight:700 }}>${a.balance.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                        <button className="cta">Link New Account</button>
                        <button style={{ ...navButton }}>Sync Accounts</button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* right column */}
                <aside>
                  <div className="card">
                    <h4 style={{ margin: 0 }}>Quick Actions</h4>
                    <div className="muted small">Frequent operations</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                      <button className="cta" onClick={() => openSection("escrow")}>Create Escrow</button>
                      <button style={{ ...navButton }} onClick={() => openSection("advance")}>Offer Advance Payment</button>
                      <button style={{ ...navButton }} onClick={() => openSection("trades")}>Open Trade Flow</button>
                    </div>
                  </div>

                  <div style={{ height: 12 }} />

                  <div className="card">
                    <h4 style={{ margin: 0 }}>Notifications</h4>
                    <div className="muted small">Recent updates</div>
                    <ul style={{ marginTop: 10 }}>
                      <li>Incoming transfer $5,000 posted</li>
                      <li>Escrow ESC-9001 awaiting release</li>
                      <li>Loan LN-1002 has pending approval</li>
                    </ul>
                  </div>
                </aside>
              </div>
            </section>

            {/* Bank Accounts */}
            <section className={`section ${active === "bankaccounts" ? "active" : ""}`}>
              <div className="card">
                <h2>Bank Account Management</h2>
                <p className="muted">Add, verify and manage external bank accounts (IBAN, SWIFT).</p>

                <div style={{ marginTop: 12 }}>
                  <table>
                    <thead><tr><th>Account</th><th>Ref</th><th>Balance</th><th></th></tr></thead>
                    <tbody>
                      {bankAccounts.map(a => (
                        <tr key={a.id}>
                          <td>{a.name}</td>
                          <td className="mini muted">{a.id}</td>
                          <td style={{ fontWeight:700 }}>${a.balance.toLocaleString()}</td>
                          <td><button style={{ ...navButton }} onClick={() => alert("Demo: view account details")}>View</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <button className="cta">Add Bank Account</button>
                    <button style={{ ...navButton }}>Verify via Micro-deposits</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Card Management */}
            <section className={`section ${active === "cards" ? "active" : ""}`}>
              <div className="card">
                <h2>Card Management</h2>
                <p className="muted">Issue cards, set spend limits and manage vendors.</p>

                <div style={{ marginTop: 12 }}>
                  <table>
                    <thead><tr><th>Card</th><th>Holder</th><th>Type</th><th>Limit</th><th></th></tr></thead>
                    <tbody>
                      {cards.map(c => (
                        <tr key={c.id}>
                          <td>{c.id}</td>
                          <td>{c.holder}</td>
                          <td>{c.type}</td>
                          <td>{c.limit ? `$${c.limit}` : "—"}</td>
                          <td><button style={{ ...navButton }} onClick={() => alert("Demo: manage card")}>Manage</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <button className="cta">Issue New Card</button>
                    <button style={{ ...navButton }}>Export Card Activity</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Loans & Credits */}
            <section className={`section ${active === "loans" ? "active" : ""}`}>
              <div className="card">
                <h2>Loans & Credit Lines</h2>
                <p className="muted">View active loans and manage repayment schedules.</p>

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
                          <td><button style={{ ...navButton }} onClick={() => alert("Demo: loan details")}>Details</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <button className="cta">Create Loan</button>
                    <button style={{ ...navButton }}>Run Credit Check</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Escrow */}
            <section className={`section ${active === "escrow" ? "active" : ""}`}>
              <div className="card">
                <h2>Escrow Management</h2>
                <p className="muted">Create, review and release escrow contracts for transactions.</p>

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
                          <td>
                            <button className="cta" onClick={() => alert("Demo: view escrow")}>View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <button className="cta">Create Escrow Contract</button>
                    <button style={{ ...navButton }}>Assign Custodian</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Factory */}
            <section className={`section ${active === "factory" ? "active" : ""}`}>
              <div className="card">
                <h2>Finance Factory</h2>
                <p className="muted">Structure pooled finance products and mortgage securitizations.</p>

                <div style={{ marginTop: 12 }}>
                  <div className="mini muted">Existing factories</div>
                  <ul style={{ marginTop: 8 }}>
                    {factoryContracts.map(f => <li key={f.id}><strong>{f.title || f.id}</strong> — {f.status}</li>)}
                  </ul>

                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <button className="cta">Create New Factory</button>
                    <button style={{ ...navButton }}>Model Cashflows</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Advance Payment */}
            <section className={`section ${active === "advance" ? "active" : ""}`}>
              <div className="card">
                <h2>Advance Payment Offers</h2>
                <p className="muted">Offer counterparties early-payment discounts for faster settlement.</p>

                <div style={{ marginTop: 12 }}>
                  <table>
                    <thead><tr><th>Offer</th><th>Discount</th><th>Description</th><th></th></tr></thead>
                    <tbody>
                      {advancePaymentOffers.map(a => (
                        <tr key={a.id}>
                          <td>{a.id}</td>
                          <td>{a.discountPct}%</td>
                          <td>{a.description}</td>
                          <td><button className="cta" onClick={() => alert("Demo: apply advance offer")}>Apply</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Real Estate Trades */}
            <section className={`section ${active === "trades" ? "active" : ""}`}>
              <div className="card">
                <h2>Real Estate Trade Flow</h2>
                <p className="muted">Seller / Buyer contract lifecycle for property transactions (non-crypto).</p>

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
                    <button className="cta">New Trade Contract</button>
                    <button style={{ ...navButton }}>Match Counterparty</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Release Payment */}
            <section className={`section ${active === "release" ? "active" : ""}`}>
              <div className="card">
                <h2>Release Payment</h2>
                <p className="muted">Approve or reject escrow releases after verification.</p>

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
                            <button className="cta" onClick={() => alert("Demo: release funds")}>Release</button>
                            <button style={{ ...navButton }}>Reject</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* User Profile */}
            <section className={`section ${active === "user" ? "active" : ""}`}>
              <div className="card">
                <h2>User Profile</h2>
                <p className="muted">Account information, roles, security settings and audit history.</p>

                <div style={{ marginTop: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <div className="mini muted">Name</div>
                      <div style={{ fontWeight:700 }}>Alex Morgan</div>

                      <div className="mini muted" style={{ marginTop: 8 }}>Email</div>
                      <div>alex.morgan@clearo.com</div>
                    </div>

                    <div>
                      <div className="mini muted">Role</div>
                      <div style={{ fontWeight:700 }}>Operator</div>

                      <div className="mini muted" style={{ marginTop:8 }}>2FA</div>
                      <div>Enabled</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <button className="cta">Edit Profile</button>
                    <button style={{ ...navButton }}>Change Password</button>
                    <button style={{ ...navButton }}>Audit Logs</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Admin */}
            <section className={`section ${active === "admin" ? "active" : ""}`}>
              <div className="card">
                <h2>Administration</h2>
                <p className="muted">Manage roles, access and global settings for Clearo platform.</p>

                <div style={{ marginTop: 12 }}>
                  <div className="mini muted">Roles overview</div>
                  <ul style={{ marginTop: 8 }}>
                    <li><strong>Super Admin</strong> — Full control</li>
                    <li><strong>Operator</strong> — Manage operations and escrows</li>
                    <li><strong>Auditor</strong> — Read-only logs & reports</li>
                  </ul>

                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <button className="cta">Create User</button>
                    <button style={{ ...navButton }}>View Audit Trail</button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
