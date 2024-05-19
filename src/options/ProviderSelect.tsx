import { Button, Collapse, Input, Select, Spinner, Tabs, useInput, useToasts } from '@geist-ui/core'
import { FC, useCallback, useState } from 'react'
import useSWR from 'swr'
import { getProviderConfigs, ProviderConfigs, ProviderType, saveProviderConfigs, PROVIDER_CONFIG_DEFAULT } from '../config'

interface ConfigProps {
  config: ProviderConfigs
}

const ConfigPanel: FC<ConfigProps> = ({ config }) => {

  const geminiDefUrl = PROVIDER_CONFIG_DEFAULT[ProviderType.Gemini].baseUrl
  const geminiModel = PROVIDER_CONFIG_DEFAULT[ProviderType.Gemini].models[0]

  const openaiDefUrl = PROVIDER_CONFIG_DEFAULT[ProviderType.OpenAI].baseUrl
  const openaiModels = PROVIDER_CONFIG_DEFAULT[ProviderType.OpenAI].models

  const [tab, setTab] = useState<ProviderType>(config.provider)
  const { bindings: geminiApiKey } = useInput(config.configs[ProviderType.Gemini]?.apiKey ?? '')
  const { bindings: geminiBaseUrl } = useInput(config.configs[ProviderType.Gemini]?.baseUrl ?? '')

  const { bindings: openaiApiKey } = useInput(config.configs[ProviderType.OpenAI]?.apiKey ?? '')
  const { bindings: openaiBaseUrl } = useInput(config.configs[ProviderType.OpenAI]?.baseUrl ?? '')
  const [openaiModel, setOpenaiModel] = useState(config.configs[ProviderType.OpenAI]?.model ?? openaiModels[0])
  const { setToast } = useToasts()

  const save = useCallback(async () => {
    if (tab === ProviderType.Gemini) {
      if (!geminiApiKey.value) {
        alert('Please enter your Google Gemini API key')
        return
      }
    } else if (tab === ProviderType.OpenAI) {
      if (!openaiApiKey.value) {
        alert('Please enter your OpenAI API key')
        return
      }
      if (!openaiModel || !openaiModels.includes(openaiModel)) {
        alert('Please select a valid model')
        return
      }
    }

    await saveProviderConfigs(tab, {
      [ProviderType.Gemini]: {
        apiKey: geminiApiKey.value,
        baseUrl: geminiBaseUrl.value,
      },
      [ProviderType.OpenAI]: {
        apiKey: openaiApiKey.value,
        baseUrl: openaiBaseUrl.value,
        model: openaiModel,
      },
    })
    setToast({ text: 'Changes saved', type: 'success' })
  }, [geminiApiKey.value, openaiApiKey.value, openaiModel, openaiModels, setToast, tab])

  return (
    <div className="flex flex-col gap-3">
      <Tabs value={tab} onChange={(v) => setTab(v as ProviderType)}>
        <Tabs.Item label="Gemini API" value={ProviderType.Gemini}>
          <div className="flex flex-col gap-2">
            <span>
              Google Gemini API, <span className="font-semibold">free for now</span>
            </span>
            <div className="flex flex-row gap-2">
              <Input readOnly scale={2 / 3} initialValue={geminiModel} />
              <Input.Password label="API key" scale={2 / 3} {...geminiApiKey} width="100%" />
            </div>
            <Collapse title="Custom Endpoint" scale={1 / 4}>
              <Input label="Endpoint URL" placeholder={geminiDefUrl} scale={2 / 3} {...geminiBaseUrl} width="100%" />
            </Collapse>
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
                value={openaiModel}
                onChange={(v) => setOpenaiModel(v as string)}
                placeholder="model">
                {openaiModels.map((m) => (
                  <Select.Option key={m} value={m}>
                    {m}
                  </Select.Option>
                ))}
              </Select>
              <Input.Password htmlType="password" label="API key" scale={2 / 3} {...openaiApiKey} width="100%" />
            </div>
            <Collapse title="Custom Endpoint" scale={1 / 4}>
              <Input label="Endpoint URL" placeholder={openaiDefUrl} scale={2 / 3} {...openaiBaseUrl} width="100%" />
            </Collapse>

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
    const config = await getProviderConfigs()
    return { config }
  })
  if (query.isLoading) {
    return <Spinner />
  }
  return <ConfigPanel config={query.data!.config} />
}

export default ProviderSelect
