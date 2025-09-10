import "./LegalForm.css";

export interface LegalData {
  firstName: string;
  lastName: string;
  dni: string;
  license: string;
}

interface LegalFormProps {
  data: LegalData;
  onChange: (field: keyof LegalData, value: string) => void;
}

export default function LegalForm({ data, onChange }: LegalFormProps) {
  return (
    <div className="legal-form">
      <h2 className="legal-form-title">Representante Legal</h2>
      <input
        className="legal-input"
        placeholder="Nombres"
        value={data.firstName}
        onChange={(e) => onChange("firstName", e.target.value)}
      />
      <input
        className="legal-input"
        placeholder="Apellidos"
        value={data.lastName}
        onChange={(e) => onChange("lastName", e.target.value)}
      />
      <input
        className="legal-input"
        placeholder="DNI / RUC"
        value={data.dni}
        onChange={(e) => onChange("dni", e.target.value)}
      />
      <input
        className="legal-input"
        placeholder="N° de colegiatura"
        value={data.license}
        onChange={(e) => onChange("license", e.target.value)}
      />
    </div>
  );
}

