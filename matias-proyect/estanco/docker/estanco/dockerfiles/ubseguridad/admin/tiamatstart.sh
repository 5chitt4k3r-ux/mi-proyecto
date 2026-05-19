#!/bin/bash
set -e
load_entrypoint_base(){
    bash /root/admin/base/tiamatstart.sh
}

tiamatload_ciber(){
    LOG_DIR="/root/logs"
    LOG_FILE="$LOG_DIR/cttiamatrestaurante_ports.log"
    
    echo "=== PORT AUDITORIO ===" >> "$LOG_FILE"
    echo "Container: ${CONTENEDOR}" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"

    echo "--- Listening TCP/UDP ports ---" >> "$LOG_FILE"
    ss -tulnp >> "$LOG_FILE" 2>&1
    
    echo "" >> "$LOG_FILE"
    echo "--- Exposed enviroment ports ---" >> "$LOG_FILE"
    printenv | grep -i port >> "$LOG_FILE" 2>/dev/null || true

    echo "" >> "$LOG_FILE"
    echo "=== END AUDITORIa ===" >> "$LOG_FILE"

}

tiamatscan(){
    while true; do
        tiamatload_ciber
        sleep 30
    done
}

main () {
    touch /root/logs/cttiamatrestaurante_ports.log
    load_entrypoint_base
    tiamatscan &
}

main