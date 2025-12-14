/**
 * # Feature Flagged Persona Repository
 * Propósito: Repositorio Prisma Feature Flagged Persona Repository
 * Pertenece a: Infraestructura / Repositorio Prisma
 * Interacciones: PrismaService, entidades de dominio
 */

import { PersonaRepository, type PersonaCreateInput, type PersonaUpdateInput } from '@/application/repositories/PersonaRepository';
import type { PersonaProps } from '@/domain/entities';

export class FeatureFlaggedPersonaRepository extends PersonaRepository {
  constructor(private readonly delegate: PersonaRepository) {
    super();
  }

  findMany(params?: { organizacionId?: number; search?: string }): Promise<PersonaProps[]> {
    const { organizacionId, search } = params ?? {};
    return this.delegate.findMany({ organizacionId, search });
  }

  findById(id: number): Promise<PersonaProps | null> {
    return this.delegate.findById(id);
  }

  create(data: PersonaCreateInput): Promise<PersonaProps> {
    return this.delegate.create(data);
  }

  update(id: number, data: PersonaUpdateInput): Promise<PersonaProps> {
    return this.delegate.update(id, data);
  }

  delete(id: number): Promise<void> {
    return this.delegate.delete(id);
  }
}
