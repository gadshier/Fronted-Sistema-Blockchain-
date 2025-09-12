interface NavbarProps {
  onConnect: () => void;
  account?: string;
}

export default function Navbar({ onConnect, account }: NavbarProps) {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 roiunded-b-lg">
        
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
            <span className="w-[200px] py-2 border rounded-full text-sm text-gray-700">
              {account}
            </span>
          ) : (
            <>
              <button
                onClick={onConnect}
                className="w-[150px] h-[35px] border rounded-full text-gray-700 hover:bg-[#94B0D1] hover:text-white transition-colors"
              >
                Iniciar sesión
              </button>
            </>
        )}
      </div>

      </div>
    </header>
  );
}

