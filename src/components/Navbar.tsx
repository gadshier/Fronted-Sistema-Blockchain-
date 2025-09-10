import React from "react";
import "./Navbar.css";

interface NavbarProps {
  onConnect: () => void;
  account?: string;
}

export default function Navbar({ onConnect, account }: NavbarProps) {
  return (
    <div className="navbar">
      <div className="nav-logo">BlockFarm</div>
      <nav className="nav-links">
        <a href="#" className="nav-link-active">
          Registrar Lote
        </a>
        <a href="#" className="nav-link">
          Otros
        </a>
      </nav>
      {account ? (
        <span className="session-account">{account}</span>
      ) : (
        <div className="session-buttons">
          <button onClick={onConnect} className="session-button">
            Iniciar sesión
          </button>
          <button className="session-button">Crear cuenta</button>
        </div>
      )}
    </div>
  );
}

