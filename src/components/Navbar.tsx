interface NavbarProps {
  onConnect: () => void;
  account?: string;
  isConnecting?: boolean;
}

export default function Navbar({ onConnect, account, isConnecting }: NavbarProps) {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className=" mx-auto flex items-center justify-between px-6 py-3 roiunded-b-lg">
        
        {/* Logo + Nombre */}
        <div className="flex flex-col items-center gap-2">
          <img src="/LogoBlockMed.png" alt="BlockFarm logo" className="size-9" />
          <span className="font-bold text-[#2997f0] italic text-[19px]">
            BlockFarm
          </span>
        </div>

        {/* Links de navegación */}
        <nav className="flex justify-between w-[500px]">
          <a href="#" className="text-[#000000] hover:text-[#2997f0] no-underline">
            Consultar Medicamentos
          </a>
          <a href="#" className="text-[#2997f0] font-semibold no-underline">
            Registrar Lote
          </a>
          <a href="#" className="text-[#000000] hover:text-[#2997f0] no-underline">
            Realizar Transferencia
          </a>
        </nav>

        {/* Botones de sesión */}
        <div className="flex items-center gap-3  justify-end">
          {account ? (
            
            <div className="flex items-center gap-4">
              
              <span className=" py-2 border rounded-full text-sm text-blue-700">
              {account}
              </span>
              <img src="/man.png" alt="MetaMask logo" className="inline size-10 mr-2" />
            </div>
          ) : (
            <>
              <button
                onClick={onConnect}
                disabled={!!isConnecting}
                className="w-[150px] h-[35px] border rounded-full text-gray-700 hover:bg-[#94B0D1] hover:text-white transition-colors"
              >
                {isConnecting ? "Conectando..." : "Iniciar Sesión"}
              </button>
            </>
        )}
      </div>

      </div>
    </header>
  );
}

