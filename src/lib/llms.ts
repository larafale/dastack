import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { LanguageModel } from 'ai';

export type LLMS =
  | 'openai:whisper'
  | 'openai:4o'
  | 'openai:4o-mini'
  | 'openai:o1'
  | 'openai:o1-mini'
  | 'anthropic:3.5-sonnet'
  | 'anthropic:3.5-haiku'
  | 'anthropic:3-opus';
export type ModelProvider = 'anthropic' | 'openai';
export type LLMString = LLMS;

export const DEFAULT_LLM: LLMString = 'openai:4o';

type ModelConfig = {
  name: string;
  model: string;
  provider: (model: string) => LanguageModel;
};

type ProviderConfig = {
  name: string;
  models: Record<string, ModelConfig>;
};

export const MODEL_CONFIGS: Record<ModelProvider, ProviderConfig> = {
  anthropic: {
    name: 'Anthropic',
    models: {
      '3.5-sonnet': {
        name: 'Claude 3.5 Sonnet',
        model: 'claude-3-5-sonnet-latest',
        provider: anthropic,
      },
      '3.5-haiku': {
        name: 'Claude 3.5 Haiku',
        model: 'claude-3-5-haiku-latest',
        provider: anthropic,
      },
      '3-opus': {
        name: 'Claude 3 Opus',
        model: 'claude-3-opus-latest',
        provider: anthropic,
      },
    },
  },
  openai: {
    name: 'OpenAI',
    models: {
      whisper: {
        name: 'Whisper',
        model: 'whisper-1',
        provider: openai,
      },
      '4o': {
        name: 'GPT-4 Turbo',
        model: 'gpt-4-0125-preview',
        provider: openai,
      },
      '4o-mini': {
        name: 'GPT-4 Turbo Mini',
        model: 'gpt-4-0125-preview',
        provider: openai,
      },
      o1: {
        name: 'GPT-4 Vision',
        model: 'gpt-4-vision-preview',
        provider: openai,
      },
      'o1-mini': {
        name: 'GPT-4 Vision Mini',
        model: 'gpt-4-vision-preview',
        provider: openai,
      },
      'gpt-4': {
        name: 'GPT-4',
        model: 'gpt-4',
        provider: openai,
      },
      'gpt-3.5': {
        name: 'GPT-3.5 Turbo',
        model: 'gpt-3.5-turbo',
        provider: openai,
      },
    },
  },
};

export function parseLLM(llm: LLMString) {
  const [provider, modelId] = llm.split(':') as [ModelProvider, string];
  const config = MODEL_CONFIGS[provider].models[modelId];

  if (!config) {
    throw new Error(`Invalid model configuration: ${llm}`);
  }

  return config;
}

export function getModel(llm: LLMString): LanguageModel {
  const config = parseLLM(llm);
  return config.provider(config.model);
}
