import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
export class CarritoController {
  constructor(private carritoService: CarritoService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  agregar(
    @Request() req,
    @Body() body: { productoId: number; cantidad?: number },
  ) {
    return this.carritoService.agregarAlCarrito(
      req.user.userId,
      body.productoId,
      body.cantidad,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  obtenerCarrito(@Request() req) {
    return this.carritoService.obtenerCarrito(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  obtenerHistorial(@Request() req) {
    return this.carritoService.obtenerHistorial(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  actualizarCantidad(
    @Request() req,
    @Param('id') id: string,
    @Body('cantidad') cantidad: number,
  ) {
    return this.carritoService.actualizarCantidad(
      +id,
      req.user.userId,
      cantidad,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  eliminar(@Request() req, @Param('id') id: string) {
    return this.carritoService.eliminarDelCarrito(+id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('pay')
  pagar(@Request() req) {
    return this.carritoService.pagar(req.user.userId);
  }
}
