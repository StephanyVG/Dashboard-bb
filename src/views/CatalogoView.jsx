import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, X, Layers } from 'lucide-react';
import { getProductosAPI, createProductoAPI } from '../services/api';

const DEFAULT_PRODUCTS = [
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

const CATEGORY_TABS = ['Todos', 'Cafetería', 'Alimentos', 'Postres'];

export default function CatalogoView({ onShowToast, onRequireAuth }) {
  const [activeTab, setActiveTab] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);

  // Estado para el modal de nuevo producto con especificaciones
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Cafetería',
    price: '',
    specifications: '',
  });

  // Cargar productos desde la API protegida si hay token
  useEffect(() => {
    getProductosAPI()
      .then((res) => {
        if (res.data) setProducts(res.data);
      })
      .catch(() => {
        // En caso de 401 se conserva el estado local
      });
  }, []);

  const handleOpenModal = () => {
    setNewProduct({
      name: '',
      category: activeTab !== 'Todos' ? activeTab : 'Cafetería',
      price: '',
      specifications: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !newProduct.price.trim()) {
      if (onShowToast) {
        onShowToast('Por favor completa el nombre y precio del producto.', 'alert');
      }
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createProductoAPI({
        name: newProduct.name.trim(),
        category: newProduct.category,
        price: newProduct.price.trim(),
        specifications: newProduct.specifications.trim() || 'Sin especificaciones registradas',
      });

      setProducts((prev) => [res.product, ...prev]);
      setIsModalOpen(false);

      if (onShowToast) {
        onShowToast(`Producto "${res.product.name}" agregado con éxito al catálogo.`, 'success');
      }
    } catch (err) {
      if (err.status === 401) {
        if (onShowToast) {
          onShowToast('Estado 401: Sesión expirada. Se requiere token JWT.', 'error');
        }
        if (onRequireAuth) {
          onRequireAuth();
        }
      } else {
        if (onShowToast) {
          onShowToast(err.message || 'Error al agregar producto.', 'error');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrado reactivo por tabs de tipo (Cafetería, Alimentos, Postres) y buscador
  const filteredProducts = products.filter((item) => {
    // 1. Filtro por tipo/categoría
    const matchesCategory =
      activeTab === 'Todos' ||
      item.category?.toLowerCase() === activeTab.toLowerCase();

    // 2. Filtro por término de búsqueda
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      item.name?.toLowerCase().includes(term) ||
      item.id?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term) ||
      item.specifications?.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header de la vista */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#000000] tracking-tight">
            Catálogo de Productos
          </h1>
          <p className="text-sm text-[#52525B] mt-0.5">
            Gestión de artículos y recetas organizadas por tipo con especificaciones completas.
          </p>
        </div>

        {/* Acciones: Botón con round corner de 6px */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenModal}
            className="btn-primary flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-[6px] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Producto
          </button>
        </div>
      </div>

      {/* Barra de Navegación: Tabs de tipo (Cafetería, Alimentos, Postres) y Buscador integrado */}
      <div className="p-4 bg-[#FFFFFF] border border-[#E4E4E7] rounded-[16px] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Tabs de Tipo: Cafetería, Alimentos, Postres */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-[6px] transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#000000] text-[#FFFFFF]'
                  : 'bg-transparent text-[#000000] border border-[#E4E4E7] hover:bg-[#F4F4F5]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Buscador dentro del catálogo */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#52525B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o ingredientes..."
            className="w-full bg-[#FFFFFF] text-[#000000] border border-[#E4E4E7] pl-10 pr-8 py-2 text-xs sm:text-sm rounded-[6px] focus:outline-none focus:border-[#000000] transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#000000] p-1"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid de Productos / Ítems: Tarjetas con round corner de 16px según design.md */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-[#FFFFFF] border border-[#E4E4E7] rounded-[16px] text-xs text-[#52525B]">
            No se encontraron productos en la categoría <strong>{activeTab}</strong> {searchTerm ? `con el término "${searchTerm}"` : ''}.
          </div>
        ) : (
          filteredProducts.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-[#FFFFFF] border border-[#E4E4E7] hover:border-[#000000] transition-colors flex flex-col justify-between rounded-[16px]"
            >
              <div>
                {/* Tag superior con SKU y Tipo */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-mono text-[#52525B] font-medium text-[11px]">{item.id}</span>
                  <span className="text-[11px] uppercase tracking-wider text-[#000000] font-semibold px-2 py-0.5 bg-[#F4F4F5] border border-[#E4E4E7] rounded-[6px]">
                    {item.category}
                  </span>
                </div>

                {/* Wireframe de preview del producto con round corner de 6px */}
                <div className="h-28 bg-[#F4F4F5] border border-[#E4E4E7] rounded-[6px] flex items-center justify-center text-[#000000] mb-3">
                  <Package className="w-8 h-8 opacity-60" />
                </div>

                <h3 className="text-sm font-semibold text-[#000000] line-clamp-1">
                  {item.name}
                </h3>

                {/* Especificaciones del producto */}
                {item.specifications && (
                  <div className="mt-2.5 p-2.5 bg-[#F4F4F5] border border-[#E4E4E7] rounded-[6px]">
                    <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#000000] mb-0.5">
                      <Layers className="w-3 h-3 text-[#000000]" />
                      <span>Especificaciones</span>
                    </div>
                    <p className="text-xs text-[#52525B] line-clamp-2 leading-relaxed" title={item.specifications}>
                      {item.specifications}
                    </p>
                  </div>
                )}
              </div>

              {/* Fila inferior: Solo precio (sin badges ni existencias) */}
              <div className="mt-4 pt-3 border-t border-[#E4E4E7] flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#52525B]">Precio Unitario</span>
                <span className="text-base font-bold text-[#000000] font-mono">{item.price}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación: Contenedor con 16px round corner, botones con 6px */}
      <div className="p-4 bg-[#FFFFFF] border border-[#E4E4E7] rounded-[16px] flex items-center justify-between text-xs text-[#52525B]">
        <span>Mostrando {filteredProducts.length} de {products.length} productos</span>
        <div className="flex items-center gap-1.5">
          <button 
            type="button"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="btn-secondary px-3 py-1.5 text-xs font-medium rounded-[6px] cursor-pointer disabled:opacity-50"
          >
            Anterior
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 flex items-center justify-center text-xs font-medium rounded-[6px] transition-colors cursor-pointer ${
                currentPage === page
                  ? 'bg-[#000000] text-[#FFFFFF]'
                  : 'bg-transparent text-[#000000] border border-[#E4E4E7] hover:bg-[#F4F4F5]'
              }`}
            >
              {page}
            </button>
          ))}
          <button 
            type="button"
            onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
            disabled={currentPage === 3}
            className="btn-secondary px-3 py-1.5 text-xs font-medium rounded-[6px] cursor-pointer disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal para Agregar Producto con Especificaciones */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/60 backdrop-blur-xs p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-[#FFFFFF] border border-[#E4E4E7] rounded-[16px] w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3 mb-4">
              <div>
                <h2 id="modal-title" className="text-base font-bold text-[#000000]">
                  Agregar Nuevo Producto
                </h2>
                <p className="text-xs text-[#52525B] mt-0.5">
                  Registra un producto en el catálogo e incluye sus especificaciones técnicas y de receta.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-[#52525B] hover:text-[#000000] p-1 rounded-[6px] hover:bg-[#F4F4F5] transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#000000] mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Ej: Croissant de Avellana y Chocolate"
                  className="w-full bg-[#FFFFFF] text-[#000000] border border-[#E4E4E7] px-3 py-2 text-xs sm:text-sm rounded-[6px] focus:outline-none focus:border-[#000000]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#000000] mb-1">
                    Tipo / Categoría *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-[#FFFFFF] text-[#000000] border border-[#E4E4E7] px-3 py-2 text-xs sm:text-sm rounded-[6px] focus:outline-none focus:border-[#000000] cursor-pointer"
                  >
                    <option value="Cafetería">Cafetería</option>
                    <option value="Alimentos">Alimentos</option>
                    <option value="Postres">Postres</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#000000] mb-1">
                    Precio ($ MXN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="Ej: $85.00"
                    className="w-full bg-[#FFFFFF] text-[#000000] border border-[#E4E4E7] px-3 py-2 text-xs sm:text-sm font-mono rounded-[6px] focus:outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#000000] mb-1">
                  Especificaciones del Producto
                </label>
                <textarea
                  rows={3}
                  value={newProduct.specifications}
                  onChange={(e) => setNewProduct({ ...newProduct, specifications: e.target.value })}
                  placeholder="Ej: Pan laminado con mantequilla francesa, crema de avellana natural, cacao al 70%"
                  className="w-full bg-[#FFFFFF] text-[#000000] border border-[#E4E4E7] px-3 py-2 text-xs sm:text-sm rounded-[6px] focus:outline-none focus:border-[#000000] resize-none"
                />
                <span className="text-[11px] text-[#52525B] mt-1 block">
                  Agrega detalles técnicos, receta, ingredientes o características especiales.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4E4E7]">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary px-4 py-2 text-xs font-medium rounded-[6px] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-[6px] cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
