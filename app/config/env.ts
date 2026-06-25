import type { AppEnvironment } from './secrets';
import { ENVIRONMENT, requireEnv } from './secrets';

interface AppEnvironmentConfig {
  openAiApiKey: string;
  openAiBaseUrl: string;
  openAiModel: string;
}

const envConfig: Record<AppEnvironment, () => AppEnvironmentConfig> = {
  development: () => ({
    openAiApiKey: requireEnv('OPENAI_API_KEY'),
    openAiBaseUrl: requireEnv('OPENAI_BASE_URL'),
    openAiModel: requireEnv('OPENAI_MODEL'),
  }),
  test: () => ({
    openAiApiKey: 'test-key',
    openAiBaseUrl: 'https://api.openai.com/v1',
    openAiModel: 'gpt-4o-mini',
  }),
};

export default envConfig[ENVIRONMENT]();
