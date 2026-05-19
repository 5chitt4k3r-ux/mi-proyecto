import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CrearProductoDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsString()
  @IsOptional()
  imagenUrl?: string;

  @IsString()
  categoria: string;

  @IsNumber()
  @Min(0)
  stock: number;
}
