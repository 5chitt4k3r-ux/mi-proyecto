# Script de Despliegue Completo

## FASE 1: Subir el proyecto a GitHub (desde tu máquina local)

Abre una terminal en `c:\Users\Gremory\Documents\ASIR 2\Repositorios\recuperacion-hlc` y ejecuta:

```bash
# 1. Inicializar git (si no está iniciado)
git init

# 2. Añadir todos los archivos del proyecto
git add matias-proyect/estanco/docker/estanco/

# 3. Crear .gitignore para evitar subir node_modules, logs, etc.
echo "node_modules/
*.log
package-lock.json
dist/
.next/
.env" > matias-proyect/estanco/docker/estanco/.gitignore

git add matias-proyect/estanco/docker/estanco/.gitignore

# 4. Hacer commit
git commit -m "Proyecto completo: Docker + Kubernetes + Helm + NestJS + Next.js"

# 5. Añadir el repositorio remoto
git remote add origin https://github.com/TiamatV1/mi-proyecto.git

# 6. Subir a GitHub
git branch -M main
git push -u origin main
```

---

## FASE 2: Conectarse al VPS y preparar el entorno

Conéctate al VPS por SSH:

```bash
ssh root@31.222.114.57
# Introduce tu contraseña cuando la pida
```

Una vez dentro del VPS, ejecuta estos comandos:

### 2.1 Clonar el repositorio

```bash
cd /home/TiamatV1
git clone https://github.com/TiamatV1/mi-proyecto.git proyecto_tfg
cd /home/TiamatV1/proyecto_tfg
```

### 2.2 Crear la estructura de directorios para los proyectos

```bash
# Crear directorios de los proyectos que se copian en los dockerfiles
mkdir -p /home/TiamatV1/proyecto_tfg/docker/megacrossover/proyecto/prestaurante/estanco-arboleas-backend
mkdir -p /home/TiamatV1/proyecto_tfg/docker/megacrossover/proyecto/prestaurante/estanco-arboleas-frontend
mkdir -p /home/TiamatV1/proyecto_tfg/docker/megacrossover/proyecto/nest_api/proyecto
```

### 2.3 Copiar los proyectos a las rutas que esperan los dockerfiles

```bash
# Copiar backend NestJS del estanco
cp -r /home/TiamatV1/proyecto_tfg/estanco-arboleas-backend/* /home/TiamatV1/proyecto_tfg/docker/megacrossover/proyecto/prestaurante/estanco-arboleas-backend/

# Copiar frontend Next.js del estanco
cp -r /home/TiamatV1/proyecto_tfg/estanco-arboleas-frontend/* /home/TiamatV1/proyecto_tfg/docker/megacrossover/proyecto/prestaurante/estanco-arboleas-frontend/

# Copiar proyecto nest_api
cp -r /home/TiamatV1/proyecto_tfg/nest_api/proyecto/* /home/TiamatV1/proyecto_tfg/docker/megacrossover/proyecto/nest_api/proyecto/
```

### 2.4 Iniciar sesión en Docker Hub

```bash
docker login
# Usuario: TiamatV1
# Contraseña: (tu contraseña de Docker Hub)
```

---

## FASE 3: Construir y subir imágenes Docker

Ve al directorio de los docker-compose y construye las imágenes en orden:

### 3.1 Imagen base (ubbase)

```bash
cd /home/TiamatV1/proyecto_tfg/docker/megacrossover/pbase/deploy
docker-compose build
docker-compose push
```

### 3.2 Imagen de seguridad (ubseguridad)

```bash
cd /home/TiamatV1/proyecto_tfg/docker/megacrossover/pseguridad/deploy
docker-compose build
docker-compose push
```

### 3.3 Imagen de nginx

```bash
cd /home/TiamatV1/proyecto_tfg/docker/megacrossover/pnginx/deploy
docker-compose build
docker-compose push
```

### 3.4 Imagen de PostgreSQL

```bash
cd /home/TiamatV1/proyecto_tfg/docker/megacrossover/ppostgre/deploy
docker-compose build
docker-compose push
```

### 3.5 Imagen del backend NestJS (restaurante)

```bash
cd /home/TiamatV1/proyecto_tfg/docker/megacrossover/pnode/deploy
docker-compose build
docker-compose push
```

### 3.6 Imagen del frontend Next.js (restaurante)

```bash
cd /home/TiamatV1/proyecto_tfg/docker/megacrossover/pnode_next/deploy
docker-compose build
docker-compose push
```

### 3.7 Imagen de nginx para pokeapi

```bash
cd /home/TiamatV1/proyecto_tfg/docker/megacrossover/nest_api/deploy
docker-compose build
docker-compose push
```

---

## FASE 4: Desplegar con Helm en MicroK8s

### 4.1 Asegurarse de que MicroK8s está funcionando

```bash
microk8s status --wait-ready
microk8s enable helm3 dns storage ingress
```

### 4.2 Navegar al chart de Helm

```bash
cd /home/TiamatV1/proyecto_tfg/docker/megacrossover/personal/estanco
```

### 4.3 Desplegar el chart

```bash
# Si es la primera vez que se despliega:
microk8s helm3 install estanco . --namespace proyecto-nest --create-namespace

# Si ya existe y quieres actualizar:
# microk8s helm3 upgrade estanco . --namespace proyecto-nest
```

### 4.4 Verificar el despliegue

```bash
# Ver pods
microk8s kubectl get pods -n proyecto-nest

# Ver servicios
microk8s kubectl get svc -n proyecto-nest

# Ver ingress
microk8s kubectl get ingress -n proyecto-nest

# Ver logs de un pod específico
microk8s kubectl logs -n proyecto-nest -l app=restaurante-backend
microk8s kubectl logs -n proyecto-nest -l app=restaurante-frontend
```

---

## FASE 5: Probar la alta disponibilidad

```bash
# Ver los pods actuales
microk8s kubectl get pods -n proyecto-nest

# Matar un pod del backend
microk8s kubectl delete pod -n proyecto-nest -l app=restaurante-backend

# Ver cómo Kubernetes lo recrea automáticamente
microk8s kubectl get pods -n proyecto-nest -w
```

---

## FASE 6: Verificar el dominio

Una vez que el Ingress esté desplegado y los DNS apunten a la IP del VPS:

```bash
# Verificar que el Ingress está configurado
microk8s kubectl get ingress -n proyecto-nest

# Probar desde el propio VPS
curl -k https://vuelaguadalinfogarrucha.eu
curl -k https://api.vuelaguadalinfogarrucha.eu
```

---

## Resumen de puertos y servicios

| Servicio | Tipo | Puerto Interno | Puerto Externo |
|----------|------|---------------|----------------|
| Backend (NestJS) | ClusterIP | 3000 | - (Ingress) |
| Frontend (Next.js) | ClusterIP | 3000 | - (Ingress) |
| PostgreSQL | ClusterIP | 5432 | - |
| SSH Backend | NodePort | 3456 | 30556 |
| SSH Frontend | NodePort | 3456 | 30557 |

**Dominios:**
- `https://vuelaguadalinfogarrucha.eu` → Frontend
- `https://www.vuelaguadalinfogarrucha.eu` → Frontend
- `https://api.vuelaguadalinfogarrucha.eu` → Backend API
