import React from "react";

export interface LotData {
  medicineName: string;
  manufacturer: string;
  mfgDate: string;
  expDate: string;
  seriesCode: string;
}

interface LotFormProps {
  data: LotData;
  onChange: (field: keyof LotData, value: string) => void;
  onGenerateCode: () => void;
}

export default function LotForm({ data, onChange, onGenerateCode }: LotFormProps) {
  return (
    <div>
      <h2 className="font-bold mb-4">Registro de Lote</h2>
      <input
        className="w-full border rounded-md px-3 py-2 mb-3"
        placeholder="Nombre del medicamento"
        value={data.medicineName}
        onChange={(e) => onChange("medicineName", e.target.value)}
      />
      <input
        className="w-full border rounded-md px-3 py-2 mb-3"
        placeholder="Fabricante"
        value={data.manufacturer}
        onChange={(e) => onChange("manufacturer", e.target.value)}
      />
      <input
        type="date"
        className="w-full border rounded-md px-3 py-2 mb-3"
        value={data.mfgDate}
        onChange={(e) => onChange("mfgDate", e.target.value)}
      />
      <input
        type="date"
        className="w-full border rounded-md px-3 py-2 mb-3"
        value={data.expDate}
        onChange={(e) => onChange("expDate", e.target.value)}
      />
      <div className="flex items-center">
        <input
          className="w-full border rounded-md px-3 py-2 mb-3"
          placeholder="Código único de serie"
          value={data.seriesCode}
          onChange={(e) => onChange("seriesCode", e.target.value)}
        />
        <button
          type="button"
          onClick={onGenerateCode}
          className="bg-blue-600 text-white px-3 py-1 rounded-md ml-2 mb-3"
        >
          Generar
        </button>
      </div>
    </div>
  );
}

