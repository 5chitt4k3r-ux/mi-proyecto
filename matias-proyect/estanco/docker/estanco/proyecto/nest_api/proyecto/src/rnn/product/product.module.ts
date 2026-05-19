import { Module } from '@nestjs/common';
import { ProductosService } from './product.service';
import { ProductosController } from './product.controller';
import { Producto } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Producto])],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductModule {}
