import { app } from './app.js';
import { config } from './config.js';

const PORT = config.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[API Server] Servidor backend ejecutándose en http://localhost:${PORT}`);
  console.log(`[API Server] Usuario Admin configurado: ${config.ADMIN_USER}`);
  console.log(`[API Server] JWT Secret configurado correctamente.`);
});
