#!/bin/bash

load_entrypoint_seguridad() {
    echo "Ejecutando entrypoint seguridad..." >> /root/logs/informe_restaurante_backend.log
    
    if [ -f /root/admin/ubseguridad/tiamatstart.sh ]; then
        bash /root/admin/ubseguridad/tiamatstart.sh
        echo "Entrypoint seguridad ejecutado" >> /root/logs/informe_restaurante_backend.log
    else
        echo "ADVERTENCIA: No se encontró /root/admin/ubseguridad/tiamatstart.sh" >> /root/logs/informe_restaurante_backend.log
    fi
}

load_entrypoint_nginx(){
    echo "Cargando entrypoint Nginx..." >> /root/logs/informe_restaurante_backend.log
    
    if [ -f /root/admin/sweb/nginx/tiamatstart.sh ]; then
        bash /root/admin/sweb/nginx/tiamatstart.sh
        echo "Entrypoint Nginx ejecutado" >> /root/logs/informe_restaurante_backend.log
    else
        echo "ADVERTENCIA: tiamatstart.sh de Nginx no encontrado" >> /root/logs/informe_restaurante_backend.log
    fi
}

workdir(){
    echo "Cambiando directorio al proyecto NestJS..." >> /root/logs/informe_restaurante_backend.log
    
    if [ -d /root/admin/node/proyectos/restaurante_backend ]; then
        cd /root/admin/node/proyectos/restaurante_backend
        echo "Directorio cambiado a: $(pwd)" >> /root/logs/informe_restaurante_backend.log
    else
        echo "ERROR: Directorio /root/admin/node/proyectos/restaurante_backend no existe" >> /root/logs/informe_restaurante_backend.log
        exit 1
    fi
}

dependencias-y-servicio(){
    echo "Instalando dependencias NestJS..." >> /root/logs/informe_restaurante_backend.log
    
    # Verificar si package.json existe
    if [ -f package.json ]; then
        npm install -g npm@11.7.0
        
        # Limpiar node_modules e instalar
        rm -rf node_modules
        npm install && echo "Dependencias instaladas" >> /root/logs/informe_restaurante_backend.log
        
        # Asegurar permisos de ejecución
        chmod -R +x node_modules/.bin
        
        # Compilar el proyecto NestJS (TypeScript -> JavaScript)
        echo "Compilando proyecto NestJS..." >> /root/logs/informe_restaurante_backend.log
        npm run build && echo "Proyecto compilado exitosamente" >> /root/logs/informe_restaurante_backend.log
        
        # Ejecutar el seed antes de arrancar
        echo "Ejecutando seed.ts..." >> /root/logs/informe_restaurante_backend.log
        npm run seed -- -y && echo "Seeding completado" >> /root/logs/informe_restaurante_backend.log
        
        # Iniciar el servidor NestJS en modo producción
        echo "Arrancando NestJS en modo producción..." >> /root/logs/informe_restaurante_backend.log
        HOST=0.0.0.0 npm run start:prod &
    else
        echo "ERROR: package.json no encontrado" >> /root/logs/informe_restaurante_backend.log
        exit 1
    fi
}



main(){
    mkdir -p /root/logs
    touch /root/logs/informe_restaurante_backend.log
    load_entrypoint_nginx
    load_entrypoint_seguridad
    workdir
    dependencias-y-servicio
    tail -f /dev/null
}


main