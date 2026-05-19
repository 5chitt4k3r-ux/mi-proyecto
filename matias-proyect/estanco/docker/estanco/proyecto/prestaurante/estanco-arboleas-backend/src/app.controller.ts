import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus() {
    return {
      status: 'online',
      nombre: 'Estanco Arboleas API',
      version: '1.0.0',
      endpoints: {
        auth: {
          login: 'POST /auth/login',
          register: 'POST /auth/register',
        },
        productos: {
          listar: 'GET /product',
          detalle: 'GET /product/:id',
          crear: 'POST /product',
          actualizar: 'PUT /product/:id',
          eliminar: 'DELETE /product/:id',
        },
        carrito: {
          añadir: 'POST /cart',
          ver: 'GET /cart',
          historial: 'GET /cart/history',
          actualizar: 'PUT /cart/:id',
          eliminar: 'DELETE /cart/:id',
          pagar: 'POST /cart/pay',
        },
        usuarios: {
          perfil: 'GET /users/profile',
          listar: 'GET /users',
          cambiarRol: 'PUT /users/:id/role',
        },
      },
    };
  }
}
