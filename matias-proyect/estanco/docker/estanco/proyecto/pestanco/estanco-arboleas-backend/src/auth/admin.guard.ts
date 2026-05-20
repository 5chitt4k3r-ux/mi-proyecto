import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.rol === 'admin') {
      return true;
    }

    throw new ForbiddenException('Acceso restringido a administradores');
  }
}
