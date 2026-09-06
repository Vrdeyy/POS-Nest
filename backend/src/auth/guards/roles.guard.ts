import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Membaca requirement role dari decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Jika endpoint tidak diberi @Roles(), berarti bebas diakses siapa saja (selama punya token)
    if (!requiredRoles) {
      return true;
    }

    // Mengambil data user yang disisipkan oleh JwtStrategy
    const { user } = context.switchToHttp().getRequest();

    // Cek apakah user punya role yang sesuai
    const hasRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRole) {
      throw new ForbiddenException('Akses ditolak! Anda tidak memiliki hak akses ini.');
    }

    return true;
  }
}
