import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
}  from '@google/generative-ai'
import { GenerateAnswerParams, Provider } from '../types'

export class GeminiProvider implements Provider {
  private genAI: GoogleGenerativeAI

  constructor(private token: string) {
    this.token = token
    this.genAI = new GoogleGenerativeAI(this.token)
  }

  async generateAnswer(params: GenerateAnswerParams) {
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };
    
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' ,safetySettings , generationConfig})
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
