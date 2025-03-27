
import axios from 'axios'

export default class ApiService {
  private baseUrl: string
  private token: string
  private courseId: string
  private userId: string
  private agentToken: string

  constructor() {
    const params = new URLSearchParams(window.location.search)
    this.baseUrl = params.get('moodleUrl') || ''
    this.token = params.get('moodleToken') || ''
    this.courseId = params.get('courseId') || ''
    this.userId = params.get('userId') || ''
    this.agentToken = params.get('agentToken') || ''

    if (!this.baseUrl || !this.token || !this.courseId || !this.userId || !this.agentToken) {
      throw new Error('Missing required URL parameters')
    }
  }

  async sendMessageStream(message: string, onChunk: (chunk: string) => void) {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          'X-Agent-Token': this.agentToken
        },
        body: JSON.stringify({
          message,
          course_id: this.courseId,
          user_id: this.userId,
          stream: true
        })
      })

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
