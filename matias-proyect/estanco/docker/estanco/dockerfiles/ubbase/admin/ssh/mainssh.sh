#!/bin/bash

configurar_ssh() {
  echo "Configurando SSH..." >> /root/logs/informe.log
  # Solo modificar si el archivo existe
  if [ -f /etc/ssh/sshd_config ]; then
  # Deshabilitar el login de root
  sed -i 's/#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
  # Cambiar el puerto de SSH
  sed -i 's/#Port.*/Port 3456/' /etc/ssh/sshd_config
  fi
  
  # Crear directorios
  mkdir -p /run/sshd
  mkdir -p /home/tiamat/.ssh
  
  # Añadir clave si existe
  if [ -f /root/admin/base/common/id_rsa.pub ]; then
    cat /root/admin/base/common/id_rsa.pub >> /home/tiamat/.ssh/authorized_keys
    echo "Clave SSH añadida" >> /root/logs/informe.log
  fi
  
  # Iniciar SSH en background
  if command -v /usr/sbin/sshd &> /dev/null; then
    exec /usr/sbin/sshd -D &
    echo "SSH configurado y funcionando" >> /root/logs/informe.log
  else
    echo "ERROR: sshd no encontrado" >> /root/logs/informe.log
  fi
}