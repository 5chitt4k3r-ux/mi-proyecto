"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Users,
  Shield,
  User,
  ChevronRight,
  AlertCircle,
  Check,
} from "lucide-react";
import { peticionGETToken, peticionPUT } from "../../api";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export default function AdminUsuarios() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState<{
    tipo: "exito" | "error";
    texto: string;
  } | null>(null);

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
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await peticionGETToken("/users");
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setCargando(false);
    }
  };

  const cambiarRol = async (id: number, nuevoRol: string) => {
    try {
      await peticionPUT(`/users/${id}/role`, { rol: nuevoRol });
      setMensaje({
        tipo: "exito",
        texto: "Rol actualizado correctamente",
      });
      cargarUsuarios();
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: "Error al actualizar el rol",
      });
    }
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
            Administración de Usuarios
          </span>
        </nav>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Users className="w-8 h-8 text-[#c9a84c]" />
          Usuarios
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

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1a1f2e] text-white">
              <tr>
                <th className="p-4 text-left text-sm font-medium">Usuario</th>
                <th className="p-4 text-left text-sm font-medium">Email</th>
                <th className="p-4 text-left text-sm font-medium">Rol</th>
                <th className="p-4 text-right text-sm font-medium">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario, index) => (
                  <tr
                    key={usuario.id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            usuario.rol === "admin"
                              ? "bg-[#c9a84c]/20 text-[#c9a84c]"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {usuario.rol === "admin" ? (
                            <Shield className="w-5 h-5" />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </div>
                        <span className="font-medium text-gray-800">
                          {usuario.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600">
                        {usuario.email}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          usuario.rol === "admin"
                            ? "bg-[#c9a84c]/10 text-[#c9a84c]"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {usuario.rol === "admin" ? (
                          <Shield className="w-3 h-3" />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        {usuario.rol === "admin" ? "Admin" : "Usuario"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end">
                        <select
                          value={usuario.rol}
                          onChange={(e) =>
                            cambiarRol(usuario.id, e.target.value)
                          }
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#c9a84c] transition"
                        >
                          <option value="user">Usuario</option>
                          <option value="admin">Admin</option>
                        </select>
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
