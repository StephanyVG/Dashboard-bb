import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const authRouter = express.Router();

/**
 * POST /api/login
 * Recibe usuario y contraseña, los valida contra ADMIN_USER y ADMIN_PASS de variables de entorno.
 * Si son válidos, retorna un JWT firmado con JWT_SECRET.
 */
authRouter.post('/login', (req, res) => {
  const { username, password, usuario, contrasena } = req.body || {};

  const inputUser = String(username || usuario || '').trim();
  const inputPass = String(password || contrasena || '');

  if (!inputUser || !inputPass) {
    return res.status(400).json({
      error: 'Petición incompleta',
      message: 'Se requiere usuario y contraseña en el cuerpo de la petición.',
    });
  }

  // Validación estricta contra las variables de entorno (sin tablas de base de datos)
  const isUserValid = inputUser === config.ADMIN_USER;
  const isPassValid = inputPass === config.ADMIN_PASS;

  if (!isUserValid || !isPassValid) {
    return res.status(401).json({
      error: 'Credenciales inválidas',
      message: 'Usuario o contraseña incorrectos.',
    });
  }

  // Generar JWT firmado
  const payload = {
    username: config.ADMIN_USER,
    role: 'admin',
    iss: 'dashboard-monocromatico',
  };

  const token = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: '8h',
  });

  return res.json({
    message: 'Autenticación exitosa',
    token,
    user: {
      username: config.ADMIN_USER,
      role: 'admin',
    },
  });
});
