// React Trading App Mockup con modo oscuro/claro, animación de logo,
// dashboard con gráficos, login simulado y menú profesional estilo Binance Pro.
// ---
// NOTA: Este mockup es completamente funcional en React 18.
// Necesita instalar: recharts
// npm install recharts

import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TradingMockup() {
  const [theme, setTheme] = useState("dark");
  const [active, setActive] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // Simulación de datos
  const chartData = [
    { name: "Lun", value: 32000 },
    { name: "Mar", value: 33500 },
    { name: "Mie", value: 31000 },
    { name: "Jue", value: 35500 },
    { name: "Vie", value: 38000 },
  ];

  // Cambiar tema
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // Estilos dinámicos
  const rootStyles = {
    background: theme === "dark" ? "#0c0c0c" : "#f2f2f2",
    color: theme === "dark" ? "#f5f5f5" : "#111",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
    transition: "0.3s ease",
  };

  return (
    <div style={rootStyles}>
      <style>{`
        .navbar {
          height: 64px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 26px;
          border-bottom: 1px solid ${theme === "dark" ? "#222" : "#ccc"};
        }
        .logo-spin {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #ff692e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          animation: spin 4s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .menu {
          position: absolute;
          right: 20px;
          top: 70px;
          width: 220px;
          background: ${theme === "dark" ? "#151515" : "#fff"};
          border: 1px solid ${theme === "dark" ? "#222" : "#ddd"};
          border-radius: 10px;
          padding: 8px 0;
          box-shadow: 0 0 15px rgba(0,0,0,0.15);
          animation: fade 0.2s ease;
        }
        @keyframes fade {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .menu button {
          width: 100%;
          padding: 12px 20px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          font-size: 0.95rem;
        }
        .menu button:hover {
          background: ${theme === "dark" ? "#1c1c1c" : "#efefef"};
          color: #ff692e;
        }
        .active-option {
          color: #ff692e !important;
        }
        .section {
          padding: 28px;
          display: none;
        }
        .section.active {
          display: block;
          animation: fade 0.3s ease;
        }
        .card {
          background: ${theme === "dark" ? "#151515" : "#fff"};
          padding: 22px;
          border-radius: 14px;
          border: 1px solid ${theme === "dark" ? "#222" : "#ccc"};
          max-width: 600px;
        }
        .orange-btn {
          background: #ff692e;
          padding: 12px 20px;
          border-radius: 10px;
          border: none;
          color: white;
          cursor: pointer;
          font-weight: 600;
        }
        .login-box {
          max-width: 400px;
          margin: 120px auto;
          padding: 30px;
          text-align: center;
          border-radius: 14px;
          background: ${theme === "dark" ? "#151515" : "#fff"};
          border: 1px solid ${theme === "dark" ? "#222" : "#ccc"};
        }
        .login-input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #555;
          margin-top: 14px;
          background: ${theme === "dark" ? "#0c0c0c" : "#f6f6f6"};
          color: inherit;
        }
      `}</style>

      {/* LOGIN */}
      {!loggedIn && (
        <div className="login-box">
          <h2>Iniciar sesión</h2>
          <input className="login-input" placeholder="Correo o usuario" />
          <input className="login-input" placeholder="Contraseña" type="password" />
          <button className="orange-btn" style={{ marginTop: "20px", width: "100%" }} onClick={() => setLoggedIn(true)}>
            Entrar
          </button>
        </div>
      )}

      {loggedIn && (
        <>
          {/* NAVBAR */}
          <nav className="navbar">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontWeight: 600 }}>
              <div className="logo-spin">T</div>
              Trading Pro
            </div>

            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <button onClick={toggleTheme} className="orange-btn">{theme === "dark" ? "Light" : "Dark"}</button>
              <button className="orange-btn" onClick={() => setMenuOpen(!menuOpen)}>Menu ▾</button>
            </div>

            {menuOpen && (
              <div className="menu">
                <button className={active === "dashboard" ? "active-option" : ""} onClick={() => setActive("dashboard")}>Dashboard</button>
                <button className={active === "usuario" ? "active-option" : ""} onClick={() => setActive("usuario")}>Usuario</button>
                <button className={active === "operaciones" ? "active-option" : ""} onClick={() => setActive("operaciones")}>Operaciones</button>
                <button className={active === "liberar" ? "active-option" : ""} onClick={() => setActive("liberar")}>Liberar Pago</button>
                <button className={active === "admin" ? "active-option" : ""} onClick={() => setActive("admin")}>Administración</button>
              </div>
            )}
          </nav>

          {/* DASHBOARD */}
          <div className={`section ${active === "dashboard" ? "active" : ""}`}>            
            <h2>Dashboard</h2>
            <div className="card" style={{ height: "300px" }}>
              <h3>BTC/USDT</h3>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={chartData}>
                  <XAxis dataKey="name" stroke={theme === "dark" ? "#777" : "#333"} />
                  <YAxis stroke={theme === "dark" ? "#777" : "#333"} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#ff692e" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* USUARIO */}
          <div className={`section ${active === "usuario" ? "active" : ""}`}>            
            <h2>Mi Perfil</h2>
            <div className="card">
              <p><strong>Nombre:</strong> Carlos Torres</p>
              <p><strong>Correo:</strong> usuario@trading.com</p>
              <p><strong>Estado:</strong> Verificado</p>
            </div>
          </div>

          {/* OPERACIONES */}
          <div className={`section ${active === "operaciones" ? "active" : ""}`}>            
            <h2>Operaciones Recientes</h2>
            <div className="card">
              <p>• Compra BTC — 0.15 BTC</p>
              <p>• Venta USDT — 400 USDT</p>
              <p>• Swap ETH → MATIC</p>
            </div>
          </div>

          {/* LIBERAR */}
          <div className={`section ${active === "liberar" ? "active" : ""}`}>            
            <h2>Liberar Pago</h2>
            <div className="card">
              <p><strong>ID:</strong> TX-934812</p>
              <p><strong>Monto:</strong> $245.00</p>
              <button className="orange-btn">Liberar Fondos</button>
            </div>
          </div>

          {/* ADMIN */}
          <div className={`section ${active === "admin" ? "active" : ""}`}>            
            <h2>Administración</h2>
            <div className="card">
              <p><strong>Nivel de Seguridad:</strong> Alto</p>
              <p><strong>2FA:</strong> Activo</p>
              <p><strong>Límite Diario:</strong> $10,000</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}