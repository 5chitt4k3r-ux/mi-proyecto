import { Injectable } from '@nestjs/common';
import { ProductoTalla } from './entities/product-size.entity';
import { Producto } from '../product/entities/product.entity';
import { Talla } from '../talla/entities/talla.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductoTallaService {
  constructor(
    @InjectRepository(ProductoTalla)
    private readonly productoTallaRepository: Repository<ProductoTalla>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Talla)
    private readonly tallaRepository: Repository<Talla>,
  ) {}

  async asignarPrecio(productoId: number, tallaId: number, precio: number): Promise<ProductoTalla> {
    const producto = await this.productoRepository.findOne({ where: { id: productoId } });
    const talla = await this.tallaRepository.findOne({ where: { id: tallaId } });

    if (!producto || !talla) {
      throw new Error('Producto o talla no encontrados');
    }

    const productoTalla = this.productoTallaRepository.create({ producto, talla, precio });
    return await this.productoTallaRepository.save(productoTalla);
  }

  async obtenerProductoTalla(productoId: number, tallaId: number): Promise<ProductoTalla | null> {
    return await this.productoTallaRepository.findOne({
      where: { producto: { id: productoId }, talla: { id: tallaId } },
      relations: ['producto', 'talla'],
    });
  }
}
