<template>
  <div class="chat-interface">
    <div class="chat-header">
      <div class="config-menu">
        <button class="config-button" @click="toggleConfig">
          ⚙️ ELSA Config
        </button>
        <div v-if="showConfig" class="config-panel">
          <div class="config-option">
            <label>Analytics Mode:</label>
            <select v-model="analyticsMode">
              <option value="basic">Basic Analysis</option>
              <option value="detailed">Detailed Analysis</option>
              <option value="advanced">Advanced Analytics</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
        {{ message.content }}
      </div>
    </div>

    <div class="input-container">
      <div class="message-input">
        <textarea
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Type your message..."
        ></textarea>
        <div class="action-buttons">
          <button class="icon-button" @click="toggleVoiceRecording" :class="{ 'active': isRecording }">
            <i class="fas fa-microphone"></i>
          </button>
          <button class="icon-button" @click="sendMessage">
            <i class="fas fa-paper-plane"></i>
          </button>
          <button class="icon-button" @click="toggleConfig">
            <i class="fas fa-cog"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import ApiService from '../services/ApiService'

const props = defineProps<{
  currentAgent: string
  messages: Array<{text: string, isUser: boolean, type: string}>
}>()

const emit = defineEmits(['update:messages'])

const api = new ApiService()
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const isRecording = ref(false)
const isMuted = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const showConfig = ref(false);
const analyticsMode = ref('basic');
let mediaRecorder: MediaRecorder | null = null

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(() => props.messages, scrollToBottom, { deep: true })

const toggleMute = () => {
  isMuted.value = !isMuted.value
}

const toggleConfig = () => {
  showConfig.value = !showConfig.value;
}

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    isRecording.value = true

    mediaRecorder.ondataavailable = async (event) => {
      const audioBlob = new Blob([event.data], { type: 'audio/wav' })
      // Handle the audio blob - you can send it to your API here
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
    stopRecording();
  } else {
    startRecording();
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    const file = target.files[0]
    // Handle file upload here
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const userMessage = { text: newMessage.value, isUser: true, type: 'user' }
  const updatedMessages = [...props.messages, userMessage]
  emit('update:messages', updatedMessages)

  newMessage.value = ''

  try {
    const response = await api.sendToDify(userMessage.text)
    const botMessage = { text: response.answer, isUser: false, type: 'bot' }
    emit('update:messages', [...updatedMessages, botMessage])
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
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.chat-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  background: #fcfcfc;
}

.config-menu {
  position: relative;
}

.config-button {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.config-button:hover {
  background: #f8f9fa;
}

.config-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  padding: 1rem;
  min-width: 200px;
  z-index: 1000;
}

.config-option {
  margin-bottom: 0.5rem;
}

.config-option label {
  display: block;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
  color: #666;
}

.config-option select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
}

.control-panel {
  padding: 1rem;
  background: #fcfcfc;
  border-top: 1px solid #eee;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
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
  margin-left: 0.5rem;
}

.icon-button:hover {
  background: #e6f2ff;
  transform: translateY(-1px);
}

.icon-button.active {
  background: #e6f2ff;
  color: #0066cc;
}

.action-buttons {
  display: flex;
  align-items: center;
}

.message-input {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.message-input textarea {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: none;
  font-size: 0.95rem;
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
  word-break: break-word;
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
</style>