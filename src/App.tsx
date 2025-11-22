import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import type { Eip1193Provider } from "ethers";
import { connectWallet } from "./utils/wallet";
import abi from "./abi/MedicineRegistry.json";
import type {
  ContractRoleKey,
  MedicineRegistryContract,
} from "./types/MedicineRegistry";
import Navbar, {
  sidebarNavigation,
  type NavTabId,
  type SidebarItem,
} from "./components/Navbar";
import LotForm from "./components/LotForm";
import type { LotData } from "./components/LotForm";
import LegalForm from "./components/LegalForm";
import type { LegalData } from "./components/LegalForm";
import LotPopup from "./components/ModalLote";
import TraceabilityForm from "./components/TraceabilityForm";
import TransferForm from "./components/TransferForm";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "./components/Layout/PageWraper";
import RoleManagement from "./components/RoleManagement";


const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS; // Dirección del contrato desplegado

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
  quantity: string;
  responsable: LegalData;
  transactionHash?: string;
}
function App() {
  const [account, setAccount] = useState<string>("");
  const [contract, setContract] = useState<MedicineRegistryContract | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [lastLotInfo, setLastLotInfo] = useState<LotInfo | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTabId | null>(null);
  const [roleStatus, setRoleStatus] = useState<
    Record<ContractRoleKey, boolean>
  >({
    ADMIN_ROLE: false,
    FABRICANTE_ROLE: false,
    DISTRIBUIDOR_ROLE: false,
    FARMACIA_ROLE: false,
  });
  const [roleHashes, setRoleHashes] = useState<
    Record<ContractRoleKey, string>
  >(() => ({
    ADMIN_ROLE: ethers.id("ADMIN_ROLE"),
    FABRICANTE_ROLE: ethers.id("FABRICANTE_ROLE"),
    DISTRIBUIDOR_ROLE: ethers.id("DISTRIBUIDOR_ROLE"),
    FARMACIA_ROLE: ethers.id("FARMACIA_ROLE"),
  }));
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);

  const [lotData, setLotData] = useState<LotData>({
    medicineName: "",
    activeIngredient: "",
    seriesCode: "",
    mfgDate: "",
    expDate: "",
    healthReg: "",
    quantity: "",

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

  useEffect(() => {
    if (!contract || !account) {
      setRoleStatus({
        ADMIN_ROLE: false,
        FABRICANTE_ROLE: false,
        DISTRIBUIDOR_ROLE: false,
        FARMACIA_ROLE: false,
      });
      setIsLoadingRoles(false);
      setRoleError(null);
      return;
    }

    let cancelled = false;

    const loadRoles = async () => {
      setIsLoadingRoles(true);
      setRoleError(null);
      try {
        const [adminRole, fabricanteRole, distribuidorRole, farmaciaRole] =
          await Promise.all([
            contract.ADMIN_ROLE(),
            contract.FABRICANTE_ROLE(),
            contract.DISTRIBUIDOR_ROLE(),
            contract.FARMACIA_ROLE(),
          ]);

        if (cancelled) return;

        const hashes: Record<ContractRoleKey, string> = {
          ADMIN_ROLE: adminRole,
          FABRICANTE_ROLE: fabricanteRole,
          DISTRIBUIDOR_ROLE: distribuidorRole,
          FARMACIA_ROLE: farmaciaRole,
        };
        setRoleHashes(hashes);

        const [isAdmin, isFabricante, isDistribuidor, isFarmacia] =
          await Promise.all([
            contract.hasRole(adminRole, account),
            contract.hasRole(fabricanteRole, account),
            contract.hasRole(distribuidorRole, account),
            contract.hasRole(farmaciaRole, account),
          ]);

        if (cancelled) return;

        setRoleStatus({
          ADMIN_ROLE: isAdmin,
          FABRICANTE_ROLE: isFabricante,
          DISTRIBUIDOR_ROLE: isDistribuidor,
          FARMACIA_ROLE: isFarmacia,
        });
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setRoleError(
            "No fue posible recuperar los roles asignados. Intenta nuevamente."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingRoles(false);
        }
      }
    };

    void loadRoles();

    return () => {
      cancelled = true;
    };
  }, [contract, account]);

  const availableTabs = useMemo<SidebarItem[]>(() => {
    return sidebarNavigation.filter((item) => {
      if (!item.requiredRoles?.length) return true;
      return item.requiredRoles.some((role) => roleStatus[role]);
    });
  }, [roleStatus]);

  useEffect(() => {
    if (!availableTabs.length) {
      setActiveTab(null);
      return;
    }

    const isActiveAvailable = availableTabs.some(
      (item) => item.id === activeTab
    );

    if (!isActiveAvailable) {
      setActiveTab(availableTabs[0].id);
    }
  }, [availableTabs, activeTab]);

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

      const parsedQuantity = lotData.quantity.trim();
      let quantityValue: bigint;
      try {
        quantityValue = BigInt(parsedQuantity);
      } catch (error) {
        alert("Ingresa una cantidad válida para el lote.");
        return;
      }

      if (quantityValue <= 0n) {
        alert("La cantidad debe ser mayor a cero.");
        return;
      }

      const responsable = {
        nombre: legalData.name.trim(),
        dni: legalData.id.trim(),
        telefono: legalData.phone.trim(),
        correo: legalData.email.trim(),
      };

      if (!responsable.nombre || !responsable.dni) {
        alert("Completa los datos del responsable técnico.");
        return;
      }

      const tx = await contract.registrarLote(
        lotData.medicineName,
        lotData.activeIngredient,
        mfg,
        exp,
        lotData.seriesCode,
        responsable,
        quantityValue
      );

      await tx.wait();

      // Guarda la información del último lote registrado
      setLastLotInfo({
        medicineName: lotData.medicineName,
        seriesCode: lotData.seriesCode,
        expDate: lotData.expDate,
        account: account,
        txHash: tx.hash,
        quantity: lotData.quantity,
        responsable: legalData,
      });

      setShowPopup(true); // Abrir el popup
    } catch (err) {
      console.error(err);
      alert("Transacción cancelada o fallida.");
    } finally {
      setIsRegistering(false);
    }
  }

  const formatAccount = (value: string) =>
    value ? `${value.slice(0, 6)}…${value.slice(-4)}` : "";

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="flex min-h-screen">
        <Navbar
          onConnect={handleConnect}
          account={account}
          isConnecting={isConnecting}
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          items={availableTabs}
        />

        <div className="relative flex flex-1 flex-col">
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16 pt-8 sm:px-8 lg:pt-12">
            <div className="mb-10 flex flex-col gap-4 lg:hidden">
              <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm shadow-blue-100/60 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
                      BlockFarm
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      Registro farmacéutico
                    </p>
                  </div>
                  <button
                    onClick={handleConnect}
                    disabled={Boolean(account) || isConnecting}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 ${
                      account
                        ? "cursor-default bg-slate-100 text-slate-400"
                        : "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow hover:from-blue-500 hover:to-blue-400"
                    }`}
                    type="button"
                  >
                    {account
                      ? formatAccount(account)
                      : isConnecting
                        ? "Conectando..."
                        : "Conectar"}
                  </button>
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  Gestiona lotes críticos con auditoría en blockchain.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {availableTabs.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 ${
                        isActive
                          ? "border-blue-200 bg-blue-50 text-blue-600"
                          : "border-transparent bg-white/70 text-slate-600 hover:border-blue-100 hover:bg-blue-50/60"
                      }`}
                      type="button"
                    >
                      <span className="sr-only">{item.helper}</span>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {account && isLoadingRoles && (
              <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-blue-700">
                Cargando roles asignados para tu cuenta...
              </div>
            )}

            {roleError && (
              <div className="mb-4 rounded-2xl border border-red-100 bg-red-50/70 p-4 text-sm text-red-600">
                {roleError}
              </div>
            )}

            {account &&
              !isLoadingRoles &&
              !roleError &&
              availableTabs.length === 0 && (
                <div className="mb-4 rounded-2xl border border-amber-100 bg-amber-50/70 p-4 text-sm text-amber-600">
                  Tu cuenta no tiene módulos asignados actualmente. Solicita a un
                  administrador que te otorgue un rol operativo.
                </div>
              )}

            <AnimatePresence mode="wait">
              {activeTab === "register" && (
                <PageWrapper key="register" className="space-y-10">
                  <section className="space-y-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600 shadow-sm">
                      Registro en blockchain
                    </span>
                    <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                      Registrar un nuevo lote farmacéutico
                    </h1>
                    <p className="max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
                      Completa los datos técnicos y legales del lote para generar un registro inmutable.
                      Asegúrate de contar con la documentación de respaldo antes de continuar.
                    </p>
                  </section>

                  <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
                    <LotForm
                      data={lotData}
                      onChange={handleLotChange}
                      onGenerateCode={generateSeriesCode}
                    />
                    <LegalForm data={legalData} onChange={handleLegalChange} />
                  </div>

                  <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/70 bg-white/80 p-6 text-center shadow-sm shadow-blue-100/60 backdrop-blur lg:flex-row lg:justify-between lg:text-left">
                    <p className="text-sm text-slate-500">
                      Verifica que las fechas y códigos coincidan con la guía de remisión y los protocolos de control de calidad.
                    </p>
                    <button
                      onClick={registrarLote}
                      disabled={isRegistering}
                      className={`inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 ${
                        isRegistering
                          ? "cursor-not-allowed bg-blue-300"
                          : "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 hover:from-blue-500 hover:via-blue-400 hover:to-blue-300"
                      }`}
                      type="button"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                      </svg>
                      {isRegistering ? "Registrando lote..." : "Registrar lote"}
                    </button>
                  </div>
                </PageWrapper>
              )}

              {activeTab === "consult" && (
                <PageWrapper key="consult" className="w-full">
                  <TraceabilityForm contract={contract} />
                </PageWrapper>
              )}

              {activeTab === "transfer" && (
                <PageWrapper key="transfer" className="w-full">
                  <TransferForm contract={contract} account={account} />
                </PageWrapper>
              )}

              {activeTab === "roles" && (
                <PageWrapper key="roles" className="w-full">
                  <RoleManagement
                    contract={contract}
                    roleHashes={roleHashes}
                  />
                </PageWrapper>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {activeTab === "register" && lastLotInfo && !showPopup && (
        <button
          type="button"
          className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-5 py-3 text-sm font-medium text-blue-600 shadow-lg shadow-blue-200/80 backdrop-blur hover:border-blue-300 hover:bg-blue-50"
          onClick={() => setShowPopup(true)}
        >
          <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
          Último lote registrado
        </button>
      )}

      {activeTab === "register" && showPopup && lastLotInfo && (
        <LotPopup info={lastLotInfo} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}

export default App;
