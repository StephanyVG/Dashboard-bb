import React from 'react';
import { Menu, Bell } from 'lucide-react';

export default function Header({ activeView, onOpenSidebar, onShowToast, breadcrumbs }) {
  const titles = {
    monitor: 'Pedidos',
    finanzas: 'Gestión Financiera',
    catalogo: 'Catálogo de Productos',
  };

  return (
    <header className="h-16 px-[40px] bg-[#FFFFFF] border-b border-[#E4E4E7] sticky top-0 z-30 flex items-center justify-between shrink-0">
      {/* Lado izquierdo: Botón menú móvil y Título o Breadcrumb (solo en vistas secundarias) */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Abrir menú de navegación"
          className="lg:hidden min-w-[40px] min-h-[40px] flex items-center justify-center text-[#000000] hover:bg-[#F4F4F5] rounded-[6px] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {breadcrumbs && breadcrumbs.length > 0 ? (
          /* Breadcrumbs solo presentes en secciones o niveles secundarios */
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-[#E4E4E7]">/</span>}
                <span className={idx === breadcrumbs.length - 1 ? 'text-[#000000] font-semibold' : 'text-[#52525B] font-medium'}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        ) : (
          /* Sección Principal: Título directo sin breadcrumbs */
          <h1 className="text-sm font-semibold text-[#000000]">
            {titles[activeView] || activeView}
          </h1>
        )}
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
