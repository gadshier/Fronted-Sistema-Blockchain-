import { useState } from "react";
import { ethers } from "ethers";
import { connectWallet } from "./utils/wallet";
import abi from "./abi/MedicineRegistry.json";
import type { MedicineRegistryContract } from "./types/MedicineRegistry";
import Navbar from "./components/Navbar";
import LotForm, { LotData } from "./components/LotForm";
import LegalForm, { LegalData } from "./components/LegalForm";

const CONTRACT_ADDRESS = "0x4E0fa35846Cf43E9e204C3744607aB66E33827e0"; // Dirección del contrato desplegado

function App() {
  const [account, setAccount] = useState<string>("");
  const [contract, setContract] = useState<MedicineRegistryContract | null>(null);

  const [lotData, setLotData] = useState<LotData>({
    medicineName: "",
    manufacturer: "",
    mfgDate: "",
    expDate: "",
    seriesCode: "",
  });

  const [legalData, setLegalData] = useState<LegalData>({
    name: "",
    id: "",
    phone: "",
    email: "",
  });

  // conectar MetaMask
  async function handleConnect() {
    const conn = await connectWallet();
    if (conn) {
      const { signer } = conn;
      const address = await signer.getAddress();
      setAccount(address);

      // instanciamos el contrato
      const _contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi.abi,
        signer
      ) as unknown as MedicineRegistryContract;
      setContract(_contract);
    }
  }

  const handleLotChange = (field: keyof LotData, value: string) => {
    setLotData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLegalChange = (field: keyof LegalData, value: string) => {
    setLegalData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSeriesCode = () => {
    const code = `CODE-${Math.floor(Math.random() * 100000)}`;
    setLotData((prev) => ({ ...prev, seriesCode: code }));
  };

  // registrar lote usando datos del formulario
  async function registrarLote() {
    if (!contract) return alert("Conecta tu wallet primero");

    const mfg = Math.floor(new Date(lotData.mfgDate).getTime() / 1000);
    const exp = Math.floor(new Date(lotData.expDate).getTime() / 1000);

    const tx = await contract.registrarLote(
      lotData.medicineName,
      lotData.manufacturer,
      mfg,
      exp,
      lotData.seriesCode
    );

    await tx.wait();
    alert("Lote registrado en la blockchain");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onConnect={handleConnect} account={account} />
      <div className="max-w-4xl mx-auto mt-8">
        <div className="grid grid-cols-2 gap-6 p-6 border border-dashed border-blue-400 rounded-md bg-gray-50">
          <LotForm
            data={lotData}
            onChange={handleLotChange}
            onGenerateCode={generateSeriesCode}
          />
          <LegalForm data={legalData} onChange={handleLegalChange} />
        </div>
        <button
          onClick={registrarLote}
          className="mx-auto mt-6 px-6 py-2 border rounded-md bg-white hover:bg-gray-100 block"
        >
          Registrar Lote
        </button>
      </div>
    </div>
  );
}

export default App;
