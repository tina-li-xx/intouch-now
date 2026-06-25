import type { AppEnvironment } from './secrets';
import { ENVIRONMENT, requireEnv } from './secrets';

interface AppEnvironmentConfig {
  openAiApiKey: string;
  openAiBaseUrl: string;
  openAiModel: string;
}

const OPENAI_BASE_URL = 'https://api.openai.com/v1';
const OPENAI_MODEL = 'gpt-4o-mini';

const envConfig: Record<AppEnvironment, () => AppEnvironmentConfig> = {
  development: () => ({
    openAiApiKey: requireEnv('OPENAI_API_KEY'),
    openAiBaseUrl: requireEnv('OPENAI_BASE_URL'),
    openAiModel: requireEnv('OPENAI_MODEL'),
  }),
  test: () => ({
    openAiApiKey: process.env.OPENAI_API_KEY || 'test-key',
    openAiBaseUrl: process.env.OPENAI_BASE_URL || OPENAI_BASE_URL,
    openAiModel: process.env.OPENAI_MODEL || OPENAI_MODEL,
  }),
};

export default envConfig[ENVIRONMENT]();
