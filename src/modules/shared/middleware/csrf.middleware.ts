import csurf from 'csurf';
import type { Request, Response, NextFunction } from 'express';

import { env } from '@/config/env';

const secureCookies = env.NODE_ENV !== 'development';

export const csrfProtection = csurf({
  cookie: {
    httpOnly: false, // el token debe ser legible por el cliente para reenviarlo en cabeceras
    sameSite: 'lax',
    secure: secureCookies,
    path: '/'
  }
});

export function attachCsrfToken(req: Request, res: Response, next: NextFunction) {
  if (typeof req.csrfToken === 'function') {
    const token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token, {
      httpOnly: false,
      sameSite: 'lax',
      secure: secureCookies,
      path: '/'
    });
    res.setHeader('X-CSRF-Token', token);
  }
  next();
}