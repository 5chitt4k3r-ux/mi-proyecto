import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarritoItem } from './carrito-item.entity';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(CarritoItem)
    private carritoRepositorio: Repository<CarritoItem>,
  ) {}

  async agregarAlCarrito(
    usuarioId: number,
    productoId: number,
    cantidad: number = 1,
  ): Promise<CarritoItem> {
    const existente = await this.carritoRepositorio.findOne({
      where: { usuarioId, productoId, pagado: false },
    });

    if (existente) {
      existente.cantidad += cantidad;
      return this.carritoRepositorio.save(existente);
    }

    const item = this.carritoRepositorio.create({
      usuarioId,
      productoId,
      cantidad,
    });
    return this.carritoRepositorio.save(item);
  }

  async obtenerCarrito(usuarioId: number): Promise<CarritoItem[]> {
    return this.carritoRepositorio.find({
      where: { usuarioId, pagado: false },
    });
  }

  async obtenerHistorial(usuarioId: number): Promise<CarritoItem[]> {
    return this.carritoRepositorio.find({
      where: { usuarioId, pagado: true },
    });
  }

  async actualizarCantidad(
    id: number,
    usuarioId: number,
    cantidad: number,
  ): Promise<CarritoItem | null> {
    const item = await this.carritoRepositorio.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Item no encontrado');
    if (item.usuarioId !== usuarioId)
      throw new ForbiddenException('No autorizado');

    if (cantidad <= 0) {
      await this.carritoRepositorio.delete(id);
      return null;
    }

    item.cantidad = cantidad;
    return this.carritoRepositorio.save(item);
  }

  async eliminarDelCarrito(id: number, usuarioId: number): Promise<void> {
    const item = await this.carritoRepositorio.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Item no encontrado');
    if (item.usuarioId !== usuarioId)
      throw new ForbiddenException('No autorizado');
    await this.carritoRepositorio.delete(id);
  }

  async pagar(usuarioId: number): Promise<CarritoItem[]> {
    const items = await this.carritoRepositorio.find({
      where: { usuarioId, pagado: false },
    });

    for (const item of items) {
      item.pagado = true;
      item.fechaPago = new Date();
    }

    return this.carritoRepositorio.save(items);
  }
}
