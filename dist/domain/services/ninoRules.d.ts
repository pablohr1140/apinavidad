import { NinoProps } from '@/domain/entities';
export declare const MAX_EDAD = 10;
export declare function calcularEdad(fechaNacimiento?: Date | null, fechaReferencia?: Date): number | null;
export declare function debeInhabilitar(nino: NinoProps, fechaReferencia?: Date): boolean;
export declare function prepararInhabilitacion(nino: NinoProps, fechaReferencia?: Date): Pick<NinoProps, 'estado' | 'fecha_retiro'>;
