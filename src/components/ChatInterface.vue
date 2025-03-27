
<template>
  <div class="chat-container">
    <div class="messages-container" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" 
           :class="['message', message.isUser ? 'user-message' : 'bot-message']">
        <p>{{ message.text }}</p>
      </div>
    </div>
    
    <div class="input-container">
      <div class="attachment-container">
        <input type="file" ref="fileInput" @change="handleFileUpload" class="file-input" />
        <button class="icon-button" @click="triggerFileInput">
          <i class="fas fa-paperclip"></i>
        </button>
      </div>

      <textarea 
        v-model="newMessage" 
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
        rows="1"
        ref="messageInput"
      ></textarea>

      <div class="action-buttons">
        <button class="icon-button" @click="toggleMute">
          <i :class="['fas', isMuted ? 'fa-volume-mute' : 'fa-volume-up']"></i>
        </button>
        
        <button v-if="isRecording" @click="stopRecording" class="icon-button recording">
          <i class="fas fa-stop"></i>
        </button>
        <button v-else @click="startRecording" class="icon-button">
          <i class="fas fa-microphone"></i>
        </button>

        <button @click="sendMessage" class="send-button" :disabled="!newMessage.trim()">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import ApiService from '../services/ApiService'

const props = defineProps<{
  currentAgent: string
  messages: Array<{text: string, isUser: boolean}>
}>()

const emit = defineEmits(['update:messages'])

const api = new ApiService()
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const isRecording = ref(false)
const isMuted = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
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
  
  const userMessage = { text: newMessage.value, isUser: true }
  const updatedMessages = [...props.messages, userMessage]
  emit('update:messages', updatedMessages)
  
  newMessage.value = ''
  
  try {
    const response = await api.sendToDify(userMessage.text)
    const botMessage = { text: response.answer, isUser: false }
    emit('update:messages', [...updatedMessages, botMessage])
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

onMounted(scrollToBottom)
</script>

<style scoped>
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
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
  background: #fff;
  border-top: 1px solid #eee;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}

textarea {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.4;
  max-height: 120px;
  transition: all 0.2s ease;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.icon-button {
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #666;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover {
  background: #f5f5f5;
  color: #333;
}

.recording {
  color: #FF3B30;
  animation: pulse 1.5s infinite;
}

.send-button {
  background: #007AFF;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-button:hover {
  transform: scale(1.05);
}

.send-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.file-input {
  display: none;
}

.attachment-container {
  position: relative;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>
