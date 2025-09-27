import { useState } from "react";
import type { FormEvent } from "react";
import {
  ethers,
  Contract,
  type ContractEventName,
  type EventLog,
} from "ethers";
import type { MedicineRegistryContract } from "../types/MedicineRegistry";

interface TraceabilityFormProps {
  contract: MedicineRegistryContract | null;
}

interface LoteInfo {
  nombre: string;
  fabricante: string;
  mfgDate: number;
  expDate: number;
  propietario: string;
  fechaRegistro: number;
  fechaTransferencia: number;
}

type TransferRecord = {
  from: string;
  to: string;
  timestamp: number;
  txHash?: string;
  esActual: boolean;
};

export default function TraceabilityForm({
  contract,
}: TraceabilityFormProps) {
  const [codigo, setCodigo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loteInfo, setLoteInfo] = useState<LoteInfo | null>(null);
  const [historial, setHistorial] = useState<TransferRecord[]>([]);
  const [isTimelineLoading, setIsTimelineLoading] = useState(false);
  const [timelineError, setTimelineError] = useState<string | null>(null);

  const formatDate = (
    timestamp?: number,
    emptyMessage = "Fecha no disponible"
  ) => {
    if (!timestamp) {
      return emptyMessage;
    }

    return new Date(timestamp * 1000).toLocaleString();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoteInfo(null);
    setHistorial([]);
    setTimelineError(null);
    setIsTimelineLoading(false);

    const trimmedCode = codigo.trim();
    if (!contract) {
      setError("Conecta tu wallet para realizar la consulta.");
      return;
    }
    if (!trimmedCode) {
      setError("Ingresa el código único del lote.");
      return;
    }

    setIsLoading(true);
    try {
      const loteId = ethers.keccak256(ethers.toUtf8Bytes(trimmedCode));
      const [
        nombre,
        fabricante,
        mfgDate,
        expDate,
        propietario,
        fechaRegistro,
        fechaTransferencia,
        existe,
      ] = await contract.obtenerLote(loteId);

      if (!existe) {
        setError("Lote no encontrado en la blockchain.");
        return;
      }

      const loteData: LoteInfo = {
        nombre,
        fabricante,
        mfgDate: Number(mfgDate),
        expDate: Number(expDate),
        propietario,
        fechaRegistro: Number(fechaRegistro),
        fechaTransferencia: Number(fechaTransferencia),
      };

      setLoteInfo(loteData);

      setIsTimelineLoading(true);
      try {
        const blockchainContract = contract as unknown as Contract;
        const filters =
          blockchainContract.filters as
            | Record<string, (...args: unknown[]) => ContractEventName>
            | undefined;

        const registroFilter = filters?.RegistroLote?.(loteId);
        const transferenciaFilter = filters?.TransferenciaLote?.(loteId);

        const [registroEventsRaw, transferenciaEventsRaw] = await Promise.all([
          registroFilter
            ? (blockchainContract.queryFilter(
                registroFilter
              ) as Promise<EventLog[]>)
            : Promise.resolve([] as EventLog[]),
          transferenciaFilter
            ? (blockchainContract.queryFilter(
                transferenciaFilter
              ) as Promise<EventLog[]>)
            : Promise.resolve([] as EventLog[]),
        ]);

        const registroEvents = registroEventsRaw ?? [];
        const transferenciaEvents = transferenciaEventsRaw ?? [];

        const combinedEvents: Array<{
          type: "registro" | "transferencia";
          event: EventLog;
        }> = [
          ...registroEvents.map((event) => ({
            type: "registro" as const,
            event,
          })),
          ...transferenciaEvents.map((event) => ({
            type: "transferencia" as const,
            event,
          })),
        ].sort((a, b) => {
          const blockA = a.event.blockNumber ?? 0;
          const blockB = b.event.blockNumber ?? 0;
          if (blockA !== blockB) {
            return blockA - blockB;
          }
          const indexA = a.event.index ?? 0;
          const indexB = b.event.index ?? 0;
          return indexA - indexB;
        });

        const timelineRecords: TransferRecord[] = [];
        const registrationEvent = combinedEvents.find(
          (item) => item.type === "registro"
        )?.event;

        if (registrationEvent?.args) {
          const args = registrationEvent.args as {
            propietario?: string;
            fechaRegistro?: bigint;
          };
          const propietarioRegistro =
            args?.propietario ?? loteData.propietario;
          const fechaRegistroEvento =
            args?.fechaRegistro !== undefined
              ? Number(args.fechaRegistro)
              : loteData.fechaRegistro;

          timelineRecords.push({
            from: "Registro",
            to: propietarioRegistro,
            timestamp: fechaRegistroEvento,
            txHash: registrationEvent.transactionHash,
            esActual:
              propietarioRegistro?.toLowerCase() ===
              loteData.propietario.toLowerCase(),
          });
        }

        for (const item of combinedEvents) {
          if (item.type !== "transferencia") {
            continue;
          }
          const args = item.event.args as {
            propietarioAnterior?: string;
            nuevoPropietario?: string;
            fechaTransferencia?: bigint;
          };
          const toAddress = args?.nuevoPropietario ?? "";

          timelineRecords.push({
            from: args?.propietarioAnterior ?? "",
            to: toAddress,
            timestamp:
              args?.fechaTransferencia !== undefined
                ? Number(args.fechaTransferencia)
                : 0,
            txHash: item.event.transactionHash,
            esActual:
              !!toAddress &&
              toAddress.toLowerCase() ===
                loteData.propietario.toLowerCase(),
          });
        }

        if (timelineRecords.length === 0) {
          timelineRecords.push({
            from: "Registro",
            to: loteData.propietario,
            timestamp: loteData.fechaRegistro,
            esActual: true,
          });
        }

        setHistorial(timelineRecords);
      } catch (timelineErr) {
        console.error(timelineErr);
        setTimelineError("No se pudo obtener la trazabilidad del lote.");
      } finally {
        setIsTimelineLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al consultar el lote.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-10">
      <section className="space-y-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          Auditoría en tiempo real
        </span>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Verificación y trazabilidad de medicamentos
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
          Consulta el estado actual y el historial de transferencias de un lote registrado en blockchain.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-slate-600" htmlFor="codigo-lote">
              Código único del lote
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 5h3v3H3z" />
                  <path d="M8 5h3v3H8z" />
                  <path d="M13 5h3v3h-3z" />
                  <path d="M18 5h3v3h-3z" />
                  <path d="M3 10h3v3H3z" />
                  <path d="M18 10h3v3h-3z" />
                  <path d="M3 15h3v3H3z" />
                  <path d="M8 15h3v3H8z" />
                  <path d="M13 15h3v3h-3z" />
                  <path d="M18 15h3v3h-3z" />
                </svg>
              </span>
              <input
                id="codigo-lote"
                className="w-full rounded-2xl border border-slate-200/70 bg-white px-4 py-3 pl-12 text-sm text-slate-700 outline-none transition-all hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                placeholder="Ej. CODE-12345"
                value={codigo}
                onChange={(event) => setCodigo(event.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!contract || isLoading}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 ${
              !contract || isLoading
                ? "cursor-not-allowed bg-blue-300"
                : "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 hover:from-blue-500 hover:via-blue-400 hover:to-blue-300"
            }`}
          >
            {isLoading ? "Buscando lote..." : "Verificar"}
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {!contract && (
            <p className="text-sm text-amber-500">
              Conecta tu wallet para consultar información en la blockchain.
            </p>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="button"
            className="text-sm font-medium text-blue-600 hover:underline"
            onClick={() => alert("El código único se encuentra en la etiqueta del lote registrado.")}
          >
            ¿Dónde encuentro el código del lote?
          </button>
        </div>
      </form>

      {loteInfo && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex h-full flex-col rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)]">
            <h2 className="text-lg font-semibold text-slate-900">Ficha del lote</h2>
            <dl className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-slate-500">Medicamento</dt>
                <dd className="text-right text-slate-800">{loteInfo.nombre}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-slate-500">Fabricante</dt>
                <dd className="text-right text-slate-800">{loteInfo.fabricante}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-slate-500">Fabricación</dt>
                <dd className="text-right text-slate-800">{formatDate(loteInfo.mfgDate)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-slate-500">Caducidad</dt>
                <dd className="text-right text-slate-800">{formatDate(loteInfo.expDate)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-slate-500">Propietario actual</dt>
                <dd className="text-right text-slate-800 break-all">{loteInfo.propietario}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-slate-500">Registro inicial</dt>
                <dd className="text-right text-slate-800">{formatDate(loteInfo.fechaRegistro)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-medium text-slate-500">Última transferencia</dt>
                <dd className="text-right text-slate-800">
                  {formatDate(
                    loteInfo.fechaTransferencia,
                    "Sin transferencias registradas"
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex h-full flex-col rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.35)]">
            <h2 className="text-lg font-semibold text-slate-900">Trazabilidad del lote</h2>
            <div className="mt-4 flex-1 text-sm text-slate-600">
              {isTimelineLoading ? (
                <p className="text-sm text-slate-500">Cargando trazabilidad...</p>
              ) : timelineError ? (
                <p className="text-sm text-red-500">{timelineError}</p>
              ) : historial.length === 0 ? (
                <p className="text-sm text-slate-500">Sin movimientos registrados.</p>
              ) : (
                <div className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {historial.map((registro, index) => {
                    const isRegistroInicial = registro.from === "Registro";
                    const isActual = registro.esActual;
                    const circleClasses = `${
                      "absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border"
                    } ${
                      isActual
                        ? "bg-blue-100 border-blue-500 text-blue-700 font-semibold shadow"
                        : "bg-slate-100 border-slate-300 text-slate-400"
                    }`;
                    const cardClasses = isActual
                      ? "rounded-2xl border border-blue-100 bg-blue-50/80 p-4 shadow-sm"
                      : "rounded-2xl border border-slate-100 bg-slate-50 p-4";
                    return (
                      <div
                        key={
                          registro.txHash ??
                          `${registro.to}-${registro.timestamp}-${index}`
                        }
                        className="relative mb-6 last:mb-0"
                      >
                        <span className={circleClasses} aria-hidden="true" />
                        <div className={cardClasses}>
                          <p
                            className={`break-all font-semibold ${
                              isActual ? "text-blue-700" : "text-slate-700"
                            }`}
                          >
                            {registro.to || "Dirección desconocida"}
                          </p>
                          <p className="text-sm text-slate-500">
                            {isRegistroInicial
                              ? "Registro inicial"
                              : `Transferido a ${
                                  registro.to || "destinatario desconocido"
                                }`}
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatDate(
                              registro.timestamp,
                              "Fecha no disponible"
                            )}
                          </p>
                          {registro.txHash && (
                            <p className="mt-1 break-all text-xs text-slate-400">
                              Hash: {registro.txHash}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

