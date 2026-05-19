import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Libreria {
    @PrimaryGeneratedColumn() // Genera un id autoincremental, si sólo fuera clave sería @PrimaryColumn()
      id: number;
    @Column()
      title:string;
    @Column()
      author:string;
    @Column()
      subject:string;
    @Column()
      publisher:string;
    @Column()
      quantity:number;
    @Column("decimal", { precision: 6, scale: 2 })
      price:number;
}
