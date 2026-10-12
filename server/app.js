import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { productosRouter } from './routes/productos.js';
import { pedidosRouter } from './routes/pedidos.js';
import { cortesRouter } from './routes/cortes.js';

export const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Endpoint de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas de autenticación
app.use('/api', authRouter);

// Rutas de gestión (Protegidas con JWT mediante authMiddleware)
app.use('/api/productos', productosRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/cortes', cortesRouter);

// Manejador de rutas 404 para la API compatible con Express 5
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint no encontrado' });
  }
  return next();
});
