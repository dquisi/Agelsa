<template>
  <div class="chat-interface">
    <div class="messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" 
           :key="index" 
           :class="['message', message.isUser ? 'user-message' : 'bot-message']">
        {{ message.text }}
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
          <button class="icon-button" @click="toggleMute" :class="{ 'active': isMuted }">
            <i :class="['fas', isMuted ? 'fa-volume-mute' : 'fa-volume-up']"></i>
          </button>
          <button class="icon-button" @click="toggleVoiceRecording" :class="{ 'active': isRecording }">
            <i class="fas fa-microphone"></i>
          </button>
          <button class="icon-button" @click="sendMessage">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
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
      // Handle audio here
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
      agent: props.currentAgent
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

onMounted(scrollToBottom)
</script>

<style scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
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
  gap: 0.5rem;
  align-items: flex-end;
}

.message-input textarea {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: none;
  font-size: 0.95rem;
  min-height: 45px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
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
</style>