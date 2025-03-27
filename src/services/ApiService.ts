import axios from "axios";

export default class ApiService {
  private baseUrl: string;
  private token: string;
  private userId: string;
  private courseId: number;
  private elsaToken?: string;
  private sectionId?: number;
  private resourceId?: number;
  private customPrompt?: string;
  private moodleUrl?: string;

  constructor() {
    const params = new URLSearchParams(window.location.search);
    this.baseUrl = import.meta.env.VITE_AGENT_URL;
    this.token = params.get("token") || "default_token";
    this.userId = params.get("userId") || "default_user";
    this.courseId = Number(params.get("courseId")) || 0;
    this.elsaToken = params.get("elsaToken") || undefined;
    this.sectionId = params.get("sectionId")
      ? Number(params.get("sectionId"))
      : undefined;
    this.resourceId = params.get("resourceId")
      ? Number(params.get("resourceId"))
      : undefined;
    this.customPrompt = params.get("customPrompt") || undefined;
    this.moodleUrl = params.get("moodleUrl") || undefined;
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
      const payload: any = {
        message,
        user_id: this.userId,
        course_id: this.courseId,
      };

      if (this.customPrompt) payload.custom_prompt = this.customPrompt;
      if (this.elsaToken) payload.elsa_token = this.elsaToken;
      if (this.sectionId) payload.section_id = this.sectionId;
      if (this.resourceId) payload.resource_id = this.resourceId;

      const response = await fetch(`${this.baseUrl}/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(payload),
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
