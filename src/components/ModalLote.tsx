

interface LotInfo {
  medicineName: string;
  seriesCode: string;
  expDate: string;
  account: string;
  txHash: string;
}

interface LotPopupProps {
  info: LotInfo;
  onClose: () => void;
}

export default function LotPopup({ info, onClose }: LotPopupProps) {
  if (!info) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="flex flex-col gap-4 bg-white rounded-xl shadow-lg p-6 w-[400px] border-blue-300 border">
        <h2 className="text-xl font-bold mb-4">✅ Lote registrado exitosamente</h2>
        <p><strong>Medicamento:</strong> {info.medicineName}</p>
        <p><strong>Código de serie:</strong> {info.seriesCode}</p>
        <p><strong>Fecha vencimiento:</strong> {info.expDate}</p>
        <p><strong>Registrado por:</strong> {info.account}</p>
        <div className="flex justify-center">
            <a
                href={`https://sepolia.etherscan.io/tx/${info.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline block mt-2 "
            >
            Ver en blockchain
            </a>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
