import detectEthereumProvider from "@metamask/detect-provider";

import { ethers } from "ethers";



// interface básica para MetaMask
interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

export async function connectWallet() {


    const provider = (await detectEthereumProvider()) as EthereumProvider | null;

    if (provider) {
        //Solicitar permiso a meta mask
        await provider.request({ method: "eth_requestAccounts" });

        //Envolver petición en ethers.js
        const ethersProvider = new ethers.BrowserProvider(provider);

        //Obtener signer ( cuenta actviva en metamask )
        const signer = await ethersProvider.getSigner();
        return {signer, ethersProvider};
    }
    else {
        alert("Por favor, instala Metamask para contunuar");
        return null;
    }
}
