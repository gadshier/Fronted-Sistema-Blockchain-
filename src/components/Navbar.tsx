import React from "react";

interface NavbarProps {
  onConnect: () => void;
  account?: string;
}

export default function Navbar({ onConnect, account }: NavbarProps) {
  return (
    <div className="flex justify-between items-center px-6 py-4 shadow-sm bg-white">
      <div className="text-[#6C63FF] font-semibold">BlockFarm</div>
      <nav className="flex gap-4">
        <a href="#" className="text-purple-600 font-semibold border-b-2 border-purple-600">
          Registrar Lote
        </a>
        <a href="#" className="text-gray-600">
          Otros
        </a>
      </nav>
      {account ? (
        <span className="rounded-full border px-4 py-1">{account}</span>
      ) : (
        <div className="flex gap-2">
          <button onClick={onConnect} className="rounded-full border px-4 py-1">
            Iniciar sesión
          </button>
          <button className="rounded-full border px-4 py-1">Crear cuenta</button>
        </div>
      )}
    </div>
  );
}

