import { Module } from '@nestjs/common';
import { ProductoTallaService } from './product-size.service';
import { ProductoTallaController } from './product-size.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from '../product/entities/product.entity';
import { Talla } from '../talla/entities/talla.entity';
import { ProductoTalla } from './entities/product-size.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoTalla, Producto, Talla])],
  controllers: [ProductoTallaController],
  providers: [ProductoTallaService],
  exports: [ProductoTallaService],
})
export class ProductSizeModule {}
