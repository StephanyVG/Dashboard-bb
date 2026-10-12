import React, { useState, useEffect, useCallback } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  Percent, 
  Receipt,
  Download,
  Calendar,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  X
} from 'lucide-react';
import { getCortesDiariosAPI, generarCorteDiarioAPI } from '../services/api';

// Fecha base de referencia normalizada para la aplicación
const TODAY_ISO = '2026-10-12';

export default function FinanzasView({ onShowToast }) {
  const [cortes, setCortes] = useState([]);
  const [resumen, setResumen] = useState({
    ventas_totales: 0,
    comision_anticuario: 0,
    neto_cafeteria: 0,
    numero_pedidos: 0,
    porcentaje_comision: 5,
  });
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Recarga manual de cortes (utilizada tras generar un corte)
  const reloadCortes = useCallback(() => {
    const params = selectedDate ? { fecha: selectedDate } : { mes: selectedMonth };
    return getCortesDiariosAPI(params)
      .then((res) => {
        setCortes(res.data || []);
        if (res.resumen) {
          setResumen(res.resumen);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar cortes diarios:', err);
        if (onShowToast) {
          onShowToast('Error al consultar los cortes diarios de caja.', 'error');
        }
        setLoading(false);
      });
  }, [selectedMonth, selectedDate, onShowToast]);

  // Cargar cortes del periodo seleccionado (filtrando por fecha específica o por mes)
  useEffect(() => {
    let ignore = false;
    const params = selectedDate ? { fecha: selectedDate } : { mes: selectedMonth };
    getCortesDiariosAPI(params)
      .then((res) => {
        if (!ignore) {
          setCortes(res.data || []);
          if (res.resumen) {
            setResumen(res.resumen);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Error al cargar cortes diarios:', err);
          if (onShowToast) {
            onShowToast('Error al consultar los cortes diarios de caja.', 'error');
          }
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [selectedMonth, selectedDate, onShowToast]);

  // Generar cierre de caja diario (POST /api/cortes/generar)
  const handleGenerarCierre = async () => {
    try {
      setGenerating(true);
      const res = await generarCorteDiarioAPI(selectedDate || null);
      if (onShowToast) {
        onShowToast(res.message || 'Cierre de caja diario generado con éxito.', 'success');
      }
      await reloadCortes();
    } catch (err) {
      console.error('Error al generar cierre de caja:', err);
      if (onShowToast) {
        onShowToast(err.message || 'Error al procesar el cierre de caja diario.', 'error');
      }
    } finally {
      setGenerating(false);
    }
  };

  // Exportar cortes del periodo activo a CSV
  const handleExportCSV = () => {
    if (cortes.length === 0) {
      if (onShowToast) {
        onShowToast('No hay datos en el periodo seleccionado para exportar.', 'info');
      }
      return;
    }

    const headers = ['Fecha', 'Ventas Totales', 'Comisión Anticuario (5%)', 'Neto Cafetería', 'Número de Pedidos'];
    const rows = cortes.map((c) => [
      c.fecha,
      c.ventas_totales.toFixed(2),
      c.comision_anticuario.toFixed(2),
      c.neto_cafeteria.toFixed(2),
      c.numero_pedidos,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const filename = selectedDate ? `Corte_Diario_${selectedDate}.csv` : `Cortes_Diarios_${selectedMonth}.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onShowToast) {
      onShowToast(`Reporte CSV descargado (${selectedDate || selectedMonth}).`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header de la vista */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">
            Gestión Financiera
          </h1>
          <p className="text-sm text-[#52525B] mt-0.5">
            Cortes de caja diarios, control de comisiones del anticuario y flujo neto de cafetería.
          </p>
        </div>

        {/* Acciones principales y botón de Cierre */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="btn-secondary flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-[6px] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar CSV
          </button>

          <button
            type="button"
            onClick={handleGenerarCierre}
            disabled={generating}
            className="btn-primary flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-[6px] cursor-pointer disabled:opacity-50"
          >
            {generating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Receipt className="w-3.5 h-3.5" />
            )}
            Cierre de Caja Diario
          </button>
        </div>
      </div>

      {/* Barra de Filtros: Filtro por Mes y Filtro por Fecha Específica */}
      <div className="p-4 bg-[#FFFFFF] border border-[#E4E4E7] rounded-[16px] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* Filtro 1: Selector de Mes */}
          <div className="flex items-center gap-2 bg-[#F4F4F5] border border-[#E4E4E7] rounded-[6px] px-3 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#000000]" />
            <span className="font-semibold text-[#000000]">Mes:</span>
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedDate(''); // Al cambiar mes se limpia fecha específica
              }}
              className="bg-transparent text-[#000000] font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="2026-10">Octubre 2026</option>
              <option value="2026-09">Septiembre 2026</option>
              <option value="2026-08">Agosto 2026</option>
            </select>
          </div>

          {/* Filtro 2: Selector de Fecha Específica */}
          <div className="flex items-center gap-2 bg-[#F4F4F5] border border-[#E4E4E7] rounded-[6px] px-3 py-1.5 text-xs">
            <span className="font-semibold text-[#000000]">Fecha específica:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-[#000000] font-medium focus:outline-none cursor-pointer text-xs font-mono"
            />
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate('')}
                className="text-[#52525B] hover:text-[#000000] p-0.5 ml-1 cursor-pointer"
                title="Quitar fecha específica y ver mes completo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Indicador del filtro activo */}
        <div className="text-xs text-[#52525B] flex items-center gap-1.5">
          {selectedDate ? (
            <span className="px-2.5 py-1 bg-[#FFFFFF] border border-[#000000] text-[#000000] rounded-[6px] font-medium">
              Filtrando por día: <strong className="font-mono">{selectedDate}</strong>
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-[#FFFFFF] border border-[#E4E4E7] text-[#52525B] rounded-[6px]">
              Mostrando mes completo: <strong className="text-[#000000]">{selectedMonth}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Tarjetas KPI Financieras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ventas Totales */}
        <div className="p-6 bg-[#FFFFFF] border border-[#E4E4E7] rounded-[16px]">
          <div className="flex items-center justify-between text-[#52525B]">
            <span className="text-xs font-medium uppercase tracking-wider">Ventas Totales</span>
            <div className="w-8 h-8 bg-[#F4F4F5] text-[#000000] flex items-center justify-center border border-[#E4E4E7] rounded-[6px]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">
              ${resumen.ventas_totales.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#000000] font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-[#000000]" />
              <span>Bruto acumulado</span>
            </div>
          </div>
        </div>

        {/* Comisión Anticuario */}
        <div className="p-6 bg-[#FFFFFF] border border-[#E4E4E7] rounded-[16px]">
          <div className="flex items-center justify-between text-[#52525B]">
            <span className="text-xs font-medium uppercase tracking-wider">Comisión Anticuario</span>
            <div className="w-8 h-8 bg-[#F4F4F5] text-[#000000] flex items-center justify-center border border-[#E4E4E7] rounded-[6px]">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">
              ${resumen.comision_anticuario.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#52525B] font-medium">
              <span>{resumen.porcentaje_comision || 5}% de tasa pactada</span>
            </div>
          </div>
        </div>

        {/* Neto Cafetería */}
        <div className="p-6 bg-[#FFFFFF] border border-[#E4E4E7] rounded-[16px]">
          <div className="flex items-center justify-between text-[#52525B]">
            <span className="text-xs font-medium uppercase tracking-wider">Neto Cafetería</span>
            <div className="w-8 h-8 bg-[#000000] text-[#FFFFFF] flex items-center justify-center rounded-[6px]">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">
              ${resumen.neto_cafeteria.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#000000] font-medium">
              <span>95% ingreso libre</span>
            </div>
          </div>
        </div>

        {/* Total Pedidos */}
        <div className="p-6 bg-[#FFFFFF] border border-[#E4E4E7] rounded-[16px]">
          <div className="flex items-center justify-between text-[#52525B]">
            <span className="text-xs font-medium uppercase tracking-wider">Total de Pedidos</span>
            <div className="w-8 h-8 bg-[#F4F4F5] text-[#000000] flex items-center justify-center border border-[#E4E4E7] rounded-[6px]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">
              {resumen.numero_pedidos}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#52525B] font-medium">
              <span>Órdenes procesadas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Cortes Diarios (Corte_Diario) */}
      <div className="p-6 bg-[#FFFFFF] border border-[#E4E4E7] rounded-[16px]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold text-[#000000] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#000000]" />
              Tabla de Cortes Diarios (Corte_Diario)
            </h2>
            <p className="text-xs text-[#52525B] mt-0.5">
              {selectedDate 
                ? `Mostrando corte específico para ${selectedDate}` 
                : `Historial de cortes ejecutados para el periodo ${selectedMonth}`}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#52525B]">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F4F4F5] border border-[#E4E4E7] rounded-[6px] font-medium text-[#000000]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {cortes.length} {cortes.length === 1 ? 'corte registrado' : 'cortes registrados'}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-mono w-full">
            <thead>
              <tr className="border-b border-[#E4E4E7] text-[11px] text-[#52525B] uppercase font-semibold">
                <th scope="col" className="px-4 py-3 text-left">Fecha</th>
                <th scope="col" className="px-4 py-3 text-right">Ventas Totales</th>
                <th scope="col" className="px-4 py-3 text-right">Comisión Anticuario (5%)</th>
                <th scope="col" className="px-4 py-3 text-right">Neto Cafetería</th>
                <th scope="col" className="px-4 py-3 text-center">Nº Pedidos</th>
                <th scope="col" className="px-4 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-xs text-[#52525B]">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#000000]" />
                      <span>Cargando registros de cortes diarios...</span>
                    </div>
                  </td>
                </tr>
              ) : cortes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-xs text-[#52525B]">
                    {selectedDate 
                      ? `No se encontró corte de caja registrado para la fecha ${selectedDate}.` 
                      : 'No hay cortes diarios registrados para este mes. Haz clic en "Cierre de Caja Diario" para generar el corte.'}
                  </td>
                </tr>
              ) : (
                cortes.map((corte) => (
                  <tr key={corte.id || corte.fecha} className="hover:bg-[#F4F4F5]/60 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-[#000000]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{corte.fecha}</span>
                        {corte.fecha === TODAY_ISO && (
                          <span className="px-1.5 py-0.5 bg-[#000000] text-[#FFFFFF] text-[10px] rounded-[4px] font-sans font-medium">
                            Hoy
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono font-medium text-right text-[#000000]">
                      ${corte.ventas_totales.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-right text-[#52525B]">
                      ${corte.comision_anticuario.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono font-semibold text-right text-[#000000]">
                      ${corte.neto_cafeteria.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-xs text-center text-[#000000]">
                      <span className="inline-block px-2 py-0.5 bg-[#F4F4F5] border border-[#E4E4E7] rounded-[6px] font-mono font-medium">
                        {corte.numero_pedidos}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F4F4F5] border border-[#E4E4E7] text-[#000000] rounded-[6px] font-medium text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-[#000000]" />
                        Cerrado
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
