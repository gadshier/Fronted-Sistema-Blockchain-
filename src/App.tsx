import { useState } from "react";
import { ethers } from "ethers";
import { connectWallet } from "./utils/wallet";
import abi from "./abi/MedicineRegistry.json";
import type { MedicineRegistryContract } from "./types/MedicineRegistry";

const CONTRACT_ADDRESS = "0x4E0fa35846Cf43E9e204C3744607aB66E33827e0"; // Dirección del contrato desplegado

function App() {
  const [account, setAccount] = useState<string>("");
  const [contract, setContract] = useState<MedicineRegistryContract | null>(null);

  // conectar MetaMask
  async function handleConnect() {  
    const conn = await connectWallet();
    if (conn) {
      const { signer } = conn;
      const address = await signer.getAddress();
      setAccount(address);

      // instanciamos el contrato
      const _contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer) as unknown as MedicineRegistryContract;
        setContract(_contract);

    }
  }

  // registrar lote de prueba
  async function registrarLote() {
    if (!contract) return alert("Conecta tu wallet primero");

    const mfg = Math.floor(new Date("2025-01-01").getTime() / 1000);
    const exp = Math.floor(new Date("2026-01-01").getTime() / 1000);

    const tx = await contract.registrarLote(
      "Paracetamol 500mg",
      "ACME Labs",
      mfg,
      exp,
      "LOTE-FRONT-001"
    );

    await tx.wait();
    alert("Lote registrado en la blockchain");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Medicine Registry DApp</h1>
      {!account ? (
        <button onClick={handleConnect}>Conectar MetaMask</button>
      ) : (
        <>
          <p>Conectado como: {account}</p>
          <button onClick={registrarLote}>Registrar lote de prueba</button>
        </>
      )}
    </div>
  );
}

export default App;
