
import axios from 'axios'

export default class ApiService {
  private baseUrl: string
  private token: string
  private openaiKey: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_BASE_URL
    this.token = import.meta.env.VITE_TOKEN
    this.openaiKey = import.meta.env.VITE_OPENAI_API_KEY
  }

  async sendToDify(message: string) {
    const response = await axios.post(`${this.baseUrl}/chat`, {
      message,
      course_id: import.meta.env.VITE_COURSE_ID,
      user_id: import.meta.env.VITE_USER_ID
    }, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    })
    return response.data
  }

  async sendToOpenAI(message: string) {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }]
    }, {
      headers: {
        Authorization: `Bearer ${this.openaiKey}`
      }
    })
    return response.data.choices[0].message.content
  }
}
