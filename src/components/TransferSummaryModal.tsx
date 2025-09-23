export interface TransferSummaryData {
  codigoLote: string;
  destinatario: string;
  fecha: string;
  cantidad: string;
  representante: string;
  emisor: string;
  txHash: string;
  numeroLote?: string;
  nombreMedicamento?: string;
}

interface TransferSummaryModalProps {
  data: TransferSummaryData;
  onClose: () => void;
}

export default function TransferSummaryModal({
  data,
  onClose,
}: TransferSummaryModalProps) {
  if (!data) return null;

  const formattedDate = data.fecha
    ? new Date(data.fecha).toLocaleDateString()
    : "No registrada";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="flex flex-col gap-4 bg-white rounded-xl shadow-lg p-6 w-[400px] border-blue-300 border">
        <h2 className="text-xl font-bold mb-4">
          ✅ Transferencia completada
        </h2>
        {data.numeroLote && (
          <p>
            <strong>Número de lote:</strong> {data.numeroLote}
          </p>
        )}
        <p>
          <strong>Código de lote:</strong> {data.codigoLote}
        </p>
        {data.nombreMedicamento && (
          <p>
            <strong>Medicamento:</strong> {data.nombreMedicamento}
          </p>
        )}
        <p>
          <strong>Destinatario:</strong> {data.destinatario}
        </p>
        <p>
          <strong>Representante:</strong> {data.representante || "No indicado"}
        </p>
        <p>
          <strong>Fecha:</strong> {formattedDate}
        </p>
        <p>
          <strong>Cantidad:</strong> {data.cantidad || "No indicada"}
        </p>
        <p>
          <strong>Cuenta emisora:</strong> {data.emisor || "No conectada"}
        </p>
        <div className="flex justify-center">
          <a
            href={`https://sepolia.etherscan.io/tx/${data.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline block mt-2"
          >
            Ver en blockchain
          </a>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            type="button"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

