# Documentación del Proyecto - Despliegue en VPS

**VPS:** `31.222.114.57`
**Dominio:** `vuelaguadalinfo.eu`
**Usuario:** `TiamatV1`
**Ruta base:** `/home/TiamatV1/proyecto_tfg/docker/megacrossover/`
**Fecha:** Mayo 2026

---

## Índice

1. [Estructura de los Dockerfiles](#1-estructura-de-los-dockerfiles)
2. [Helm Chart Completo](#2-helm-chart-completo)
3. [Alta Disponibilidad en Kubernetes](#3-alta-disponibilidad-en-kubernetes)

---

## 1. Estructura de los Dockerfiles

### 1.1. Jerarquía Multi-Capa (Imagen Base)

El proyecto utiliza una arquitectura de imágenes Docker en capas, donde cada imagen base sirve como fundamento para la siguiente. Esto permite reutilizar configuraciones comunes (seguridad, SSH, usuarios) sin repetirlas en cada imagen.

```
                    ┌─────────────────┐
                    │   ubuntu:22.04   │  (OFICIAL - Docker Hub)
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  TiamatV1/      │
                    │   ubbase01      │  (ubuntu + curl, nano, net-tools,
                    │                 │    sudo, openssh-server, usuario
                    │                 │    tiamat, SSH configurado)
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ TiamatV1/       │
                    │  ubseguridad01  │  (ubbase01 + iptables, nmap,
                    │                 │    seguridad perimetral)
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼────────┐ ┌──▼─────────┐ ┌──▼─────────┐
     │ TiamatV1/       │ │ TiamatV1/  │ │ TiamatV1/  │
     │  nginx101       │ │  postgre01 │ │  nginx101   │
     │ (nginx +        │ │ (PostgreSQL│ │ (nginx +    │
     │  ubseguridad)   │ │  16 +      │ │  ubseguridad│
     │                 │ │  ubseguridad│ │             │
     └────────┬────────┘ └────────────┘ └─────────────┘
              │
    ┌─────────┼─────────┐
    │         │         │
┌───▼───┐ ┌──▼────┐ ┌──▼──────┐
│nest/  │ │next/  │ │nginxres-│
│tiamat │ │docker │ │taurante/│
│restau-│ │file   │ │tiamat   │
│rante  │ │       │ │nginxres-│
│       │ │       │ │taurante │
│(NestJS│ │(Next  │ │         │
│Backend│ │ App)  │ │(Next.js │
│+nginx)│ │       │ │Frontend │
│       │ │       │ │+nginx)  │
└───────┘ └───────┘ └─────────┘
```

### 1.2. Dockerfile 1: `ubbase/tiamatubbase` (Capa Base)

**Propósito:** Imagen base mínima con herramientas esenciales y configuración de usuario/SSH.

**Archivo:** [`dockerfiles/ubbase/tiamatubbase`](matias-proyect/estanco/docker/estanco/dockerfiles/ubbase/tiamatubbase)

```dockerfile
FROM ubuntu:22.04

# Instalación de herramientas base
RUN apt-get update && apt-get install -y \
    curl nano net-tools sudo openssh-server iproute2

# Creación del usuario del sistema
RUN useradd -m -s /bin/bash tiamat && echo "tiamat:1234" | chpasswd
RUN usermod -aG sudo tiamat

# Configuración SSH
RUN mkdir /var/run/sshd
RUN sed -i 's/#Port 22/Port 22452/' /etc/ssh/sshd_config
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# Copia de scripts de administración
COPY ./common/ /root/admin/
COPY ./dockerfiles/ubbase/admin/ /root/admin/base/

RUN chmod +x /root/admin/base/tiamatstart.sh

ENTRYPOINT ["./tiamatstart.sh"]
```

**Script de entrypoint:** [`dockerfiles/ubbase/admin/tiamatstart.sh`](matias-proyect/estanco/docker/estanco/dockerfiles/ubbase/admin/tiamatstart.sh)

Este script ejecuta en orden:
1. [`mainuser.sh`](matias-proyect/estanco/docker/estanco/dockerfiles/ubbase/admin/usuario/mainuser.sh) - Crea usuario `tiamat` con contraseña `1234`
2. [`mainssh.sh`](matias-proyect/estanco/docker/estanco/dockerfiles/ubbase/admin/ssh/mainssh.sh) - Configura SSH (puerto, clave pública)
3. [`mainsudo.sh`](matias-proyect/estanco/docker/estanco/dockerfiles/ubbase/admin/sudo/mainsudo.sh) - Añade usuario a sudoers

### 1.3. Dockerfile 2: `ubseguridad/tiamatubseguridad` (Capa de Seguridad)

**Propósito:** Añade herramientas de seguridad y hardening.

**Archivo:** [`dockerfiles/ubseguridad/tiamatubseguridad`](matias-proyect/estanco/docker/estanco/dockerfiles/ubseguridad/tiamatubseguridad)

```dockerfile
FROM TiamatV1/ubbase01

# Herramientas de seguridad
RUN apt-get update && apt-get install -y iptables nmap

# Script de seguridad
COPY ./dockerfiles/ubseguridad/admin/ /root/admin/ubseguridad/
RUN chmod +x /root/admin/ubseguridad/tiamatstart.sh

ENTRYPOINT ["./tiamatstart.sh"]
```

**Script de entrypoint:** [`dockerfiles/ubseguridad/admin/tiamatstart.sh`](matias-proyect/estanco/docker/estanco/dockerfiles/ubseguridad/admin/tiamatstart.sh)

Funciones:
- `tiamatload_ciber()` - Carga reglas de iptables (firewall)
- `tiamatscan()` - Escanea puertos abiertos

### 1.4. Dockerfile 3: `sweb/nginx/tiamatnginx` (Capa Nginx)

**Propósito:** Añade Nginx como servidor web/proxy inverso.

**Archivo:** [`dockerfiles/sweb/nginx/tiamatnginx`](matias-proyect/estanco/docker/estanco/dockerfiles/sweb/nginx/tiamatnginx)

```dockerfile
FROM TiamatV1/ubseguridad01

RUN apt-get update && apt-get install -y nginx
COPY ./dockerfiles/sweb/nginx/admin/ /root/admin/sweb/nginx/
RUN chmod +x /root/admin/sweb/nginx/tiamatstart.sh

ENTRYPOINT ["./tiamatstart.sh"]
```

**Script de entrypoint:** [`dockerfiles/sweb/nginx/admin/tiamatstart.sh`](matias-proyect/estanco/docker/estanco/dockerfiles/sweb/nginx/admin/tiamatstart.sh)

Carga el entrypoint de seguridad y arranca Nginx.

### 1.5. Dockerfile 4: `postgre/tiamatpostgre` (Base de Datos)

**Propósito:** PostgreSQL 16 para la aplicación.

**Archivo:** [`dockerfiles/postgre/tiamatpostgre`](matias-proyect/estanco/docker/estanco/dockerfiles/postgre/tiamatpostgre)

```dockerfile
FROM TiamatV1/ubseguridad01

RUN apt-get update && apt-get install -y postgresql postgresql-client
COPY ./dockerfiles/postgre/admin/ /root/admin/postgre/
RUN chmod +x /root/admin/postgre/tiamatstart.sh

USER postgres
ENTRYPOINT ["./tiamatstart.sh"]
```

**Script de entrypoint:** [`dockerfiles/postgre/admin/tiamatstart.sh`](matias-proyect/estanco/docker/estanco/dockerfiles/postgre/admin/tiamatstart.sh)

Inicializa el clúster de PostgreSQL, configura acceso remoto, crea base de datos y usuario.

### 1.6. Dockerfile 5: `nest/tiamatrestaurante` (Backend NestJS)

**Propósito:** Backend de la aplicación de restaurante con NestJS.

**Archivo:** [`dockerfiles/nest/tiamatrestaurante`](matias-proyect/estanco/docker/estanco/dockerfiles/nest/tiamatrestaurante)

```dockerfile
FROM TiamatV1/nginx101

# Instalar Node.js 22
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -y nodejs

# Copiar proyecto NestJS
COPY ./proyecto/prestaurante/estanco-arboleas-backend/ /root/admin/node/proyectos/restaurante_backend/

# Copiar entrypoint
COPY ./dockerfiles/nest/admin/tiamatstart.sh .
RUN chmod +x /root/admin/node/tiamatstart.sh

ENTRYPOINT [ "./tiamatstart.sh" ]
```

**Script de entrypoint:** [`dockerfiles/nest/admin/tiamatstart.sh`](matias-proyect/estanco/docker/estanco/dockerfiles/nest/admin/tiamatstart.sh)

Flujo de ejecución:
1. Carga entrypoint de Nginx
2. Carga entrypoint de seguridad
3. Cambia al directorio del proyecto NestJS
4. Instala dependencias (`npm install`)
5. Compila TypeScript a JavaScript (`npm run build`)
6. Ejecuta seed de base de datos (`npm run seed`)
7. Arranca servidor en producción (`npm run start:prod`)

### 1.7. Dockerfile 6: `nginxrestaurante/tiamatnginxrestaurante` (Frontend Next.js)

**Propósito:** Frontend de la aplicación de restaurante con Next.js.

**Archivo:** [`dockerfiles/nginxrestaurante/tiamatnginxrestaurante`](matias-proyect/estanco/docker/estanco/dockerfiles/nginxrestaurante/tiamatnginxrestaurante)

```dockerfile
FROM TiamatV1/nginx101

# Instalar Node.js 22
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
RUN apt-get install -y nodejs

# Copiar proyecto Next.js
COPY ./proyecto/prestaurante/estanco-arboleas-frontend/ /root/admin/node/proyectos/restaurante_frontend/

# Copiar entrypoint
COPY ./dockerfiles/nginxrestaurante/admin/tiamatstart.sh .
RUN chmod +x ./tiamatstart.sh

ENTRYPOINT ["./tiamatstart.sh"]
```

**Script de entrypoint:** [`dockerfiles/nginxrestaurante/admin/tiamatstart.sh`](matias-proyect/estanco/docker/estanco/dockerfiles/nginxrestaurante/admin/tiamatstart.sh)

Flujo de ejecución:
1. Carga entrypoint base (SSH, usuario, sudo)
2. Carga entrypoint de Nginx
3. Cambia al directorio del proyecto Next.js
4. Instala dependencias y construye (`npm run build`)
5. Arranca Next.js en segundo plano
6. Arranca Nginx en primer plano (mantiene el contenedor vivo)

### 1.8. Dockerfiles Adicionales

#### `next/dockerfile`
**Propósito:** Aplicación Next.js independiente (pokeapi_next).

**Archivo:** [`dockerfiles/next/dockerfile`](matias-proyect/estanco/docker/estanco/dockerfiles/next/dockerfile)

```dockerfile
FROM TiamatV1/nginx101
# Instala Node.js 22 y copia proyecto next_app
COPY ./proyecto/next_app/ /root/admin/node/proyectos/next_app/
ENTRYPOINT ["./start.sh"]
```

#### `nginxpokeapinext/dockerfile`
**Propósito:** Aplicación PokeAPI con Next.js.

**Archivo:** [`dockerfiles/nginxpokeapinext/dockerfile`](matias-proyect/estanco/docker/estanco/dockerfiles/nginxpokeapinext/dockerfile)

```dockerfile
FROM TiamatV1/nginx101
# Instala Node.js 22 y copia proyecto pokeapi_next
COPY ./proyecto/pokeapi_next/ /root/admin/node/proyectos/pokeapi_next/
ENTRYPOINT ["./start.sh"]
```

### 1.9. Docker Compose - Orden de Construcción

Los docker-compose.yml están organizados en carpetas separadas (`pbase/`, `pseguridad/`, `pnginx/`, `pnode/`, `pnode_next/`, `ppostgre/`, `nest_api/`). Cada uno despliega un servicio específico.

**Ejemplo** - [`pbase/deploy/docker-compose.yml`](matias-proyect/estanco/docker/estanco/proyecto/pbase/deploy/docker-compose.yml):

```yaml
services:
  ubbase:
    build:
      context: /home/TiamatV1/proyecto_tfg/docker/megacrossover/
      dockerfile: ./dockerfiles/ubbase/tiamatubbase
    image: TiamatV1/ubbase01
    container_name: cttiamatbase
    ports:
      - "22452:22452"
    volumes:
      - /home/TiamatV1/proyecto_tfg/docker/megacrossover/common:/root/admin
```

**Nota:** Todos los contextos apuntan a la misma ruta base: `/home/TiamatV1/proyecto_tfg/docker/megacrossover/`

---

## 2. Helm Chart Completo

### 2.1. Estructura del Chart

```
personal/estanco/
├── Chart.yaml          # Metadatos del chart
├── values.yaml         # Valores configurables
├── templates/
│   ├── _helpers.tpl    # Funciones auxiliares (naming)
│   ├── backend.yaml    # Deployment + Service del backend
│   ├── frontend.yaml   # Deployment + Service del frontend
│   ├── postgres.yaml   # StatefulSet + Service de PostgreSQL
│   └── ingress.yaml    # Ingress (deshabilitado, usamos NodePort)
└── .helmignore         # Archivos a ignorar
```

### 2.2. `Chart.yaml` - Metadatos

**Archivo:** [`personal/estanco/Chart.yaml`](matias-proyect/estanco/docker/estanco/proyecto/personal/estanco/Chart.yaml)

```yaml
apiVersion: v2
name: restaruante
description: A Helm chart for Kubernetes
type: application
version: 0.1.0
appVersion: "1.16.0"
```

### 2.3. `values.yaml` - Valores Configurables

**Archivo:** [`personal/estanco/values.yaml`](matias-proyect/estanco/docker/estanco/proyecto/personal/estanco/values.yaml)

```yaml
global:
  iniciales: tiamat
  domain: ""  # Sin dominio, se accede por IP:NodePort

postgres:
  name: postgre01
  image:
    repository: TiamatV1/postgre01
    tag: latest
  auth:
    database: tienda_online
    username: postgres
    password: usuario
  service:
    port: 5432
  persistence:
    enabled: true
    size: 1Gi
    storageClassName: "microk8s-hostpath"

backend:
  name: restaurante-backend
  image:
    repository: TiamatV1/restaurante_backend01
    tag: latest
  replicas: 1
  containerPort: 3000
  ssh:
    port: 3456
    nodePort: 30556
  service:
    type: NodePort
    port: 3000
    nodePort: 30100

frontend:
  name: restaurante-frontend
  image:
    repository: TiamatV1/restaurante_frontend01
    tag: latest
  replicas: 1
  containerPort: 3000
  nginxPort: 80
  apiUrl: "http://31.222.114.57:30100"  # IP del VPS
  ssh:
    port: 3456
    nodePort: 30557
  service:
    type: NodePort
    port: 3000
    nodePort: 30180

ingress:
  enabled: false  # Deshabilitado, usamos NodePort
```

### 2.4. Templates

#### `backend.yaml` - Backend Deployment + Service

**Archivo:** [`personal/estanco/templates/backend.yaml`](matias-proyect/estanco/docker/estanco/proyecto/personal/estanco/templates/backend.yaml)

**Deployment:**
- Nombre: `restaurante-backend`
- Imagen: `TiamatV1/restaurante_backend01:latest`
- Puertos: 3000 (HTTP), 3456 (SSH)
- Variables de entorno: DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD (desde values.yaml)

**Service (NodePort):**
- Puerto HTTP: 3000 → NodePort `30100`
- Puerto SSH: 3456 → NodePort `30556`
- Tipo: NodePort (accesible desde fuera del clúster)

#### `frontend.yaml` - Frontend Deployment + Service

**Archivo:** [`personal/estanco/templates/frontend.yaml`](matias-proyect/estanco/docker/estanco/proyecto/personal/estanco/templates/frontend.yaml)

**Deployment:**
- Nombre: `restaurante-frontend`
- Imagen: `TiamatV1/restaurante_frontend01:latest`
- Puertos: 3000 (Next.js), 80 (Nginx), 3456 (SSH)
- Variable de entorno: `NEXT_PUBLIC_API_URL=http://31.222.114.57:30100`

**Service (NodePort):**
- Puerto HTTP: 3000 → NodePort `30180`
- Puerto SSH: 3456 → NodePort `30557`
- Tipo: NodePort

#### `postgres.yaml` - PostgreSQL StatefulSet + Service

**Archivo:** [`personal/estanco/templates/postgres.yaml`](matias-proyect/estanco/docker/estanco/proyecto/personal/estanco/templates/postgres.yaml)

**StatefulSet:**
- Nombre: `postgre01`
- Imagen: `TiamatV1/postgre01:latest`
- 1 réplica (base de datos stateful)
- Variables de entorno: POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, PGDATA
- Volumen persistente: 1Gi con `microk8s-hostpath`

**Service (Headless - ClusterIP: None):**
- Puerto: 5432
- Sin IP de clúster (headless), usado para descubrimiento de DNS

#### `ingress.yaml` - Ingress (Deshabilitado)

**Archivo:** [`personal/estanco/templates/ingress.yaml`](matias-proyect/estanco/docker/estanco/proyecto/personal/estanco/templates/ingress.yaml)

```yaml
{{- if .Values.ingress.enabled -}}
# ... contenido del Ingress ...
{{- end }}
```

El Ingress está **deshabilitado** (`ingress.enabled: false`). Se accede a los servicios mediante **NodePort** directamente con la IP del VPS.

### 2.5. Comandos de Despliegue con Helm

```bash
# Desplegar el chart
helm install restaurante ./personal/estanco --namespace proyecto-nest --create-namespace

# Actualizar el chart tras cambios
helm upgrade restaurante ./personal/estanco --namespace proyecto-nest

# Ver el estado
helm status restaurante --namespace proyecto-nest

# Listar releases
helm list --namespace proyecto-nest

# Desinstalar
helm uninstall restaurante --namespace proyecto-nest
```

### 2.6. Puertos de Acceso (NodePort)

| Servicio | Puerto Interno | NodePort | Acceso desde fuera |
|----------|---------------|----------|-------------------|
| Backend (API) | 3000 | **30100** | `http://31.222.114.57:30100` |
| Backend (SSH) | 3456 | **30556** | `ssh -p 30556 tiamat@31.222.114.57` |
| Frontend (Web) | 3000 | **30180** | `http://31.222.114.57:30180` |
| Frontend (SSH) | 3456 | **30557** | `ssh -p 30557 tiamat@31.222.114.57` |
| PostgreSQL | 5432 | Interno (ClusterIP) | Solo desde pods del clúster |

---

## 3. Alta Disponibilidad en Kubernetes

### 3.1. Concepto

La alta disponibilidad (HA) en Kubernetes permite que una aplicación siga funcionando incluso cuando uno o más pods fallan. Esto se logra mediante:

1. **Múltiples réplicas** en el Deployment
2. **Health checks** (readiness/liveness probes)
3. **Service** que balancea el tráfico entre pods
4. **ReplicationController** que reemplaza pods fallidos automáticamente

### 3.2. Demostración: Matar un Pod y el Servicio No Cae

#### Escenario

Tenemos un Deployment con **3 réplicas** del backend. El Service balancea el tráfico entre ellas. Si matamos un pod, Kubernetes lo reemplaza automáticamente y el servicio sigue respondiendo.

**Archivo de ejemplo** - [`deploypokeapi.yml`](matias-proyect/estanco/docker/estanco/proyecto/kubernetes/kubernetes/deploypokeapi.yml):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pokeapi-deployment
  namespace: proyecto-nest
spec:
  replicas: 3  # 3 réplicas para alta disponibilidad
  selector:
    matchLabels:
      app: pokeapi
  template:
    metadata:
      labels:
        app: pokeapi
    spec:
      containers:
      - name: pokeapi
        image: TiamatV1/nginxpokeapi:latest
        ports:
        - containerPort: 3001
        - containerPort: 22452
```

#### Procedimiento de Demostración

**Paso 1: Verificar el estado inicial**

```bash
# Ver los pods en ejecución
kubectl get pods -n proyecto-nest

# Output esperado:
# NAME                                  READY   STATUS    RESTARTS   AGE
# pokeapi-deployment-7d4f9c8b6f-abc12   1/1     Running   0          5m
# pokeapi-deployment-7d4f9c8b6f-def34   1/1     Running   0          5m
# pokeapi-deployment-7d4f9c8b6f-ghi56   1/1     Running   0          5m
```

**Paso 2: Verificar que el servicio responde**

```bash
# Obtener la IP del servicio
kubectl get svc -n proyecto-nest

# Probar el servicio (desde dentro del clúster)
curl http://pokeapi-service:3001/api/health

# O desde fuera (por NodePort)
curl http://31.222.114.57:30100/api/health
```

**Paso 3: Matar un pod**

```bash
# Eliminar un pod específico
kubectl delete pod pokeapi-deployment-7d4f9c8b6f-abc12 -n proyecto-nest

# Output:
# pod "pokeapi-deployment-7d4f9c8b6f-abc12" deleted
```

**Paso 4: Verificar que el servicio sigue respondiendo INMEDIATAMENTE**

```bash
# Durante la eliminación, el servicio sigue respondiendo
# porque los otros 2 pods siguen activos
curl http://31.222.114.57:30100/api/health

# Respuesta: OK (el servicio no cayó)
```

**Paso 5: Verificar que Kubernetes reemplaza el pod automáticamente**

```bash
# Ver los pods (el pod eliminado se está reemplazando)
kubectl get pods -n proyecto-nest -w

# Output:
# NAME                                  READY   STATUS        RESTARTS   AGE
# pokeapi-deployment-7d4f9c8b6f-def34   1/1     Running       0          5m
# pokeapi-deployment-7d4f9c8b6f-ghi56   1/1     Running       0          5m
# pokeapi-deployment-7d4f9c8b6f-jkl78   0/1     ContainerCreating   0          2s
# pokeapi-deployment-7d4f9c8b6f-jkl78   1/1     Running       0          10s
```

**Paso 6: Verificar el nuevo pod**

```bash
# El nuevo pod tiene un nombre diferente (nuevo UID)
kubectl get pods -n proyecto-nest

# Output:
# NAME                                  READY   STATUS    RESTARTS   AGE
# pokeapi-deployment-7d4f9c8b6f-def34   1/1     Running   0          6m
# pokeapi-deployment-7d4f9c8b6f-ghi56   1/1     Running   0          6m
# pokeapi-deployment-7d4f9c8b6f-jkl78   1/1     Running   0          30s
```

### 3.3. Explicación Técnica

**¿Por qué el servicio no cae?**

1. **El Service de Kubernetes** actúa como balanceador de carga. Cuando hay múltiples pods con la misma etiqueta (`app: pokeapi`), el Service distribuye el tráfico entre todos ellos.

2. **El ReplicaSet** (creado por el Deployment) monitoriza constantemente el número de pods. Si detecta que hay menos réplicas de las especificadas (3), crea un nuevo pod automáticamente.

3. **Mecanismo de reemplazo:**
   ```
   Pod eliminado → Service deja de enviar tráfico a ese pod
                 → Los otros 2 pods siguen sirviendo
                 → ReplicaSet detecta la diferencia (2 < 3)
                 → Crea un nuevo pod
                 → Service comienza a enviar tráfico al nuevo pod
   ```

4. **Tiempo de recuperación:** Aproximadamente 10-30 segundos para que el nuevo pod esté listo. Durante ese tiempo, el servicio funciona con los pods restantes.

### 3.4. Configuración Recomendada para Producción

Para una alta disponibilidad real en producción:

```yaml
# En values.yaml del Helm chart
backend:
  replicas: 3  # Mínimo 3 para HA
  # ... resto de configuración

# Añadir health checks en el Deployment
# (en backend.yaml template)
livenessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

### 3.5. Comandos Útiles para Monitorización

```bash
# Ver pods en tiempo real (-w = watch)
kubectl get pods -n proyecto-nest -w

# Ver logs de un pod específico
kubectl logs -f pokeapi-deployment-7d4f9c8b6f-def34 -n proyecto-nest

# Ver eventos del namespace
kubectl get events -n proyecto-nest --sort-by='.lastTimestamp'

# Ver detalles del servicio
kubectl describe svc pokeapi-service -n proyecto-nest

# Escalar manualmente (si no se usa Helm)
kubectl scale deployment pokeapi-deployment --replicas=5 -n proyecto-nest

# Ver el estado de los endpoints (a qué pods dirige el service)
kubectl get endpoints -n proyecto-nest
```

---

## Anexo: Despliegue Completo en VPS

### Requisitos Previos

- VPS con MicroK8s instalado
- Docker instalado en el VPS
- Helm instalado
- Acceso SSH al VPS

### Pasos para Desplegar

```bash
# 1. Conectarse al VPS por SSH
ssh tiamat@31.222.114.57

# 2. Clonar/actualizar el repositorio
cd /home/TiamatV1/proyecto_tfg/docker/megacrossover/
git pull origin main

# 3. Construir las imágenes Docker (orden jerárquico)
docker build -f ./dockerfiles/ubbase/tiamatubbase -t TiamatV1/ubbase01 .
docker build -f ./dockerfiles/ubseguridad/tiamatubseguridad -t TiamatV1/ubseguridad01 .
docker build -f ./dockerfiles/sweb/nginx/tiamatnginx -t TiamatV1/nginx101 .
docker build -f ./dockerfiles/postgre/tiamatpostgre -t TiamatV1/postgre01 .
docker build -f ./dockerfiles/nest/tiamatrestaurante -t TiamatV1/restaurante_backend01 .
docker build -f ./dockerfiles/nginxrestaurante/tiamatnginxrestaurante -t TiamatV1/restaurante_frontend01 .

# 4. Subir imágenes a Docker Hub (opcional, para MicroK8s)
docker push TiamatV1/ubbase01
docker push TiamatV1/ubseguridad01
docker push TiamatV1/nginx101
docker push TiamatV1/postgre01
docker push TiamatV1/restaurante_backend01
docker push TiamatV1/restaurante_frontend01

# 5. Desplegar con Helm
helm install restaurante ./personal/estanco --namespace proyecto-nest --create-namespace

# 6. Verificar el despliegue
kubectl get all -n proyecto-nest

# 7. Probar el acceso
curl http://31.222.114.57:30100/api/health
curl http://31.222.114.57:30180
```
