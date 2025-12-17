/**
 * # prisma.service
 * Propósito: Infra DB prisma.service
 * Pertenece a: Infraestructura / Base de datos
 * Interacciones: Prisma, conexión a BD
/**
 * PrismaService
 * Capa: Infraestructura / Base de datos
 * Responsabilidad: Configurar PrismaClient contra SQL Server con pool/timeouts derivados de env y lifecycle Nest.
 * Dependencias: PrismaClient, env (DB_HOST/PORT/USER/PASSWORD/NAME o DATABASE_URL, pool/timeouts).
 * Flujo: si no hay DATABASE_URL, construye cadena con pool.max=10, pool.min=0, idle=10s, connectionTimeout=10s, requestTimeout=20s.
 * Usos: inyectado en repositorios Prisma y servicios que consultan DB.
 */

const DEFAULT_LOG_LEVELS: Array<'error' | 'warn'> = ['error'];
if (env.NODE_ENV === 'development') {
  DEFAULT_LOG_LEVELS.push('warn');
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  private static readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = PrismaService.resolveConnectionString();

    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim().length === 0) {
      process.env.DATABASE_URL = connectionString;
    }

    super({
      log: DEFAULT_LOG_LEVELS
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private static resolveConnectionString() {
    if (env.DATABASE_URL && env.DATABASE_URL.trim().length > 0) {
      return env.DATABASE_URL;
    }

    const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = env;
    const poolMax = env.DB_POOL_MAX ?? 10;
    const poolMin = env.DB_POOL_MIN ?? 0;
    const idle = env.DB_POOL_IDLE_TIMEOUT_MS ?? 10000;
    const connectTimeout = env.DB_POOL_CONNECT_TIMEOUT_MS ?? 10000;
    const requestTimeout = env.DB_REQUEST_TIMEOUT_MS ?? 20000;
    const encodedUser = encodeURIComponent(DB_USER);
    const encodedPassword = encodeURIComponent(DB_PASSWORD);

    const url = `sqlserver://${DB_HOST}:${DB_PORT};database=${DB_NAME};user=${encodedUser};password=${encodedPassword};encrypt=false;trustServerCertificate=true;connectionTimeout=${connectTimeout};requestTimeout=${requestTimeout};pool.max=${poolMax};pool.min=${poolMin};pool.idleTimeoutMillis=${idle}`;
    PrismaService.logger.verbose?.(`Usando connection string derivada para Prisma (${DB_HOST}:${DB_PORT}/${DB_NAME})`);
    return url;
  }
}
