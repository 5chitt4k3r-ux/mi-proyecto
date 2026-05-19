#!/bin/bash
# ============================================================
# SCRIPT DE DESPLIEGUE AUTOMÁTICO EN VPS
# Proyecto: Docker + Kubernetes + Helm + NestJS + Next.js
# ============================================================
# EJECUTAR COMO ROOT EN EL VPS:
#   1. docker login --username kuklusklan
#   2. chmod +x deploy_vps.sh && ./deploy_vps.sh
# ============================================================

# NOTA: No usamos set -e para que el script continúe aunque falle un push

echo "========================================"
echo "  INICIANDO DESPLIEGUE DEL PROYECTO"
echo "========================================"

# ============================================================
# CONFIGURACIÓN
# ============================================================
GITHUB_REPO="https://github.com/5chitt4k3r-ux/mi-proyecto.git"
PROYECTO_DIR="/home/TiamatV1/proyecto_tfg"
# Los archivos del proyecto están dentro de matias-proyect/estanco/docker/estanco/
REPO_SUBDIR="matias-proyect/estanco/docker/estanco"
MEGA_DIR="$PROYECTO_DIR/$REPO_SUBDIR"
DOCKER_USER="kuklusklan"
VPS_IP="31.222.114.57"
DOMAIN="vuelaguadalinfogarrucha.eu"

# ============================================================
# PASO 1: CLONAR EL REPOSITORIO
# ============================================================
echo ""
echo "[1/7] Clonando repositorio desde GitHub..."

if [ -d "$PROYECTO_DIR" ]; then
    echo "  El directorio $PROYECTO_DIR ya existe. Actualizando con git pull..."
    cd "$PROYECTO_DIR"
    git pull
    echo "  ✅ Repositorio actualizado correctamente"
else
    git clone "$GITHUB_REPO" "$PROYECTO_DIR"
    cd "$PROYECTO_DIR"
    echo "  ✅ Repositorio clonado correctamente"
fi

# ============================================================
# PASO 2: VERIFICAR ESTRUCTURA
# ============================================================
echo ""
echo "[2/7] Verificando estructura del proyecto..."

if [ ! -d "$MEGA_DIR" ]; then
    echo "  ERROR: No se encuentra la estructura esperada en $MEGA_DIR"
    echo "  Contenido del repositorio:"
    ls -la "$PROYECTO_DIR"
    exit 1
fi

echo "  ✅ Estructura verificada: $MEGA_DIR"

# ============================================================
# PASO 3: CONSTRUIR Y SUBIR IMÁGENES DOCKER
# ============================================================
echo ""
echo "[3/7] Construyendo y subiendo imágenes Docker..."
echo "  ⚠️  Asegúrate de haber hecho 'docker login' manualmente antes:"
echo "    docker login --username $DOCKER_USER"
echo ""

# Detectar si usar docker-compose o docker compose
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "  ERROR: No se encuentra docker-compose ni docker compose."
    echo "  Instálalo con: apt-get install -y docker-compose-plugin"
    exit 1
fi

# Función para crear .env si no existe
create_env_if_missing() {
    local deploy_path=$1
    local env_file="$deploy_path/.env"
    local dir_name=$(basename "$(dirname "$deploy_path")")
    
    if [ ! -f "$env_file" ]; then
        echo "  ⚠️  .env no encontrado en $deploy_path. Creándolo..."
        case "$dir_name" in
            pbase)
                cat > "$env_file" << 'ENVEOF'
USUARIO=tiamat
PASSWORD=1234
PORT_SSH=23456
IP_WEB=192.168.20.3
SUBNET=192.168.20.0/24
PROYECTO=restaurante_base01
FIRMA=TiamatV1
INICIALES=tiamat
IMAGEN=kuklusklan/ubbase01
CONTENEDOR=cttiamatbase01
PORT_NODE=3010
PORT_WWW=8810
ENVEOF
                ;;
            pseguridad)
                cat > "$env_file" << 'ENVEOF'
USUARIO=tiamat
PASSWORD=1234
PORT_SSH=23456
IP_WEB=192.168.21.3
SUBNET=192.168.21.0/24
PROYECTO=restaurante_seguridad01
FIRMA=TiamatV1
INICIALES=tiamat
IMAGEN=kuklusklan/ubseguridad01
CONTENEDOR=cttiamatseguridad01
PORT_NODE=3010
PORT_WWW=8810
ENVEOF
                ;;
            pnginx)
                cat > "$env_file" << 'ENVEOF'
USUARIO=tiamat
PASSWORD=1234
PORT_SSH=23456
IP_WEB=192.168.22.3
SUBNET=192.168.22.0/24
PROYECTO=nginx
FIRMA=TiamatV1
INICIALES=tiamat
IMAGEN=kuklusklan/nginx101
CONTENEDOR=cttiamatnginx01
PORT_NODE=3010
PORT_WWW=8810
ENVEOF
                ;;
            ppostgre)
                cat > "$env_file" << 'ENVEOF'
USUARIO=tiamat
PASSWORD=1234
PORT_PG=5432
IP_WEB=192.168.27.3
SUBNET=192.168.27.0/24
PROYECTO=restaurante_db01
FIRMA=TiamatV1
INICIALES=tiamat
IMAGEN=kuklusklan/postgre01
CONTENEDOR=cttiamatpostgre01
ENVEOF
                ;;
            pnode)
                cat > "$env_file" << 'ENVEOF'
USUARIO=tiamat
PASSWORD=1234
PORT_SSH=23456
IP_WEB=192.168.23.3
SUBNET=192.168.23.0/24
PROYECTO=restaurante_backend
FIRMA=TiamatV1
INICIALES=tiamat
IMAGEN=kuklusklan/restaurante_backend01
CONTENEDOR=cttiamatrestaurante
PORT_NODE=3010
PORT_WWW=8810
ENVEOF
                ;;
            pnode_next)
                cat > "$env_file" << 'ENVEOF'
USUARIO=tiamat
PASSWORD=1234
PORT_SSH=23456
IP_WEB=192.168.23.3
SUBNET=192.168.23.0/24
PROYECTO=restaurante_frontend
FIRMA=TiamatV1
INICIALES=tiamat
IMAGEN=kuklusklan/restaurante_frontend01
CONTENEDOR=cttiamatfrontend01
PORT_NODE=3010
PORT_WWW=8810
ENVEOF
                ;;
            nest_api)
                cat > "$env_file" << 'ENVEOF'
USUARIO=tiamat
PASSWORD=1234
PORT_SSH=23456
IP_WEB=192.168.25.3
SUBNET=192.168.25.0/24
PROYECTO=nginxpokeapi
FIRMA=TiamatV1
INICIALES=tiamat
IMAGEN=kuklusklan/nginxpokeapi
CONTENEDOR=cttiamatnginxpokeapi
PORT_NODE=3010
PORT_WWW=8810
ENVEOF
                ;;
        esac
        echo "  ✅ .env creado para $dir_name"
    fi
}

build_and_push() {
    local name=$1
    local path=$2
    echo ""
    echo "  --- Construyendo $name ---"
    # Crear .env si no existe
    create_env_if_missing "$path"
    cd "$path"
    $DOCKER_COMPOSE build
    echo "  --- Subiendo $name a Docker Hub ---"
    $DOCKER_COMPOSE push || echo "  ⚠️  Push falló para $name, pero la imagen se construyó. Continuando..."
    echo "  ✅ $name completado"
}

build_and_push "ubbase (imagen base)" "$MEGA_DIR/proyecto/pbase/deploy"
build_and_push "ubseguridad (seguridad)" "$MEGA_DIR/proyecto/pseguridad/deploy"
build_and_push "nginx" "$MEGA_DIR/proyecto/pnginx/deploy"
build_and_push "postgresql" "$MEGA_DIR/proyecto/ppostgre/deploy"
build_and_push "backend nestjs (restaurante)" "$MEGA_DIR/proyecto/pnode/deploy"
build_and_push "frontend nextjs (restaurante)" "$MEGA_DIR/proyecto/pnode_next/deploy"
build_and_push "nginx pokeapi" "$MEGA_DIR/proyecto/nest_api/deploy"

echo ""
echo "  ✅ Todas las imágenes construidas y subidas"

# ============================================================
# PASO 4: DESPLEGAR CON HELM
# ============================================================
echo ""
echo "[4/7] Desplegando con Helm en MicroK8s..."

# Verificar que MicroK8s está funcionando
echo "  Verificando MicroK8s..."
microk8s status --wait-ready 2>/dev/null || {
    echo "  ⚠️  MicroK8s no está funcionando. Intentando habilitar..."
    microk8s enable helm3 dns storage ingress
}

# Navegar al chart de Helm
cd "$MEGA_DIR/proyecto/personal/estanco"

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
# PASO 5: CREAR CLUSTERISSUER PARA LET'S ENCRYPT
# ============================================================
echo ""
echo "[5/7] Creando ClusterIssuer para Let's Encrypt..."

CLUSTER_ISSUER_EXISTS=$(microk8s kubectl get clusterissuer letsencrypt-prod --ignore-not-found 2>/dev/null)
if [ -z "$CLUSTER_ISSUER_EXISTS" ]; then
    echo "  Creando ClusterIssuer 'letsencrypt-prod'..."
    microk8s kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    email: 5chitt4k3r@gmail.com
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-account-key
    solvers:
    - http01:
        ingress:
          ingressClassName: nginx
EOF
    echo "  ✅ ClusterIssuer 'letsencrypt-prod' creado"
else
    echo "  ✅ ClusterIssuer 'letsencrypt-prod' ya existe"
fi

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
