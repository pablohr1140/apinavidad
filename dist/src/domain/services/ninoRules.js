"use strict";
/**
 * # nino Rules
 * Propósito: Dominio nino Rules
 * Pertenece a: Dominio
 * Interacciones: Entidades, reglas de negocio
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_EDAD = void 0;
exports.calcularEdad = calcularEdad;
exports.debeInhabilitar = debeInhabilitar;
exports.prepararInhabilitacion = prepararInhabilitacion;
const date_fns_1 = require("date-fns");
exports.MAX_EDAD = 10;
function calcularEdad(fechaNacimiento, fechaReferencia = new Date()) {
    if (!fechaNacimiento) {
        return null;
    }
    return (0, date_fns_1.differenceInYears)(fechaReferencia, fechaNacimiento);
}
function debeInhabilitar(nino, fechaReferencia = new Date()) {
    const edad = calcularEdad(nino.fecha_nacimiento, fechaReferencia);
    return edad !== null && edad >= exports.MAX_EDAD;
}
function prepararInhabilitacion(nino, fechaReferencia = new Date()) {
    const ingreso = nino.fecha_ingreso ?? fechaReferencia;
    const fechaRetiro = (0, date_fns_1.isBefore)(ingreso, fechaReferencia) ? fechaReferencia : ingreso;
    return {
        estado: 'inhabilitado',
        fecha_retiro: fechaRetiro
    };
}
