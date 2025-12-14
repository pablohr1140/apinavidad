/**
 * # Update Persona Use Case.spec
 * Propósito: Prueba unitaria Update Persona Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';

import { PersonaRepository } from '@/application/repositories/PersonaRepository';
import { UpdatePersonaUseCase } from '@/application/use-cases/personas/UpdatePersonaUseCase';
import { AppError } from '@/shared/errors/AppError';

interface RepoMock extends PersonaRepository {
  findById: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
}

const makeRepository = (): RepoMock => ({
  findById: vi.fn(),
  update: vi.fn()
}) as unknown as RepoMock;

describe('UpdatePersonaUseCase', () => {
  it('lanza AppError cuando la persona no existe', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue(null);
    const useCase = new UpdatePersonaUseCase(repository);

    await expect(useCase.execute(1, {})).rejects.toBeInstanceOf(AppError);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('valida los datos antes de actualizar', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue({ id: 1 } as any);
    repository.update.mockResolvedValue({ id: 1, email: 'user@example.com' });
    const useCase = new UpdatePersonaUseCase(repository);
    const payload = { email: 'user@example.com' };

    const persona = await useCase.execute(1, payload);

    expect(repository.update).toHaveBeenCalledWith(1, payload);
    expect(persona.email).toBe('user@example.com');
  });

  it('lanza ZodError si los datos son invalidos', async () => {
    const repository = makeRepository();
    repository.findById.mockResolvedValue({ id: 1 } as any);
    const useCase = new UpdatePersonaUseCase(repository);

    await expect(useCase.execute(1, { email: 'sin-formato' })).rejects.toBeInstanceOf(ZodError);
  });
});
