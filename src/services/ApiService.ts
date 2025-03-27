
import axios from 'axios'

export default class ApiService {
  private baseUrl: string
  private token: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_MOODLE_URL
    this.token = import.meta.env.VITE_MOODLE_TOKEN
  }

  async sendMessageStream(message: string, onChunk: (chunk: string) => void) {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          message,
          course_id: import.meta.env.VITE_MOODLE_COURSE_ID,
          user_id: import.meta.env.VITE_MOODLE_USER_ID,
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
