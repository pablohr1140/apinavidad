/**
 * # Nino Repository
 * Propósito: Contrato de repositorio Nino Repository
 * Pertenece a: Aplicación / Repositorio contrato
 * Interacciones: Capa de infraestructura que implementa el contrato
 */

/* istanbul ignore file */
/**
 * # NinoRepository
 *
 * Propósito: contrato de persistencia para niños y gestión de su estado.
 * Pertenece a: Application layer.
 * Interacciones: `NinoProps`; usado por casos de uso de niños y jobs de inhabilitación.
 */
import { EstadoNino, NinoProps } from '@/domain/entities';

export abstract class NinoRepository {
  /** Lista niños con filtros variados (periodo, organización, estado, edad, prioridad). */
  abstract findMany(params?: {
    periodoId?: number;
    organizacionId?: number;
    estado?: EstadoNino;
    edadMin?: number;
    edadMax?: number;
    prioridad?: number;
    tiempoParaInhabilitar?: number;
  }): Promise<NinoProps[]>;
  /** Busca un niño por id. */
  abstract findById(id: number): Promise<NinoProps | null>;
  /** Crea un niño. */
  abstract create(data: Omit<NinoProps, 'id' | 'createdAt' | 'updatedAt'>): Promise<NinoProps>;
  /** Actualiza atributos de un niño. */
  abstract update(id: number, data: Partial<Omit<NinoProps, 'id'>>): Promise<NinoProps>;
  /** Inhabilita un niño con fecha y motivo. */
  abstract inhabilitar(id: number, payload: { fecha: Date; motivo: string }): Promise<NinoProps>;
  /** Restaura un niño previamente inhabilitado. */
  abstract restaurar(id: number): Promise<NinoProps>;
  /** Inhabilita automáticamente según lógica de negocio; `dryRun` opcional. */
  abstract autoInhabilitar(
    fechaReferencia: Date,
    dryRun?: boolean
  ): Promise<{ afectados: number } & { detalles?: NinoProps[] }>;
}
