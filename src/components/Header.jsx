import React from 'react';
import { Menu, Bell } from 'lucide-react';

export default function Header({ onOpenSidebar, onShowToast, isSidebarHidden = false }) {
  return (
    <header className="h-16 px-6 sm:px-8 lg:px-[40px] bg-[#FFFFFF] border-b border-[#E4E4E7] sticky top-0 z-30 flex items-center justify-between shrink-0">
      {/* Lado izquierdo: Botón menú móvil o cuando la barra lateral de secciones está oculta */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Abrir menú de navegación"
          className={`${isSidebarHidden ? 'flex' : 'lg:hidden'} min-w-[40px] min-h-[40px] flex items-center justify-center text-[#000000] hover:bg-[#F4F4F5] rounded-[6px] transition-colors cursor-pointer`}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Lado derecho: Notificaciones (sin badge de versión) */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Ver notificaciones"
          onClick={() => onShowToast && onShowToast('No tienes notificaciones pendientes', 'info')}
          className="min-w-[40px] min-h-[40px] relative flex items-center justify-center text-[#000000] hover:bg-[#F4F4F5] rounded-[6px] transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#000000]"></span>
        </button>
      </div>
    </header>
  );
}
