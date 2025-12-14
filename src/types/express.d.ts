/**
 * # express.d
 * Propósito: Archivo express.d
 * Pertenece a: General
 * Interacciones: N/A
 */

import 'express';
import type { AuthenticatedUser } from '@/application/contracts/AuthenticatedUser';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
