import "./LotForm.css";

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
    <div>
      <h1 className="lot-form-title">Registro de Lote</h1>
      <div className="lot-card">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="medicineName" className="lot-label">
              Nombre del medicamento
            </label>
            <input
              id="medicineName"
              className="lot-input"
              value={data.medicineName}
              onChange={(e) => onChange("medicineName", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="activeIngredient" className="lot-label">
              Principio activo
            </label>
            <input
              id="activeIngredient"
              className="lot-input"
              value={data.activeIngredient}
              onChange={(e) => onChange("activeIngredient", e.target.value)}
            />
          </div>

          <div className="form-group md:col-span-2">
            <label htmlFor="seriesCode" className="lot-label">
              Código único de serie
            </label>
            <div className="series-row">
              <input
                id="seriesCode"
                className="lot-input flex-1"
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

          <div className="form-group">
            <label htmlFor="mfgDate" className="lot-label">
              Fecha de fabricación
            </label>
            <input
              id="mfgDate"
              type="date"
              className="lot-input"
              value={data.mfgDate}
              onChange={(e) => onChange("mfgDate", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expDate" className="lot-label">
              Fecha de vencimiento
            </label>
            <input
              id="expDate"
              type="date"
              className="lot-input"
              value={data.expDate}
              onChange={(e) => onChange("expDate", e.target.value)}
            />
          </div>

          <div className="form-group md:col-span-2">
            <label htmlFor="healthReg" className="lot-label">
              Registro sanitario (DIGEMID)
            </label>
            <input
              id="healthReg"
              className="lot-input"
              value={data.healthReg}
              onChange={(e) => onChange("healthReg", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

