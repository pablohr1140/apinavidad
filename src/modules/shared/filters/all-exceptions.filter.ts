import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import type { Request } from 'express';

import { env } from '@/config/env';
import { logger } from '@/shared/logger';
import type { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request & { requestId?: string; log?: any }>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.message : 'Internal server error';
    const errorResponse = exception instanceof HttpException ? (exception.getResponse() as any) : null;

    const payload = {
      statusCode: status,
      message: typeof errorResponse === 'object' && errorResponse?.message ? errorResponse.message : message,
      requestId: request.requestId
    };

    // Log error without leaking stack in production.
    logger.error({
      msg: 'request.exception',
      statusCode: status,
      requestId: request.requestId,
      error: {
        message: (exception as any)?.message,
        stack: env.NODE_ENV === 'development' ? (exception as any)?.stack : undefined
      }
    });

    response.status(status).json(env.NODE_ENV === 'development' ? payload : { statusCode: status, message, requestId: request.requestId });
  }
}