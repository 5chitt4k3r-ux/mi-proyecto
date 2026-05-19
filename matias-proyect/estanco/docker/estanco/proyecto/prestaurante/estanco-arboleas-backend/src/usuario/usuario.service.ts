import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepositorio: Repository<Usuario>,
  ) {}

  async encontrarUno(email: string): Promise<Usuario | null> {
    return this.usuarioRepositorio.findOne({ where: { email } });
  }

  async encontrarPorId(id: number): Promise<Usuario | null> {
    return this.usuarioRepositorio.findOne({ where: { id } });
  }

  async encontrarTodos(): Promise<Usuario[]> {
    return this.usuarioRepositorio.find();
  }

  async crear(nombre: string, email: string, password: string): Promise<Usuario> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const usuario = this.usuarioRepositorio.create({
      nombre,
      email,
      password: hashedPassword,
    });
    return this.usuarioRepositorio.save(usuario);
  }

  async actualizarRol(id: number, rol: string): Promise<Usuario> {
    const usuario = await this.usuarioRepositorio.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    usuario.rol = rol;
    return this.usuarioRepositorio.save(usuario);
  }
}
