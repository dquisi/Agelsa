import axios from "axios";

export default class ApiService {
  private baseUrl: string;
  private token: string;
  private moodleUrl: string;
  private moodleToken: string;
  private elsaToken?: string;
  private userId: number;
  private courseId: number;
  private sectionId?: number;
  private resourceId?: number;
  private customPrompt?: string;

  constructor() {
    const params = new URLSearchParams(window.location.search);
    this.baseUrl = import.meta.env.VITE_AGENT_URL || "http://0.0.0.0:5000";
    this.token = params.get("token") || "default_token";
    this.moodleUrl = params.get("moodleUrl") || "";
    this.moodleToken = params.get("moodleToken") || "";
    this.userId = Number(params.get("userId")) || 1;
    this.courseId = Number(params.get("courseId")) || 0;
    this.elsaToken = params.get("elsaToken") || undefined;
    this.sectionId = params.get("sectionId")
      ? Number(params.get("sectionId"))
      : undefined;
    this.resourceId = params.get("resourceId")
      ? Number(params.get("resourceId"))
      : undefined;
    this.customPrompt = params.get("customPrompt") || undefined;
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
        baseURL: this.moodleUrl,
        token: this.moodleToken,
        userid: this.userId,
        courseid: this.courseId,
      };

      if (this.customPrompt) payload.custom_prompt = this.customPrompt;
      if (this.elsaToken) payload.elsatoken = this.elsaToken;
      if (this.sectionId) payload.sectionid = this.sectionId;
      if (this.resourceId) payload.resourceid = this.resourceId;

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