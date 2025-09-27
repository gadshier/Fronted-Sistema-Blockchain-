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

  const summaryItems: Array<{ label: string; value: string } | null> = [
    data.numeroLote
      ? { label: "Número de lote", value: data.numeroLote }
      : null,
    { label: "Código de lote", value: data.codigoLote },
    data.nombreMedicamento
      ? { label: "Medicamento", value: data.nombreMedicamento }
      : null,
    { label: "Destinatario", value: data.destinatario },
    { label: "Representante", value: data.representante || "No indicado" },
    { label: "Fecha", value: formattedDate },
    { label: "Cantidad", value: data.cantidad || "No indicada" },
    { label: "Cuenta emisora", value: data.emisor || "No conectada" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-6 rounded-[24px] border border-white/70 bg-white/95 p-6 shadow-[0_30px_60px_-28px_rgba(15,23,42,0.55)]">
        <div className="space-y-2 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
            Transferencia completada
          </span>
          <h2 className="text-2xl font-semibold text-slate-900">
            Resumen de la operación
          </h2>
          <p className="text-sm text-slate-500">
            El registro quedó asentado en blockchain. Conserva esta información para tus auditorías internas.
          </p>
        </div>

        <dl className="space-y-3 text-sm text-slate-600">
          {summaryItems.filter(Boolean).map((item) => (
            <div
              key={item!.label}
              className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3"
            >
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item!.label}
              </dt>
              <dd className="max-w-[60%] break-all text-right text-slate-800">
                {item!.value}
              </dd>
            </div>
          ))}
        </dl>

        <a
          href={`https://sepolia.etherscan.io/tx/${data.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:border-blue-300 hover:bg-blue-100"
        >
          Ver transacción en blockchain
        </a>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-blue-200 hover:text-blue-600"
            type="button"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

