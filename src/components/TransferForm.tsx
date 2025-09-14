export default function TransferForm() {
  return (
    <div className="flex flex-col items-center gap-8 mt-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="p-6 rounded-4xl flex flex-col gap-6 items-center shadow-2xl max-w-3xl border border-gray-300 w-[361px]">
          <h2 className="text-lg font-bold">Complete los datos del lote</h2>
          <div className="flex flex-col gap-4 w-full">
            <label className="lot-label">Nombre del medicamento</label>
            <input className="text-gray-400 border rounded-lg px-2 hover:border-blue-500" />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <label className="lot-label">Código de lote</label>
            <input className="text-gray-400 border rounded-lg px-2 hover:border-blue-500" />
          </div>
        </div>
        <div className="p-6 rounded-4xl flex flex-col gap-6 items-center shadow-2xl max-w-3xl border border-gray-300 w-[361px]">
          <h2 className="text-lg font-bold">Complete los datos de recepción</h2>
          <div className="flex flex-col gap-4 w-full">
            <label className="lot-label">Destinatario</label>
            <input className="text-gray-400 border rounded-lg px-2 hover:border-blue-500" />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <label className="lot-label">Representante</label>
            <input className="text-gray-400 border rounded-lg px-2 hover:border-blue-500" />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <label className="lot-label">Fecha</label>
            <input type="date" className="text-gray-400 border rounded-lg px-2 hover:border-blue-500" />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <label className="lot-label">Cantidad</label>
            <input className="text-gray-400 border rounded-lg px-2 hover:border-blue-500" />
          </div>
        </div>
      </div>
      <button className="border border-blue-300 bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition-colors w-[200px]">
        Realizar transferencia
      </button>
    </div>
  );
}

