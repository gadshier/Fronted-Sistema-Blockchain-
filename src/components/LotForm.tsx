export interface LotData {
  medicineName: string;
  activeIngredient: string;
  seriesCode: string;
  mfgDate: string;
  expDate: string;
  healthReg: string;
  quantity: string;
}

const medicamentos = [
  // Ejemplos iniciales
  {
    nombre: "Paracetamol 500 mg",
    principioActivo: "Paracetamol",
    registroSanitario: "DIG-2025-0001",
  },
  {
    nombre: "Amoxicilina 500 mg",
    principioActivo: "Amoxicilina",
    registroSanitario: "DIG-2025-0002",
  },
  {
    nombre: "Ibuprofeno 400 mg",
    principioActivo: "Ibuprofeno",
    registroSanitario: "DIG-2025-0003",
  },
  {
    nombre: "Azitromicina 500 mg",
    principioActivo: "Azitromicina",
    registroSanitario: "DIG-2025-0004",
  },
  {
    nombre: "Metformina 850 mg",
    principioActivo: "Metformina",
    registroSanitario: "DIG-2025-0005",
  },

  // Todos los medicamentos de la lista → principio activo = Paracetamol
  {
    nombre: "PARACETAMOL 500 mg",
    principioActivo: "Paracetamol",
    registroSanitario: "E069PE",
  },
  {
    nombre: "MEDIFLU SUSPENSION",
    principioActivo: "Paracetamol",
    registroSanitario: "E10076",
  },
  {
    nombre: "MULTI-SYMPTON TYLENOL COLD MED TABLETA",
    principioActivo: "Paracetamol",
    registroSanitario: "E10158",
  },
  {
    nombre: "SYNMAL COMPRIMIDO",
    principioActivo: "Paracetamol",
    registroSanitario: "E10451",
  },
  {
    nombre: "VITAPYRENA 500 mg GRANULOS",
    principioActivo: "Paracetamol",
    registroSanitario: "E10484",
  },
  {
    nombre: "NERUPOL 500 mg TABLETA",
    principioActivo: "Paracetamol",
    registroSanitario: "E10655",
  },
  {
    nombre: "FLECTADOL 250mg + 300mg CAPSULA BLANDA",
    principioActivo: "Paracetamol",
    registroSanitario: "E10677",
  },
  {
    nombre: "PUNACAP COMPRIMIDO",
    principioActivo: "Paracetamol",
    registroSanitario: "E10831",
  },
  {
    nombre: "SUDAPOL 500 mg TABLETA",
    principioActivo: "Paracetamol",
    registroSanitario: "E11354",
  },
  {
    nombre: "NASTIFRIN COMPUESTO COMPRIMIDO RECUBIERTO",
    principioActivo: "Paracetamol",
    registroSanitario: "E11455",
  },
  {
    nombre: "TERAGRIP TABLETA",
    principioActivo: "Paracetamol",
    registroSanitario: "E11479",
  },
  {
    nombre: "TERAGRIP GRANULADO PEDIATRICO GRANULOS",
    principioActivo: "Paracetamol",
    registroSanitario: "E11484",
  },
  {
    nombre: "TERAGRIP JARABE",
    principioActivo: "Paracetamol",
    registroSanitario: "E11485",
  },
];


const iconClass = "h-5 w-5 text-blue-500";

const PillIcon = () => (
  <svg
    className={iconClass}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4.5 9.5 9 5a4.95 4.95 0 0 1 7 7l-4.5 4.5a4.95 4.95 0 0 1-7-7Z" />
    <path d="m8.5 8.5 7 7" />
  </svg>
);

const BeakerIcon = () => (
  <svg
    className={iconClass}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10 2v6l-5.5 9a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 8V2" />
    <path d="M6.1 15h11.8" />
  </svg>
);

const HashIcon = () => (
  <svg
    className={iconClass}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 9h16" />
    <path d="M4 15h16" />
    <path d="M10 3 8 21" />
    <path d="m16 3-2 18" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className={iconClass}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    className={iconClass}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3 5 6v6c0 5 3.6 9.3 7 9.9 3.4-.6 7-4.9 7-9.9V6l-7-3Z" />
    <path d="M9 12h6" />
  </svg>
);

interface LotFormProps {
  data: LotData;
  onChange: (field: keyof LotData, value: string) => void;
  onGenerateCode: () => void;
}

export default function LotForm({ data, onChange, onGenerateCode }: LotFormProps) {
  return (
    <section className="w-full rounded-[20px] border border-white/70 bg-white/90 p-8 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur">
      <header className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Datos del lote</h2>
        <p className="text-sm text-slate-500">
          Selecciona la especialidad y completa la información para generar el identificador único del lote.
        </p>
      </header>

      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="medicineName" className="text-sm font-medium text-slate-600">
            Nombre del medicamento
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <PillIcon />
            </span>
            <select
              id="medicineName"
              className="w-full rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 pl-12 text-sm font-medium text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              value={data.medicineName}
              onChange={(event) => {
                const selected = medicamentos.find((med) => med.nombre === event.target.value);
                onChange("medicineName", selected?.nombre ?? "");
                onChange("activeIngredient", selected?.principioActivo ?? "");
                onChange("healthReg", selected?.registroSanitario ?? "");
              }}
            >
              <option value="">Seleccione un medicamento</option>
              {medicamentos.map((medicamento) => (
                <option key={medicamento.registroSanitario} value={medicamento.nombre}>
                  {medicamento.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="activeIngredient" className="text-sm font-medium text-slate-600">
              Principio activo
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <BeakerIcon />
              </span>
              <input
                id="activeIngredient"
                className="w-full rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 pl-12 text-sm text-slate-600 outline-none transition-all"
                value={data.activeIngredient}
                disabled
                onChange={(event) => onChange("activeIngredient", event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="healthReg" className="text-sm font-medium text-slate-600">
              Registro sanitario (DIGEMID)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <ShieldIcon />
              </span>
              <input
                id="healthReg"
                className="w-full rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 pl-12 text-sm text-slate-600 outline-none transition-all"
                value={data.healthReg}
                disabled
                onChange={(event) => onChange("healthReg", event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="seriesCode" className="text-sm font-medium text-slate-600">
            Código único de serie
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <HashIcon />
              </span>
              <input
                id="seriesCode"
                className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 pl-12 text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                value={data.seriesCode}
                onChange={(event) => onChange("seriesCode", event.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={onGenerateCode}
              className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-600 transition-colors hover:border-blue-300 hover:bg-blue-100"
            >
              Generar código
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="mfgDate" className="text-sm font-medium text-slate-600">
              Fecha de fabricación
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <CalendarIcon />
              </span>
              <input
                id="mfgDate"
                type="date"
                className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 pl-12 text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                value={data.mfgDate}
                onChange={(event) => onChange("mfgDate", event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="expDate" className="text-sm font-medium text-slate-600">
              Fecha de vencimiento
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <CalendarIcon />
              </span>
              <input
                id="expDate"
                type="date"
                className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 pl-12 text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                value={data.expDate}
                onChange={(event) => onChange("expDate", event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="quantity" className="text-sm font-medium text-slate-600">
            Cantidad disponible en el lote
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <HashIcon />
            </span>
            <input
              id="quantity"
              type="number"
              min="0"
              className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 pl-12 text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              value={data.quantity}
              onChange={(event) => onChange("quantity", event.target.value)}
            />
          </div>
          <p className="text-xs text-slate-500">Registra el número total de unidades en este lote.</p>
        </div>
      </div>
    </section>
  );
}

