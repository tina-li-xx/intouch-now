import type {
  ExtractedCallData,
  CallProcessingResult,
} from '../call-processing/call-processing.schema';
import CallActionHelper from './call-action.helper';

const CallActionService = {
  buildResult(
    transcript: string,
    extracted: ExtractedCallData,
  ): CallProcessingResult {
    const urgency = CallActionHelper.normalizeUrgency(
      transcript,
      extracted.clinical.urgency,
    );
    const confidencePenalty = CallActionHelper.hasMissingCoreInformation(
      extracted,
    )
      ? 0.15
      : 0;

    return {
      patient: extracted.patient,
      clinical: {
        ...extracted.clinical,
        urgency,
      },
      intent: CallActionHelper.normalizeIntent(urgency, extracted.intent),
      confidence: CallActionHelper.clampConfidence(
        extracted.confidence - confidencePenalty,
      ),
      recommended_action: CallActionHelper.recommendAction(extracted, urgency),
    };
  },
};

export default CallActionService;
