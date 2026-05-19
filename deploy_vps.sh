#!/bin/bash
# ============================================================
# SCRIPT DE DESPLIEGUE AUTOMÁTICO EN VPS
# Proyecto: Docker + Kubernetes + Helm + NestJS + Next.js
# ============================================================
# EJECUTAR COMO ROOT EN EL VPS:
#   chmod +x deploy_vps.sh && ./deploy_vps.sh
# ============================================================

set -e  # Salir si hay error

echo "========================================"
echo "  INICIANDO DESPLIEGUE DEL PROYECTO"
echo "========================================"

# ============================================================
# CONFIGURACIÓN
# ============================================================
GITHUB_REPO="https://github.com/5chitt4k3r-ux/mi-proyecto.git"
PROYECTO_DIR="/home/TiamatV1/proyecto_tfg"
MEGA_DIR="$PROYECTO_DIR/docker/megacrossover"
DOCKER_USER="TiamatV1"
VPS_IP="31.222.114.57"
DOMAIN="vuelaguadalinfo.eu"

# ============================================================
# PASO 1: CLONAR EL REPOSITORIO
# ============================================================
echo ""
echo "[1/7] Clonando repositorio desde GitHub..."

if [ -d "$PROYECTO_DIR" ]; then
    echo "  El directorio $PROYECTO_DIR ya existe. Haciendo backup..."
    mv "$PROYECTO_DIR" "${PROYECTO_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
fi

git clone "$GITHUB_REPO" "$PROYECTO_DIR"
cd "$PROYECTO_DIR"
echo "  ✅ Repositorio clonado correctamente"

# ============================================================
# PASO 2: CREAR ESTRUCTURA DE DIRECTORIOS
# ============================================================
echo ""
echo "[2/7] Creando estructura de directorios para los proyectos..."

mkdir -p "$MEGA_DIR/proyecto/prestaurante/estanco-arboleas-backend"
mkdir -p "$MEGA_DIR/proyecto/prestaurante/estanco-arboleas-frontend"
mkdir -p "$MEGA_DIR/proyecto/nest_api/proyecto"
echo "  ✅ Directorios creados"

# ============================================================
# PASO 3: COPIAR PROYECTOS A RUTAS DE DOCKERFILES
# ============================================================
echo ""
echo "[3/7] Copiando proyectos a las rutas que esperan los dockerfiles..."

# NOTA: Los proyectos deben estar en el repositorio de GitHub
# Si están en el mismo repo, ya están en las rutas correctas
# Si están en otro lado, descomenta las líneas siguientes y ajusta las rutas

# cp -r /ruta/original/estanco-arboleas-backend/* "$MEGA_DIR/proyecto/prestaurante/estanco-arboleas-backend/"
# cp -r /ruta/original/estanco-arboleas-frontend/* "$MEGA_DIR/proyecto/prestaurante/estanco-arboleas-frontend/"
# cp -r /ruta/original/nest_api/proyecto/* "$MEGA_DIR/proyecto/nest_api/proyecto/"

echo "  ✅ Proyectos copiados (si estaban en el repo)"

# ============================================================
# PASO 4: CONSTRUIR Y SUBIR IMÁGENES DOCKER
# ============================================================
echo ""
echo "[4/7] Construyendo y subiendo imágenes Docker..."
echo "  ⚠️  Asegúrate de haber hecho 'docker login' manualmente antes:"
echo "    docker login --username TiamatV1"
echo ""

build_and_push() {
    local name=$1
    local path=$2
    echo ""
    echo "  --- Construyendo $name ---"
    cd "$path"
    docker-compose build
    echo "  --- Subiendo $name a Docker Hub ---"
    docker-compose push
    echo "  ✅ $name completado"
}

build_and_push "ubbase (imagen base)" "$MEGA_DIR/pbase/deploy"
build_and_push "ubseguridad (seguridad)" "$MEGA_DIR/pseguridad/deploy"
build_and_push "nginx" "$MEGA_DIR/pnginx/deploy"
build_and_push "postgresql" "$MEGA_DIR/ppostgre/deploy"
build_and_push "backend nestjs (restaurante)" "$MEGA_DIR/pnode/deploy"
build_and_push "frontend nextjs (restaurante)" "$MEGA_DIR/pnode_next/deploy"
build_and_push "nginx pokeapi" "$MEGA_DIR/nest_api/deploy"

echo ""
echo "  ✅ Todas las imágenes construidas y subidas"

# ============================================================
# PASO 5: DESPLEGAR CON HELM
# ============================================================
echo ""
echo "[5/7] Desplegando con Helm en MicroK8s..."

# Verificar que MicroK8s está funcionando
echo "  Verificando MicroK8s..."
microk8s status --wait-ready 2>/dev/null || {
    echo "  ⚠️  MicroK8s no está funcionando. Intentando habilitar..."
    microk8s enable helm3 dns storage ingress
}

# Navegar al chart de Helm
cd "$MEGA_DIR/personal/estanco"

# Verificar si ya existe un despliegue
if microk8s helm3 list -n proyecto-nest 2>/dev/null | grep -q "restaruante"; then
    echo "  El despliegue 'restaruante' ya existe. Actualizando..."
    microk8s helm3 upgrade restaruante . --namespace proyecto-nest
else
    echo "  Instalando 'restaruante' por primera vez..."
    microk8s helm3 install restaruante . --namespace proyecto-nest --create-namespace
fi

echo "  ✅ Helm desplegado correctamente"

# ============================================================
# PASO 6: VERIFICAR EL DESPLIEGUE
# ============================================================
echo ""
echo "[6/7] Verificando el despliegue..."

echo ""
echo "========================================"
echo "  P O D S"
echo "========================================"
microk8s kubectl get pods -n proyecto-nest

echo ""
echo "========================================"
echo "  S E R V I C I O S"
echo "========================================"
microk8s kubectl get svc -n proyecto-nest

echo ""
echo "========================================"
echo "  I N G R E S S"
echo "========================================"
microk8s kubectl get ingress -n proyecto-nest

echo ""
echo "========================================"
echo "  DESPLIEGUE COMPLETADO CON ÉXITO"
echo "========================================"
echo ""
echo "  Accede a tu proyecto en:"
echo "  - https://$DOMAIN"
echo "  - https://www.$DOMAIN"
echo "  - https://api.$DOMAIN"
echo ""
echo "  Para ver los logs de un pod:"
echo "    microk8s kubectl logs -n proyecto-nest -l app=restaurante-backend"
echo "    microk8s kubectl logs -n proyecto-nest -l app=restaurante-frontend"
echo ""
echo "  Para probar alta disponibilidad:"
echo "    microk8s kubectl delete pod -n proyecto-nest -l app=restaurante-backend"
echo "    microk8s kubectl get pods -n proyecto-nest -w"
echo ""
echo "========================================"
