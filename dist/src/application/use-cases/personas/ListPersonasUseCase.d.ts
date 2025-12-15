/**
 * # List Personas Use Case
 * Propósito: Caso de uso List Personas Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
import { PersonaRepository } from '@/application/repositories/PersonaRepository';
export declare class ListPersonasUseCase {
    private readonly personaRepository;
    constructor(personaRepository: PersonaRepository);
    /**
     * Delegación de filtros al repositorio para obtener personas.
     * @param params - filtros permitidos por el repositorio.
     */
    execute(params?: Parameters<PersonaRepository['findMany']>[0]): Promise<import("../../../domain/entities").PersonaProps[]>;
}
