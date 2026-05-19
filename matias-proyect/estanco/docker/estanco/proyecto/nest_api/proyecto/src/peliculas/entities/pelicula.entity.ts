import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pelicula {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column()
    director: string;

    @Column()
    genero: string;

    @Column({ type: 'date' })
    fechaEstreno: Date;

    @Column()
    duracion: number;
}
