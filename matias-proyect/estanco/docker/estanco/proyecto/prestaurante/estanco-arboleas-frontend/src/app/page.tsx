"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Store,
  Package,
  Shield,
  Truck,
  Award,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  Cigarette,
  ScrollText,
  Flame,
  Wrench,
  Stamp,
  Gem,
  Leaf,
  Sparkles,
  ChevronLeft,
  Quote,
} from "lucide-react";
import { peticionGET } from "./api";

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
  {
    nombre: "Tabaco",
    icono: Cigarette,
    color: "from-amber-600 to-amber-800",
    desc: "Cigarrillos nacionales e importados",
  },
  {
    nombre: "Puros",
    icono: ScrollText,
    color: "from-amber-800 to-stone-900",
    desc: "Cubanos, dominicanos y nacionales",
  },
  {
    nombre: "Papel de liar",
    icono: Leaf,
    color: "from-stone-400 to-stone-600",
    desc: "OCB, RAW, Smoking y más",
  },
  {
    nombre: "Encendedores",
    icono: Flame,
    color: "from-orange-500 to-red-600",
    desc: "Clipper, Bic, Zippo",
  },
  {
    nombre: "Accesorios",
    icono: Wrench,
    color: "from-slate-500 to-slate-700",
    desc: "Filtros, liyadoras, estuches",
  },
  {
    nombre: "Timbres",
    icono: Stamp,
    color: "from-blue-600 to-blue-800",
    desc: "Timbres y efectos estancados",
  },
];

const TESTIMONIOS = [
  {
    nombre: "Antonio M.",
    texto: "El mejor estanco de la comarca. Siempre tienen todo lo que busco y el trato es inmejorable.",
    estrellas: 5,
  },
  {
    nombre: "María G.",
    texto: "Precios muy competitivos y productos de calidad. La tienda online funciona genial.",
    estrellas: 5,
  },
  {
    nombre: "Carlos R.",
    texto: "Gran variedad de puros cubanos. El envío es rápido y discreto, justo lo que necesitaba.",
    estrellas: 5,
  },
];

export default function Inicio() {
  const [productosDestacados, setProductosDestacados] = useState<Producto[]>(
    []
  );
  const [testimonioActual, setTestimonioActual] = useState(0);

  useEffect(() => {
    async function cargarDestacados() {
      try {
        const productos = await peticionGET("/product");
        setProductosDestacados(productos.slice(0, 4));
      } catch (error) {
        console.error("Error al cargar productos destacados:", error);
      }
    }
    cargarDestacados();
  }, []);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTestimonioActual((prev) => (prev + 1) % TESTIMONIOS.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div>
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden rounded-3xl mb-14 bg-gradient-to-br from-[#0f1219] via-[#1a1f2e] to-[#0f1219]">
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c9a84c' fill-opacity='1'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        {/* Líneas decorativas doradas */}
        <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-transparent to-[#c9a84c]" />
        <div className="absolute bottom-0 right-0 w-32 h-1 bg-gradient-to-l from-transparent to-[#c9a84c]" />

        <div className="relative px-6 py-20 md:px-14 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-[#c9a84c]/10 text-[#c9a84c] px-5 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in border border-[#c9a84c]/20">
            <MapPin className="w-4 h-4" />
            Arboleas, Almería — Desde 1985
          </div>

          <div className="relative inline-block mb-6">
            <div className="absolute -top-6 -left-6 w-12 h-12 border-l-2 border-t-2 border-[#c9a84c]/30 rounded-tl-xl" />
            <div className="absolute -bottom-6 -right-6 w-12 h-12 border-r-2 border-b-2 border-[#c9a84c]/30 rounded-br-xl" />
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              Tu <span className="text-[#c9a84c]">Estanco</span> de
              <br />
              Confianza en Arboleas
            </h1>
          </div>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-100 leading-relaxed">
            Los mejores productos de tabaco, puros, accesorios y timbres.
            <br />
            <span className="text-gray-500">
              Calidad, tradición y el mejor servicio desde el corazón de
              Arboleas.
            </span>
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up delay-200">
            <Link
              href="/productos"
              className="group bg-[#c9a84c] hover:bg-[#dbb956] text-[#0f1219] px-8 py-3.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#c9a84c]/20 hover:shadow-xl hover:shadow-[#c9a84c]/30 hover:-translate-y-0.5"
            >
              Explorar Productos
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/registro"
              className="group border-2 border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5" />
              Crear Cuenta Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="mb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: Truck,
              titulo: "Envío Rápido",
              desc: "Entrega en 24-48h en toda la provincia",
              detalle: "Pedidos antes de las 14:00",
            },
            {
              icon: Shield,
              titulo: "Productos Originales",
              desc: "100% garantía de autenticidad",
              detalle: "Distribuidor oficial",
            },
            {
              icon: Gem,
              titulo: "Mejor Precio Garantizado",
              desc: "Precios competitivos sin sorpresas",
              detalle: "IVA incluido",
            },
            {
              icon: Clock,
              titulo: "Horario Amplio",
              desc: "Lunes a sábado de 9:00 a 21:00",
              detalle: "Sin cita previa",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl p-5 md:p-6 text-center border border-gray-100 hover:border-[#c9a84c]/30 hover:shadow-xl transition-all duration-500 animate-fade-in-up relative overflow-hidden"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/0 via-[#c9a84c]/0 to-[#c9a84c]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-[#c9a84c]/20 to-[#c9a84c]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#c9a84c] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-800 text-base mb-1">
                  {item.titulo}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
                <p className="text-xs text-[#c9a84c] mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.detalle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CATEGORÍAS ─── */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-[0.2em]">
              Navega por
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">
              Nuestras Categorías
            </h2>
          </div>
          <Link
            href="/productos"
            className="group text-[#c9a84c] hover:text-[#b8860b] transition text-sm font-medium flex items-center gap-1"
          >
            Ver todas
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIAS.map((cat, i) => {
            const Icono = cat.icono;
            return (
              <Link
                key={cat.nombre}
                href={`/productos?categoria=${encodeURIComponent(
                  cat.nombre
                )}`}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-500 animate-fade-in-up hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div
                  className={`h-28 bg-gradient-to-br ${cat.color} flex items-center justify-center relative`}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                  <Icono className="w-12 h-12 text-white/90 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500" />
                </div>
                <div className="p-4 text-center">
                  <span className="text-sm font-bold text-gray-800 group-hover:text-[#c9a84c] transition-colors block">
                    {cat.nombre}
                  </span>
                  <span className="text-xs text-gray-400 mt-1 block">
                    {cat.desc}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── PRODUCTOS DESTACADOS ─── */}
      {productosDestacados.length > 0 && (
        <section className="mb-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-[0.2em]">
                Lo más vendido
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-1 flex items-center gap-3">
                Productos Destacados
                <Star className="w-6 h-6 text-[#c9a84c] fill-[#c9a84c]" />
              </h2>
            </div>
            <Link
              href="/productos"
              className="group text-[#c9a84c] hover:text-[#b8860b] transition text-sm font-medium flex items-center gap-1"
            >
              Ver todos
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosDestacados.map((producto, i) => (
              <Link
                key={producto.id}
                href={`/productos/${producto.id}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 animate-fade-in-up hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="h-52 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                  {producto.imagenUrl ? (
                    <img
                      src={producto.imagenUrl}
                      alt={producto.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-16 h-16 text-gray-200 group-hover:scale-110 transition-transform duration-500" />
                      <span className="text-xs text-gray-300 font-medium">
                        {producto.categoria}
                      </span>
                    </div>
                  )}
                  {/* Badge precio */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-[#c9a84c] to-[#b8860b] text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-lg">
                    {producto.precio.toFixed(2)}€
                  </div>
                  {/* Badge categoría */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-sm">
                    {producto.categoria}
                  </div>
                  {producto.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="bg-red-500/90 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                        Agotado temporalmente
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 group-hover:text-[#c9a84c] transition-colors text-base">
                    {producto.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {producto.descripcion}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {producto.stock > 0
                        ? `${producto.stock} uds. disponibles`
                        : "Sin stock"}
                    </span>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">
                      {producto.stock > 0 ? "En stock" : "Agotado"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── TESTIMONIOS ─── */}
      <section className="mb-14">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-[0.2em]">
            Opiniones
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            Lo que dicen nuestros clientes
          </h2>
        </div>
        <div className="relative max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-lg relative overflow-hidden">
            <Quote className="absolute top-6 right-8 w-16 h-16 text-[#c9a84c]/5" />
            <div className="flex items-center gap-1 mb-5">
              {[...Array(TESTIMONIOS[testimonioActual].estrellas)].map(
                (_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-[#c9a84c] fill-[#c9a84c]"
                  />
                )
              )}
            </div>
            <p className="text-gray-600 text-lg leading-relaxed mb-6 italic">
              &ldquo;{TESTIMONIOS[testimonioActual].texto}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">
                  {TESTIMONIOS[testimonioActual].nombre}
                </p>
                <p className="text-sm text-gray-400">Cliente verificada</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setTestimonioActual(
                      (prev) =>
                        (prev - 1 + TESTIMONIOS.length) % TESTIMONIOS.length
                    )
                  }
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setTestimonioActual(
                      (prev) => (prev + 1) % TESTIMONIOS.length
                    )
                  }
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Indicadores */}
            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIOS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonioActual(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === testimonioActual
                      ? "w-8 bg-[#c9a84c]"
                      : "w-1.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f1219] via-[#1a1f2e] to-[#0f1219] p-10 md:p-16 mb-8">
        {/* Decoración */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a84c]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#c9a84c]/5 rounded-full blur-3xl" />

        <div className="relative text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-[#c9a84c]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#c9a84c]/20">
            <Store className="w-8 h-8 text-[#c9a84c]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            ¿Eres mayor de 18 años?
          </h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            Para acceder a nuestra tienda online necesitas ser mayor de edad.
            Te ofrecemos los mejores productos con la máxima discreción y
            calidad que nos caracteriza desde 1985.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/productos"
              className="group bg-[#c9a84c] hover:bg-[#dbb956] text-[#0f1219] px-8 py-3.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#c9a84c]/20 hover:shadow-xl hover:shadow-[#c9a84c]/30 hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5" />
              Sí, soy mayor de edad
            </Link>
            <Link
              href="/"
              className="group border-2 border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5"
            >
              No, salir
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="pb-8">
        <div className="border-t border-gray-200/80 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#c9a84c] to-[#b8860b] rounded-lg flex items-center justify-center">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-800">
                  Estanco <span className="text-[#c9a84c]">Arboleas</span>
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Tu estanco de confianza en Arboleas desde 1985. Productos
                originales, el mejor servicio y atención personalizada.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Horario</h4>
              <div className="space-y-1.5 text-sm text-gray-500">
                <p>Lunes a viernes: 9:00 - 21:00</p>
                <p>Sábados: 9:00 - 14:00</p>
                <p className="text-[#c9a84c] font-medium">
                  Domingos: Cerrado
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">
                Información Legal
              </h4>
              <div className="space-y-1.5 text-sm text-gray-500">
                <p>Venta exclusiva a mayores de 18 años</p>
                <p>Consumo responsable</p>
                <p className="text-[#c9a84c] font-medium">
                  C/ Mayor, 1, Arboleas, Almería
                </p>
              </div>
            </div>
          </div>
          <div className="text-center pt-6 border-t border-gray-100">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Estanco Arboleas — Todos los
              derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
