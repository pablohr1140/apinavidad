/**
 * # Login Use Case.spec
 * Propósito: Prueba unitaria Login Use Case.spec
 * Pertenece a: Tests (Prueba unitaria)
 * Interacciones: Mocks y servicios
 */

import { describe, expect, it, vi, beforeEach } from 'vitest';

import { HashProvider, TokenProvider } from '@/application/contracts/Auth';
import { UserRepository } from '@/application/repositories/UserRepository';
import { LoginUseCase } from '@/application/use-cases/auth/LoginUseCase';
import { AppError } from '@/shared/errors/AppError';

const makeUser = () => ({
  id: 1,
  email: 'user@example.com',
  passwordHash: 'hashed',
  roles: [],
  createdAt: new Date(),
  updatedAt: new Date()
});

const makeUserRepository = () => ({
  findByEmail: vi.fn()
}) as unknown as UserRepository;

const makeHashProvider = () => ({
  compare: vi.fn(),
  hash: vi.fn()
}) as unknown as HashProvider;

const makeTokenProvider = () => ({
  sign: vi.fn(),
  verify: vi.fn()
}) as unknown as TokenProvider;

describe('LoginUseCase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devuelve tokens cuando las credenciales son correctas', async () => {
    const userRepository = makeUserRepository();
    const hashProvider = makeHashProvider();
    const tokenProvider = makeTokenProvider();
    const useCase = new LoginUseCase(userRepository, hashProvider, tokenProvider);
    const user = makeUser();

    (userRepository.findByEmail as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(user);
    (hashProvider.compare as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(true);
    (tokenProvider.sign as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');

    const response = await useCase.execute({ email: user.email, password: 'secret123' } as any);

    expect(tokenProvider.sign).toHaveBeenCalledTimes(2);
    expect(response).toMatchObject({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: { id: user.id, email: user.email, roles: [] }
    });
  });

  it('lanza AppError si el usuario no existe', async () => {
    const userRepository = makeUserRepository();
    const useCase = new LoginUseCase(userRepository, makeHashProvider(), makeTokenProvider());
    (userRepository.findByEmail as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    await expect(useCase.execute({ email: 'missing@example.com', password: 'secret123' } as any)).rejects.toBeInstanceOf(AppError);
  });

  it('lanza AppError si la contraseña no coincide', async () => {
    const userRepository = makeUserRepository();
    const hashProvider = makeHashProvider();
    const useCase = new LoginUseCase(userRepository, hashProvider, makeTokenProvider());
    (userRepository.findByEmail as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(makeUser());
    (hashProvider.compare as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(false);

    await expect(useCase.execute({ email: 'user@example.com', password: 'wrongpass' } as any)).rejects.toBeInstanceOf(AppError);
  });
});
