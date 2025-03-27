import axios from "axios";

export default class ApiService {
  private baseUrl: string;
  private token: string;
  private userId: string;
  private moodleUrl: string;
  private moodleToken: string;
  private courseId: string;

  constructor() {
    const params = new URLSearchParams(window.location.search);
    this.baseUrl = import.meta.env.VITE_AGENT_URL || "";
    this.token = params.get("agentToken") || "default_token";
    this.userId = params.get("userId") || "default_user";
    this.moodleUrl = params.get("moodleUrl") || "";
    this.moodleToken = params.get("moodleToken") || "";
    this.courseId = params.get("courseId") || "";
  }

  async convertAudioToText(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    try {
      const response = await fetch(`${this.baseUrl}/v1/audio-to-text`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.text || "";
    } catch (error) {
      console.error("Error converting audio to text:", error);
      throw error;
    }
  }

  async sendMessageStream(message: string, onChunk: (chunk: string) => void) {
    try {
      const response = await fetch(`${this.baseUrl}/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          message: message,
          moodle_url: this.moodleUrl,
          moodle_token: this.moodleToken,
          course_id: this.courseId,
          user_id: this.userId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        onChunk(chunk);
      }
    } catch (error) {
      console.error("Error in streaming:", error);
      throw error;
    }
  }
}
