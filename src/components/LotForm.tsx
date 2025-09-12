

  export interface LotData {
    medicineName: string;
    activeIngredient: string;
    seriesCode: string;
    mfgDate: string;
    expDate: string;
    healthReg: string;
  }

  interface LotFormProps {
    data: LotData;
    onChange: (field: keyof LotData, value: string) => void;
    onGenerateCode: () => void;
  }

  export default function LotForm({ data, onChange, onGenerateCode }: LotFormProps) {
    return (
      <div className="p-6 rounded-4xl flex flex-col gap-8 items-center  shadow-md max-w-3xl  border border-blue-300 bg-blue-50">
        <h1 className=" text-lg font-bold">Registro de Lote</h1>  
        <div className="flex flex-col">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="medicineName" className="lot-label">
                Nombre del medicamento
              </label>
              <input
                id="medicineName"
                className="lot-input text-gray-400 border rounded-lg px-2"
                value={data.medicineName}
                onChange={(e) => onChange("medicineName", e.target.value)}
              />
            </div>

            <div className=" flex flex-col gap-2">
              <label htmlFor="activeIngredient" className="lot-label">
                Principio activo
              </label>
              <input
                id="activeIngredient"
                className="lot-input text-gray-400 border rounded-lg px-2"
                value={data.activeIngredient}
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
                  className="text-gray-400 border rounded-lg  px-2"
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
                className="lot-input text-gray-400 border rounded-lg px-2"
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
                className="lot-input text-gray-400 border rounded-lg px-2"
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
                className="lot-input text-gray-400 border rounded-lg px-2"
                value={data.healthReg}
                onChange={(e) => onChange("healthReg", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

