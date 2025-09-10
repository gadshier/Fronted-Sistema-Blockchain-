import React from "react";

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
      <h2 className="font-bold mb-4">Representante Legal</h2>
      <input
        className="w-full border rounded-md px-3 py-2 mb-3"
        placeholder="Nombre completo"
        value={data.name}
        onChange={(e) => onChange("name", e.target.value)}
      />
      <input
        className="w-full border rounded-md px-3 py-2 mb-3"
        placeholder="Documento de identidad"
        value={data.id}
        onChange={(e) => onChange("id", e.target.value)}
      />
      <input
        className="w-full border rounded-md px-3 py-2 mb-3"
        placeholder="Teléfono"
        value={data.phone}
        onChange={(e) => onChange("phone", e.target.value)}
      />
      <input
        className="w-full border rounded-md px-3 py-2 mb-3"
        placeholder="Correo electrónico"
        value={data.email}
        onChange={(e) => onChange("email", e.target.value)}
      />
    </div>
  );
}

