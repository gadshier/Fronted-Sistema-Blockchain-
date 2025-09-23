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
    <div className="mt-8 flex w-full flex-col items-center gap-8 px-4">
      <h1 className="text-lg font-bold">Verificación de medicamentos</h1>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col items-center gap-4"
      >
        <input
          className="w-full rounded-lg border px-3 py-2 text-sm text-gray-800 outline-none transition-colors hover:border-blue-500 focus:border-blue-500"
          placeholder="Ingresar ID único"
          value={codigo}
          onChange={(event) => setCodigo(event.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!contract || isLoading}
          className={`w-full rounded-lg border bg-blue-500 px-4 py-2 text-white transition-colors ${
            !contract || isLoading
              ? "cursor-not-allowed opacity-60"
              : "hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Buscando..." : "Verificar"}
        </button>
        {!contract && (
          <p className="w-full text-center text-sm text-amber-500">
            Conecta tu wallet para consultar información en la blockchain.
          </p>
        )}
        {error && (
          <p className="w-full text-center text-sm text-red-500">{error}</p>
        )}
        <a href="#" className="text-sm text-blue-600 hover:underline">
          ¿Dónde encuentro el código o lote?
        </a>
      </form>
      {loteInfo && (
        <div className="w-full grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-white p-6 shadow h-full">
            <h2 className="text-lg font-semibold text-gray-800">
              Datos del lote
            </h2>
            <dl className="mt-4 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <dt className="font-medium">Nombre del medicamento</dt>
                <dd className="text-right">{loteInfo.nombre}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Fabricante</dt>
                <dd className="text-right">{loteInfo.fabricante}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Fecha de fabricación</dt>
                <dd className="text-right">{formatDate(loteInfo.mfgDate)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Fecha de expiración</dt>
                <dd className="text-right">{formatDate(loteInfo.expDate)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Propietario actual</dt>
                <dd className="text-right break-all">{loteInfo.propietario}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Fecha de registro</dt>
                <dd className="text-right">
                  {formatDate(loteInfo.fechaRegistro)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Última transferencia</dt>
                <dd className="text-right">
                  {formatDate(
                    loteInfo.fechaTransferencia,
                    "Sin transferencias registradas"
                  )}
                </dd>
              </div>
            </dl>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow h-full flex flex-col">
            <h2 className="text-lg font-semibold text-gray-800">
              Trazabilidad del lote
            </h2>
            <div className="mt-4 flex-1 text-sm text-gray-700">
              {isTimelineLoading ? (
                <p className="text-sm text-gray-500">
                  Cargando trazabilidad...
                </p>
              ) : timelineError ? (
                <p className="text-sm text-red-500">{timelineError}</p>
              ) : historial.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Sin movimientos registrados
                </p>
              ) : (
                <div className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {historial.map((registro, index) => {
                    const isRegistroInicial = registro.from === "Registro";
                    const isActual = registro.esActual;
                    const circleClasses = `${
                      "absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border"
                    } ${
                      isActual
                        ? "bg-blue-100 border-blue-500 text-blue-700 font-semibold shadow"
                        : "bg-gray-100 border-gray-300 text-gray-400"
                    }`;
                    const cardClasses = isActual
                      ? "rounded-lg border border-blue-100 bg-blue-50 p-4 shadow-sm"
                      : "rounded-lg border border-gray-200 bg-gray-50 p-4";
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
                              isActual ? "text-blue-700" : "text-gray-700"
                            }`}
                          >
                            {registro.to || "Dirección desconocida"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {isRegistroInicial
                              ? "Registrado"
                              : `Transferido a ${
                                  registro.to || "destinatario desconocido"
                                }`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(
                              registro.timestamp,
                              "Fecha no disponible"
                            )}
                          </p>
                          {registro.txHash && (
                            <p className="mt-1 break-all text-xs text-gray-400">
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
      <img
        src="/user.png"
        alt="Usuario"
        className="mt-8 h-40 w-40 self-center"
      />
    </div>
  );
}

