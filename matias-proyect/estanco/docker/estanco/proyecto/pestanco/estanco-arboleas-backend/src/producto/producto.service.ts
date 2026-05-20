import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Producto } from './producto.entity';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepositorio: Repository<Producto>,
  ) {}

  async crear(crearProductoDto: CrearProductoDto): Promise<Producto> {
    const producto = this.productoRepositorio.create(crearProductoDto);
    return this.productoRepositorio.save(producto);
  }

  async obtenerTodos(query?: string): Promise<Producto[]> {
    if (query) {
      return this.productoRepositorio.find({
        where: [
          { nombre: Like(`%${query}%`) },
          { descripcion: Like(`%${query}%`) },
          { categoria: Like(`%${query}%`) },
        ],
      });
    }
    return this.productoRepositorio.find();
  }

  async obtenerPorId(id: number): Promise<Producto> {
    const producto = await this.productoRepositorio.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return producto;
  }

  async actualizar(id: number, actualizarProductoDto: ActualizarProductoDto): Promise<Producto> {
    await this.productoRepositorio.update(id, actualizarProductoDto);
    return this.obtenerPorId(id);
  }

  async eliminar(id: number): Promise<void> {
    const resultado = await this.productoRepositorio.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
  }
}
