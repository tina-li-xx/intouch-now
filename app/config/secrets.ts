import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) dotenv.config({ path: '.env' });

const APP_ENVIRONMENTS = ['development', 'test'] as const;
export type AppEnvironment = (typeof APP_ENVIRONMENTS)[number];

const fail = (message: string): never => {
  process.stderr.write(`${message}\n`);
  process.exit(1);
};

const requireEnv = (name: string) => {
  const value = process.env[name];
  if (!value) return fail(`${name} must not be undefined`);
  return value;
};

const readEnvironment = (): AppEnvironment => {
  const environment = requireEnv('NODE_ENV');

  if (!APP_ENVIRONMENTS.includes(environment as AppEnvironment)) {
    fail('NODE_ENV must be either "development" or "test"');
  }

  return environment as AppEnvironment;
};

export const ENVIRONMENT = readEnvironment();
export const OPENAI_API_KEY = requireEnv('OPENAI_API_KEY');
export const OPENAI_BASE_URL = requireEnv('OPENAI_BASE_URL');
export const OPENAI_MODEL = requireEnv('OPENAI_MODEL');
