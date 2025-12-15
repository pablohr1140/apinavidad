import { Injectable } from '@nestjs/common';

import type { RoleKey } from '@/domain/access-control';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AuthorizationService } from '@/modules/auth/services/authorization.service';

@Injectable()
export class RoleAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authorization: AuthorizationService
  ) {}

  /**
   * Elimina un rol tras validar jerarquía por rank.
   * Si el rol objetivo no existe, simplemente retorna.
   */
  async deleteRole(actorRoleKey: RoleKey, targetRoleKey: RoleKey): Promise<void> {
    // Verifica jerarquía (lanza Forbidden si target >= actor)
    await this.authorization.assertCanDeleteRole(actorRoleKey, targetRoleKey);

    // Elimina el rol (role_permissions se borran en cascada por FK)
    const deleted = await this.prisma.roles.delete({ where: { role_key: targetRoleKey } }).catch((err) => {
      // Si no existe, retornamos sin error; otros errores se propagan.
      if (err.code === 'P2025') return null;
      throw err;
    });

    if (!deleted) return;

    // Invalida caché de permisos del rol eliminado
    await this.authorization.invalidateRoleCache(targetRoleKey);
  }
}
