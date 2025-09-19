import { useState } from "react";
import type { FormEvent } from "react";
import { ethers } from "ethers";
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

export default function TraceabilityForm({
  contract,
}: TraceabilityFormProps) {
  const [codigo, setCodigo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loteInfo, setLoteInfo] = useState<LoteInfo | null>(null);

  const formatDate = (
    timestamp?: number,
    emptyMessage = "Fecha no disponible"
  ) => {
    if (!timestamp) {
      return emptyMessage;
    }

    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoteInfo(null);

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

      setLoteInfo({
        nombre,
        fabricante,
        mfgDate: Number(mfgDate),
        expDate: Number(expDate),
        propietario,
        fechaRegistro: Number(fechaRegistro),
        fechaTransferencia: Number(fechaTransferencia),
      });
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
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-800">Datos del lote</h2>
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
      )}
      <img src="/user.png" alt="Usuario" className="h-40 w-40" />
    </div>
  );
}

