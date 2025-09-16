export default function TraceabilityForm() {
  return (
    <div className="flex flex-col items-center gap-8 mt-8">
      <h1 className="text-lg font-bold">Verificación de medicamentos</h1>
      <div className="flex flex-col items-center gap-4 w-[300px]">
        <input
          className="text-gray-400 border rounded-lg px-2 py-1 w-full hover:border-blue-500"
          placeholder="Ingresar ID único"
        />
        <button className="border rounded-lg bg-blue-500 text-white px-4 py-2 w-full hover:bg-blue-600 transition-colors">
          Verificar
        </button>
        <a href="#" className="text-sm text-blue-600 hover:underline">
          ¿Dónde encuentro el código o lote?
        </a>
      </div>
      <img src="/user.png" alt="Usuario" className="w-40 h-40" />
    </div>
  );
}

