/**
 * # Create Persona Use Case.spec
 * Propósito: Prueba unitaria Create Persona Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi, afterEach } from 'vitest';
import { ZodError } from 'zod';

import { PersonaRepository } from '@/application/repositories/PersonaRepository';
import { CreatePersonaUseCase } from '@/application/use-cases/personas/CreatePersonaUseCase';

type RepoMock = PersonaRepository & {
  findMany: ReturnType<typeof vi.fn>;
  findById: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

const makeRepository = (): RepoMock => ({
  findMany: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn()
}) as unknown as RepoMock;

describe('CreatePersonaUseCase', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('agrega timestamps antes de crear la persona', async () => {
    const repository = makeRepository();
    const now = new Date('2024-05-01T12:00:00Z');
    vi.useFakeTimers();
    vi.setSystemTime(now);
    repository.create.mockResolvedValue({ id: 1 } as any);
    const useCase = new CreatePersonaUseCase(repository);

    await useCase.execute({
      nombres: 'Ana',
      apellidos: 'Diaz',
      run: '12345678',
      dv: 'K',
      fecha_nacimiento: new Date('1990-01-01'),
      sexo: 'F',
      telefono: '123456789',
      email: 'ana@example.com',
      direccion: 'Calle 1'
    });

    expect(repository.create).toHaveBeenCalledTimes(1);
    const payload = repository.create.mock.calls[0][0];
    expect(payload.createdAt).toEqual(now);
    expect(payload.updatedAt).toEqual(now);
  });

  it('lanza ZodError cuando el payload es inválido', () => {
    const repository = makeRepository();
    const useCase = new CreatePersonaUseCase(repository);

    expect(() => useCase.execute({ nombres: 'A' })).toThrowError(ZodError);
    expect(repository.create).not.toHaveBeenCalled();
  });
});
