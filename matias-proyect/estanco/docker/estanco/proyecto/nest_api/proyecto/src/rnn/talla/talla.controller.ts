import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TallasService } from './talla.service';

@Controller('tallas')
export class TallasController {
  constructor(private readonly tallasService: TallasService) {}

  @Post()
  async crearProducto(@Body() body: { nombre: string }) {
    return await this.tallasService.crearTalla(body.nombre);
  }

  @Get()
  async obtenerTodos() {
    return await this.tallasService.obtenerTodos();
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: number) {
    return await this.tallasService.obtenerPorId(id);
  }

  @Delete(':id')
  async eliminarTalla(@Param('id') id: number) {
    return await this.tallasService.eliminarTalla(id);
  }
}
