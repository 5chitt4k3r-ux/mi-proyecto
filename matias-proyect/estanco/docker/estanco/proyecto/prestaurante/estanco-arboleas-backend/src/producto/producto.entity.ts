import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CarritoItem } from '../carrito/carrito-item.entity';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('text')
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({ default: '' })
  imagenUrl: string;

  @Column()
  categoria: string;

  @Column({ default: 0 })
  stock: number;

  @OneToMany(() => CarritoItem, (carritoItem) => carritoItem.producto)
  carritoItems: CarritoItem[];
}
