import React from 'react';
import { 
  Coffee, 
  Wallet, 
  Package, 
  LayoutDashboard, 
  LogOut,
  X, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const NAVIGATION_ITEMS = [
  {
    id: 'monitor',
    label: 'Pedidos',
    icon: Coffee,
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    icon: Wallet,
  },
  {
    id: 'catalogo',
    label: 'Catálogo',
    icon: Package,
  },
];

export default function Sidebar({
  activeView,
  onSelectView,
  isOpen,
  onClose,
  currentUser,
  onLogout,
}) {
  return (
    <>
      {/* Backdrop overlay para pantallas móviles */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#000000]/60 z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container: Ancho fijo de 260px, fondo bg-secondary #F4F4F5, borde border-light #E4E4E7 */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-[#F4F4F5] border-r border-[#E4E4E7] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Cabecera del Sidebar / Brand (h-16 / 64px) */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#E4E4E7] shrink-0 bg-[#F4F4F5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#000000] text-[#FFFFFF] rounded-[6px] flex items-center justify-center font-bold text-sm">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#000000] text-sm tracking-tight block uppercase">
                ControlHub
              </span>
              <span className="text-[11px] text-[#52525B] font-medium block">
                Dashboard B/N
              </span>
            </div>
          </div>

          {/* Botón cerrar para móvil: round corner de 6px */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú lateral"
            className="lg:hidden min-w-[36px] min-h-[36px] flex items-center justify-center text-[#000000] hover:bg-[#E4E4E7] rounded-[6px] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sección de navegación principal (sin título de navegación) */}
        <div className="flex-1 px-3 py-5 overflow-y-auto">
          <nav className="space-y-1" role="navigation" aria-label="Navegación principal">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectView(item.id);
                    if (onClose) onClose();
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full min-h-[40px] px-3 py-2 flex items-center justify-between transition-colors select-none text-left rounded-[6px] cursor-pointer ${
                    isActive
                      ? 'bg-[#000000] text-[#FFFFFF] font-medium'
                      : 'text-[#000000] hover:bg-[#E4E4E7] font-normal'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FFFFFF]' : 'text-[#000000]'}`} />
                    <span className="text-xs leading-tight font-medium truncate">
                      {item.label}
                    </span>
                  </div>

                  {!isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#52525B] shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer del Sidebar: Estado de Autenticación JWT de Administrador */}
        <div className="p-3 border-t border-[#E4E4E7] shrink-0 bg-[#F4F4F5]">
          <div className="p-2.5 bg-[#FFFFFF] border border-[#E4E4E7] rounded-[6px] flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 bg-[#000000] text-[#FFFFFF] rounded-[6px] flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser?.username ? currentUser.username.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-[#000000] block truncate">
                  {currentUser?.username || 'Administrador'}
                </span>
                <span className="text-[11px] text-[#52525B] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#000000]" />
                  JWT Activo
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              aria-label="Cerrar sesión"
              title="Cerrar sesión de administrador"
              className="min-w-[32px] min-h-[32px] flex items-center justify-center text-[#52525B] hover:text-[#000000] hover:bg-[#F4F4F5] rounded-[6px] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
