
import axios from 'axios'

export default class ApiService {
  private baseUrl: string
  private token: string
  private agentUrl: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_MOODLE_URL
    this.token = import.meta.env.VITE_MOODLE_TOKEN
    this.agentUrl = import.meta.env.VITE_AGENT_URL
  }

  async sendMessageStream(message: string, onChunk: (chunk: string) => void) {
    try {
      // Get token from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const agentToken = urlParams.get('token');
      
      if (!agentToken) {
        throw new Error('Agent token not provided in URL parameters');
      }

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
