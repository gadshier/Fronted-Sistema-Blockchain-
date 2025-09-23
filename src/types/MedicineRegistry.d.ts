import { ContractTransactionResponse } from "ethers";

export interface MedicineRegistryContract {
  registrarLote: (
    name: string,
    manufacturer: string,
    mfgDate: number,
    expDate: number,
    serial: string
  ) => Promise<ContractTransactionResponse>;
  transferirLote: (
    loteId: string,
    nuevoPropietario: string
  ) => Promise<ContractTransactionResponse>;
  obtenerLote: (
    loteId: string
  ) =>
    Promise<
      [string, string, bigint, bigint, string, bigint, bigint, boolean]
    >;
}
