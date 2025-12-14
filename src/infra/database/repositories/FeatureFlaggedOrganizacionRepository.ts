/**
 * # Feature Flagged Organizacion Repository
 * Propósito: Repositorio Prisma Feature Flagged Organizacion Repository
 * Pertenece a: Infraestructura / Repositorio Prisma
 * Interacciones: PrismaService, entidades de dominio
 */

import { OrganizacionRepository } from '@/application/repositories/OrganizacionRepository';
import type { OrganizacionProps } from '@/domain/entities';

export class FeatureFlaggedOrganizacionRepository extends OrganizacionRepository {
  constructor(private readonly delegate: OrganizacionRepository) {
    super();
  }

  findMany(params?: { estado?: string; tipo?: string }): Promise<OrganizacionProps[]> {
    const { estado, tipo } = params ?? {};
    return this.delegate.findMany({ estado, tipo });
  }

  findById(id: number): Promise<OrganizacionProps | null> {
    return this.delegate.findById(id);
  }

  create(data: Omit<OrganizacionProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrganizacionProps> {
    return this.delegate.create(data);
  }

  update(id: number, data: Partial<Omit<OrganizacionProps, 'id'>>): Promise<OrganizacionProps> {
    return this.delegate.update(id, data);
  }

  delete(id: number): Promise<void> {
    return this.delegate.delete(id);
  }
}
