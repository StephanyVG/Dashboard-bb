import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  Clock, 
  User, 
  Receipt, 
  Check, 
  Search, 
  Inbox,
  X
} from 'lucide-react';
import { updatePedidoStatusAPI, getPedidosAPI } from '../services/api';

const INITIAL_ORDERS = [
  {
    id: 'ORD-2026-108',
    customerName: 'Mariana Silva',
    customerPhone: '+52 55 4920 1823',
    date: '11 Oct 2026, 14:52',
    status: 'Pedido recibido',
    item: {
      name: 'Café Flat White Grande (16 oz)',
      basePrice: 65.00,
    },
    addons: [
      { name: 'Leche de Avena Barista', price: 15.00 },
      { name: 'Doble shot de Espresso de Especialidad', price: 18.00 },
      { name: 'Jarabe de Vainilla Francesa artesanal', price: 12.00 },
    ],
    notes: 'Por favor servir bien caliente y con poco polvo de canela arriba.',
  },
  {
    id: 'ORD-2026-107',
    customerName: 'Carlos Mendoza',
    customerPhone: '+52 55 8312 9044',
    date: '11 Oct 2026, 14:38',
    status: 'Pedido recibido',
    item: {
      name: 'Cold Brew de la Casa (12 oz)',
      basePrice: 55.00,
    },
    addons: [
      { name: 'Espuma fría de canela & piloncillo', price: 14.00 },
      { name: 'Hielo extra gourmet', price: 0.00 },
    ],
    notes: 'Sin azúcar adicional.',
  },
  {
    id: 'ORD-2026-106',
    customerName: 'Sofía Navarro',
    customerPhone: '+52 55 1290 4455',
    date: '11 Oct 2026, 14:15',
    status: 'Entregado',
    item: {
      name: 'Caramel Macchiato Vainilla (16 oz)',
      basePrice: 75.00,
    },
    addons: [
      { name: 'Leche de Almendra sin azúcar', price: 15.00 },
      { name: 'Topping extra de Caramelo Salado', price: 10.00 },
      { name: 'Waffle artesanal belga (Acompañamiento)', price: 45.00 },
    ],
    notes: 'Para llevar en bolsa ecológica.',
  },
  {
    id: 'ORD-2026-105',
    customerName: 'Alejandro Ruiz',
    customerPhone: '+52 55 6788 3311',
    date: '11 Oct 2026, 13:40',
    status: 'Entregado',
    item: {
      name: 'Espresso Americano Doble Tostado (12 oz)',
      basePrice: 45.00,
    },
    addons: [
      { name: 'Shot artesanal de Avellana tostada', price: 10.00 },
    ],
    notes: '',
  },
  {
    id: 'ORD-2026-104',
    customerName: 'Lucía Fernández',
    customerPhone: '+52 55 9845 2200',
    date: '11 Oct 2026, 13:12',
    status: 'Pedido recibido',
    item: {
      name: 'Matcha Latte Ceremonial (16 oz)',
      basePrice: 70.00,
    },
    addons: [
      { name: 'Leche de Coco cremosa', price: 15.00 },
      { name: 'Shot de colágeno hidrolizado', price: 20.00 },
    ],
    notes: 'Endulzar con miel de agave si es posible.',
  },
];

function calculateOrderTotals(order) {
  const addonsTotal = (order.addons || []).reduce((sum, a) => sum + (a.price || 0), 0);
  const total = (order.item?.basePrice || 0) + addonsTotal;
  const comisionAnticuario = Number((total * 0.05).toFixed(2));
  const netoCafeteria = Number((total - comisionAnticuario).toFixed(2));
  return {
    addonsTotal,
    total,
    comisionAnticuario,
    netoCafeteria,
  };
}

// Renderizador de badge de estado: los dos únicos estados (Pedido recibido, Entregado)
function StatusBadge({ status }) {
  if (status === 'Entregado' || status === 'Entregado / Cobrado' || status === 'Entregado/cobrado') {
    return (
      <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] rounded-[6px] shrink-0 whitespace-nowrap">
        Entregado
      </span>
    );
  }
  return (
    <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] rounded-[6px] shrink-0 whitespace-nowrap">
      Pedido recibido
    </span>
  );
}

export default function MonitorView({ onShowToast, onRequireAuth, onCardSelectChange }) {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDetailSidebarOpen, setIsDetailSidebarOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const switchTimeoutRef = React.useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // Cargar pedidos desde la API protegida si hay token
  useEffect(() => {
    getPedidosAPI()
      .then((res) => {
        if (res.data) setOrders(res.data);
      })
      .catch(() => {
        // Si no hay token o es 401, se conservan los datos locales
      });
  }, []);

  // Limpiar temporizador y restaurar visibilidad de sidebar de navegación al desmontar
  useEffect(() => {
    return () => {
      if (switchTimeoutRef.current) {
        clearTimeout(switchTimeoutRef.current);
      }
      onCardSelectChange?.(false);
    };
  }, [onCardSelectChange]);

  // Cerrar sidebar lateral con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectOrder = (orderId) => {
    if (switchTimeoutRef.current) {
      clearTimeout(switchTimeoutRef.current);
    }

    // Notificar para ocultar el sidepanel de secciones de la aplicación
    onCardSelectChange?.(true);

    // Si ya está abierto con la misma orden y no está en transición, no hacer nada
    if (isDetailSidebarOpen && selectedOrderId === orderId && !isSwitching) {
      return;
    }

    // Si ya hay un sidepanel abierto con otra orden:
    // Cierra el anterior y luego abre el nuevo sidepanel
    if (isDetailSidebarOpen && selectedOrderId && selectedOrderId !== orderId) {
      setIsSwitching(true);
      switchTimeoutRef.current = setTimeout(() => {
        setSelectedOrderId(orderId);
        setIsSwitching(false);
        setIsDetailSidebarOpen(true);
      }, 240);
      return;
    }

    // Si estaba cerrado, abre directamente
    setSelectedOrderId(orderId);
    setIsSwitching(false);
    setIsDetailSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    if (switchTimeoutRef.current) {
      clearTimeout(switchTimeoutRef.current);
    }
    setIsSwitching(false);
    setIsDetailSidebarOpen(false);
    // Notificar para volver a mostrar el sidepanel de secciones
    onCardSelectChange?.(false);
  };

  // Manejar clics sobre el overlay: si se hace clic sobre otra card, seleccionarla cerrando la anterior y abriendo la nueva
  const handleOverlayClick = (e) => {
    const overlay = e.currentTarget;
    overlay.style.pointerEvents = 'none';
    const elementUnderneath = document.elementFromPoint(e.clientX, e.clientY);
    overlay.style.pointerEvents = 'auto';

    const orderCard = elementUnderneath?.closest('[data-order-id]');
    if (orderCard) {
      const orderId = orderCard.getAttribute('data-order-id');
      if (orderId) {
        handleSelectOrder(orderId);
        return;
      }
    }

    handleCloseSidebar();
  };

  // Permitir scroll fluido del contenedor principal mientras el cursor esté sobre el overlay
  const handleOverlayWheel = (e) => {
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
      mainContainer.scrollTop += e.deltaY;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'Todos') return matchesSearch;
    return matchesSearch && order.status === statusFilter;
  });

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null;
  const selectedTotals = selectedOrder ? calculateOrderTotals(selectedOrder) : null;
  const totalDaySales = orders.reduce((sum, o) => sum + calculateOrderTotals(o).total, 0);

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    const nextStatus = selectedOrder.status === 'Pedido recibido' ? 'Entregado' : 'Pedido recibido';

    try {
      const res = await updatePedidoStatusAPI(selectedOrder.id);
      const updatedOrder = res.order || { ...selectedOrder, status: nextStatus };
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? updatedOrder : o))
      );

      if (onShowToast) {
        onShowToast(`Orden actualizada a "${updatedOrder.status}"`, 'success');
      }
    } catch (err) {
      if (err.status === 401) {
        if (onShowToast) {
          onShowToast('Estado 401 Unauthorized: Endpoint protegido. Se requiere Authorization: Bearer <token>.', 'error');
        }
        if (onRequireAuth) {
          onRequireAuth();
        }
      } else {
        // Fallback local en caso de error de conexión
        setOrders((prev) =>
          prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: nextStatus } : o))
        );
        if (onShowToast) {
          onShowToast(`Orden actualizada a "${nextStatus}" (local)`, 'info');
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header de la sección: Título "Pedidos" y Cards de KPI más largas a la derecha */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">
          Pedidos
        </h1>

        {/* Cards de KPI alargadas al lado derecho del título */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-[190px] sm:min-w-[210px] px-5 py-3 bg-[#FFFFFF] border border-[#E4E4E7] rounded-[16px] flex items-center justify-between gap-4 shadow-sm">
            <div className="min-w-0">
              <span className="block text-[11px] text-[#52525B] font-medium uppercase tracking-wider leading-tight">
                Pedidos Hoy
              </span>
              <span className="text-lg font-bold text-[#000000] tracking-tight leading-none mt-1 block">
                {orders.length}
              </span>
            </div>
            <div className="w-8 h-8 bg-[#F4F4F5] text-[#000000] flex items-center justify-center border border-[#E4E4E7] rounded-[6px] shrink-0">
              <Receipt className="w-4 h-4" />
            </div>
          </div>

          <div className="min-w-[200px] sm:min-w-[220px] px-5 py-3 bg-[#FFFFFF] border border-[#E4E4E7] rounded-[16px] flex items-center justify-between gap-4 shadow-sm">
            <div className="min-w-0">
              <span className="block text-[11px] text-[#52525B] font-medium uppercase tracking-wider leading-tight">
                Total Facturado
              </span>
              <span className="text-lg font-bold text-[#000000] tracking-tight leading-none mt-1 block">
                ${totalDaySales.toFixed(2)}
              </span>
            </div>
            <div className="w-8 h-8 bg-[#F4F4F5] text-[#000000] flex items-center justify-center border border-[#E4E4E7] rounded-[6px] shrink-0">
              <Coffee className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda adaptable */}
      <div className="p-4 bg-[#FFFFFF] border border-[#E4E4E7] rounded-[16px] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#52525B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente o café..."
            className="input-mono w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-[6px]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['Todos', 'Pedido recibido', 'Entregado'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap rounded-[6px] cursor-pointer shrink-0 ${
                statusFilter === status
                  ? 'bg-[#000000] text-[#FFFFFF]'
                  : 'bg-transparent text-[#000000] border border-[#E4E4E7] hover:bg-[#F4F4F5]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Tarjetas de Pedidos a ancho completo (scroll fluido dentro del contenedor) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full p-8 bg-[#FFFFFF] border border-[#E4E4E7] rounded-[16px] text-center text-[#52525B] text-sm">
            No se encontraron pedidos con los criterios especificados.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isSelected = (isDetailSidebarOpen || isSwitching) && order.id === selectedOrderId;
            const { total } = calculateOrderTotals(order);

            return (
              <div
                key={order.id}
                data-order-id={order.id}
                onClick={() => handleSelectOrder(order.id)}
                className={`p-4 transition-all cursor-pointer text-left rounded-[16px] flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#F4F4F5] border-2 border-[#000000] shadow-md ring-1 ring-[#000000]'
                    : 'bg-[#FFFFFF] border border-[#E4E4E7] hover:border-[#000000] hover:shadow-sm'
                }`}
              >
                {/* Fila superior: Badge de estado y Fecha/Hora */}
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <StatusBadge status={order.status} />

                  <div className="flex items-center gap-1.5 text-[11px] text-[#52525B] shrink-0 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#52525B] shrink-0" />
                    <span>{order.date}</span>
                  </div>
                </div>

                {/* Fila media: Cliente y Café */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#000000]">
                    <User className="w-3.5 h-3.5 text-[#52525B] shrink-0" />
                    <h3 className="truncate">
                      {order.customerName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#000000]">
                    <Coffee className="w-3.5 h-3.5 text-[#000000] shrink-0" />
                    <span className="font-medium text-[#000000] truncate">
                      {order.item.name}
                    </span>
                  </div>

                  {/* Agregados resumidos */}
                  {order.addons.length > 0 && (
                    <div 
                      className="text-[11px] text-[#52525B] truncate pt-0.5" 
                      title={order.addons.map((a) => a.name).join(', ')}
                    >
                      <span className="font-medium text-[#000000]">+{order.addons.length} extras: </span>
                      <span className="italic">{order.addons.map((a) => a.name).join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Fila inferior: Total */}
                <div className="flex items-center justify-between pt-2.5 border-t border-[#E4E4E7] text-xs">
                  <span className="text-[10px] text-[#52525B] uppercase font-semibold">Total</span>
                  <span className="text-base font-bold text-[#000000] tracking-tight">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Overlay al 25% cuando se abre el sidepanel */}
      {(isDetailSidebarOpen || isSwitching) && (
        <div
          onClick={handleOverlayClick}
          onWheel={handleOverlayWheel}
          aria-hidden="true"
          className="fixed inset-0 bg-black/25 backdrop-blur-xs z-40 transition-opacity duration-200"
        />
      )}

      {/* Panel lateral derecho desplegable (Drawer) */}
      <aside
        role="dialog"
        aria-modal="false"
        aria-label="Detalle del pedido seleccionado"
        className={`fixed top-0 right-0 h-full w-full sm:w-[460px] md:w-[480px] bg-[#FFFFFF] border-l border-[#E4E4E7] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isDetailSidebarOpen && !isSwitching && selectedOrder ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {selectedOrder && selectedTotals && (
          <>
            {/* Header del Sidebar con botón de cerrar */}
            <div className="h-16 px-6 border-b border-[#E4E4E7] flex items-center justify-between shrink-0 bg-[#FFFFFF]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[6px] bg-[#F4F4F5] border border-[#E4E4E7] flex items-center justify-center text-[#000000] shrink-0">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#000000] leading-tight">
                    Detalle del Pedido
                  </h2>
                  <span className="text-[11px] text-[#52525B] font-mono">
                    {selectedOrder.id}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={selectedOrder.status} />
                <button
                  type="button"
                  onClick={handleCloseSidebar}
                  className="min-w-[36px] min-h-[36px] flex items-center justify-center text-[#52525B] hover:text-[#000000] hover:bg-[#F4F4F5] rounded-[6px] transition-colors cursor-pointer"
                  aria-label="Cerrar detalle"
                  title="Cerrar (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contenido scrolleable interno del Sidebar con scroll suave */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Datos del Cliente y Fecha */}
              <div className="p-4 bg-[#F4F4F5] border border-[#E4E4E7] rounded-[10px] space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#52525B] font-medium">Cliente:</span>
                  <span className="text-[#000000] font-semibold text-sm flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#52525B]" />
                    {selectedOrder.customerName}
                  </span>
                </div>
                {selectedOrder.customerPhone && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#52525B] font-medium">Teléfono:</span>
                    <span className="text-[#000000] font-mono">
                      {selectedOrder.customerPhone}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[#52525B] font-medium">Fecha y Hora:</span>
                  <span className="text-[#000000] font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#52525B]" />
                    {selectedOrder.date}
                  </span>
                </div>
              </div>

              {/* Desglose: Café y Agregados */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#52525B] block">
                  Artículos del Pedido
                </span>

                {/* Bebida Base */}
                <div className="p-3.5 bg-[#FFFFFF] border border-[#E4E4E7] rounded-[8px] flex items-start justify-between text-sm">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 mt-0.5 rounded-[4px] bg-[#F4F4F5] flex items-center justify-center text-[#000000] shrink-0">
                      <Coffee className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#000000] block">
                        {selectedOrder.item.name}
                      </span>
                      <span className="text-xs text-[#52525B]">Café base de especialidad</span>
                    </div>
                  </div>
                  <span className="font-semibold text-[#000000] font-mono">
                    ${selectedOrder.item.basePrice.toFixed(2)}
                  </span>
                </div>

                {/* Lista de Agregados */}
                {selectedOrder.addons.length > 0 && (
                  <div className="pl-3 border-l-2 border-[#000000] space-y-2 my-2">
                    <span className="text-[11px] font-semibold text-[#000000] block">
                      Agregados & Complementos:
                    </span>
                    {selectedOrder.addons.map((addon, index) => (
                      <div key={index} className="flex items-center justify-between text-xs text-[#52525B]">
                        <span>• {addon.name}</span>
                        <span className="font-mono text-[#000000] font-medium">
                          {addon.price > 0 ? `+$${addon.price.toFixed(2)}` : 'Incluido'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notas especiales del cliente */}
                {selectedOrder.notes && (
                  <div className="p-3.5 bg-[#F4F4F5] border border-[#E4E4E7] rounded-[8px] text-xs">
                    <span className="font-semibold text-[#000000] block mb-1">
                      Nota del cliente:
                    </span>
                    <p className="text-[#52525B] italic">"{selectedOrder.notes}"</p>
                  </div>
                )}
              </div>

              {/* Resumen Financiero */}
              <div className="p-4 bg-[#FFFFFF] border border-[#E4E4E7] rounded-[10px] space-y-2 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#52525B] block mb-2">
                  Resumen de Cuenta
                </span>
                <div className="flex justify-between text-[#52525B]">
                  <span>Café Base</span>
                  <span className="text-[#000000] font-mono">
                    ${selectedOrder.item.basePrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-[#52525B]">
                  <span>Agregados ({selectedOrder.addons.length})</span>
                  <span className="text-[#000000] font-mono">
                    +${selectedTotals.addonsTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-[#000000] pt-2 border-t border-[#E4E4E7]">
                  <span>Total del Pedido</span>
                  <span className="text-base text-[#000000] font-mono">
                    ${selectedTotals.total.toFixed(2)}
                  </span>
                </div>

                {/* Comisión de Anticuario aplicada a este pedido */}
                <div className="pt-2 border-t border-dashed border-[#E4E4E7] space-y-1.5">
                  <div className="flex justify-between text-[#52525B]">
                    <span>Comisión Anticuario (5%)</span>
                    <span className="text-[#000000] font-mono">
                      -${selectedTotals.comisionAnticuario.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-[#000000]">
                    <span>Neto Cafetería</span>
                    <span className="font-mono text-[#000000]">
                      ${selectedTotals.netoCafeteria.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer con Botón de Acción */}
            <div className="p-5 border-t border-[#E4E4E7] bg-[#FFFFFF] shrink-0">
              <button
                type="button"
                onClick={handleUpdateStatus}
                className="btn-primary w-full py-3 px-4 text-xs font-semibold text-center flex items-center justify-center gap-2 rounded-[6px] cursor-pointer shadow-sm hover:opacity-95"
              >
                {selectedOrder.status === 'Pedido recibido' ? (
                  <>
                    <Check className="w-4 h-4 text-[#FFFFFF]" />
                    Marcar como Entregado
                  </>
                ) : (
                  <>
                    <Inbox className="w-4 h-4 text-[#FFFFFF]" />
                    Reiniciar a Pedido Recibido
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
