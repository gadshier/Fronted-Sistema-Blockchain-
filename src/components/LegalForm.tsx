

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
    <div className="p-6 rounded-4xl flex flex-col gap-8 items-center  shadow-2xl max-w-3xl  border border-gray-300 w-[361px]">
      <h2 className="text-lg font-bold">Representante Legal</h2>
      <div className="flex flex-col gap-4 w-full">
        <label htmlFor="medicineName" className="lot-label">
                Nombre completo
        </label>
        <input
        className="text-gray-400 border rounded-lg px-2 hover:border-blue-500"
        placeholder="Nombre completo"
        value={data.name}
        onChange={(e) => onChange("name", e.target.value)}
      />
      </div>
      <div className="flex flex-col gap-4 w-full">
        <label className="lot-label">DNI / RUC</label>
        <input
        className="text-gray-400 border rounded-lg px-2 hover:border-blue-500"
        placeholder="Documento de identidad"
        value={data.id}
        onChange={(e) => onChange("id", e.target.value)}
      />
      </div>
      <div className="flex flex-col gap-4 w-full">
        <label className="lot-label">Contacto</label>
        <input
        className="text-gray-400 border rounded-lg px-2 hover:border-blue-500"
        placeholder="Teléfono"
        value={data.phone}
        onChange={(e) => onChange("phone", e.target.value)}
      />
      </div>
      <div className="flex flex-col gap-4 w-full">
        <label className="lot-label">N° de colegiatura</label>
        <input
        className="text-gray-400 border rounded-lg px-2 hover:border-blue-500"
        placeholder="Correo electrónico"
        value={data.email}
        onChange={(e) => onChange("email", e.target.value)}
      />
      </div>
    </div>
  );
}

