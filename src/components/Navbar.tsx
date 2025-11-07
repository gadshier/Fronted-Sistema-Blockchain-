import type { ReactNode } from "react";
import type { ContractRoleKey } from "../types/MedicineRegistry";

export type NavTabId = "consult" | "register" | "transfer" | "roles";

export type SidebarItem = {
  id: NavTabId;
  label: string;
  helper: string;
  icon: ReactNode;
  requiredRoles?: ContractRoleKey[];
};

interface NavbarProps {
  onConnect: () => void;
  account?: string;
  isConnecting?: boolean;
  activeTab: NavTabId | null;
  onNavigate: (tab: NavTabId) => void;
  items: SidebarItem[];
}

export const sidebarNavigation: SidebarItem[] = [
  {
    id: "register",
    label: "Registrar lote",
    helper: "Captura en blockchain",
    requiredRoles: ["FABRICANTE_ROLE", "ADMIN_ROLE"],
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 21s-6-4.35-6-9a6 6 0 0 1 12 0c0 4.65-6 9-6 9Z" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    id: "consult",
    label: "Trazabilidad",
    helper: "Verifica lotes",
    requiredRoles: ["FARMACIA_ROLE", "ADMIN_ROLE"],
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m21 21-4.35-4.35" />
        <circle cx="11" cy="11" r="7" />
      </svg>
    ),
  },
  {
    id: "transfer",
    label: "Transferir",
    helper: "Cede custodia",
    requiredRoles: ["DISTRIBUIDOR_ROLE", "ADMIN_ROLE"],
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m5 12 7-7 7 7" />
        <path d="M12 5v13" />
      </svg>
    ),
  },
  {
    id: "roles",
    label: "Roles",
    helper: "Gestiona permisos",
    requiredRoles: ["ADMIN_ROLE"],
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3 4 6v6c0 5 3.4 9.3 7 10 3.6-.7 7-5 7-10V6l-6-3Z" />
        <circle cx="12" cy="10" r="2.5" />
        <path d="M12 13.5c-2.21 0-4.33 1.1-5.6 2.94" />
      </svg>
    ),
  },
];

export default function Navbar({
  onConnect,
  account,
  isConnecting,
  activeTab,
  onNavigate,
  items,
}: NavbarProps) {
  const isConnected = Boolean(account);

  return (
    <aside className="hidden min-h-screen w-72 flex-col justify-between bg-white/70 px-6 py-10 shadow-[12px_0_30px_-20px_rgba(15,23,42,0.25)] backdrop-blur-xl lg:flex">
      <div className="space-y-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-inner">
              <svg
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3v18" />
                <path d="M5 7h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
                <path d="M8 11h8" />
                <path d="M9 15h6" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
                BlockFarm
              </p>
              <p className="text-lg font-semibold text-slate-900">
                Registro farmacéutico
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-500">
            Monitorea y registra lotes críticos con seguridad blockchain y control
            regulatorio.
          </p>
        </div>

        <nav className="space-y-2">
          {items.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 ${
                  isActive
                    ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-transparent bg-white/50 text-slate-600 hover:border-blue-100 hover:bg-blue-50/60"
                }`}
                type="button"
                disabled={!items.length}
              >
                <span className="flex items-center gap-4">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      {item.label}
                    </span>
                    <span className="text-xs text-slate-400">{item.helper}</span>
                  </span>
                </span>
                {isActive && (
                  <span className="ml-4 h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4">
        {isConnected ? (
          <div className="space-y-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-blue-700 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-blue-500">Wallet conectada</p>
            <p className="break-all text-sm font-medium">{account}</p>
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            Conecta tu wallet para firmar registros y transferencias.
          </p>
        )}
        <button
          onClick={onConnect}
          disabled={isConnected || Boolean(isConnecting)}
          className={`w-full rounded-full px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 ${
            isConnected
              ? "cursor-default bg-slate-100 text-slate-400"
              : "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200/80 hover:from-blue-500 hover:to-blue-400"
          }`}
          type="button"
        >
          {isConnected
            ? "Sesión iniciada"
            : isConnecting
              ? "Conectando..."
              : "Conectar wallet"}
        </button>
      </div>
    </aside>
  );
}
