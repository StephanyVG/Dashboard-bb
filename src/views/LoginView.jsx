import React, { useState } from 'react';
import { Lock, User, LayoutDashboard, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { loginAdmin } from '../services/api';

export default function LoginView({ onLoginSuccess, onShowToast }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const data = await loginAdmin(username.trim(), password);
      setIsLoading(false);
      onLoginSuccess(data.token, data.user);
      if (onShowToast) {
        onShowToast('Sesión de administrador iniciada exitosamente.', 'success');
      }
    } catch (err) {
      setIsLoading(false);
      const msg = err.message || 'Usuario o contraseña incorrectos.';
      setErrorMessage(msg);
      if (onShowToast) {
        onShowToast(`Error de autenticación: ${msg}`, 'error');
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#F4F4F5] text-[#000000] font-sans selection:bg-[#000000] selection:text-[#FFFFFF]">
      {/* Tarjeta de Inicio de Sesión: Round corner de 16px según design.md */}
      <div className="w-full max-w-[420px] bg-[#FFFFFF] border border-[#E4E4E7] rounded-[16px] p-8 shadow-sm">
        {/* Cabecera / Identidad */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-[#000000] text-[#FFFFFF] rounded-[6px] flex items-center justify-center mb-4">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#52525B]">
            ControlHub Dashboard
          </span>
          <h1 className="text-2xl font-bold text-[#000000] tracking-tight mt-1">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-[#52525B] mt-1.5 max-w-[280px]">
            Ingresa tus credenciales de administrador para acceder a las vistas y endpoints de gestión.
          </p>
        </div>

        {/* Mensaje de error de alta visibilidad B/N */}
        {errorMessage && (
          <div 
            role="alert"
            className="mb-6 p-3.5 bg-[#F4F4F5] border-2 border-[#000000] rounded-[6px] text-xs text-[#000000] flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-[#000000] mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Acceso denegado</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Formulario de Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="username" 
              className="block text-xs font-medium text-[#000000] mb-1.5 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#52525B]" />
              Usuario
            </label>
            <input
              id="username"
              type="text"
              name="username"
              required
              autoFocus
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Introduce tu usuario"
              className="input-mono w-full px-3.5 py-2.5 text-sm rounded-[6px]"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-xs font-medium text-[#000000] mb-1.5 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#52525B]" />
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input-mono w-full pl-3.5 pr-10 py-2.5 text-sm rounded-[6px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#000000] transition-colors p-1 cursor-pointer rounded-[4px]"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-2.5 px-4 text-xs font-medium rounded-[6px] flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <span>{isLoading ? 'Verificando credenciales...' : 'Acceder al Panel'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>

        {/* Pie de seguridad sin revelar credenciales */}
        <div className="mt-8 pt-6 border-t border-[#E4E4E7] text-center">
          <p className="text-[11px] text-[#52525B]">
            Sesión protegida por firma criptográfica JWT (HS256).
          </p>
        </div>
      </div>
    </div>
  );
}
