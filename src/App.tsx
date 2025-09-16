import { useState } from "react";
import { ethers } from "ethers";
import type { Eip1193Provider } from "ethers";
import { connectWallet } from "./utils/wallet";
import abi from "./abi/MedicineRegistry.json";
import type { MedicineRegistryContract } from "./types/MedicineRegistry";
import Navbar from "./components/Navbar";
import LotForm from "./components/LotForm";
import type { LotData } from "./components/LotForm";
import LegalForm from "./components/LegalForm";
import type { LegalData } from "./components/LegalForm";
import LotPopup from "./components/ModalLote";
import TraceabilityForm from "./components/TraceabilityForm";
import TransferForm from "./components/TransferForm";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "./components/Layout/PageWraper";
import { useEffect } from "react";



const CONTRACT_ADDRESS = "0x4E0fa35846Cf43E9e204C3744607aB66E33827e0"; // Dirección del contrato desplegado

type EthereumProviderWithEvents = Eip1193Provider & {
  on?: (eventName: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (
    eventName: string,
    listener: (...args: unknown[]) => void
  ) => void;
};
interface LotInfo {
  medicineName: string;
  seriesCode: string;
  expDate: string;
  account: string;
  txHash: string;
  transactionHash?: string;
}
function App() {
  const [account, setAccount] = useState<string>("");
  const [contract, setContract] = useState<MedicineRegistryContract | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [lastLotInfo, setLastLotInfo] = useState<LotInfo | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] =
    useState<'consult' | 'register' | 'transfer'>('register');

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
      const { signer } = await connectWallet();
      const address = await signer.getAddress();
      setAccount(address);

      const _contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi.abi,
        signer
      ) as unknown as MedicineRegistryContract;
      setContract(_contract);
    } catch (err) {
        console.error(err);
        alert('Error al conectar:ya tiene una petición pendiente en MetaMask, ábrala y complétela o cancele. Si el error persiste, asegúrese de estar en la red correcta y recargue la página.');
    } finally {
      setIsConnecting(false);
    }
  }

  useEffect(() => {
    const eth = window.ethereum as EthereumProviderWithEvents | undefined;
    if (!eth) return;

    const onAccountsChanged = (...args: unknown[]) => {
      const accounts = Array.isArray(args[0])
        ? (args[0] as string[])
        : [];
      const a = accounts?.[0] ?? "";
      setAccount(a);
      if (!a) setContract(null);
    };
    const onChainChanged = () => window.location.reload();

    eth.on?.("accountsChanged", onAccountsChanged);
    eth.on?.("chainChanged", onChainChanged);
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
    if (isRegistering) return;

    const mfgMs = Date.parse(lotData.mfgDate);
    const expMs = Date.parse(lotData.expDate);
    if (Number.isNaN(mfgMs) || Number.isNaN(expMs)) {
      alert("Completa las fechas antes de registrar el lote.");
      return;
    }

    setIsRegistering(true);
    try {
      const mfg = Math.floor(mfgMs / 1000);
      const exp = Math.floor(expMs / 1000);

      const tx = await contract.registrarLote(
        lotData.medicineName,
        lotData.activeIngredient,
        mfg,
        exp,
        lotData.seriesCode
      );

      await tx.wait();

      // Guarda la información del último lote registrado
      setLastLotInfo({
        medicineName: lotData.medicineName,
        seriesCode: lotData.seriesCode,
        expDate: lotData.expDate,
        account: account,
        txHash: tx.hash,
      });

      setShowPopup(true); // Abrir el popup
    } catch (err) {
      console.error(err);
      alert("Transacción cancelada o fallida.");
    } finally {
      setIsRegistering(false);
    }
  }

  return (
    <div className="app-container overflow-x-hidden">
      <Navbar
        onConnect={handleConnect}
        account={account}
        isConnecting={isConnecting}
        activeTab={activeTab}
        onNavigate={setActiveTab}
      />
      <AnimatePresence mode="wait">
      {activeTab === 'register' && (
        <PageWrapper key="register" >
        <div className="flex flex-col ">
          <div className="flex justify-center gap-72 my-4 ">
            <LotForm
              data={lotData}
              onChange={handleLotChange}
              onGenerateCode={generateSeriesCode}
            />
            <LegalForm data={legalData} onChange={handleLegalChange} />
          </div>

          <div className="flex justify-center mb-12">
            <button
              onClick={registrarLote}
              disabled={isRegistering}
              className={`border border-blue-300 bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition-colors w-[200px] ${isRegistering ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isRegistering ? "Registrando..." : "Registrar Lote"}
            </button>
          </div>
        </div>
        </PageWrapper>
      )}
      
      {activeTab === 'consult' &&
        <PageWrapper key="consult">
          <TraceabilityForm contract={contract} />
        </PageWrapper>}
      {activeTab === 'transfer' &&
      <PageWrapper key="transfer">
       <TransferForm />
       </PageWrapper>
       }
      {activeTab === 'register' && lastLotInfo && !showPopup && (
        <div
          className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow cursor-pointer hover:bg-blue-600"
          onClick={() => setShowPopup(true)}
        >
          Último lote registrado
        </div>
      )}
      {activeTab === 'register' && showPopup && lastLotInfo && (
        <LotPopup info={lastLotInfo} onClose={() => setShowPopup(false)} />
      )}
    </AnimatePresence>
    </div>
    
  );
}

export default App;
