"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Store,
  ShoppingCart,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Search,
  Package,
  Users,
  Home,
  UserPlus,
} from "lucide-react";

export default function Navbar() {
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [buscando, setBuscando] = useState("");
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuario");
    if (token && usuarioGuardado) {
      setSesionIniciada(true);
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, [pathname]);

  const manejarLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setSesionIniciada(false);
    setUsuario(null);
    setMenuAbierto(false);
    router.push("/");
  };

  const manejarBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    if (buscando.trim()) {
      router.push(`/productos?q=${encodeURIComponent(buscando.trim())}`);
      setBuscando("");
      setMostrarBusqueda(false);
      setMenuAbierto(false);
    }
  };

  const estaActivo = (ruta: string) => {
    if (ruta === "/") return pathname === "/";
    return pathname.startsWith(ruta);
  };

  return (
    <nav className="bg-gradient-to-r from-[#1a1f2e] via-[#2c3e50] to-[#1a1f2e] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-[#c9a84c] to-[#b8860b] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block">
              <span className="text-[#c9a84c]">Estanco</span> Arboleas
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`hover:text-[#c9a84c] transition text-sm flex items-center gap-1 ${
                estaActivo("/") && pathname === "/"
                  ? "text-[#c9a84c]"
                  : ""
              }`}
            >
              <Home className="w-4 h-4" />
              Inicio
            </Link>
            <Link
              href="/productos"
              className={`hover:text-[#c9a84c] transition text-sm flex items-center gap-1 ${
                estaActivo("/productos") ? "text-[#c9a84c]" : ""
              }`}
            >
              <Package className="w-4 h-4" />
              Productos
            </Link>

            {/* Search */}
            <form onSubmit={manejarBusqueda} className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={buscando}
                onChange={(e) => setBuscando(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-full px-4 py-1.5 pl-10 text-sm w-48 focus:outline-none focus:border-[#c9a84c] focus:bg-white/15 transition placeholder:text-white/50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            </form>

            {sesionIniciada && usuario ? (
              <>
                {usuario.rol === "admin" && (
                  <div className="flex items-center space-x-4 border-l border-white/20 pl-4">
                    <Link
                      href="/admin/productos"
                      className="hover:text-[#c9a84c] transition text-sm flex items-center gap-1"
                    >
                      <Package className="w-4 h-4" />
                      Productos
                    </Link>
                    <Link
                      href="/admin/usuarios"
                      className="hover:text-[#c9a84c] transition text-sm flex items-center gap-1"
                    >
                      <Users className="w-4 h-4" />
                      Usuarios
                    </Link>
                  </div>
                )}
                <Link
                  href="/carrito"
                  className="hover:text-[#c9a84c] transition text-sm flex items-center gap-1"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Carrito
                </Link>
                <div className="flex items-center space-x-3 border-l border-white/20 pl-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#c9a84c]/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-[#c9a84c]" />
                    </div>
                    <span className="text-sm text-white/80">
                      {usuario.nombre}
                    </span>
                  </div>
                  <button
                    onClick={manejarLogout}
                    className="hover:text-red-400 transition text-sm flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="hover:text-[#c9a84c] transition text-sm flex items-center gap-1"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </Link>
                <Link
                  href="/registro"
                  className="bg-[#c9a84c] hover:bg-[#e8c95a] text-[#1a1f2e] px-4 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-1"
                >
                  <UserPlus className="w-4 h-4" />
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
          >
            {menuAbierto ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuAbierto && (
        <div className="md:hidden bg-[#1a1f2e] border-t border-white/10 px-4 py-4 space-y-3 animate-fade-in">
          <form onSubmit={manejarBusqueda} className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={buscando}
              onChange={(e) => setBuscando(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:border-[#c9a84c] placeholder:text-white/50"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          </form>

          <Link
            href="/"
            className="block hover:text-[#c9a84c] transition flex items-center gap-2"
            onClick={() => setMenuAbierto(false)}
          >
            <Home className="w-4 h-4" />
            Inicio
          </Link>
          <Link
            href="/productos"
            className="block hover:text-[#c9a84c] transition flex items-center gap-2"
            onClick={() => setMenuAbierto(false)}
          >
            <Package className="w-4 h-4" />
            Productos
          </Link>

          {sesionIniciada && usuario ? (
            <>
              {usuario.rol === "admin" && (
                <>
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs text-[#c9a84c] mb-2 font-medium">
                      Administración
                    </p>
                    <Link
                      href="/admin/productos"
                      className="block hover:text-[#c9a84c] transition text-sm flex items-center gap-2 pl-4"
                      onClick={() => setMenuAbierto(false)}
                    >
                      <Package className="w-4 h-4" />
                      Gestionar Productos
                    </Link>
                    <Link
                      href="/admin/usuarios"
                      className="block hover:text-[#c9a84c] transition text-sm flex items-center gap-2 pl-4"
                      onClick={() => setMenuAbierto(false)}
                    >
                      <Users className="w-4 h-4" />
                      Gestionar Usuarios
                    </Link>
                  </div>
                </>
              )}
              <Link
                href="/carrito"
                className="block hover:text-[#c9a84c] transition flex items-center gap-2"
                onClick={() => setMenuAbierto(false)}
              >
                <ShoppingCart className="w-4 h-4" />
                Carrito
              </Link>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#c9a84c]" />
                  <span className="text-sm">{usuario.nombre}</span>
                </div>
                <button
                  onClick={manejarLogout}
                  className="text-red-400 hover:text-red-300 transition text-sm flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-white/10 space-y-2">
              <Link
                href="/login"
                className="block hover:text-[#c9a84c] transition flex items-center gap-2"
                onClick={() => setMenuAbierto(false)}
              >
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="block bg-[#c9a84c] hover:bg-[#e8c95a] text-[#1a1f2e] px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 text-center"
                onClick={() => setMenuAbierto(false)}
              >
                <UserPlus className="w-4 h-4" />
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
