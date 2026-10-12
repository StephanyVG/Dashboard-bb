import React, { useState } from 'react';
import { 
  Coffee, 
  Clock, 
  User, 
  Receipt, 
  Check, 
  Search, 
  Inbox
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

export default function MonitorView({ onShowToast, onRequireAuth }) {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState(INITIAL_ORDERS[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // Cargar pedidos desde la API protegida si hay token
  React.useEffect(() => {
    getPedidosAPI()
      .then((res) => {
        if (res.data) setOrders(res.data);
      })
      .catch(() => {
        // Si no hay token o es 401, se conservan los datos locales
      });
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'Todos') return matchesSearch;
    return matchesSearch && order.status === statusFilter;
  });

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];
  const selectedTotals = calculateOrderTotals(selectedOrder);
  const totalDaySales = orders.reduce((sum, o) => sum + calculateOrderTotals(o).total, 0);

  const handleUpdateStatus = async () => {
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

      {/* Contenido Principal: Listado adaptable y Detalle lateral de 420px */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Contenedor de filtros y cards de pedidos: se adapta fluidamente a lo ancho */}
        <div className="flex-1 min-w-0 w-full space-y-4">
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

          {/* Tarjetas de Pedidos: 3 por línea en escritorio, 2 por línea en dispositivos más pequeños */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredOrders.length === 0 ? (
              <div className="col-span-full p-8 bg-[#FFFFFF] border border-[#E4E4E7] rounded-[16px] text-center text-[#52525B] text-sm">
                No se encontraron pedidos con los criterios especificados.
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = order.id === selectedOrder.id;
                const { total } = calculateOrderTotals(order);

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-3.5 sm:p-4 transition-all cursor-pointer text-left rounded-[16px] flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#F4F4F5] border-2 border-[#000000] shadow-sm'
                        : 'bg-[#FFFFFF] border border-[#E4E4E7] hover:border-[#000000]'
                    }`}
                  >
                    {/* Fila superior: Badge de estado (arriba del nombre) y Fecha/Hora con reloj al lado izquierdo */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <StatusBadge status={order.status} />

                      <div className="flex items-center gap-1.5 text-[11px] text-[#52525B] shrink-0 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#52525B] shrink-0" />
                        <span>{order.date}</span>
                      </div>
                    </div>

                    {/* Fila media: Cliente (directamente debajo del badge) y Café */}
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

                      {/* Agregados resumidos de forma compacta */}
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
        </div>

        {/* Columna Derecha: Detalle Completo del Pedido Seleccionado (Sidepanel de 420px de ancho) */}
        <div className="w-full xl:w-[420px] shrink-0">
          <div className="sticky top-0 bg-[#FFFFFF] border border-[#E4E4E7] p-6 rounded-[16px] max-h-[calc(100vh-100px)] overflow-y-auto shadow-sm">
            {/* Header del Comprobante (Sin ID) */}
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-4">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#52525B] block">
                  Comprobante
                </span>
                <h2 className="text-base font-bold text-[#000000] flex items-center gap-2 mt-0.5">
                  <Receipt className="w-5 h-5 text-[#000000]" />
                  Detalle del Pedido
                </h2>
              </div>
              <StatusBadge status={selectedOrder.status} />
            </div>

            {/* Datos del Cliente y Fecha */}
            <div className="py-4 border-b border-[#E4E4E7] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#52525B]">
                <span>Cliente:</span>
                <span className="text-[#000000] font-semibold text-sm">
                  {selectedOrder.customerName}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#52525B]">
                <span>Fecha y Hora:</span>
                <span className="text-[#000000] font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#000000]" />
                  {selectedOrder.date}
                </span>
              </div>
            </div>

            {/* Desglose: Café y Agregados */}
            <div className="py-4 border-b border-[#E4E4E7] space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#52525B] block">
                Detalle del Pedido
              </span>

              {/* Bebida Base */}
              <div className="flex items-start justify-between text-sm">
                <div>
                  <span className="font-semibold text-[#000000] block">
                    {selectedOrder.item.name}
                  </span>
                  <span className="text-xs text-[#52525B]">Café base de especialidad</span>
                </div>
                <span className="font-semibold text-[#000000]">
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

              {/* Notas especiales del cliente: borde regular sin línea izquierda */}
              {selectedOrder.notes && (
                <div className="p-3 bg-[#F4F4F5] border border-[#E4E4E7] rounded-[6px] text-xs">
                  <span className="font-semibold text-[#000000] block mb-0.5">
                    Nota del cliente:
                  </span>
                  <p className="text-[#52525B] italic">"{selectedOrder.notes}"</p>
                </div>
              )}
            </div>

            {/* Resumen Financiero */}
            <div className="py-4 space-y-2 text-xs">
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
                <span className="text-base text-[#000000]">
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

            {/* Acción de la orden: Botón Primary con round corner de 6px */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleUpdateStatus}
                className="btn-primary w-full py-2.5 px-4 text-xs font-medium text-center flex items-center justify-center gap-2 rounded-[6px] cursor-pointer"
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
          </div>
        </div>
      </div>
    </div>
  );
}
