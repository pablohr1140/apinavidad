/**
 * # Get Persona Use Case
 * Propósito: Caso de uso Get Persona Use Case
 * Pertenece a: Aplicación / Caso de uso
 * Interacciones: Repositorios, servicios de dominio
 */
import { PersonaRepository } from '@/application/repositories/PersonaRepository';
export declare class GetPersonaUseCase {
    private readonly personaRepository;
    constructor(personaRepository: PersonaRepository);
    /**
     * Busca una persona por id; lanza 404 si no existe.
     * @param id - identificador de persona.
     */
    execute(id: number): Promise<import("../../../domain/entities").PersonaProps>;
}
