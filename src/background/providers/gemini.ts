import { GoogleGenerativeAI } from '@google/generative-ai'
import { GenerateAnswerParams, Provider } from '../types'

export class GeminiProvider implements Provider {
  private genAI: GoogleGenerativeAI

  constructor(private token: string) {
    this.token = token
    this.genAI = new GoogleGenerativeAI(this.token)
  }

  async generateAnswer(params: GenerateAnswerParams) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContentStream(params.prompt)
    let text = ''
    for await (const chunk of result.stream) {
      const chunkText = chunk.text()
      text += chunkText
      console.debug('chunkText:', chunkText)
      params.onEvent({
        type: 'answer',
        data: {
          text: text,
          messageId: '',
          conversationId: '',
        },
      })
    }
    params.onEvent({ type: 'done' })
    return {}
  }
}
