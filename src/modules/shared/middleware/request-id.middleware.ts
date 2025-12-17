import { randomUUID } from 'crypto';
import type { Request, Response, NextFunction } from 'express';

import { logger } from '@/shared/logger';

const HEADER_REQUEST_ID = 'x-request-id';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const incomingId = req.headers[HEADER_REQUEST_ID] as string | undefined;
  const requestId = incomingId && incomingId.length > 0 ? incomingId : randomUUID();

  req.requestId = requestId;
  req.log = logger.child({ requestId });
  res.setHeader(HEADER_REQUEST_ID, requestId);

  next();
}