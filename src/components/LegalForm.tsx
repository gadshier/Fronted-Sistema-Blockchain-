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

const iconClass = "h-5 w-5 text-blue-500";

const UserIcon = () => (
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
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
  </svg>
);

const IdIcon = () => (
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
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 8h3" />
    <path d="M7 12h10" />
    <path d="M7 16h7" />
  </svg>
);

const PhoneIcon = () => (
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
    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5.5 5.5L15 13l5 2v3a2 2 0 0 1-2 2 15 15 0 0 1-13-13 2 2 0 0 1 2-2Z" />
  </svg>
);

const MailIcon = () => (
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
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export default function LegalForm({ data, onChange }: LegalFormProps) {
  return (
    <section className="h-full w-full rounded-[20px] border border-white/70 bg-white/80 p-8 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur">
      <header className="mb-6 space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">Responsable técnico</h3>
        <p className="text-sm text-slate-500">
          Datos del representante legal o químico farmacéutico responsable de la liberación del lote.
        </p>
      </header>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="legal-name">
            Nombre completo
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <UserIcon />
            </span>
            <input
              id="legal-name"
              className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 pl-12 text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              placeholder="Nombre completo"
              value={data.name}
              onChange={(event) => onChange("name", event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="legal-id">
            DNI / RUC
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <IdIcon />
            </span>
            <input
              id="legal-id"
              className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 pl-12 text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              placeholder="Documento de identidad"
              value={data.id}
              onChange={(event) => onChange("id", event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="legal-phone">
            Teléfono de contacto
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <PhoneIcon />
            </span>
            <input
              id="legal-phone"
              className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 pl-12 text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              placeholder="Número de contacto"
              value={data.phone}
              onChange={(event) => onChange("phone", event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="legal-email">
            Correo institucional / colegiatura
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <MailIcon />
            </span>
            <input
              id="legal-email"
              className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 pl-12 text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              placeholder="Correo profesional o N° colegiatura"
              value={data.email}
              onChange={(event) => onChange("email", event.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

