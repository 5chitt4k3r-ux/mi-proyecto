import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  getInfo() {
    return {
      message: 'Endpoints de autenticación',
      login: { metodo: 'POST', ruta: '/auth/login', body: { email: 'string', password: 'string' } },
      register: { metodo: 'POST', ruta: '/auth/register', body: { nombre: 'string', email: 'string', password: 'string' } },
    };
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body() body: { nombre: string; email: string; password: string },
  ) {
    return this.authService.register(body.nombre, body.email, body.password);
  }
}
