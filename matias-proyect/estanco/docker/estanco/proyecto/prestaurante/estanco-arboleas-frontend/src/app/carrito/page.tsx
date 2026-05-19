"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  CreditCard,
  Package,
  ChevronRight,
  AlertCircle,
  Check,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { peticionGETToken, peticionPUT, peticionDELETE, peticionPOST } from "../api";

interface ItemCarrito {
  id: number;
  usuarioId: number;
  productoId: number;
  cantidad: number;
  fechaPago: string | null;
  pagado: boolean;
  producto: {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagenUrl: string;
    categoria: string;
    stock: number;
  };
}

export default function PaginaCarrito() {
  const router = useRouter();
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [historial, setHistorial] = useState<ItemCarrito[]>([]);
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [cantidadEdit, setCantidadEdit] = useState(1);
  const [mensaje, setMensaje] = useState<{
    tipo: "exito" | "error";
    texto: string;
  } | null>(null);
  const [pagando, setPagando] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    cargarCarrito();
    cargarHistorial();
  }, []);

  const cargarCarrito = async () => {
    try {
      const data = await peticionGETToken("/cart");
      setItems(data);
    } catch (error) {
      console.error("Error al cargar carrito:", error);
    } finally {
      setCargando(false);
    }
  };

  const cargarHistorial = async () => {
    try {
      const data = await peticionGETToken("/cart/history");
      setHistorial(data);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    }
  };

  const eliminarItem = async (id: number) => {
    try {
      await peticionDELETE(`/cart/${id}`);
      setItems(items.filter((item) => item.id !== id));
      setMensaje({ tipo: "exito", texto: "Producto eliminado del carrito" });
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al eliminar el producto" });
    }
  };

  const actualizarCantidad = async (id: number) => {
    try {
      await peticionPUT(`/cart/${id}`, { cantidad: cantidadEdit });
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, cantidad: cantidadEdit } : item
        )
      );
      setEditandoId(null);
      setMensaje({ tipo: "exito", texto: "Cantidad actualizada" });
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al actualizar cantidad" });
    }
  };

  const realizarPago = async () => {
    setPagando(true);
    try {
      await peticionPOST("/cart/pay", {}, true);
      setMensaje({
        tipo: "exito",
        texto: "¡Pago realizado con éxito! Gracias por tu compra.",
      });
      setItems([]);
      cargarHistorial();
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Error al procesar el pago" });
    } finally {
      setPagando(false);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.producto.precio * item.cantidad,
    0
  );

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
          <span className="text-gray-800 font-medium">Carrito</span>
        </nav>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-[#c9a84c]" />
          Mi Carrito
        </h1>
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

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tu carrito está vacío
          </h3>
          <p className="text-gray-500 mb-6">
            Explora nuestros productos y añade los que más te gusten
          </p>
          <Link
            href="/productos"
            className="bg-[#c9a84c] hover:bg-[#e8c95a] text-[#1a1f2e] px-6 py-3 rounded-full font-medium transition inline-flex items-center gap-2"
          >
            <Package className="w-5 h-5" />
            Ver Productos
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shrink-0">
                  {item.producto.imagenUrl ? (
                    <img
                      src={item.producto.imagenUrl}
                      alt={item.producto.nombre}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/productos/${item.producto.id}`}
                    className="font-semibold text-gray-800 hover:text-[#c9a84c] transition"
                  >
                    {item.producto.nombre}
                  </Link>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {item.producto.categoria}
                  </p>
                  <p className="text-[#c9a84c] font-bold mt-1">
                    {item.producto.precio.toFixed(2)}€
                  </p>

                  {editandoId === item.id ? (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() =>
                            setCantidadEdit(Math.max(1, cantidadEdit - 1))
                          }
                          className="p-1.5 hover:bg-gray-50 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-medium min-w-[30px] text-center">
                          {cantidadEdit}
                        </span>
                        <button
                          onClick={() =>
                            setCantidadEdit(
                              Math.min(item.producto.stock, cantidadEdit + 1)
                            )
                          }
                          className="p-1.5 hover:bg-gray-50 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => actualizarCantidad(item.id)}
                        className="text-xs bg-[#c9a84c] text-white px-3 py-1.5 rounded-lg hover:bg-[#b8860b] transition"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditandoId(null)}
                        className="text-xs text-gray-500 hover:text-gray-700 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-gray-600">
                        Cant: {item.cantidad}
                      </span>
                      <button
                        onClick={() => {
                          setEditandoId(item.id);
                          setCantidadEdit(item.cantidad);
                        }}
                        className="text-xs text-[#c9a84c] hover:text-[#b8860b] transition"
                      >
                        Cambiar
                      </button>
                      <button
                        onClick={() => eliminarItem(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 transition flex items-center gap-1 ml-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-800">
                    {(item.producto.precio * item.cantidad).toFixed(2)}€
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-20">
              <h3 className="font-semibold text-gray-800 mb-4">
                Resumen del pedido
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600 truncate mr-2">
                      {item.producto.nombre} x{item.cantidad}
                    </span>
                    <span className="font-medium text-gray-800">
                      {(item.producto.precio * item.cantidad).toFixed(2)}€
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-[#c9a84c]">
                    {total.toFixed(2)}€
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  IVA incluido
                </p>
              </div>
              <button
                onClick={realizarPago}
                disabled={pagando}
                className="w-full mt-6 bg-[#c9a84c] hover:bg-[#e8c95a] text-[#1a1f2e] py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {pagando ? (
                  <div className="w-5 h-5 border-2 border-[#1a1f2e] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pagar {total.toFixed(2)}€
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Historial de compras */}
      {historial.length > 0 && (
        <div className="mt-12">
          <button
            onClick={() => setMostrarHistorial(!mostrarHistorial)}
            className="flex items-center gap-2 text-gray-800 font-semibold mb-4 hover:text-[#c9a84c] transition"
          >
            <Clock className="w-5 h-5" />
            Historial de compras ({historial.length})
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                mostrarHistorial ? "rotate-90" : ""
              }`}
            />
          </button>
          {mostrarHistorial && (
            <div className="space-y-3">
              {historial.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {item.producto.nombre}
                    </p>
                    <p className="text-sm text-gray-500">
                      Cantidad: {item.cantidad} -{" "}
                      {(item.producto.precio * item.cantidad).toFixed(2)}€
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-green-600 font-medium">Pagado</p>
                    <p className="text-gray-400 text-xs">
                      {item.fechaPago
                        ? new Date(item.fechaPago).toLocaleDateString("es-ES")
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
