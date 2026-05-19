import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from '../producto/producto.entity';
import { Usuario } from '../usuario/usuario.entity';

@Entity()
export class CarritoItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuarioId: number;

  @Column()
  productoId: number;

  @Column({ default: 1 })
  cantidad: number;

  @Column({ nullable: true })
  fechaPago: Date;

  @Column({ default: false })
  pagado: boolean;

  @ManyToOne(() => Usuario, (usuario) => usuario.carritoItems, { eager: true })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @ManyToOne(() => Producto, (producto) => producto.carritoItems, {
    eager: true,
  })
  @JoinColumn({ name: 'productoId' })
  producto: Producto;
}
