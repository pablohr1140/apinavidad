import { UserRepository, UserRecord } from '@/application/repositories/UserRepository';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
export declare class PrismaUserRepository implements UserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    /** Busca usuario por email incluyendo rol, normaliza a `UserRecord`. */
    findByEmail(email: string): Promise<UserRecord | null>;
}
