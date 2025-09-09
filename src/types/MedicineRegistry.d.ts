import { ContractTransactionResponse } from "ethers";

export interface MedicineRegistryContract {
  registrarLote: (
    name: string,
    manufacturer: string,
    mfgDate: number,
    expDate: number,
    serial: string
  ) => Promise<ContractTransactionResponse>;
}
