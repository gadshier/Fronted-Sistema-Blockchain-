

export default function LotPopup({ info, onClose }: { info: any; onClose: () => void }) {
  if (!info) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[400px]">
        <h2 className="text-xl font-bold mb-4">✅ Lote registrado</h2>
        <p><strong>Medicamento:</strong> {info.medicineName}</p>
        <p><strong>Código de serie:</strong> {info.seriesCode}</p>
        <p><strong>Fecha vencimiento:</strong> {info.expDate}</p>
        <p><strong>Registrado por:</strong> {info.account}</p>
        <a
          href={`https://sepolia.etherscan.io/tx/${info.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline block mt-2"
        >
          Ver en blockchain
        </a>

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
