<template>
  <div class="chat-interface">
    <div class="suggestions" v-if="suggestedQuestions.length > 0">
      <button 
        v-for="(question, index) in suggestedQuestions" 
        :key="index"
        class="suggestion-button"
        @click="handleSuggestion(question)">
        {{ question }}
      </button>
    </div>
    <div class="header">
      <button class="icon-button" @click="toggleHistory">
        <i class="fas" :class="showHistory ? 'fa-chevron-down' : 'fa-chevron-up'"></i>
      </button>

    </div>

    <div class="messages" ref="messagesContainer" v-show="showHistory">
      <div v-for="(message, index) in messages" 
           :key="index" 
           :class="['message', message.isUser ? 'user-message' : 'bot-message']"
           v-html="formatMessage(message.text)">
      </div>
    </div>

    <div class="input-container">
      <div class="message-input">
        <div class="action-buttons">
          <button class="icon-button primary" @click="sendMessage">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        <textarea
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Type your message..."
        ></textarea>
        <div class="action-buttons">
          <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none">
          <button class="icon-button" @click="toggleMute" :class="{ 'active': isMuted }">
            <i :class="['fas', isMuted ? 'fa-volume-mute' : 'fa-volume-up']"></i>
          </button>
          <button class="icon-button" @click="toggleVoiceRecording" :class="{ 'active': isRecording }">
            <i class="fas fa-microphone"></i>
          </button>
          <button class="icon-button" @click="$refs.fileInput.click()">
            <i class="fas fa-paperclip"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import { marked } from 'marked'

const formatMessage = (text: string) => {
  // Separar el texto en secciones usando '___' como delimitador
  const sections = text.split('___')
  
  // Procesar cada sección con Markdown
  return sections.map(section => 
    marked.parse(section.trim(), { breaks: true })
  ).join('<hr class="section-divider">')
}

const props = defineProps<{
  messages: Array<{text: string, isUser: boolean}>,
  currentAgent: string
}>()

const emit = defineEmits(['update:messages'])
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const isRecording = ref(false)
const isMuted = ref(false)
const showHistory = ref(true)
const selectedAgent = ref(props.currentAgent)
const fileInput = ref<HTMLInputElement | null>(null)

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const toggleHistory = () => {
  showHistory.value = !showHistory.value
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
}

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    try {
      await apiService.uploadFile(file)
      const fileMessage = { text: `File uploaded successfully: ${file.name}`, isUser: true }
      emit('update:messages', [...props.messages, fileMessage])
    } catch (error) {
      const errorMessage = { text: `Error uploading file: ${file.name}`, isUser: true }
      emit('update:messages', [...props.messages, errorMessage])
      console.error('Error uploading file:', error)
    }
  }
}

watch(() => props.messages, scrollToBottom, { deep: true })

let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []

const requestMicrophonePermission = async () => {
  try {
    const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    if (result.state === 'denied') {
      alert('Please allow microphone access to use voice recording');
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error checking permissions:', err);
    return false;
  }
};

const startRecording = async () => {
  try {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    isRecording.value = true
    audioChunks = []

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data)
    }

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
      try {
        const text = await apiService.convertAudioToText(audioBlob)
        if (text) {
          newMessage.value = text
        }
      } catch (err) {
        console.error('Error converting audio to text:', err)
      }
    }

    mediaRecorder.start()
  } catch (err) {
    console.error('Error accessing microphone:', err)
  }
}

const stopRecording = () => {
  if (mediaRecorder) {
    mediaRecorder.stop()
    isRecording.value = false
    mediaRecorder.stream.getTracks().forEach(track => track.stop())
  }
}

const toggleVoiceRecording = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}


import ApiService from '../services/ApiService'
const apiService = new ApiService()
const currentStreamingMessage = ref('')
const suggestedQuestions = ref<string[]>([])
const currentMessageId = ref('')

const handleSuggestion = (question: string) => {
  newMessage.value = question
  sendMessage()
}

const sendMessage = async () => {
  const message = newMessage.value.trim()
  if (!message) return

  const userMessage = { text: message, isUser: true }
  const botMessage = { text: '', isUser: false }
  const updatedMessages = [...props.messages, userMessage, botMessage]
  emit('update:messages', updatedMessages)
  newMessage.value = ''
  currentStreamingMessage.value = ''

  if (isMuted.value) return

  try {
    await apiService.sendMessageStream(message, (chunk) => {
      currentStreamingMessage.value += chunk
      const lastMessageIndex = updatedMessages.length - 1
      updatedMessages[lastMessageIndex].text = currentStreamingMessage.value
      emit('update:messages', [...updatedMessages])
    })
  } catch (error) {
    console.error('Error sending message:', error)
  }
}


onMounted(scrollToBottom)
</script>

<style scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.header {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}


.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  scroll-behavior: smooth;
}

.message {
  max-width: 80%;
  margin: 0.5rem 0;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  line-height: 1.4;
}

.user-message {
  margin-left: auto;
  background: #007AFF;
  color: white;
}

.bot-message {
  margin-right: auto;
  background: #F0F0F0;
  color: #333;
}

.bot-message :deep(h1, h2, h3, h4, h5, h6) {
  margin: 0.5em 0;
}

.bot-message :deep(ul, ol) {
  margin-left: 1.5em;
}

.bot-message :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.bot-message :deep(th, td) {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.bot-message :deep(th) {
  background-color: #f5f5f5;
}

.bot-message :deep(.section-divider) {
  margin: 1em 0;
  border: 0;
  border-top: 1px solid #ddd;
}

.bot-message :deep(code) {
  background: #f4f4f4;
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

.bot-message :deep(pre) {
  background: #f4f4f4;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
}

.input-container {
  padding: 1rem;
  border-top: 1px solid #eee;
}

.message-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.message-input textarea {
  flex: 1;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: none;
  font-size: 0.95rem;
  height: 50px;
  overflow-y: hidden;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.new-chat {
  padding: 0.75rem;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.new-chat:hover {
  background: #0066cc;
}

.icon-button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #f0f7ff;
  color: #0066cc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.icon-button:hover {
  background: #e6f2ff;
}

.icon-button.active {
  background: #0066cc;
  color: white;
}

.icon-button.primary {
  background: #007AFF;
  color: white;
}

.icon-button.primary:hover {
  background: #0066cc;
}

.suggestions {
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.suggestion-button {
  padding: 0.5rem 1rem;
  background: #f0f7ff;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  color: #0066cc;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.suggestion-button:hover {
  background: #e6f2ff;
  border-color: #0066cc;
}
</style>