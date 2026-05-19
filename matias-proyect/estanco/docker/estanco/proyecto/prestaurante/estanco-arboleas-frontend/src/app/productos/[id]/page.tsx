"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  ChevronRight,
  Minus,
  Plus,
  AlertCircle,
  Check,
  ArrowLeft,
  Star,
} from "lucide-react";
import { peticionGET, peticionPOST } from "../../api";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  categoria: string;
  stock: number;
}

export default function DetalleProducto() {
  const params = useParams();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [agregando, setAgregando] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: "exito" | "error";
    texto: string;
  } | null>(null);
  const [sesionIniciada, setSesionIniciada] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setSesionIniciada(!!token);
  }, []);

  useEffect(() => {
    async function cargarProducto() {
      try {
        const data = await peticionGET(`/product/${params.id}`);
        setProducto(data);
      } catch (error) {
        console.error("Error al cargar producto:", error);
      } finally {
        setCargando(false);
      }
    }
    if (params.id) {
      cargarProducto();
    }
  }, [params.id]);

  const agregarAlCarrito = async () => {
    if (!sesionIniciada) {
      setMensaje({
        tipo: "error",
        texto: "Debes iniciar sesión para añadir productos al carrito",
      });
      return;
    }
    setAgregando(true);
    setMensaje(null);
    try {
      await peticionPOST(
        "/cart",
        { productoId: producto!.id, cantidad },
        true
      );
      setMensaje({
        tipo: "exito",
        texto: "Producto añadido al carrito correctamente",
      });
      setCantidad(1);
    } catch (error: any) {
      setMensaje({
        tipo: "error",
        texto: error.message || "Error al añadir al carrito",
      });
    } finally {
      setAgregando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="text-center py-20">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Producto no encontrado
        </h2>
        <Link
          href="/productos"
          className="text-[#c9a84c] hover:text-[#b8860b] transition inline-flex items-center gap-2 mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a productos
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#c9a84c] transition">
          Inicio
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/productos" className="hover:text-[#c9a84c] transition">
          Productos
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-800 font-medium">{producto.nombre}</span>
      </nav>

      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Imagen */}
            <div className="h-64 md:h-full min-h-[300px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
              {producto.imagenUrl ? (
                <img
                  src={producto.imagenUrl}
                  alt={producto.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-24 h-24 text-gray-300" />
              )}
              {producto.stock <= 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Agotado
                </div>
              )}
            </div>

            {/* Detalles */}
            <div className="p-6 md:p-8 flex flex-col">
              <div>
                <span className="text-sm text-[#c9a84c] font-medium uppercase tracking-wide">
                  {producto.categoria}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
                  {producto.nombre}
                </h1>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex text-[#c9a84c]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(12 reseñas)</span>
                </div>
                <p className="text-3xl font-bold text-gray-800 mt-4">
                  {producto.precio.toFixed(2)}€
                </p>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  {producto.descripcion}
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100">
                {producto.stock > 0 ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">
                        En stock ({producto.stock} unidades)
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-xl">
                        <button
                          onClick={() =>
                            setCantidad(Math.max(1, cantidad - 1))
                          }
                          className="p-3 hover:bg-gray-50 transition rounded-l-xl"
                          disabled={cantidad <= 1}
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="px-4 font-medium text-gray-800 min-w-[40px] text-center">
                          {cantidad}
                        </span>
                        <button
                          onClick={() =>
                            setCantidad(Math.min(producto.stock, cantidad + 1))
                          }
                          className="p-3 hover:bg-gray-50 transition rounded-r-xl"
                          disabled={cantidad >= producto.stock}
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <button
                        onClick={agregarAlCarrito}
                        disabled={agregando}
                        className="flex-1 bg-[#c9a84c] hover:bg-[#e8c95a] text-[#1a1f2e] px-6 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        {agregando
                          ? "Añadiendo..."
                          : "Añadir al Carrito"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-3 rounded-xl">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">
                      Producto agotado temporalmente
                    </span>
                  </div>
                )}

                {mensaje && (
                  <div
                    className={`mt-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
                      mensaje.tipo === "exito"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {mensaje.tipo === "exito" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {mensaje.texto}
                  </div>
                )}

                {!sesionIniciada && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-xl text-sm text-amber-700">
                    <p className="font-medium mb-2">
                      Inicia sesión para comprar
                    </p>
                    <div className="flex gap-3">
                      <Link
                        href="/login"
                        className="text-[#c9a84c] hover:text-[#b8860b] font-medium transition"
                      >
                        Iniciar sesión
                      </Link>
                      <Link
                        href="/registro"
                        className="text-[#c9a84c] hover:text-[#b8860b] font-medium transition"
                      >
                        Registrarse
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[
            {
              icon: <Truck className="w-5 h-5" />,
              titulo: "Envío discreto",
              desc: "Recibe tu pedido en un embalaje neutro",
            },
            {
              icon: <Shield className="w-5 h-5" />,
              titulo: "Producto original",
              desc: "Garantizamos la autenticidad",
            },
            {
              icon: <RefreshCw className="w-5 h-5" />,
              titulo: "Devoluciones",
              desc: "14 días para devoluciones",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-[#c9a84c]/10 rounded-lg flex items-center justify-center text-[#c9a84c]">
                {item.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm">
                  {item.titulo}
                </h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Truck(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function Shield(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function RefreshCw(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}
