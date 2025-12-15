/**
 * # index
 * Propósito: Dominio index
 * Pertenece a: Dominio
 * Interacciones: Entidades, reglas de negocio
 */
import type { RoleKey } from '../access-control';
export type EstadoNino = 'registrado' | 'validado' | 'egresado' | 'inhabilitado' | boolean;
export type EstadoPeriodo = 'borrador' | 'planificado' | 'abierto' | 'cerrado';
export type EstadoOrganizacion = 'borrador' | 'activo' | 'suspendido';
export interface PersonaProps {
    id: number;
    nombres: string;
    apellidos: string;
    run?: string | null;
    dv?: string | null;
    fecha_nacimiento?: Date | null;
    sexo?: string | null;
    telefono?: string | null;
    email?: string | null;
    email_verified_at?: Date | null;
    password?: string | null;
    rememberToken?: string | null;
    direccion?: string | null;
    providenciaId?: number | null;
    esRepresentante: boolean;
    roles: RoleSummary[];
    createdAt: Date;
    updatedAt: Date;
}
export interface RoleSummary {
    id: number;
    key: RoleKey;
    name: string;
    rank: number;
}
export interface OrganizacionProps {
    id: number;
    nombre: string;
    sigla?: string | null;
    rut?: string | null;
    tipo: string;
    direccion?: string | null;
    telefono?: string | null;
    email?: string | null;
    providenciaId?: number | null;
    estado: EstadoOrganizacion;
    createdAt: Date;
    updatedAt: Date;
}
export interface PeriodoProps {
    id: number;
    nombre: string;
    fecha_inicio?: Date | null;
    fecha_fin?: Date | null;
    estado_periodo: EstadoPeriodo;
    es_activo: boolean;
    descripcion?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface NinoProps {
    id: number;
    nombres: string;
    apellidos?: string | null;
    documento_numero: string;
    tipoDocumentoId?: number | null;
    nacionalidadId?: number | null;
    personaRegistroId?: number | null;
    fecha_nacimiento?: Date | null;
    sexo?: string | null;
    organizacionId?: number | null;
    periodoId: number;
    edad?: number | null;
    tiene_discapacidad: boolean;
    fecha_ingreso?: Date | null;
    fecha_retiro?: Date | null;
    estado: EstadoNino;
    createdAt: Date;
    updatedAt: Date;
}
export interface DiscapacidadProps {
    id: number;
    nombre: string;
    categoria?: string | null;
    codigo?: string | null;
    descripcion?: string | null;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface LogProps {
    id: number;
    personaId?: number | null;
    accion: string;
    mensaje?: string | null;
    loggableId: number;
    loggableType: string;
    payload?: Record<string, unknown> | null;
    ip?: string | null;
    user_agent?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
