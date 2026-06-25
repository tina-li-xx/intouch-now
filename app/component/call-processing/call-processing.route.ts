import { Application } from 'express';
import { asyncHandler } from '../../middleware/async-handler';
import { processCall } from './call-processing.controller';
import { validateProcessCall } from './call-processing.validation';

export default function registerCallProcessingRoute(app: Application) {
  app
    .route('/process-call')
    .post(asyncHandler(validateProcessCall), asyncHandler(processCall));
}
