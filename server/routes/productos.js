import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

export const productosRouter = express.Router();

// Aplicar middleware de autenticación a todos los endpoints de productos
productosRouter.use(authMiddleware);

// Base de datos en memoria para gestión de productos organizada por tipos (Cafetería, Alimentos, Postres)
let productos = [
  // Cafetería
  {
    id: 'SKU-1024',
    name: 'Café de Especialidad Grano 1kg',
    category: 'Cafetería',
    price: '$340.00',
    specifications: 'Origen: Chiapas (1,400 msnm) · Tueste: Medio · Proceso: Lavado · Notas: Chocolate amargo y avellana',
  },
  {
    id: 'SKU-1025',
    name: 'Cold Brew Concentrado 1L',
    category: 'Cafetería',
    price: '$180.00',
    specifications: 'Extracción en frío de 18 horas · Grano Arábica lavado de Veracruz · Baja acidez y notas a cacao',
  },
  {
    id: 'SKU-1026',
    name: 'Matcha Ceremonial Uji 100g',
    category: 'Cafetería',
    price: '$420.00',
    specifications: 'Primera cosecha de Uji, Kioto · Molienda fina en piedra volcánica · Alto en antioxidantes',
  },
  {
    id: 'SKU-1027',
    name: 'Jarabe Artesanal Vainilla 750ml',
    category: 'Cafetería',
    price: '$160.00',
    specifications: 'Extracto de vainilla de Papantla natural · Azúcar orgánica de caña · Sin conservadores artificiales',
  },

  // Alimentos
  {
    id: 'SKU-1028',
    name: 'Sándwich Roast Beef & Gruyère',
    category: 'Alimentos',
    price: '$165.00',
    specifications: 'Pan brioche artesanal, roast beef horneado a baja temperatura, mostaza dijon y gruyère gratinado',
  },
  {
    id: 'SKU-1029',
    name: 'Toast de Aguacate & Huevo Poché',
    category: 'Alimentos',
    price: '$135.00',
    specifications: 'Masa madre integral tostada, aguacate hass macerado, huevo orgánico pochado y dukkah de semillas',
  },
  {
    id: 'SKU-1030',
    name: 'Quiche Lorraine de Tocino Artesanal',
    category: 'Alimentos',
    price: '$120.00',
    specifications: 'Masa quebrada con mantequilla pura, tocino ahumado artesanal, poro salteado y queso emmental',
  },
  {
    id: 'SKU-1031',
    name: 'Bagel de Salmón Ahumado & Eneldo',
    category: 'Alimentos',
    price: '$175.00',
    specifications: 'Bagel artesanal con ajonjolí negro, queso crema batido al eneldo, alcaparras baby y salmón curado',
  },

  // Postres
  {
    id: 'SKU-1032',
    name: 'Croissant de Almendras Tostadas',
    category: 'Postres',
    price: '$75.00',
    specifications: 'Laminado artesanal 100% mantequilla francesa, crema frangipane y almendras fileteadas horneadas',
  },
  {
    id: 'SKU-1033',
    name: 'Cheesecake Vasco con Frutos Rojos',
    category: 'Postres',
    price: '$95.00',
    specifications: 'Horneado a alta temperatura caramelizado, centro cremoso y coulis de frutos silvestres casero',
  },
  {
    id: 'SKU-1034',
    name: 'Tarta de Higo & Miel de Agave',
    category: 'Postres',
    price: '$85.00',
    specifications: 'Higos frescos de temporada, base crujiente de pasta frola con almendra y reducción de agave',
  },
  {
    id: 'SKU-1035',
    name: 'Galleta de Chocolate Oscuro & Sal de Colima',
    category: 'Postres',
    price: '$45.00',
    specifications: '70% cacao mexicano orgánico, centro fudge suave y escamas crocantes de sal de mar de Colima',
  },
];

// GET /api/productos - Listar productos (Protegido con JWT)
productosRouter.get('/', (req, res) => {
  return res.json({
    data: productos,
    total: productos.length,
    requestedBy: req.user.username,
  });
});

// POST /api/productos - Crear un producto con especificaciones (Protegido con JWT)
productosRouter.post('/', (req, res) => {
  const { name, category, price, specifications, specs } = req.body || {};

  if (!name || !price) {
    return res.status(400).json({
      error: 'Datos incompletos',
      message: 'Se requiere nombre y precio para el producto.',
    });
  }

  // Normalizar precio si no tiene el signo de pesos
  const formattedPrice = String(price).startsWith('$') ? String(price) : `$${Number(price).toFixed(2)}`;

  const newId = `SKU-${1036 + productos.length}`;
  const newProduct = {
    id: newId,
    name,
    category: category || 'Cafetería',
    price: formattedPrice,
    specifications: specifications || specs || 'Sin especificaciones registradas',
  };

  productos.unshift(newProduct);

  return res.status(201).json({
    message: 'Producto creado exitosamente',
    product: newProduct,
  });
});

// PUT /api/productos/:id - Actualizar un producto (Protegido con JWT)
productosRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  const index = productos.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  productos[index] = { ...productos[index], ...req.body, id };

  return res.json({
    message: 'Producto actualizado exitosamente',
    product: productos[index],
  });
});

// DELETE /api/productos/:id - Eliminar un producto (Protegido con JWT)
productosRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = productos.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const deleted = productos.splice(index, 1);

  return res.json({
    message: 'Producto eliminado exitosamente',
    order: deleted[0],
  });
});
