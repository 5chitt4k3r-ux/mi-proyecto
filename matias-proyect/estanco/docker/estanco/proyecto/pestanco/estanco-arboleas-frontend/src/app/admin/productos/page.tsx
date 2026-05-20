"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  AlertCircle,
  Check,
  X,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import {
  peticionGETToken,
  peticionPOST,
  peticionPUT,
  peticionDELETE,
} from "../../api";

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
  "Tabaco",
  "Puros",
  "Papel de liar",
  "Encendedores",
  "Accesorios",
  "Timbres",
];

export default function AdminProductos() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<{
    tipo: "exito" | "error";
    texto: string;
  } | null>(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagenUrl: "",
    categoria: "Tabaco",
    stock: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuario = localStorage.getItem("usuario");
    if (!token || !usuario) {
      router.push("/login");
      return;
    }
    const userData = JSON.parse(usuario);
    if (userData.rol !== "admin") {
      router.push("/");
      return;
    }
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await peticionGETToken("/product");
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setCargando(false);
    }
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    const datos = {
      nombre: formulario.nombre,
      descripcion: formulario.descripcion,
      precio: parseFloat(formulario.precio),
      imagenUrl: formulario.imagenUrl,
      categoria: formulario.categoria,
      stock: parseInt(formulario.stock),
    };

    try {
      if (editando) {
        await peticionPUT(`/product/${editando}`, datos);
        setMensaje({ tipo: "exito", texto: "Producto actualizado correctamente" });
      } else {
        await peticionPOST("/product", datos, true);
        setMensaje({ tipo: "exito", texto: "Producto creado correctamente" });
      }
      resetFormulario();
      cargarProductos();
    } catch (error: any) {
      setMensaje({
        tipo: "error",
        texto: error.message || "Error al guardar el producto",
      });
    }
  };

  const editarProducto = (producto: Producto) => {
    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio.toString(),
      imagenUrl: producto.imagenUrl || "",
      categoria: producto.categoria,
      stock: producto.stock.toString(),
    });
    setEditando(producto.id);
    setMostrarFormulario(true);
  };

  const eliminarProducto = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await peticionDELETE(`/product/${id}`);
      setMensaje({ tipo: "exito", texto: "Producto eliminado correctamente" });
      cargarProductos();
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al eliminar el producto" });
    }
  };

  const resetFormulario = () => {
    setFormulario({
      nombre: "",
      descripcion: "",
      precio: "",
      imagenUrl: "",
      categoria: "Tabaco",
      stock: "",
    });
    setEditando(null);
    setMostrarFormulario(false);
  };

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
          <span className="text-gray-800 font-medium">
            Administración de Productos
          </span>
        </nav>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Package className="w-8 h-8 text-[#c9a84c]" />
            Productos
          </h1>
          <button
            onClick={() => {
              resetFormulario();
              setMostrarFormulario(!mostrarFormulario);
            }}
            className="bg-[#c9a84c] hover:bg-[#e8c95a] text-[#1a1f2e] px-4 py-2 rounded-xl font-medium transition flex items-center gap-2"
          >
            {mostrarFormulario ? (
              <>
                <X className="w-5 h-5" /> Cancelar
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" /> Nuevo Producto
              </>
            )}
          </button>
        </div>
      </div>

      {mensaje && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-2 ${
            mensaje.tipo === "exito"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {mensaje.tipo === "exito" ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {mensaje.texto}
        </div>
      )}

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editando ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <form onSubmit={manejarSubmit} className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={formulario.nombre}
                onChange={(e) =>
                  setFormulario({ ...formulario, nombre: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#c9a84c] transition"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formulario.descripcion}
                onChange={(e) =>
                  setFormulario({
                    ...formulario,
                    descripcion: e.target.value,
                  })
                }
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#c9a84c] transition resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio (€)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formulario.precio}
                onChange={(e) =>
                  setFormulario({ ...formulario, precio: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#c9a84c] transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                min="0"
                value={formulario.stock}
                onChange={(e) =>
                  setFormulario({ ...formulario, stock: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#c9a84c] transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={formulario.categoria}
                onChange={(e) =>
                  setFormulario({ ...formulario, categoria: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#c9a84c] transition"
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de imagen (opcional)
              </label>
              <input
                type="text"
                value={formulario.imagenUrl}
                onChange={(e) =>
                  setFormulario({ ...formulario, imagenUrl: e.target.value })
                }
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#c9a84c] transition"
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-[#c9a84c] hover:bg-[#e8c95a] text-[#1a1f2e] px-6 py-2 rounded-xl font-medium transition"
              >
                {editando ? "Actualizar Producto" : "Crear Producto"}
              </button>
              <button
                type="button"
                onClick={resetFormulario}
                className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-xl font-medium transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1a1f2e] text-white">
              <tr>
                <th className="p-4 text-left text-sm font-medium">Producto</th>
                <th className="p-4 text-left text-sm font-medium">Categoría</th>
                <th className="p-4 text-left text-sm font-medium">Precio</th>
                <th className="p-4 text-left text-sm font-medium">Stock</th>
                <th className="p-4 text-right text-sm font-medium">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No hay productos registrados
                  </td>
                </tr>
              ) : (
                productos.map((producto) => (
                  <tr
                    key={producto.id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {producto.nombre}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">
                            {producto.descripcion}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600">
                        {producto.categoria}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-[#c9a84c]">
                        {producto.precio.toFixed(2)}€
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-sm ${
                          producto.stock > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {producto.stock > 0
                          ? `${producto.stock} uds.`
                          : "Agotado"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => editarProducto(producto)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-[#c9a84c]"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => eliminarProducto(producto.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
