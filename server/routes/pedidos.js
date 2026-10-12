import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Pedido } from '../data/db.js';

export const pedidosRouter = express.Router();

// Aplicar middleware de autenticación a todos los endpoints de pedidos
pedidosRouter.use(authMiddleware);

// GET /api/pedidos - Listar pedidos (Protegido con JWT)
pedidosRouter.get('/', (req, res) => {
  return res.json({
    data: Pedido,
    total: Pedido.length,
    requestedBy: req.user.username,
  });
});

// POST /api/pedidos - Crear un pedido (Protegido con JWT)
pedidosRouter.post('/', (req, res) => {
  const { customerName, customerPhone, item, addons, notes } = req.body || {};

  if (!customerName || !item?.name) {
    return res.status(400).json({
      error: 'Datos incompletos',
      message: 'Se requiere nombre del cliente y producto para la orden.',
    });
  }

  const targetDate = new Date().toISOString().split('T')[0];
  const newOrder = {
    id: `ORD-2026-${109 + Pedido.length}`,
    customerName,
    customerPhone: customerPhone || 'Sin teléfono',
    date: 'Hoy, ' + new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    fecha: targetDate,
    createdAt: new Date().toISOString(),
    status: 'Pedido recibido',
    item: {
      name: item.name,
      basePrice: item.basePrice || 50.0,
    },
    addons: addons || [],
    notes: notes || '',
  };

  Pedido.unshift(newOrder);

  return res.status(201).json({
    message: 'Pedido creado exitosamente',
    order: newOrder,
  });
});

// PUT /api/pedidos/:id/status - Actualizar estado de un pedido (Protegido con JWT)
pedidosRouter.put('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  const order = Pedido.find((p) => p.id === id);

  if (!order) {
    return res.status(404).json({ error: 'Pedido no encontrado' });
  }

  if (status) {
    order.status = status;
  } else {
    // Transición directa: Pedido recibido -> Entregado
    order.status = order.status === 'Pedido recibido' ? 'Entregado' : 'Pedido recibido';
  }

  return res.json({
    message: 'Estado del pedido actualizado exitosamente',
    order,
  });
});

// DELETE /api/pedidos/:id - Cancelar/eliminar un pedido (Protegido con JWT)
pedidosRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = Pedido.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Pedido no encontrado' });
  }

  const deleted = Pedido.splice(index, 1);

  return res.json({
    message: 'Pedido eliminado exitosamente',
    order: deleted[0],
  });
});
