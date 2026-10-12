const TOKEN_KEY = 'admin_jwt_token';
const USER_KEY = 'admin_user_data';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser: () => {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
};

/**
 * Petición autenticada con inyección de cabecera Authorization: Bearer <token>
 */
export async function authFetch(url, options = {}) {
  const token = authStorage.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    // Si la sesión expiró o el token es inválido, limpiar almacenamiento
    authStorage.removeToken();
    const error = new Error(data.message || 'Acceso no autorizado (401)');
    error.status = 401;
    error.data = data;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(data.message || data.error || 'Error en la petición');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Endpoint POST /api/login
 */
export async function loginAdmin(username, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || data.error || 'Credenciales inválidas');
    error.status = response.status;
    throw error;
  }

  authStorage.setToken(data.token);
  authStorage.setUser(data.user);
  return data;
}

/**
 * Endpoints protegidos de Pedidos
 */
export async function getPedidosAPI() {
  return authFetch('/api/pedidos');
}

export async function updatePedidoStatusAPI(orderId, status) {
  return authFetch(`/api/pedidos/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

/**
 * Endpoints protegidos de Productos
 */
export async function getProductosAPI() {
  return authFetch('/api/productos');
}

export async function createProductoAPI(productData) {
  return authFetch('/api/productos', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

/**
 * Endpoints de Cortes Diarios (Cierre de Caja y Finanzas)
 */
export async function getCortesDiariosAPI(params = {}) {
  const query = new URLSearchParams();
  if (params.mes) query.append('mes', params.mes);
  if (params.anio) query.append('anio', params.anio);
  if (params.desde) query.append('desde', params.desde);
  if (params.hasta) query.append('hasta', params.hasta);
  if (params.fecha) query.append('fecha', params.fecha);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return authFetch(`/api/cortes${queryString}`);
}

export async function generarCorteDiarioAPI(fecha = null) {
  return authFetch('/api/cortes/generar', {
    method: 'POST',
    body: JSON.stringify(fecha ? { fecha } : {}),
  });
}

