import EnvHelper from '../../config/env.helper';
import ApiError from '../../exception/api.error';
import { ExtractedCallDataSchema } from '../call-processing/call-processing.schema';
import type { ExtractedCallData } from '../call-processing/call-processing.schema';

const CALL_EXTRACTION_INSTRUCTIONS = [
  'You extract structured data from UK GP patient call transcripts.',
  'Return JSON only. Do not include markdown or commentary.',
  '',
  'Rules:',
  '- Do not diagnose.',
  '- Do not invent patient details.',
  '- Normalize date_of_birth to YYYY-MM-DD when explicitly present; otherwise use null.',
  '- Symptoms should be short lowercase clinical terms, for example "cough", "fever", "chest pain".',
  '- duration should be the caller-stated duration as text, for example "5 days"; otherwise null.',
  '- urgency must be one of: emergency, urgent, routine, unknown.',
  '- intent must be one of: book_appointment, request_prescription, request_callback, ask_advice, administrative, emergency, unknown.',
  '- confidence must be a number between 0 and 1.',
  '',
  'Use emergency only for obvious red flags such as severe chest pain, severe breathing difficulty, stroke symptoms, loss of consciousness, severe bleeding, or immediate danger.',
  'Use urgent for likely same-day GP review. Use routine for non-red-flag appointment requests. Use unknown when there is not enough clinical context.',
  '',
  'JSON shape:',
  '{',
  '  "patient": { "name": string | null, "date_of_birth": "YYYY-MM-DD" | null },',
  '  "clinical": { "symptoms": string[], "duration": string | null, "urgency": "emergency" | "urgent" | "routine" | "unknown" },',
  '  "intent": "book_appointment" | "request_prescription" | "request_callback" | "ask_advice" | "administrative" | "emergency" | "unknown",',
  '  "confidence": number',
  '}',
].join('\n');

interface OpenAiChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
}

const OpenAiCallExtractionClient = {
  async extract(transcript: string): Promise<ExtractedCallData> {
    const response = await fetch(`${EnvHelper.getOpenAiBaseUrl()}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${EnvHelper.getOpenAiApiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: EnvHelper.getOpenAiModel(),
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: CALL_EXTRACTION_INSTRUCTIONS,
          },
          {
            role: 'user',
            content: transcript,
          },
        ],
      }),
    });

    const payload = (await response.json()) as OpenAiChatCompletionResponse;

    if (!response.ok)
      throw new ApiError(
        503,
        payload.error?.message || 'LLM extraction request failed',
      );

    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new ApiError(503, 'LLM returned an empty response');

    const parsed = ExtractedCallDataSchema.safeParse(JSON.parse(content));
    if (!parsed.success)
      throw new ApiError(503, 'LLM returned invalid structured data');
    return parsed.data;
  },
};

export default OpenAiCallExtractionClient;
