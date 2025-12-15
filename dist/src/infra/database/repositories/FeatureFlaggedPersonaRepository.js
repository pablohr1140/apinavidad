"use strict";
/**
 * # Feature Flagged Persona Repository
 * Propósito: Repositorio Prisma Feature Flagged Persona Repository
 * Pertenece a: Infraestructura / Repositorio Prisma
 * Interacciones: PrismaService, entidades de dominio
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFlaggedPersonaRepository = void 0;
const PersonaRepository_1 = require("../../../application/repositories/PersonaRepository");
class FeatureFlaggedPersonaRepository extends PersonaRepository_1.PersonaRepository {
    delegate;
    constructor(delegate) {
        super();
        this.delegate = delegate;
    }
    findMany(params) {
        const { organizacionId, search } = params ?? {};
        return this.delegate.findMany({ organizacionId, search });
    }
    findById(id) {
        return this.delegate.findById(id);
    }
    create(data) {
        return this.delegate.create(data);
    }
    update(id, data) {
        return this.delegate.update(id, data);
    }
    delete(id) {
        return this.delegate.delete(id);
    }
}
exports.FeatureFlaggedPersonaRepository = FeatureFlaggedPersonaRepository;
