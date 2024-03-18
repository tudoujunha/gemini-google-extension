import { defaults } from 'lodash-es'
import Browser from 'webextension-polyfill'

export enum TriggerMode {
  Always = 'always',
  QuestionMark = 'questionMark',
  Manually = 'manually',
}

export const TRIGGER_MODE_TEXT = {
  [TriggerMode.Always]: { title: 'Always', desc: 'Gemini is queried on every search' },
  [TriggerMode.QuestionMark]: {
    title: 'Question Mark',
    desc: 'When your query ends with a question mark (?)',
  },
  [TriggerMode.Manually]: {
    title: 'Manually',
    desc: 'Gemini is queried when you manually click a button',
  },
}

export enum Theme {
  Auto = 'auto',
  Light = 'light',
  Dark = 'dark',
}

export enum Language {
  Auto = 'auto',
  English = 'english',
  Chinese = 'chinese',
  Spanish = 'spanish',
  French = 'french',
  Korean = 'korean',
  Japanese = 'japanese',
  German = 'german',
  Portuguese = 'portuguese',
}

const userConfigWithDefaultValue = {
  triggerMode: TriggerMode.Always,
  theme: Theme.Auto,
  language: Language.Auto,
}

export type UserConfig = typeof userConfigWithDefaultValue

export async function getUserConfig(): Promise<UserConfig> {
  const result = await Browser.storage.local.get(Object.keys(userConfigWithDefaultValue))
  return defaults(result, userConfigWithDefaultValue)
}

export async function updateUserConfig(updates: Partial<UserConfig>) {
  console.debug('update configs', updates)
  return Browser.storage.local.set(updates)
}

export enum ProviderType {
  Gemini = 'Gemini',
  OpenAI = 'OpenAI',
}

interface OpenAIProviderConfig {
  model: string
  apiKey: string
}

interface GeminiProviderConfig {
  apiKey: string
}

export interface ProviderConfigs {
  provider: ProviderType
  configs: {
    [ProviderType.Gemini]: GeminiProviderConfig | undefined
    [ProviderType.OpenAI]: OpenAIProviderConfig | undefined
  }
}

export async function getStoredProviderType(): Promise<string> {
  const { provider = ProviderType.Gemini } = await Browser.storage.local.get('provider');
  return provider;
}

export async function getProviderConfigs(): Promise<ProviderConfigs> {
  const { provider = ProviderType.Gemini } = await Browser.storage.local.get('provider')
  const configGeminiKey = `provider:${ProviderType.Gemini}`
  const configOpenAIKey = `provider:${ProviderType.OpenAI}`
  const resultGeminKey = await Browser.storage.local.get(configGeminiKey)
  const resultOpenAIKey = await Browser.storage.local.get(configOpenAIKey)
  return {
    provider,
    configs: {
      [ProviderType.Gemini]: resultGeminKey[configGeminiKey],
      [ProviderType.OpenAI]: resultOpenAIKey[configOpenAIKey],
    },
  }
}

export async function saveProviderConfigs(
  provider: ProviderType,
  configs: ProviderConfigs['configs'],
) {
  return Browser.storage.local.set({
    provider,
    [`provider:${ProviderType.Gemini}`]: configs[ProviderType.Gemini],
    [`provider:${ProviderType.OpenAI}`]: configs[ProviderType.OpenAI],
  })
}
