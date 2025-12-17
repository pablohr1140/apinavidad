/**
 * RolesController
 * Capa: HTTP
 * Responsabilidad: Exponer la eliminación de roles por clave.
 * Seguridad actual: Protegido solo por guards globales (Paseto + Permissions). No usa `@Permissions` específico; requiere que el guard de auth pueble `user` con rol.
 * Flujo: DELETE /roles/:roleKey -> extrae actor vía `@AuthUser` -> delega a `RoleAdminService.deleteRole` pasando rol del actor y rol objetivo.
 * Interacciones: `AuthUser` decorator lee del request poblado por `PasetoAuthGuard`; `RoleAdminService` aplica la política interna existente.
 */
import { Controller, Delete, HttpCode, HttpStatus, Param, UnauthorizedException } from '@nestjs/common';

import type { AuthenticatedUser } from '@/application/contracts/AuthenticatedUser';
import type { RoleKey } from '@/domain/access-control';
import { AuthUser } from '@/modules/auth/decorators/auth-user.decorator';
import { RoleAdminService } from '@/modules/auth/services/role-admin.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleAdminService: RoleAdminService) {}

  @Delete(':roleKey')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRole(@Param('roleKey') roleKey: RoleKey, @AuthUser() user: AuthenticatedUser) {
    const actorRoleKey = user?.roles?.[0]?.key as RoleKey | undefined;

    if (!actorRoleKey) {
      // El guard debería poblar user; si no, es un fallo de auth.
      throw new UnauthorizedException('Falta rol del actor en el contexto de autenticación');
    }

    await this.roleAdminService.deleteRole(actorRoleKey, roleKey);
  }
}
