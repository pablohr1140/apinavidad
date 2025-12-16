"use strict";
/**
 * # Feature Flagged Organizacion Repository
 * Propósito: Repositorio Prisma Feature Flagged Organizacion Repository
 * Pertenece a: Infraestructura / Repositorio Prisma
 * Interacciones: PrismaService, entidades de dominio
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFlaggedOrganizacionRepository = void 0;
const OrganizacionRepository_1 = require("../../../application/repositories/OrganizacionRepository");
class FeatureFlaggedOrganizacionRepository extends OrganizacionRepository_1.OrganizacionRepository {
    delegate;
    constructor(delegate) {
        super();
        this.delegate = delegate;
    }
    findMany(params) {
        const { estado, tipo } = params ?? {};
        return this.delegate.findMany({ estado, tipo });
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
exports.FeatureFlaggedOrganizacionRepository = FeatureFlaggedOrganizacionRepository;
