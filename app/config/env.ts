import type { AppEnvironment } from './secrets';
import { OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL } from './secrets';

interface AppEnvironmentConfig {
  openAiApiKey: string;
  openAiBaseUrl: string;
  openAiModel: string;
}

const sharedOpenAiConfig: AppEnvironmentConfig = {
  openAiApiKey: OPENAI_API_KEY,
  openAiBaseUrl: OPENAI_BASE_URL,
  openAiModel: OPENAI_MODEL,
};

const envConfig: Record<AppEnvironment, AppEnvironmentConfig> = {
  development: {
    ...sharedOpenAiConfig,
  },
  test: {
    ...sharedOpenAiConfig,
  },
};

export default envConfig;
