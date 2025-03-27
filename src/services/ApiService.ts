import axios from "axios";

export default class ApiService {
  private baseUrl: string;
  private agentToken: string;
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
    this.baseUrl = import.meta.env.VITE_AGENT_URL || "";
    this.agentToken = params.get("agentToken") || "default_token";
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
    try {
      const formData = new FormData();
      formData.append("file", audioBlob);
      const response = await fetch(`${this.baseUrl}/v1/audio-to-text`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${this.agentToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error("Error converting audio to text:", error);
      return "Error al convertir audio a texto. Por favor, intente nuevamente.";
    }
  }

  async uploadFile(file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user", this.userId.toString());

      const response = await fetch(`${this.baseUrl}/v1/files/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${this.agentToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  async sendMessageStream(message: string, onChunk: (chunk: string) => void) {
    try {
      const inputs: any = {
        baseURL: this.moodleUrl,
        token: this.moodleToken,
        userid: this.userId.toString(),
        courseid: this.courseId.toString(),
      };
      if (this.customPrompt) inputs.custom_prompt = this.customPrompt;
      if (this.elsaToken) inputs.elsatoken = this.elsaToken;
      if (this.sectionId) inputs.sectionid = this.sectionId;
      if (this.resourceId) inputs.resourceid = this.resourceId;
      const payload: any = {
        inputs: inputs,
        query: message,
        response_mode: "streaming",
        conversation_id: "",
        user: this.userId.toString(),
        files: [],
      };
      const response = await fetch(`${this.baseUrl}/v1/chat-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.agentToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += new TextDecoder().decode(value);
        const lines = buffer.split("\n");

        for (let i = 0; i < lines.length - 1; i++) {
          if (lines[i].trim() === "") continue;

          try {
            const dataStr = lines[i].replace("data: ", "");
            const data = JSON.parse(dataStr);

            if (data.event === "agent_thought" && data.thought) {
              onChunk(data.thought);
            }
          } catch (e) {
            console.error("Error parsing chunk:", e);
          }
        }

        buffer = lines[lines.length - 1];
      }
    } catch (error) {
      console.error("Error in streaming:", error);
      throw error;
    }
  }
}
