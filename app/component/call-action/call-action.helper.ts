import type {
  CallIntent,
  ClinicalUrgency,
  ExtractedCallData,
  RecommendedAction,
} from '../call-processing/call-processing.schema';

const EMERGENCY_PATTERNS = [
  /\bchest pain\b/i,
  /\b(can'?t|cannot)\s+breathe\b/i,
  /\bsevere\s+(breathlessness|bleeding|pain)\b/i,
  /\b(unconscious|collapsed)\b/i,
  /\bstroke\b/i,
  /\bface drooping\b/i,
  /\bblue lips\b/i,
  /\bsuicidal\b/i,
];

const CallActionHelper = {
  clampConfidence(confidence: number) {
    return Math.max(0, Math.min(1, Number(confidence.toFixed(2))));
  },

  hasEmergencyRedFlag(transcript: string) {
    return EMERGENCY_PATTERNS.some((pattern) => pattern.test(transcript));
  },

  hasMissingCoreInformation(extracted: ExtractedCallData) {
    return (
      !extracted.patient.name ||
      !extracted.patient.date_of_birth ||
      extracted.clinical.symptoms.length === 0
    );
  },

  normalizeUrgency(
    transcript: string,
    urgency: ClinicalUrgency,
  ): ClinicalUrgency {
    if (CallActionHelper.hasEmergencyRedFlag(transcript)) return 'emergency';
    return urgency;
  },

  normalizeIntent(urgency: ClinicalUrgency, intent: CallIntent): CallIntent {
    if (urgency === 'emergency') return 'emergency';
    return intent;
  },

  recommendAction(
    extracted: ExtractedCallData,
    urgency: ClinicalUrgency,
  ): RecommendedAction {
    if (urgency === 'emergency') {
      return {
        type: 'emergency_escalation',
        mode: 'emergency_services',
      };
    }

    if (CallActionHelper.hasMissingCoreInformation(extracted)) {
      return {
        type: 'request_more_information',
        mode: 'collect_missing_details',
      };
    }

    if (urgency === 'urgent') {
      return {
        type: 'book_appointment',
        mode: 'same_day_gp',
      };
    }

    if (extracted.intent === 'request_prescription') {
      return {
        type: 'route_to_admin',
        mode: 'prescription_request',
      };
    }

    if (extracted.intent === 'request_callback') {
      return {
        type: 'book_appointment',
        mode: 'telephone_callback',
      };
    }

    if (extracted.intent === 'book_appointment') {
      return {
        type: 'book_appointment',
        mode: 'gp_consultation',
      };
    }

    return {
      type: 'route_to_admin',
      mode: 'care_navigation',
    };
  },
};

export default CallActionHelper;
