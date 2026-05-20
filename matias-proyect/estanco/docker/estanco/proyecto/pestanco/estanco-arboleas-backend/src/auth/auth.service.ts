import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const usuario = await this.usuarioService.encontrarUno(email);
    if (usuario && (await bcrypt.compare(pass, usuario.password))) {
      const { password, ...result } = usuario;
      return result;
    }
    return null;
  }

  async login(usuario: any) {
    const payload = {
      email: usuario.email,
      sub: usuario.id,
      rol: usuario.rol,
      nombre: usuario.nombre,
    };
    return {
      token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
    };
  }

  async register(nombre: string, email: string, password: string) {
    const usuario = await this.usuarioService.crear(nombre, email, password);
    return this.login(usuario);
  }
}
