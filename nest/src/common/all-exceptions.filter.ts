import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/** Semua error dikembalikan dalam satu bentuk yang konsisten. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const r = exception.getResponse() as any;
      message = typeof r === 'string' ? r : (r.message ?? exception.message);
      error = typeof r === 'string' ? exception.name : (r.error ?? exception.name);
    } else {
      this.logger.error(exception);
    }

    res.status(statusCode).json({
      statusCode,
      error,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
