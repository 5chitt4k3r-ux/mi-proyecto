import { PartialType } from '@nestjs/mapped-types';
import { CreateLibreriaDto } from './create-libreria.dto';

export class UpdateLibreriaDto extends PartialType(CreateLibreriaDto) {}
