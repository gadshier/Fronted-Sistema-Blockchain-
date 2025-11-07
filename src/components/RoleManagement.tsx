import { useState } from "react";
import { ethers } from "ethers";
import type {
  ContractRoleKey,
  MedicineRegistryContract,
} from "../types/MedicineRegistry";

interface RoleManagementProps {
  contract: MedicineRegistryContract | null;
  roleHashes: Partial<Record<ContractRoleKey, string>>;
}

type RoleAction = "assign" | "revoke";

type FeedbackState = {
  type: RoleAction;
  message: string;
} | null;

const ROLE_OPTIONS: Array<{ value: ContractRoleKey; label: string }> = [
  { value: "FABRICANTE_ROLE", label: "Fabricante" },
  { value: "DISTRIBUIDOR_ROLE", label: "Distribuidor" },
  { value: "FARMACIA_ROLE", label: "Farmacia" },
  { value: "ADMIN_ROLE", label: "Administrador" },
];

export default function RoleManagement({
  contract,
  roleHashes,
}: RoleManagementProps) {
  const [selectedRole, setSelectedRole] = useState<ContractRoleKey>(
    "FABRICANTE_ROLE"
  );
  const [targetAddress, setTargetAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [error, setError] = useState<string | null>(null);

  const resolveRoleHash = (role: ContractRoleKey) =>
    roleHashes[role] ?? ethers.id(role);

  const handleRoleAction = async (action: RoleAction) => {
    setError(null);
    setFeedback(null);

    if (!contract) {
      setError("Conecta tu wallet para gestionar roles.");
      return;
    }

    const trimmedAddress = targetAddress.trim();

    if (!trimmedAddress) {
      setError("Ingresa la dirección a la que deseas asignar el rol.");
      return;
    }

    if (!ethers.isAddress(trimmedAddress)) {
      setError("La dirección ingresada no es válida.");
      return;
    }

    try {
      setIsSubmitting(true);
      const roleHash = resolveRoleHash(selectedRole);
      const tx =
        action === "assign"
          ? await contract.asignarRol(roleHash, trimmedAddress)
          : await contract.revocarRol(roleHash, trimmedAddress);

      await tx.wait();

      setFeedback({
        type: action,
        message:
          action === "assign"
            ? "Rol asignado correctamente."
            : "Rol revocado correctamente.",
      });
      setTargetAddress("");
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "La transacción fue cancelada o falló.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600 shadow-sm">
          Administración de roles
        </span>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Gestiona los permisos de la red
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
          Asigna o revoca los roles operativos de la plataforma. Cada rol controla el acceso a los módulos críticos del sistema, por lo que te recomendamos revisar dos veces cada dirección antes de confirmar.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-6 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm shadow-blue-100/60 backdrop-blur">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">
              Selecciona el rol a gestionar
            </h2>
            <p className="text-sm text-slate-500">
              Elige el rol que deseas asignar o revocar y proporciona la dirección compatible con Ethereum del destinatario.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-600">
              Rol operativo
              <select
                value={selectedRole}
                onChange={(event) =>
                  setSelectedRole(event.target.value as ContractRoleKey)
                }
                className="mt-2 w-full rounded-2xl border border-blue-100 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 shadow-inner focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-600">
              Dirección del usuario
              <input
                value={targetAddress}
                onChange={(event) => setTargetAddress(event.target.value)}
                type="text"
                placeholder="0x..."
                className="mt-2 w-full rounded-2xl border border-blue-100 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </label>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50/70 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {feedback && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-600">
              {feedback.message}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => handleRoleAction("assign")}
              disabled={isSubmitting}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 ${
                isSubmitting
                  ? "cursor-not-allowed bg-blue-300"
                  : "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 shadow-lg shadow-blue-200/80 hover:from-blue-500 hover:via-blue-400 hover:to-blue-300"
              }`}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              Asignar rol
            </button>
            <button
              type="button"
              onClick={() => handleRoleAction("revoke")}
              disabled={isSubmitting}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70 ${
                isSubmitting
                  ? "cursor-not-allowed bg-red-200 text-red-400"
                  : "border border-red-200 bg-white/80 text-red-600 shadow-sm hover:border-red-300 hover:bg-red-50"
              }`}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
              </svg>
              Revocar rol
            </button>
          </div>
        </div>

        <aside className="space-y-4 rounded-3xl border border-blue-100 bg-blue-50/60 p-6 text-blue-700 shadow-inner">
          <h2 className="text-base font-semibold">Roles disponibles</h2>
          <ul className="space-y-3 text-sm">
            {ROLE_OPTIONS.map((option) => (
              <li key={option.value} className="flex flex-col">
                <span className="font-semibold">{option.label}</span>
                <span className="text-xs text-blue-600/80">
                  {roleHashes[option.value] ?? ethers.id(option.value)}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs leading-relaxed text-blue-600/80">
            Solo las cuentas con rol de administrador pueden realizar cambios. Asegúrate de que el personal operativo conecte su wallet para acceder al módulo asignado.
          </p>
        </aside>
      </div>
    </div>
  );
}
