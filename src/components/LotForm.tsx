import React from "react";
import "./LotForm.css";

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
      <h2 className="lot-form-title">Registro de Lote</h2>
      <input
        className="lot-input"
        placeholder="Nombre del medicamento"
        value={data.medicineName}
        onChange={(e) => onChange("medicineName", e.target.value)}
      />
      <input
        className="lot-input"
        placeholder="Fabricante"
        value={data.manufacturer}
        onChange={(e) => onChange("manufacturer", e.target.value)}
      />
      <input
        type="date"
        className="lot-input"
        value={data.mfgDate}
        onChange={(e) => onChange("mfgDate", e.target.value)}
      />
      <input
        type="date"
        className="lot-input"
        value={data.expDate}
        onChange={(e) => onChange("expDate", e.target.value)}
      />
      <div className="series-container">
        <input
          className="lot-input"
          placeholder="Código único de serie"
          value={data.seriesCode}
          onChange={(e) => onChange("seriesCode", e.target.value)}
        />
        <button
          type="button"
          onClick={onGenerateCode}
          className="generate-btn"
        >
          Generar
        </button>
      </div>
    </div>
  );
}

