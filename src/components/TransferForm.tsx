import { useState } from "react";
import type { FormEvent } from "react";
import { ethers } from "ethers";
import PageWrapper from "./Layout/PageWraper";
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

  return (
    <PageWrapper>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-8 my-4"
      >
        <div className="flex md:flex-row gap-80">
          <div className="p-6 rounded-4xl flex flex-col gap-6 items-center shadow-2xl max-w-3xl border border-gray-300 w-[361px]">
            <h2 className="text-lg font-bold">Complete los datos del lote</h2>
            <div className="flex flex-col gap-4 w-full">
              <label className="lot-label">Datos del emisor</label>
              <input
                className="text-black border rounded-lg px-2 bg-gray-200"
                placeholder="Conecta tu wallet"
                value={account || ""}
                disabled
              />
            </div>
            <div className="flex flex-col gap-4 w-full">
              <label className="lot-label">Representante Legal/Técnico</label>
              <input
                className="text-black border rounded-lg px-2 bg-gray-200"
                placeholder="QF Maria Lopez (CIPQF 67890)"
                disabled
              />
            </div>
            <div className="flex flex-col gap-4 w-full">
              <label className="lot-label">Número de Lote</label>
              <input
                className="text-gray-400 border rounded-lg px-2 hover:border-blue-500"
                value={numeroLote}
                onChange={(event) => setNumeroLote(event.target.value)}
                disabled={isTransferring}
              />
            </div>
            <div className="flex flex-col gap-4 w-full">
              <label className="lot-label">Nombre del medicamento</label>
              <input
                className="text-gray-400 border rounded-lg px-2 hover:border-blue-500"
                value={nombreMedicamento}
                onChange={(event) => setNombreMedicamento(event.target.value)}
                disabled={isTransferring}
              />
            </div>
            <div className="flex flex-col gap-4 w-full">
              <label className="lot-label">Código de lote</label>
              <input
                className="text-gray-400 border rounded-lg px-2 hover:border-blue-500"
                value={codigoLote}
                onChange={(event) => setCodigoLote(event.target.value)}
                disabled={isTransferring}
              />
            </div>
          </div>
          <div className="p-6 rounded-4xl flex flex-col gap-6 items-center shadow-2xl max-w-3xl border border-gray-300 w-[361px]">
            <h2 className="text-lg font-bold">Complete los datos de recepción</h2>
            <div className="flex flex-col gap-4 w-full">
              <label className="lot-label">Destinatario</label>
              <input
                className="text-gray-400 border rounded-lg px-2 hover:border-blue-500"
                value={destinatario}
                onChange={(event) => setDestinatario(event.target.value)}
                disabled={isTransferring}
              />
            </div>
            <div className="flex flex-col gap-4 w-full">
              <label className="lot-label">Representante</label>
              <input
                className="text-gray-400 border rounded-lg px-2 hover:border-blue-500"
                value={representante}
                onChange={(event) => setRepresentante(event.target.value)}
                disabled={isTransferring}
              />
            </div>
            <div className="flex flex-col gap-4 w-full">
              <label className="lot-label">Fecha</label>
              <input
                type="date"
                className="text-gray-400 border rounded-lg px-2 hover:border-blue-500"
                value={fecha}
                onChange={(event) => setFecha(event.target.value)}
                disabled={isTransferring}
              />
            </div>
            <div className="flex flex-col gap-4 w-full">
              <label className="lot-label">Cantidad</label>
              <input
                type="number"
                min="0"
                className="text-gray-400 border rounded-lg px-2 hover:border-blue-500"
                value={cantidad}
                onChange={(event) => setCantidad(event.target.value)}
                disabled={isTransferring}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            type="submit"
            className={`border border-blue-300 bg-blue-500 text-white px-6 py-3 rounded-full shadow-md transition-colors w-[200px] ${
              isTransferring ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
            disabled={isTransferring}
          >
            {isTransferring ? "Transfiriendo..." : "Realizar transferencia"}
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {successMessage && (
            <p className="text-green-600 text-sm text-center">
              {successMessage}
            </p>
          )}
        </div>
      </form>
      {summaryData && (
        <TransferSummaryModal data={summaryData} onClose={handleCloseSummary} />
      )}
      {!summaryData && lastSummary && (
        <div
          className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow cursor-pointer hover:bg-blue-600"
          onClick={handleReopenSummary}
        >
          Última transferencia
        </div>
      )}
    </PageWrapper>
  );
}

