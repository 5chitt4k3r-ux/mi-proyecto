#!/bin/bash

LOG_DIR="/root/logs"
LOG_FILE="$LOG_DIR/informe_next_app.log"

log() {
    echo "$1"
    echo "$1" >> "$LOG_FILE"
}

load_entrypoint_nginx(){
    log "Cargando entrypoint Nginx..."
    
    if [ -f /root/admin/sweb/nginx/tiamatstart.sh ]; then
        bash /root/admin/sweb/nginx/tiamatstart.sh || log "ADVERTENCIA: Entrypoint Nginx falló, continuando..."
        log "Entrypoint Nginx ejecutado"
    else
        log "ADVERTENCIA: tiamatstart.sh de Nginx no encontrado"
    fi
}

directorio_de_trabajo(){
    log "Cambiando directorio al proyecto Next.js..."

    if cd /root/admin/node/proyectos/next_app; then
        log "Directorio cambiado a: $(pwd)"
    else
        log "ERROR: No se pudo cambiar al directorio del proyecto Next.js"
        exit 1
    fi
}

construir_y_arrancar(){
    log "Usando API URL: $NEXT_PUBLIC_API_URL"
    export NEXT_PUBLIC_API_URL
    
    log "Limpiando node_modules previos e instalando dependencias..."
    rm -rf node_modules
    npm install
    
    # Asegurar permisos de ejecución para los binarios de node_modules
    chmod -R +x node_modules/.bin
    
    # Construir proyecto Next.js
    if npm run build; then
        log "Proyecto Next.js construido"
    else
        log "ERROR: Falló npm run build"
        exit 1
    fi
    
    # Arrancar Next.js en segundo plano
    log "Arrancando Next.js en segundo plano..."
    HOST=0.0.0.0 PORT=3000 npm start &
}

cargar_nginx(){
    log "Configurando Nginx..."
    
    # Verificar configuración de Nginx
    nginx -t 2>&1 || log "ADVERTENCIA: nginx -t falló"
    # Iniciar Nginx en primer plano (mantiene el contenedor vivo)
    log "Nginx arrancando en primer plano..."
    nginx -g 'daemon off;'
}

load_entrypoint_base(){
    log "Cargando entrypoint base (SSH, usuario, sudo)..."
    if [ -f /root/admin/base/tiamatstart.sh ]; then
        bash /root/admin/base/tiamatstart.sh || log "ADVERTENCIA: Entrypoint base falló, continuando..."
        log "Entrypoint base ejecutado"
    else
        log "ADVERTENCIA: tiamatstart.sh de base no encontrado"
    fi
}

main(){
    mkdir -p "$LOG_DIR"
    touch "$LOG_FILE"
    log "=== Iniciando contenedor Next.js App ==="
    log "Fecha: $(date)"
    load_entrypoint_base
    load_entrypoint_nginx
    directorio_de_trabajo
    construir_y_arrancar
    cargar_nginx
}

main
