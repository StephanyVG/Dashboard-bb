import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginView from './views/LoginView';
import MonitorView from './views/MonitorView';
import FinanzasView from './views/FinanzasView';
import CatalogoView from './views/CatalogoView';
import { Check, X, AlertCircle } from 'lucide-react';
import { authStorage } from './services/api';

export default function App() {
  const [activeView, setActiveView] = useState('monitor');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOrderSelected, setIsOrderSelected] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSelectView = (view) => {
    setActiveView(view);
    setIsOrderSelected(false);
  };

  // Estado de autenticación JWT inicializado directamente desde almacenamiento local
  const [token, setToken] = useState(() => authStorage.getToken());
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = authStorage.getUser();
    return savedUser || (authStorage.getToken() ? { username: 'admin', role: 'admin' } : null);
  });

  const handleLoginSuccess = (newToken, user) => {
    setToken(newToken);
    setCurrentUser(user);
  };

  const handleLogout = (message = 'Sesión cerrada exitosamente.') => {
    authStorage.removeToken();
    setToken(null);
    setCurrentUser(null);
    showToast(message, 'info');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // PANTALLA INICIAL: Si no hay token JWT válido, se muestra la pantalla de inicio de sesión
  if (!token) {
    return (
      <>
        <LoginView 
          onLoginSuccess={handleLoginSuccess} 
          onShowToast={showToast} 
        />

        {/* Notificación Toast para feedback en pantalla de login */}
        {toast && (
          <div 
            role="status"
            aria-live="polite"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#000000] text-[#FFFFFF] text-sm font-medium border border-[#27272A] rounded-[6px] shadow-2xl transition-all duration-200"
          >
            {toast.type === 'error' ? (
              <X className="w-4 h-4 shrink-0 text-[#FFFFFF]" />
            ) : toast.type === 'alert' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-[#FFFFFF]" />
            ) : (
              <Check className="w-4 h-4 shrink-0 text-[#FFFFFF]" />
            )}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-[#FFFFFF]/70 hover:text-[#FFFFFF] transition-colors p-0.5 cursor-pointer"
              aria-label="Cerrar notificación"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </>
    );
  }

  // PANTALLA DEL DASHBOARD (Acceso concedido mediante JWT)
  return (
    <div className="flex h-screen overflow-hidden bg-[#FFFFFF] text-[#000000] font-sans selection:bg-[#000000] selection:text-[#FFFFFF]">
      {/* Sidebar de navegación lateral (Ancho fijo de 260px) */}
      <Sidebar
        activeView={activeView}
        onSelectView={handleSelectView}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentUser={currentUser}
        onLogout={() => handleLogout('Sesión cerrada. Token JWT eliminado.')}
        isHidden={isOrderSelected}
      />

      {/* Contenedor principal a la derecha */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#F4F4F5]">
        {/* Barra superior / Header (Altura fija 64px / h-16) */}
        <Header
          activeView={activeView}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onShowToast={showToast}
          isSidebarHidden={isOrderSelected}
        />

        {/* Área de contenido de la vista activa: Ancho fluido adaptativo con exactamente 40px de padding */}
        <main className="flex-1 overflow-y-auto p-[40px] bg-[#F4F4F5]">
          <div className="w-full">
            {activeView === 'monitor' && (
              <MonitorView 
                onShowToast={showToast} 
                onRequireAuth={() => handleLogout('Tu sesión ha expirado (401). Inicia sesión nuevamente.')} 
                onCardSelectChange={setIsOrderSelected}
              />
            )}
            {activeView === 'finanzas' && (
              <FinanzasView onShowToast={showToast} />
            )}
            {activeView === 'catalogo' && (
              <CatalogoView 
                onShowToast={showToast} 
                onRequireAuth={() => handleLogout('Tu sesión ha expirado (401). Inicia sesión nuevamente.')} 
              />
            )}
          </div>
        </main>
      </div>

      {/* Notificación Toast (Fondo surface-inverted #000000, texto blanco #FFFFFF) segun Seccion 3 */}
      {toast && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#000000] text-[#FFFFFF] text-sm font-medium border border-[#27272A] rounded-[6px] shadow-2xl transition-all duration-200"
        >
          {toast.type === 'error' ? (
            <X className="w-4 h-4 shrink-0 text-[#FFFFFF]" />
          ) : toast.type === 'alert' ? (
            <AlertCircle className="w-4 h-4 shrink-0 text-[#FFFFFF]" />
          ) : (
            <Check className="w-4 h-4 shrink-0 text-[#FFFFFF]" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 text-[#FFFFFF]/70 hover:text-[#FFFFFF] transition-colors p-0.5 cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
