import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('product')
export class ProductoController {
  constructor(private productoService: ProductoService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  crear(@Body() crearProductoDto: CrearProductoDto) {
    return this.productoService.crear(crearProductoDto);
  }

  @Get()
  obtenerTodos(@Query('query') query?: string) {
    return this.productoService.obtenerTodos(query);
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: string) {
    return this.productoService.obtenerPorId(+id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  actualizar(
    @Param('id') id: string,
    @Body() actualizarProductoDto: ActualizarProductoDto,
  ) {
    return this.productoService.actualizar(+id, actualizarProductoDto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.productoService.eliminar(+id);
  }
}
