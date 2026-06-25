import { z } from 'zod';

const NonEmptyStringSchema = z.string().trim().min(1);
const DateOfBirthSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const ConfidenceSchema = z.number().min(0).max(1);

const TranscriptSchema = z
  .string({
    required_error: 'transcript is required',
    invalid_type_error: 'transcript must be a string',
  })
  .trim()
  .min(1, 'transcript cannot be empty')
  .max(12000, 'transcript is too long');

export const ProcessCallRequestSchema = z.object({
  transcript: TranscriptSchema,
});

const ClinicalUrgencySchema = z.enum([
  'emergency',
  'urgent',
  'routine',
  'unknown',
]);

const CallIntentSchema = z.enum([
  'book_appointment',
  'request_prescription',
  'request_callback',
  'ask_advice',
  'administrative',
  'emergency',
  'unknown',
]);

const RecommendedActionTypeSchema = z.enum([
  'book_appointment',
  'request_more_information',
  'route_to_admin',
  'emergency_escalation',
]);

const RecommendedActionModeSchema = z.enum([
  'gp_consultation',
  'same_day_gp',
  'telephone_callback',
  'prescription_request',
  'care_navigation',
  'collect_missing_details',
  'emergency_services',
]);

const PatientSchema = z
  .object({
    name: NonEmptyStringSchema.nullable(),
    date_of_birth: DateOfBirthSchema.nullable(),
  })
  .strict();

const ClinicalSchema = z
  .object({
    symptoms: z.array(NonEmptyStringSchema).default([]),
    duration: NonEmptyStringSchema.nullable(),
    urgency: ClinicalUrgencySchema,
  })
  .strict();

const RecommendedActionSchema = z
  .object({
    type: RecommendedActionTypeSchema,
    mode: RecommendedActionModeSchema,
  })
  .strict();

export const ExtractedCallDataSchema = z
  .object({
    patient: PatientSchema,
    clinical: ClinicalSchema,
    intent: CallIntentSchema,
    confidence: ConfidenceSchema,
  })
  .strict();

export const CallProcessingResultSchema = ExtractedCallDataSchema.extend({
  recommended_action: RecommendedActionSchema,
}).strict();

export type ProcessCallRequest = z.infer<typeof ProcessCallRequestSchema>;
export type ClinicalUrgency = z.infer<typeof ClinicalUrgencySchema>;
export type CallIntent = z.infer<typeof CallIntentSchema>;
export type RecommendedAction = z.infer<typeof RecommendedActionSchema>;
export type ExtractedCallData = z.infer<typeof ExtractedCallDataSchema>;
export type CallProcessingResult = z.infer<typeof CallProcessingResultSchema>;
