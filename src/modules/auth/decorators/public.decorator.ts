/**
 * # public.decorator
 * Propósito: Decorador public.decorator
 * Pertenece a: Decorador (Nest)
 * Interacciones: Metadatos de rutas/servicios
 */

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
