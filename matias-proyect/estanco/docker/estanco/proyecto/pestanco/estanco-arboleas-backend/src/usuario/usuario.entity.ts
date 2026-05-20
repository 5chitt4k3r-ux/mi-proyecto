import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CarritoItem } from '../carrito/carrito-item.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  rol: string;

  @OneToMany(() => CarritoItem, (carritoItem) => carritoItem.usuario)
  carritoItems: CarritoItem[];
}
