import { ethers } from "ethers";
import type { Eip1193Provider } from "ethers";

declare global {
  interface Window { ethereum?: Eip1193Provider }
}

const ALCHEMY_URL = import.meta.env.VITE_ALCHEMY_URL;
export const alchemyProvider = new ethers.JsonRpcProvider(ALCHEMY_URL);
console.log("Alchemy URL:", alchemyProvider._getConnection());

export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask no está instalada");

  const browserProvider = new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
  const accounts = await browserProvider.send("eth_requestAccounts", []);
  const signer = await browserProvider.getSigner();

  // 🔑 Signer que firma con MetaMask pero envía usando Alchemy
  

  return { provider: alchemyProvider, signer: signer, account: accounts[0] };
}
