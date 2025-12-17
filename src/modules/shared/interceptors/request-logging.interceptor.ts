import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable, tap } from 'rxjs';

import { logger as baseLogger } from '@/shared/logger';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request & { requestId?: string; log?: any }>();
    const res = http.getResponse();

    const { method, url } = req;
    const startedAt = Date.now();
    const log = req.log ?? baseLogger;

    log.info({ msg: 'request.start', method, url, requestId: req.requestId });

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startedAt;
          log.info({
            msg: 'request.complete',
            method,
            url,
            statusCode: res.statusCode,
            durationMs: duration,
            requestId: req.requestId
          });
        },
        error: (error) => {
          const duration = Date.now() - startedAt;
          log.error({
            msg: 'request.error',
            method,
            url,
            statusCode: res.statusCode,
            durationMs: duration,
            requestId: req.requestId,
            error: { message: (error as any)?.message }
          });
        }
      })
    );
  }
}