import { ENVIRONMENT } from './secrets';
import envByEnvironment from './env';

const { openAiApiKey, openAiBaseUrl, openAiModel } =
  envByEnvironment[ENVIRONMENT];

const EnvHelper = {
  getPort(defaultPort = 8080) {
    const port = Number(process.env.PORT);
    if (!Number.isFinite(port)) return defaultPort;
    return Math.max(1, Math.floor(port));
  },
  getOpenAiApiKey() {
    return openAiApiKey;
  },
  getOpenAiBaseUrl() {
    return openAiBaseUrl;
  },
  getOpenAiModel() {
    return openAiModel;
  },
};

export default EnvHelper;
