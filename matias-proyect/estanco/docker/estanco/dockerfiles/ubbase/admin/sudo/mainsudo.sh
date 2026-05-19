#!/bin/bash

configurar_sudo() {
  echo "Configurando sudo para tiamat..." >> /root/logs/informe.log
  
  # Solo crear si el directorio existe
  if [ -d /etc/sudoers.d ]; then
    echo "tiamat ALL=(ALL) NOPASSWD: ALL" > "/etc/sudoers.d/tiamat"
    chmod 0440 "/etc/sudoers.d/tiamat"
    echo "Sudo configurado" >> /root/logs/informe.log
  else
    echo "ERROR: /etc/sudoers.d no existe" >> /root/logs/informe.log
  fi
}