import { useState } from "react";
import type { FormEvent } from "react";
import { ethers } from "ethers";
import type { MedicineRegistryContract } from "../types/MedicineRegistry";
import TransferSummaryModal, {
  type TransferSummaryData,
} from "./TransferSummaryModal";

interface TransferFormProps {
  contract: MedicineRegistryContract | null;
  account: string;
}

export default function TransferForm({
  contract,
  account,
}: TransferFormProps) {
  const [numeroLote, setNumeroLote] = useState("");
  const [nombreMedicamento, setNombreMedicamento] = useState("");
  const [codigoLote, setCodigoLote] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [representante, setRepresentante] = useState("");
  const [fecha, setFecha] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<TransferSummaryData | null>(
    null
  );
  const [lastSummary, setLastSummary] = useState<TransferSummaryData | null>(
    null
  );

  const resetForm = () => {
    setNumeroLote("");
    setNombreMedicamento("");
    setCodigoLote("");
    setDestinatario("");
    setRepresentante("");
    setFecha("");
    setCantidad("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!contract) {
      const message = "Conecta tu wallet antes de transferir un lote.";
      setError(message);
      alert(message);
      return;
    }

    const trimmedCodigo = codigoLote.trim();
    const trimmedDestinatario = destinatario.trim();

    if (!trimmedCodigo) {
      const message = "Ingresa el código del lote a transferir.";
      setError(message);
      alert(message);
      return;
    }

    if (!trimmedDestinatario) {
      const message = "Ingresa la dirección del destinatario.";
      setError(message);
      alert(message);
      return;
    }

    if (!ethers.isAddress(trimmedDestinatario)) {
      const message = "La dirección del destinatario no es válida.";
      setError(message);
      alert(message);
      return;
    }

    try {
      setIsTransferring(true);
      const loteId = ethers.keccak256(ethers.toUtf8Bytes(trimmedCodigo));
      const tx = await contract.transferirLote(loteId, trimmedDestinatario);
      await tx.wait();

      const summary: TransferSummaryData = {
        codigoLote: trimmedCodigo,
        destinatario: trimmedDestinatario,
        fecha,
        cantidad,
        representante,
        emisor: account,
        txHash: tx.hash,
        numeroLote: numeroLote.trim(),
        nombreMedicamento: nombreMedicamento.trim(),
      };

      setSummaryData(summary);
      setLastSummary(summary);
      setSuccessMessage(
        "Transferencia completada. Puedes revisar el resumen."
      );
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : "La transferencia fue cancelada o falló.";
      setError(message);
      alert(message);
    } finally {
      setIsTransferring(false);
    }
  };

  const handleCloseSummary = () => {
    setSummaryData(null);
    resetForm();
  };

  const handleReopenSummary = () => {
    if (lastSummary) {
      setSummaryData(lastSummary);
    }
  };

  const iconClass = "h-5 w-5 text-blue-500";

  const WalletIcon = () => (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 7a3 3 0 0 1 3-3h13a1 1 0 0 1 1 1v2" />
      <path d="M18 7H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-2" />
      <path d="M17 12h4v4h-4a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2Z" />
    </svg>
  );

  const UserShieldIcon = () => (
    <svg
      className={iconClass}
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
  );

  const ClipboardIcon = () => (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 3v2h6V3" />
      <path d="M9 9h6" />
      <path d="M9 13h4" />
    </svg>
  );

  const PillIcon = () => (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 9.5 9 5a4.95 4.95 0 0 1 7 7l-4.5 4.5a4.95 4.95 0 0 1-7-7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );

  const HashIcon = () => (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 9h16" />
      <path d="M4 15h16" />
      <path d="M10 3 8 21" />
      <path d="m16 3-2 18" />
    </svg>
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-10">
        <section className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
            Transferencia segura
          </span>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Transferir custodia de un lote
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Registra el traspaso del lote a un nuevo custodio asegurando la trazabilidad y cumplimiento regulatorio.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[20px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-900">Datos del emisor</h2>
            <p className="mt-1 text-sm text-slate-500">
              Información del laboratorio o entidad que cede la custodia del lote.
            </p>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Cuenta conectada</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <WalletIcon />
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 pl-12 text-sm text-slate-700 outline-none"
                    placeholder="Conecta tu wallet"
                    value={account || "Sin conexión"}
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Representante técnico</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <UserShieldIcon />
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 pl-12 text-sm text-slate-700 outline-none"
                    placeholder="Responsable registrado"
                    value="Responsable autorizado"
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Número de lote</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <ClipboardIcon />
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 pl-12 text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    value={numeroLote}
                    onChange={(event) => setNumeroLote(event.target.value)}
                    disabled={isTransferring}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Nombre del medicamento</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <PillIcon />
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 pl-12 text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    value={nombreMedicamento}
                    onChange={(event) => setNombreMedicamento(event.target.value)}
                    disabled={isTransferring}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Código único del lote</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <HashIcon />
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 pl-12 text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    value={codigoLote}
                    onChange={(event) => setCodigoLote(event.target.value)}
                    disabled={isTransferring}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-900">Datos del receptor</h2>
            <p className="mt-1 text-sm text-slate-500">
              Información del establecimiento o entidad que recibirá el lote.
            </p>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Dirección del destinatario</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <WalletIcon />
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 pl-12 text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    value={destinatario}
                    onChange={(event) => setDestinatario(event.target.value)}
                    disabled={isTransferring}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Representante receptor</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <UserShieldIcon />
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 pl-12 text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    value={representante}
                    onChange={(event) => setRepresentante(event.target.value)}
                    disabled={isTransferring}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Fecha de transferencia</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <CalendarIcon />
                  </span>
                  <input
                    type="date"
                    className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 pl-12 text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    value={fecha}
                    onChange={(event) => setFecha(event.target.value)}
                    disabled={isTransferring}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Cantidad (unidades)</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <ClipboardIcon />
                  </span>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 pl-12 text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                    value={cantidad}
                    onChange={(event) => setCantidad(event.target.value)}
                    disabled={isTransferring}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/70 bg-white/80 p-6 text-center shadow-sm shadow-blue-100/60 backdrop-blur lg:flex-row lg:justify-between lg:text-left">
          <p className="text-sm text-slate-500">
            Confirma la dirección del destinatario en la blockchain antes de firmar la transferencia.
          </p>
          <button
            type="submit"
            className={`inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 ${
              isTransferring
                ? "cursor-not-allowed bg-blue-300"
                : "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 hover:from-blue-500 hover:via-blue-400 hover:to-blue-300"
            }`}
            disabled={isTransferring}
          >
            {isTransferring ? "Transfiriendo..." : "Registrar transferencia"}
          </button>
        </div>

        {error && <p className="text-center text-sm text-red-500">{error}</p>}
        {successMessage && (
          <p className="text-center text-sm text-green-600">{successMessage}</p>
        )}
      </form>

      {summaryData && (
        <TransferSummaryModal data={summaryData} onClose={handleCloseSummary} />
      )}
      {!summaryData && lastSummary && (
        <button
          type="button"
          className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-5 py-3 text-sm font-medium text-blue-600 shadow-lg shadow-blue-200/80 backdrop-blur hover:border-blue-300 hover:bg-blue-50"
          onClick={handleReopenSummary}
        >
          <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
          Última transferencia
        </button>
      )}
    </>
  );
}

