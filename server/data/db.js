/**
 * Tablas y modelos de datos en memoria para el sistema del Dashboard
 * 
 * - Pedido: Registro de órdenes y productos solicitados
 * - Comision: Configuración de porcentajes de comisión (Anticuario)
 * - Corte_Diario: Registro histórico de cortes de caja diarios
 */

// 1. Tabla Comision
export let Comision = [
  {
    id: 1,
    nombre: 'Comisión Anticuario',
    tipo: 'porcentaje',
    porcentaje: 5.0,
    factor: 0.05,
    descripcion: 'Comisión fija del 5.0% sobre ventas brutas totales pactada con Anticuario',
    activo: true,
    fecha_actualizacion: '2026-10-12',
  },
];

// 2. Tabla Pedido (Órdenes de clientes)
export let Pedido = [
  {
    id: 'ORD-2026-108',
    customerName: 'Mariana Silva',
    customerPhone: '+52 55 4920 1823',
    date: 'Hoy, 14:52',
    fecha: '2026-10-12',
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
    createdAt: '2026-10-12T14:52:00.000Z',
  },
  {
    id: 'ORD-2026-107',
    customerName: 'Carlos Mendoza',
    customerPhone: '+52 55 8312 9044',
    date: 'Hoy, 14:38',
    fecha: '2026-10-12',
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
    createdAt: '2026-10-12T14:38:00.000Z',
  },
  {
    id: 'ORD-2026-106',
    customerName: 'Sofía Navarro',
    customerPhone: '+52 55 1290 4455',
    date: 'Hoy, 14:15',
    fecha: '2026-10-12',
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
    createdAt: '2026-10-12T14:15:00.000Z',
  },
  {
    id: 'ORD-2026-105',
    customerName: 'Alejandro Ruiz',
    customerPhone: '+52 55 6788 3311',
    date: 'Hoy, 13:40',
    fecha: '2026-10-12',
    status: 'Entregado',
    item: {
      name: 'Espresso Americano Doble Tostado (12 oz)',
      basePrice: 45.00,
    },
    addons: [
      { name: 'Shot artesanal de Avellana tostada', price: 10.00 },
    ],
    notes: '',
    createdAt: '2026-10-12T13:40:00.000Z',
  },
  {
    id: 'ORD-2026-104',
    customerName: 'Lucía Fernández',
    customerPhone: '+52 55 9845 2200',
    date: 'Hoy, 13:12',
    fecha: '2026-10-12',
    status: 'Entregado',
    item: {
      name: 'Matcha Latte Ceremonial (16 oz)',
      basePrice: 70.00,
    },
    addons: [
      { name: 'Leche de Coco cremosa', price: 15.00 },
      { name: 'Shot de colágeno hidrolizado', price: 20.00 },
    ],
    notes: 'Endulzar con miel de agave si es posible.',
    createdAt: '2026-10-12T13:12:00.000Z',
  },
];

// 3. Tabla Corte_Diario
// Campos requeridos: fecha, ventas_totales, comision_anticuario, neto_cafeteria, numero_pedidos
export let Corte_Diario = [
  {
    id: 'CORTE-2026-10-11',
    fecha: '2026-10-11',
    ventas_totales: 3420.00,
    comision_anticuario: 171.00,
    neto_cafeteria: 3249.00,
    numero_pedidos: 28,
    creado_en: '2026-10-11T23:59:00.000Z',
  },
  {
    id: 'CORTE-2026-10-10',
    fecha: '2026-10-10',
    ventas_totales: 4150.00,
    comision_anticuario: 207.50,
    neto_cafeteria: 3942.50,
    numero_pedidos: 34,
    creado_en: '2026-10-10T23:59:00.000Z',
  },
  {
    id: 'CORTE-2026-10-09',
    fecha: '2026-10-09',
    ventas_totales: 2890.00,
    comision_anticuario: 144.50,
    neto_cafeteria: 2745.50,
    numero_pedidos: 22,
    creado_en: '2026-10-09T23:59:00.000Z',
  },
  {
    id: 'CORTE-2026-10-08',
    fecha: '2026-10-08',
    ventas_totales: 3120.00,
    comision_anticuario: 156.00,
    neto_cafeteria: 2964.00,
    numero_pedidos: 25,
    creado_en: '2026-10-08T23:59:00.000Z',
  },
  {
    id: 'CORTE-2026-10-07',
    fecha: '2026-10-07',
    ventas_totales: 2650.00,
    comision_anticuario: 132.50,
    neto_cafeteria: 2517.50,
    numero_pedidos: 20,
    creado_en: '2026-10-07T23:59:00.000Z',
  },
  {
    id: 'CORTE-2026-10-06',
    fecha: '2026-10-06',
    ventas_totales: 2980.00,
    comision_anticuario: 149.00,
    neto_cafeteria: 2831.00,
    numero_pedidos: 24,
    creado_en: '2026-10-06T23:59:00.000Z',
  },
  {
    id: 'CORTE-2026-10-05',
    fecha: '2026-10-05',
    ventas_totales: 3800.00,
    comision_anticuario: 190.00,
    neto_cafeteria: 3610.00,
    numero_pedidos: 30,
    creado_en: '2026-10-05T23:59:00.000Z',
  },
  {
    id: 'CORTE-2026-10-04',
    fecha: '2026-10-04',
    ventas_totales: 4320.00,
    comision_anticuario: 216.00,
    neto_cafeteria: 4104.00,
    numero_pedidos: 36,
    creado_en: '2026-10-04T23:59:00.000Z',
  },
  {
    id: 'CORTE-2026-10-03',
    fecha: '2026-10-03',
    ventas_totales: 3950.00,
    comision_anticuario: 197.50,
    neto_cafeteria: 3752.50,
    numero_pedidos: 32,
    creado_en: '2026-10-03T23:59:00.000Z',
  },
  {
    id: 'CORTE-2026-10-02',
    fecha: '2026-10-02',
    ventas_totales: 2750.00,
    comision_anticuario: 137.50,
    neto_cafeteria: 2612.50,
    numero_pedidos: 21,
    creado_en: '2026-10-02T23:59:00.000Z',
  },
  {
    id: 'CORTE-2026-10-01',
    fecha: '2026-10-01',
    ventas_totales: 2450.00,
    comision_anticuario: 122.50,
    neto_cafeteria: 2327.50,
    numero_pedidos: 19,
    creado_en: '2026-10-01T23:59:00.000Z',
  },
];

/**
 * Calcula el importe total de un pedido considerando producto base y todos sus agregados
 */
export function calculateOrderTotal(order) {
  if (typeof order.total === 'number') {
    return Number(order.total.toFixed(2));
  }
  const basePrice = Number(order.item?.basePrice) || 0;
  const addonsTotal = Array.isArray(order.addons)
    ? order.addons.reduce((sum, addon) => sum + (Number(addon.price) || 0), 0)
    : 0;
  return Number((basePrice + addonsTotal).toFixed(2));
}

/**
 * Obtiene la configuración activa de la tabla Comision
 */
export function getComisionConfig() {
  const activeCom = Comision.find((c) => c.activo) || Comision[0];
  const factor = activeCom ? (activeCom.factor ?? activeCom.porcentaje / 100) : 0.05;
  return {
    id: activeCom?.id || 1,
    nombre: activeCom?.nombre || 'Comisión Anticuario',
    factor: Number(factor),
    porcentaje: Number((factor * 100).toFixed(2)),
  };
}

/**
 * Obtiene los pedidos correspondientes a una fecha específica
 */
export function getPedidosByDate(targetDate) {
  const formattedToday = new Date().toISOString().split('T')[0];
  const dateToMatch = targetDate || formattedToday;

  return Pedido.filter((order) => {
    // Coincidencia directa por campo fecha normalizado (YYYY-MM-DD)
    if (order.fecha === dateToMatch) {
      return true;
    }
    // Coincidencia por timestamp ISO createdAt
    if (order.createdAt && order.createdAt.startsWith(dateToMatch)) {
      return true;
    }
    // Si la fecha solicitada es hoy, capturar órdenes marcadas con "Hoy"
    if (dateToMatch === formattedToday && (order.date?.includes('Hoy') || order.date?.includes('12 Oct 2026'))) {
      return true;
    }
    return false;
  });
}

/**
 * Calcula los importes financieros de un pedido individual:
 * La comisión de Anticuario se aplica por cada pedido individualmente.
 */
export function calculateOrderFinancials(order, factor = 0.05) {
  const basePrice = Number(order.item?.basePrice) || 0;
  const addonsTotal = Array.isArray(order.addons)
    ? order.addons.reduce((sum, addon) => sum + (Number(addon.price) || 0), 0)
    : 0;
  const total = Number((basePrice + addonsTotal).toFixed(2));
  const comision_anticuario = Number((total * factor).toFixed(2));
  const neto_cafeteria = Number((total - comision_anticuario).toFixed(2));

  return {
    basePrice,
    addonsTotal,
    total,
    comision_anticuario,
    neto_cafeteria,
  };
}

/**
 * Realiza el cierre de caja diario y crea o actualiza un registro en Corte_Diario
 * La comisión de Anticuario se aplica por cada pedido individualmente y luego se consolida.
 */
export function ejecutarCierreDiario(fechaDeseada) {
  const targetDate = fechaDeseada || new Date().toISOString().split('T')[0];
  const pedidosDelDia = getPedidosByDate(targetDate);
  const comisionInfo = getComisionConfig();

  // Calcular totales sumando el desglose financiero aplicado por cada pedido
  let ventas_totales = 0;
  let comision_anticuario = 0;
  let neto_cafeteria = 0;

  pedidosDelDia.forEach((order) => {
    const fin = calculateOrderFinancials(order, comisionInfo.factor);
    order.total = fin.total;
    order.comision_anticuario = fin.comision_anticuario;
    order.neto_cafeteria = fin.neto_cafeteria;

    ventas_totales += fin.total;
    comision_anticuario += fin.comision_anticuario;
    neto_cafeteria += fin.neto_cafeteria;
  });

  ventas_totales = Number(ventas_totales.toFixed(2));
  comision_anticuario = Number(comision_anticuario.toFixed(2));
  neto_cafeteria = Number(neto_cafeteria.toFixed(2));
  const numero_pedidos = pedidosDelDia.length;

  const corteRecord = {
    id: `CORTE-${targetDate}`,
    fecha: targetDate,
    ventas_totales,
    comision_anticuario,
    neto_cafeteria,
    numero_pedidos,
    pedidos_ids: pedidosDelDia.map((p) => p.id),
    porcentaje_comision: comisionInfo.porcentaje,
    creado_en: new Date().toISOString(),
  };

  // Guardar en la tabla Corte_Diario (actualizar si ya existía para ese día o insertar al inicio)
  const existingIndex = Corte_Diario.findIndex((c) => c.fecha === targetDate);
  if (existingIndex !== -1) {
    Corte_Diario[existingIndex] = {
      ...Corte_Diario[existingIndex],
      ...corteRecord,
      actualizado_en: new Date().toISOString(),
    };
    return { corte: Corte_Diario[existingIndex], pedidos: pedidosDelDia, esNuevo: false };
  } else {
    Corte_Diario.unshift(corteRecord);
    return { corte: corteRecord, pedidos: pedidosDelDia, esNuevo: true };
  }
}
