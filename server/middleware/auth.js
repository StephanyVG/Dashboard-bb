import jwt from 'jsonwebtoken';
import { config } from '../config.js';

/**
 * Middleware de autenticación JWT.
 * Verifica la existencia y validez del token en el header Authorization: Bearer <token>.
 * Si el token es inválido o no se proporciona, responde con status 401.
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader) {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Cabecera Authorization no proporcionada',
    });
  }

  // Verificar formato Bearer <token>
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Formato de token inválido. Debe ser: Bearer <token>',
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    // Inyectar usuario decodificado en la petición
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Token JWT inválido o expirado',
      details: err.message,
    });
  }
}
