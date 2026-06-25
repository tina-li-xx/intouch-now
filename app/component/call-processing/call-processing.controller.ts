import type { Request, Response } from 'express';
import CallProcessingService from './call-processing.service';
import { ProcessCallRequest } from './call-processing.schema';

type ProcessCallHttpRequest = Request<unknown, unknown, ProcessCallRequest>;

export async function processCall(
  request: ProcessCallHttpRequest,
  response: Response,
) {
  return response.json({
    status: true,
    body: await CallProcessingService.process(request.body.transcript),
  });
}
