import { NextFunction, Request, Response } from 'express';
import ApiError from '../../exception/api.error';
import { ProcessCallRequestSchema } from './call-processing.schema';

export function validateProcessCall(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const parsed = ProcessCallRequestSchema.safeParse(request.body);
  if (!parsed.success) throw new ApiError(400, 'invalid request body');
  request.body = parsed.data;
  next();
}
