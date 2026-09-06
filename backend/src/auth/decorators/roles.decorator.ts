import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client'; // Import enum Role dari Prisma

export const ROLES_KEY = 'roles';
// Membuat decorator @Roles yang menerima daftar Role
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
