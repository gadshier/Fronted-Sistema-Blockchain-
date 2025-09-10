import React from "react";
import "./LegalForm.css";

export interface LegalData {
  name: string;
  id: string;
  phone: string;
  email: string;
}

interface LegalFormProps {
  data: LegalData;
  onChange: (field: keyof LegalData, value: string) => void;
}

export default function LegalForm({ data, onChange }: LegalFormProps) {
  return (
    <div>
      <h2 className="legal-form-title">Representante Legal</h2>
      <input
        className="legal-input"
        placeholder="Nombre completo"
        value={data.name}
        onChange={(e) => onChange("name", e.target.value)}
      />
      <input
        className="legal-input"
        placeholder="Documento de identidad"
        value={data.id}
        onChange={(e) => onChange("id", e.target.value)}
      />
      <input
        className="legal-input"
        placeholder="Teléfono"
        value={data.phone}
        onChange={(e) => onChange("phone", e.target.value)}
      />
      <input
        className="legal-input"
        placeholder="Correo electrónico"
        value={data.email}
        onChange={(e) => onChange("email", e.target.value)}
      />
    </div>
  );
}

