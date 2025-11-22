

interface LotInfo {
  medicineName: string;
  seriesCode: string;
  expDate: string;
  account: string;
  txHash: string;
  quantity: string;
  responsable: {
    name: string;
    id: string;
    phone: string;
    email: string;
  };
}

interface LotPopupProps {
  info: LotInfo;
  onClose: () => void;
}

export default function LotPopup({ info, onClose }: LotPopupProps) {
  if (!info) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-6 rounded-[24px] border border-white/70 bg-white/95 p-6 shadow-[0_30px_60px_-28px_rgba(15,23,42,0.55)]">
        <div className="space-y-2 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
            Registro exitoso
          </span>
          <h2 className="text-2xl font-semibold text-slate-900">
            Lote registrado en blockchain
          </h2>
          <p className="text-sm text-slate-500">
            Guarda esta información para tu bitácora de control de calidad.
          </p>
        </div>

        <dl className="space-y-3 text-sm text-slate-600">
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Medicamento
            </dt>
            <dd className="text-right text-slate-800">{info.medicineName}</dd>
          </div>
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Código de serie
            </dt>
            <dd className="break-all text-right text-slate-800">{info.seriesCode}</dd>
          </div>
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Cantidad registrada
            </dt>
            <dd className="text-right text-slate-800">{info.quantity}</dd>
          </div>
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Vencimiento
            </dt>
            <dd className="text-right text-slate-800">{info.expDate}</dd>
          </div>
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Registrado por
            </dt>
            <dd className="break-all text-right text-slate-800">{info.account}</dd>
          </div>
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Responsable técnico
            </dt>
            <dd className="text-right text-slate-800">
              <p className="font-semibold">{info.responsable.name}</p>
              <p className="text-xs text-slate-500">DNI/RUC: {info.responsable.id}</p>
              {info.responsable.phone && (
                <p className="text-xs text-slate-500">Tel: {info.responsable.phone}</p>
              )}
              {info.responsable.email && (
                <p className="text-xs text-slate-500">Correo: {info.responsable.email}</p>
              )}
            </dd>
          </div>
        </dl>

        <a
          href={`https://sepolia.etherscan.io/tx/${info.txHash}`}
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
