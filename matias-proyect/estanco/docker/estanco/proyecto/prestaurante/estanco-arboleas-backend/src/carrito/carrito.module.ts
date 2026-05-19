import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoController } from './carrito.controller';
import { CarritoService } from './carrito.service';
import { CarritoItem } from './carrito-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarritoItem])],
  controllers: [CarritoController],
  providers: [CarritoService],
})
export class CarritoModule {}
