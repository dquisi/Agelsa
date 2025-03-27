
<template>
  <div class="chat-interface">
    <div class="header">
      <button class="icon-button" @click="toggleHistory">
        <i class="fas" :class="showHistory ? 'fa-chevron-down' : 'fa-chevron-up'"></i>
      </button>
      <select v-model="selectedAgent" class="agent-select">
        <option value="default">Default Agent</option>
        <option value="gpt4">GPT-4</option>
        <option value="custom">Custom</option>
      </select>
    </div>

    <div class="messages" ref="messagesContainer" v-show="showHistory">
      <div v-for="(message, index) in messages" 
           :key="index" 
           :class="['message', message.isUser ? 'user-message' : 'bot-message']">
        {{ message.text }}
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

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const fileMessage = { text: `File uploaded: ${file.name}`, isUser: true }
      emit('update:messages', [...props.messages, fileMessage])
    }
    reader.readAsDataURL(file)
  }
}

watch(() => props.messages, scrollToBottom, { deep: true })

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    isRecording.value = true

    mediaRecorder.ondataavailable = async (event) => {
      const audioBlob = new Blob([event.data], { type: 'audio/wav' })
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

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const userMessage = { text: newMessage.value, isUser: true }
  const updatedMessages = [...props.messages, userMessage]
  emit('update:messages', updatedMessages)

  try {
    const response = await axios.post('/api/v1/chat/completions', {
      message: newMessage.value,
      agent: selectedAgent.value
    })

    if (response.data && !isMuted.value) {
      const botMessage = { text: response.data.answer, isUser: false }
      emit('update:messages', [...updatedMessages, botMessage])
    }
  } catch (error) {
    console.error('Error sending message:', error)
  }

  newMessage.value = ''
}

let mediaRecorder: MediaRecorder | null = null

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

.agent-select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  background: #fff;
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
</style>
