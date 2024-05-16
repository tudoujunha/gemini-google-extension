import { Button, Input, Select, Spinner, Tabs, useInput, useToasts } from '@geist-ui/core'
import { FC, useCallback, useState } from 'react'
import useSWR from 'swr'
import { getProviderConfigs, ProviderConfigs, ProviderType, saveProviderConfigs } from '../config'

interface ConfigProps {
  config: ProviderConfigs
  models: string[]
  models_gemini: string[]
}

async function loadModels(): Promise<string[]> {
  const configs = {
    openai_model_names: ['gpt-3.5-turbo','gpt-4-turbo-preview','gpt-4'],
  }
  return configs.openai_model_names
}
async function loadModels_gemini(): Promise<string[]> {
  const configs = {
    gemini_model_names: ["gemini-1.5-flash-latest", "gemini-1.5-pro-latest", "gemini-1.0-pro"]
  }
  return configs.gemini_model_names
}

const ConfigPanel: FC<ConfigProps> = ({ config, models,models_gemini }) => {
  const [tab, setTab] = useState<ProviderType>(config.provider)
  const { bindings: geminiApiKey } = useInput(config.configs[ProviderType.Gemini]?.apiKey ?? '')
  const { bindings: openaiApiKey } = useInput(config.configs[ProviderType.OpenAI]?.apiKey ?? '')
  const [model, setModel] = useState(config.configs[ProviderType.OpenAI]?.model ?? models[0])
  const [model_gemini, setModel_gemini] = useState(config.configs[ProviderType.Gemini]?.model_gemini ?? models_gemini[0])
  const { setToast } = useToasts()
  const save = useCallback(async () => {
    if (tab === ProviderType.Gemini) {
      if (!geminiApiKey.value) {
        alert('Please enter your Google Gemini API key')
        return
      }
      if (!model_gemini || !models_gemini.includes(model_gemini)) {
        alert('Please select a valid model')
        return
      }
    } else if (tab === ProviderType.OpenAI) {
      if (!openaiApiKey.value) {
        alert('Please enter your OpenAI API key')
        return
      }
      if (!model || !models.includes(model)) {
        alert('Please select a valid model')
        return
      }
    }

    await saveProviderConfigs(tab, {
      [ProviderType.Gemini]: {
        model_gemini,
        apiKey: geminiApiKey.value,
      },
      [ProviderType.OpenAI]: {
        model,
        apiKey: openaiApiKey.value,
      },
    })
    setToast({ text: 'Changes saved', type: 'success' })
  }, [geminiApiKey.value, openaiApiKey.value, model_gemini , models_gemini, model, models, setToast, tab])

  return (
    <div className="flex flex-col gap-3">
      <Tabs value={tab} onChange={(v) => setTab(v as ProviderType)}>
        <Tabs.Item label="Gemini API" value={ProviderType.Gemini}>
          <div className="flex flex-col gap-2">
            <span>
              Google Gemini API, <span className="font-semibold">free for now</span>
            </span>
            <div className="flex flex-row gap-2">
              <Select
                  scale={2 / 3}
                  value={model_gemini}
                  onChange={(v) => setModel_gemini(v as string)}
                  placeholder="model_gemini"
                >
                  {models_gemini.map((m) => (
                    <Select.Option key={m} value={m}>
                      {m}
                    </Select.Option>
                  ))}
                </Select>
              <Input htmlType="password" label="API key" scale={2 / 3} {...geminiApiKey} />
            </div>
            <span className="italic text-xs">
              You can find or create your API key{' '}
              <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noreferrer">
                here
              </a>
            </span>
          </div>
        </Tabs.Item>
        <Tabs.Item label="OpenAI API" value={ProviderType.OpenAI}>
          <div className="flex flex-col gap-2">
            <span>
              OpenAI official API, more stable,{' '}
              <span className="font-semibold">charge by usage</span>
            </span>
            <div className="flex flex-row gap-2">
              <Select
                scale={2 / 3}
                value={model}
                onChange={(v) => setModel(v as string)}
                placeholder="model"
              >
                {models.map((m) => (
                  <Select.Option key={m} value={m}>
                    {m}
                  </Select.Option>
                ))}
              </Select>
              <Input htmlType="password" label="API key" scale={2 / 3} {...openaiApiKey} />
            </div>
            <span className="italic text-xs">
              You can find or create your API key{' '}
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
            </span>
          </div>
        </Tabs.Item>
      </Tabs>
      <Button scale={2 / 3} ghost style={{ width: 20 }} type="success" onClick={save}>
        Save
      </Button>
    </div>
  )
}

function ProviderSelect() {
  const query = useSWR('provider-configs', async () => {
    const [config, models, models_gemini] = await Promise.all([getProviderConfigs(), loadModels(), loadModels_gemini()])
    return { config, models,models_gemini }
  })
  if (query.isLoading) {
    return <Spinner />
  }
  return <ConfigPanel config={query.data!.config} models={query.data!.models} models_gemini={query.data!.models_gemini} />
}

export default ProviderSelect
