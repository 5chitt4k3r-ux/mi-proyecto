#!/bin/bash

LOG_DIR="/root/logs"
LOG_FILE="$LOG_DIR/informe_postgre.log"

# =============================================
# Valores de configuración de PostgreSQL
# =============================================
PG_USER="postgres"
PG_PASSWORD="usuario"
PG_DATABASE="tienda_online"
PG_PORT="5432"

# Detectar versión de PostgreSQL instalada
PG_VERSION=$(ls /usr/lib/postgresql/ | sort -V | tail -1)
PG_BIN="/usr/lib/postgresql/$PG_VERSION/bin"
PGDATA="/var/lib/postgresql/data/pgdata"

log() {
    echo "$1"
    echo "$1" >> "$LOG_FILE"
}

# =============================================
# Cargar entrypoint de la capa anterior (ubseguridad)
# =============================================
load_entrypoint_seguridad() {
    log "Ejecutando entrypoint seguridad..."

    if [ -f /root/admin/ubseguridad/tiamatstart.sh ]; then
        bash /root/admin/ubseguridad/tiamatstart.sh || log "ADVERTENCIA: Entrypoint seguridad falló, continuando..."
        log "Entrypoint seguridad ejecutado"
    else
        log "ADVERTENCIA: No se encontró /root/admin/ubseguridad/tiamatstart.sh"
    fi
}

# =============================================
# Inicializar cluster de PostgreSQL
# =============================================
inicializar_cluster() {
    if [ ! -f "$PGDATA/PG_VERSION" ]; then
        log "Inicializando cluster PostgreSQL (v$PG_VERSION)..."
        su - postgres -c "$PG_BIN/initdb -D $PGDATA" || { log "ERROR: Falló initdb"; return 1; }
        log "Cluster inicializado"
    else
        log "Cluster PostgreSQL ya existe, saltando inicialización"
    fi
}

# =============================================
# Configurar acceso remoto
# =============================================
configurar_acceso() {
    log "Configurando acceso remoto..."

    # Escuchar en todas las interfaces
    sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PGDATA/postgresql.conf"
    sed -i "s/#port = 5432/port = $PG_PORT/" "$PGDATA/postgresql.conf"

    # Permitir conexiones desde cualquier IP con contraseña
    if ! grep -q "host all all 0.0.0.0/0 md5" "$PGDATA/pg_hba.conf"; then
        echo "host all all 0.0.0.0/0 md5" >> "$PGDATA/pg_hba.conf"
    fi

    log "Acceso remoto configurado"
}

# =============================================
# Crear usuario y base de datos
# =============================================
crear_usuario_y_bd() {
    log "Arrancando PostgreSQL temporalmente para configuración..."

    # Arrancar PostgreSQL temporalmente
    su - postgres -c "$PG_BIN/pg_ctl -D $PGDATA start -w -l /var/lib/postgresql/logfile" || { log "ERROR: No se pudo arrancar PostgreSQL"; return 1; }

    # Configurar contraseña del usuario postgres
    su - postgres -c "psql -c \"ALTER USER $PG_USER WITH PASSWORD '$PG_PASSWORD';\"" || log "ADVERTENCIA: Falló alter user"
    log "Contraseña del usuario '$PG_USER' configurada"

    # Crear base de datos si no existe
    su - postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname='$PG_DATABASE'\"" | grep -q 1 || \
    su - postgres -c "psql -c \"CREATE DATABASE $PG_DATABASE OWNER $PG_USER;\"" || log "ADVERTENCIA: Falló crear BD"
    log "Base de datos '$PG_DATABASE' creada/verificada"

    # Otorgar privilegios
    su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE $PG_DATABASE TO $PG_USER;\"" || log "ADVERTENCIA: Falló grant"
    log "Privilegios otorgados a '$PG_USER' sobre '$PG_DATABASE'"

    # Parar PostgreSQL tras la configuración
    su - postgres -c "$PG_BIN/pg_ctl -D $PGDATA stop -w"

    log "Configuración de usuario y BD completada"
}

# =============================================
# Arrancar PostgreSQL en primer plano
# =============================================
arrancar_postgresql_foreground() {
    log "Arrancando PostgreSQL en primer plano..."
    exec su - postgres -c "$PG_BIN/postgres -D $PGDATA"
}

# =============================================
# Main
# =============================================
main() {
    mkdir -p "$LOG_DIR"
    touch "$LOG_FILE"

    log "=== Iniciando capa PostgreSQL (v$PG_VERSION) ==="
    log "Fecha: $(date)"
    log "Usuario: $PG_USER | BD: $PG_DATABASE | Puerto: $PG_PORT"

    load_entrypoint_seguridad
    inicializar_cluster
    configurar_acceso
    crear_usuario_y_bd
    arrancar_postgresql_foreground

    log "=== Capa PostgreSQL configurada correctamente ==="
}

main
