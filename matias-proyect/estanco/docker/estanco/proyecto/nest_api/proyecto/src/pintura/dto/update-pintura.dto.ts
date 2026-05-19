import { PartialType } from '@nestjs/mapped-types';
import { CreatePinturaDto } from './create-pintura.dto';

export class UpdatePinturaDto extends PartialType(CreatePinturaDto) {}
