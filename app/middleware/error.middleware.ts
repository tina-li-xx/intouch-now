import { NextFunction, Request, Response } from 'express';
import ApiError from '../exception/api.error';

export default function errorMiddleware(
  error: ApiError | Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  response.status(error instanceof ApiError ? error.statusCode : 500).json({
    message: error.message || 'Something went wrong',
    status: false,
  });
}
