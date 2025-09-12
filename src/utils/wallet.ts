import { ethers } from "ethers";


declare global {
  interface Window { ethereum?: unknown; }
}

export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask no está instalada");

  const provider =
    // v6
    (ethers).BrowserProvider
      ? new (ethers).BrowserProvider(window.ethereum)
      // fallback v5
      : new (ethers).providers.Web3Provider(window.ethereum);

  try {
    // Pide conexión solo si no hay cuentas ya autorizadas
    const existing: string[] = await provider.send("eth_accounts", []);
    if (!existing || existing.length === 0) {
      await provider.send("eth_requestAccounts", []);
    }
  } catch (err: any) {
    if (err?.code === -32002) {
      // Ya hay una solicitud abierta en MetaMask
      throw Object.assign(
        new Error("MetaMask tiene una solicitud de conexión pendiente. Abre la extensión y complétala o cancélala."),
        { code: -32002 }
      );
    }
    if (err?.code === 4001) {
      // Usuario rechazó
      throw Object.assign(new Error("Conexión cancelada por el usuario."), { code: 4001 });
    }
    throw err;
  }

  const signer = await provider.getSigner();
  return { provider, signer };
}
