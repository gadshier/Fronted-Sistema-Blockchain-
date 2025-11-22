import { ContractTransactionResponse } from "ethers";

export type ContractRoleKey =
  | "ADMIN_ROLE"
  | "FABRICANTE_ROLE"
  | "DISTRIBUIDOR_ROLE"
  | "FARMACIA_ROLE";

export interface ResponsableTecnico {
  nombre: string;
  dni: string;
  telefono: string;
  correo: string;
}

export interface MedicineRegistryContract {
  ADMIN_ROLE: () => Promise<string>;
  FABRICANTE_ROLE: () => Promise<string>;
  DISTRIBUIDOR_ROLE: () => Promise<string>;
  FARMACIA_ROLE: () => Promise<string>;
  hasRole: (role: string, account: string) => Promise<boolean>;
  asignarRol: (
    role: string,
    account: string
  ) => Promise<ContractTransactionResponse>;
  revocarRol: (
    role: string,
    account: string
  ) => Promise<ContractTransactionResponse>;
  registrarLote: (
    name: string,
    manufacturer: string,
    mfgDate: number,
    expDate: number,
    serial: string,
    responsableTecnico: ResponsableTecnico,
    cantidad: bigint
  ) => Promise<ContractTransactionResponse>;
  transferirLote: (
    loteId: string,
    nuevoPropietario: string,
    cantidad: bigint
  ) => Promise<ContractTransactionResponse>;
  obtenerLote: (
    loteId: string
  ) =>
    Promise<
      [
        string,
        string,
        bigint,
        bigint,
        string,
        bigint,
        bigint,
        boolean,
        ResponsableTecnico,
        bigint
      ]
    >;
}
