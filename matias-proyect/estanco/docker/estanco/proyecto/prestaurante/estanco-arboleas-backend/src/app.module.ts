import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoModule } from './producto/producto.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { CarritoModule } from './carrito/carrito.module';
import { AppController } from './app.controller';
import { Producto } from './producto/producto.entity';
import { Usuario } from './usuario/usuario.entity';
import { CarritoItem } from './carrito/carrito-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'estanco-arboleas.db',
      entities: [Producto, Usuario, CarritoItem],
      synchronize: true,
    }),
    ProductoModule,
    UsuarioModule,
    AuthModule,
    CarritoModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
