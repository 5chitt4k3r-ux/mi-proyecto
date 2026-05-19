const API_URL = "http://localhost:4000";

export async function peticionGET(ruta: string) {
  const res = await fetch(`${API_URL}${ruta}`);
  if (!res.ok) throw new Error("Error en la petición");
  return res.json();
}

export async function peticionGETToken(ruta: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}${ruta}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error en la petición");
  return res.json();
}

export async function peticionPOST(
  ruta: string,
  datos: any,
  necesitaToken = false
) {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (necesitaToken && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${ruta}`, {
    method: "POST",
    headers,
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error en la petición");
  }
  return res.json();
}

export async function peticionPUT(ruta: string, datos: any) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}${ruta}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error("Error en la petición");
  return res.json();
}

export async function peticionDELETE(ruta: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}${ruta}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error en la petición");
  return res.json();
}
