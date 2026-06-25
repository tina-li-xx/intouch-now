import ApiError from '../../exception/api.error';
import { CallProcessingResultSchema } from './call-processing.schema';
import type { CallProcessingResult } from './call-processing.schema';
import CallActionService from '../call-action/call-action.service';
import OpenAiCallExtractionClient from '../llm/openai-call-extraction.client';

const CallProcessingService = {
  async process(transcript: string): Promise<CallProcessingResult> {
    const parsed = CallProcessingResultSchema.safeParse(
      CallActionService.buildResult(
        transcript,
        await OpenAiCallExtractionClient.extract(transcript),
      ),
    );
    if (!parsed.success)
      throw new ApiError(503, 'processed call output was invalid');
    return parsed.data;
  },
};

export default CallProcessingService;
