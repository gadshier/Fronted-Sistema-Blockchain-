

  export interface LotData {
    medicineName: string;
    activeIngredient: string;
    seriesCode: string;
    mfgDate: string;
    expDate: string;
    healthReg: string;
  }

  const medicamentos = [
  { 
    nombre: "Paracetamol 500 mg", 
    principioActivo: "Paracetamol", 
    registroSanitario: "DIG-2025-0001" 
  },
  { 
    nombre: "Amoxicilina 500 mg", 
    principioActivo: "Amoxicilina", 
    registroSanitario: "DIG-2025-0002" 
  },
  { 
    nombre: "Ibuprofeno 400 mg", 
    principioActivo: "Ibuprofeno", 
    registroSanitario: "DIG-2025-0003" 
  },
  { 
    nombre: "Azitromicina 500 mg", 
    principioActivo: "Azitromicina", 
    registroSanitario: "DIG-2025-0004" 
  },
  { 
    nombre: "Metformina 850 mg", 
    principioActivo: "Metformina", 
    registroSanitario: "DIG-2025-0005" 
  },
];
  
  interface LotFormProps {
    data: LotData;
    onChange: (field: keyof LotData, value: string) => void;
    onGenerateCode: () => void;
  }

  export default function LotForm({ data, onChange, onGenerateCode }: LotFormProps) {
    return (
      <div className="p-6 rounded-4xl flex flex-col gap-8 items-center  shadow-2xl max-w-3xl  border border-gray-300">
        <h1 className=" text-lg font-bold">Registro de Lote</h1>  
        <div className="flex flex-col">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="medicineName" className="lot-label">
                Nombre del medicamento
              </label>
              <select
                id="medicineName"
                className="lot-input border rounded-lg px-2 hover:border-blue-500"
                value={data.medicineName}
                onChange={(e) => {
                  const selected = medicamentos.find(med => med.nombre === e.target.value);
                  onChange("medicineName", selected?.nombre || "");
                  onChange("activeIngredient", selected?.principioActivo || "");
                  onChange("healthReg", selected?.registroSanitario || "");
                }}
              >
                <option value="">Seleccione un medicamento</option>
                {medicamentos.map((med, index) => (
                  <option key={index} value={med.nombre}>
                    {med.nombre}
                  </option>
                ))}

              </select>
            </div>

            <div className=" flex flex-col gap-2">
              <label htmlFor="activeIngredient" className="lot-label">
                Principio activo
              </label>
              <input
                id="activeIngredient"
                className="lot-input border rounded-lg px-2 hover:border-blue-500 "
                value={data.activeIngredient}
                disabled
                onChange={(e) => onChange("activeIngredient", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="seriesCode" className="">
                Código único de serie
              </label>
              <div className="flex  gap-6">
                <input
                  id="seriesCode"
                  className="text-gray-400 border rounded-lg  px-2 hover:border-blue-500"
                  value={data.seriesCode}
                  onChange={(e) => onChange("seriesCode", e.target.value)}
                />
                <button
                  type="button"
                  onClick={onGenerateCode}
                  className="border rounded-lg bg-blue-500 text-white px-4 py-1 hover:bg-blue-600 transition-colors"
                >
                  Generar
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="mfgDate" className="">
                Fecha de fabricación
              </label>
              <input
                id="mfgDate"
                type="date"
                className="lot-input text-gray-400 border rounded-lg px-2 hover:border-blue-500"
                value={data.mfgDate}
                onChange={(e) => onChange("mfgDate", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="expDate" className="lot-label">
                Fecha de vencimiento
              </label>
              <input
                id="expDate"
                type="date"
                className="lot-input text-gray-400 border rounded-lg px-2 hover:border-blue-500"
                value={data.expDate}
                onChange={(e) => onChange("expDate", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="healthReg" className="lot-label">
                Registro sanitario (DIGEMID)
              </label>
              <input
                id="healthReg"
                className="lot-inpu border rounded-lg px-2"
                value={data.healthReg}
                disabled
                onChange={(e) => onChange("healthReg", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

