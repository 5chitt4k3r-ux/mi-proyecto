import { Module } from '@nestjs/common';
import { TallasService } from './talla.service';
import { TallasController } from './talla.controller';
import { Talla } from './entities/talla.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Talla])],
  controllers: [TallasController],
  providers: [TallasService],
  exports: [TallasService],
})
export class TallaModule {}
