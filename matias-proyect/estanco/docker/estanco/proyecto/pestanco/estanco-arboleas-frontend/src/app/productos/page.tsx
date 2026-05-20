"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Package, Search, ChevronRight, SlidersHorizontal } from "lucide-react";
import { peticionGET } from "../api";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  categoria: string;
  stock: number;
}

const CATEGORIAS = [
  "Todas",
  "Tabaco",
  "Puros",
  "Papel de liar",
  "Encendedores",
  "Accesorios",
  "Timbres",
];

function ContenidoProductos() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoriaParam = searchParams.get("categoria") || "";

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState(categoriaParam);
  const [busqueda, setBusqueda] = useState(query);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    async function cargarProductos() {
      try {
        let ruta = "/product";
        if (query) {
          ruta += `?q=${encodeURIComponent(query)}`;
        }
        const data = await peticionGET(ruta);
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setCargando(false);
      }
    }
    cargarProductos();
  }, [query]);

  const productosFiltrados = categoriaSeleccionada
    ? categoriaSeleccionada === "Todas"
      ? productos
      : productos.filter((p) => p.categoria === categoriaSeleccionada)
    : productos;

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#c9a84c] transition">
            Inicio
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-medium">Productos</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Nuestros Productos
            </h1>
            {query && (
              <p className="text-gray-500 mt-1">
                Resultados para: "{query}"
              </p>
            )}
          </div>
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="md:hidden bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:border-[#c9a84c] transition"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filtros */}
        <aside
          className={`${
            mostrarFiltros ? "block" : "hidden"
          } md:block w-full md:w-56 shrink-0`}
        >
          <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-20">
            <h3 className="font-semibold text-gray-800 mb-3">Categorías</h3>
            <div className="space-y-1">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoriaSeleccionada(cat === "Todas" ? "" : cat);
                    setMostrarFiltros(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    (cat === "Todas" && !categoriaSeleccionada) ||
                    categoriaSeleccionada === cat
                      ? "bg-[#c9a84c]/10 text-[#c9a84c] font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid Productos */}
        <div className="flex-1">
          {productosFiltrados.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-500 mb-6">
                {query
                  ? `No hay resultados para "${query}"`
                  : "No hay productos en esta categoría"}
              </p>
              <Link
                href="/productos"
                className="bg-[#c9a84c] hover:bg-[#e8c95a] text-[#1a1f2e] px-6 py-2 rounded-full font-medium transition inline-flex items-center gap-2"
              >
                Ver todos los productos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productosFiltrados.map((producto, index) => (
                <Link
                  key={producto.id}
                  href={`/productos/${producto.id}`}
                  className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                    {producto.imagenUrl ? (
                      <img
                        src={producto.imagenUrl}
                        alt={producto.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Package className="w-16 h-16 text-gray-300" />
                    )}
                    <div className="absolute top-3 right-3 bg-[#c9a84c] text-white text-xs font-bold px-2 py-1 rounded-full">
                      {producto.precio.toFixed(2)}€
                    </div>
                    {producto.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Agotado
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-[#c9a84c] font-medium uppercase tracking-wide">
                      {producto.categoria}
                    </span>
                    <h3 className="font-semibold text-gray-800 mt-1 group-hover:text-[#c9a84c] transition">
                      {producto.nombre}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {producto.descripcion}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-800">
                        {producto.precio.toFixed(2)}€
                      </span>
                      {producto.stock > 0 && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          En stock
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaginaProductos() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ContenidoProductos />
    </Suspense>
  );
}
