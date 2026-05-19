#!/bin/bash

comprobar_usuario(){
    if grep -q "^tiamat:" /etc/passwd
    then
        echo "El usuario tiamat ya existe." >> /root/logs/informe.log
        return 1
    else
        echo "El usuario tiamat no existe. Creando usuario..." >> /root/logs/informe.log
        return 0
    fi
}

comprobar_directorio(){
    if [ ! -d "/home/tiamat" ]
    then
        echo "El directorio /home/tiamat no existe." >> /root/logs/informe.log
        return 0
    else
        echo "El directorio /home/tiamat ya existe." >> /root/logs/informe.log
        return 1
    fi
}

crear_usuario(){
    comprobar_usuario
    if [ $? -eq 0 ]
    then
        comprobar_directorio
        if [ $? -eq 0 ]
        then
            useradd -rm -d /home/tiamat -s /bin/bash tiamat
            echo "tiamat:1234" | chpasswd
            echo "Bienvenido tiamat" > /home/tiamat/welcome.txt
            echo "Usuario tiamat creado con éxito." >> /root/logs/informe.log
            return 0
        else
            echo "No se puede crear el usuario tiamat porque el directorio ya existe." >> /root/logs/informe.log
            return 1
        fi
    else
        echo "No se puede crear el usuario tiamat porque ya existe." >> /root/logs/informe.log
        return 1
    fi
}