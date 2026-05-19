import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Talla } from './entities/talla.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TallasService {
  constructor(
    @InjectRepository(Talla)
    private readonly tallaRepository: Repository<Talla>,
  ) {}
  async crearTalla(nombre: string): Promise<Talla> {
    const producto = this.tallaRepository.create({ nombre});
    return await this.tallaRepository.save(producto);
  }
  async obtenerTodos(): Promise<Talla[]> {
    return await this.tallaRepository.find();
  }
  async obtenerPorId(id: number): Promise<Talla|null> {
    return await this.tallaRepository.findOne({ where: { id } });
  }
  async eliminarTalla(id: number): Promise<string> {
    const producto = await this.tallaRepository.findOne({ where: { id } });

    if (!producto) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }
    await this.tallaRepository.remove(producto);
    return `Producto con ID ${id} eliminado correctamente`;
  }
}
