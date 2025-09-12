import { useState } from "react";
import { ethers } from "ethers";
import { connectWallet } from "./utils/wallet";
import abi from "./abi/MedicineRegistry.json";
import type { MedicineRegistryContract } from "./types/MedicineRegistry";
import Navbar from "./components/Navbar";
import LotForm from "./components/LotForm";
import type { LotData } from "./components/LotForm";
import LegalForm from "./components/LegalForm";
import type { LegalData } from "./components/LegalForm";
import { useEffect } from "react";


const CONTRACT_ADDRESS = "0x4E0fa35846Cf43E9e204C3744607aB66E33827e0"; // Dirección del contrato desplegado

function App() {
  const [account, setAccount] = useState<string>("");
  const [contract, setContract] = useState<MedicineRegistryContract | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lotData, setLotData] = useState<LotData>({
    medicineName: "",
    activeIngredient: "",
    seriesCode: "",
    mfgDate: "",
    expDate: "",
    healthReg: "",
  });

  const [legalData, setLegalData] = useState<LegalData>({
    name: "",
    id: "",
    phone: "",
    email: "",
  });

  // conectar MetaMask
  async function handleConnect() {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      const conn = await connectWallet();
      const { signer } = conn;
      const address = await signer.getAddress();
      setAccount(address);

      const _contract = new ethers.Contract(CONTRACT_ADDRESS, (abi as any).abi, signer) as unknown as MedicineRegistryContract;
      setContract(_contract);
    } catch (err: any) {
      
        alert('Error al conectar:ya tiene una petición pendiente en MetaMask, ábrala y complétela o cancele. Si el error persiste, asegúrese de estar en la red correcta y recargue la página.');
      
    } finally {
      setIsConnecting(false);
    }
  }

  useEffect(() => {
    if ((window).ethereum) {
      (window).ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccount(accounts[0] || ""); // si desconecta queda vacío
      });
    }
  }, []);

  useEffect(() => {
    const eth = (window).ethereum;
    if (!eth) return;

    const onAccountsChanged = (accs: string[]) => {
      const a = accs?.[0] ?? "";
      setAccount(a);
      if (!a) setContract(null);
    };
    const onChainChanged = () => window.location.reload();

    eth.on("accountsChanged", onAccountsChanged);
    eth.on("chainChanged", onChainChanged);
    return () => {
      eth.removeListener?.("accountsChanged", onAccountsChanged);
      eth.removeListener?.("chainChanged", onChainChanged);
    };
  }, []);

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
      lotData.activeIngredient,
      mfg,
      exp,
      lotData.seriesCode
    );

    await tx.wait();
    alert("Lote registrado en la blockchain");
  }

  return (
    <div className="app-container">
      <Navbar onConnect={handleConnect} account={account} />
      <div className="flex flex-col">
        <div className="flex justify-center gap-72 my-4">
          <LotForm
            data={lotData}
            onChange={handleLotChange}
            onGenerateCode={generateSeriesCode}
          />
          <LegalForm data={legalData} onChange={handleLegalChange} />
        </div>
        
        <div className="flex justify-center mb-12">
          <button onClick={registrarLote} className=" border border-blue-300 bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition-colors w-[200px]">
          Registrar Lote
        </button>
        </div>
      </div>
    </div>
  );
}

export default App;
