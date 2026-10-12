import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

// Cargar variables de entorno iniciales
dotenv.config({ path: envPath, override: true });

export function getAuthConfig() {
  // Recargar .env con override: true para reflejar cambios en caliente
  dotenv.config({ path: envPath, override: true });
  return {
    ADMIN_USER: process.env.ADMIN_USER || 'barbarista',
    ADMIN_PASS: process.env.ADMIN_PASS || 'barbarista2026*',
    JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_dashboard_antigravity_2026_monochrome',
    PORT: process.env.PORT || 3001,
  };
}

export const config = {
  get ADMIN_USER() {
    return getAuthConfig().ADMIN_USER;
  },
  get ADMIN_PASS() {
    return getAuthConfig().ADMIN_PASS;
  },
  get JWT_SECRET() {
    return getAuthConfig().JWT_SECRET;
  },
  get PORT() {
    return getAuthConfig().PORT;
  },
};
