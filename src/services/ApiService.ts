
import axios from 'axios'

export default class ApiService {
  private baseUrl: string
  private token: string
  private userId: string
  private moodleUrl: string
  private moodleToken: string
  private courseId: string

  constructor() {
    const params = new URLSearchParams(window.location.search)
    this.baseUrl = 'http://agente.cedia.org.ec'
    this.token = params.get('agentToken') || 'default_token'
    this.userId = params.get('userId') || 'default_user'
    this.moodleUrl = params.get('moodleUrl') || ''
    this.moodleToken = params.get('moodleToken') || ''
    this.courseId = params.get('courseId') || ''
  }

  async sendMessageStream(message: string, onChunk: (chunk: string) => void) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/chat-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          inputs: {},
          query: message,
          response_mode: "streaming",
          conversation_id: "",
          user: this.userId,
          files: []
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = new TextDecoder().decode(value)
        onChunk(chunk)
      }
    } catch (error) {
      console.error('Error in streaming:', error)
      throw error
    }
  }
}
