import { Controller, Get, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('users')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  obtenerPerfil(@Request() req) {
    return this.usuarioService.encontrarPorId(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  obtenerTodos() {
    return this.usuarioService.encontrarTodos();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id/role')
  actualizarRol(@Param('id') id: string, @Body('rol') rol: string) {
    return this.usuarioService.actualizarRol(+id, rol);
  }
}
