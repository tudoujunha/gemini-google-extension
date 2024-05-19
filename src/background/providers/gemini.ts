import { GoogleGenerativeAI } from '@google/generative-ai'
import { GenerateAnswerParams, Provider } from '../types'

export class GeminiProvider implements Provider {
  private genAI: GoogleGenerativeAI

  constructor(token: string, private baseUrl: string, private model: string) {
    this.genAI = new GoogleGenerativeAI(token);
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async generateAnswer(params: GenerateAnswerParams) {
    const model = this.genAI.getGenerativeModel({ model: this.model }, { baseUrl: this.baseUrl })
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
