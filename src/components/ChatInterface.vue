<template>
  <div class="chat-interface">
    <div class="messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.isUser ? 'user' : 'bot']">
        <div v-if="message.type === 'file'" class="file-message">
          <a :href="message.url" target="_blank">📎 {{ message.filename }}</a>
        </div>
        <div v-else-if="message.type === 'audio'" class="audio-message">
          <audio controls :src="message.url"></audio>
        </div>
        <div v-else>{{ message.text }}</div>
      </div>
    </div>

    <div class="input-container">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message..." type="text"/>
      <label class="attach-file">
        📎
        <input type="file" @change="handleFileAttachment" style="display: none"/>
      </label>
      <button @click="toggleVoiceRecording" :class="['voice-btn', { 'recording': isRecording }]">
        🎤
      </button>
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps<{
  currentAgent: string
  messages: Array<{text?: string, isUser: boolean, type?: string, url?: string, filename?: string}>
}>()

const emit = defineEmits(['update:messages'])
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const isRecording = ref(false)
let mediaRecorder: MediaRecorder | null = null
let audioChunks: BlobPart[] = []

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const updatedMessages = [...props.messages]
  updatedMessages.push({ text: newMessage.value, isUser: true })
  emit('update:messages', updatedMessages)
  newMessage.value = ''
}

const handleFileAttachment = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const url = URL.createObjectURL(file)
    const updatedMessages = [...props.messages]
    updatedMessages.push({ 
      type: 'file',
      url,
      filename: file.name,
      isUser: true 
    })
    emit('update:messages', updatedMessages)
  }
}

const toggleVoiceRecording = async () => {
  if (!isRecording.value) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder = new MediaRecorder(stream)
      audioChunks = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        const updatedMessages = [...props.messages]
        updatedMessages.push({ 
          type: 'audio',
          url: audioUrl,
          isUser: true 
        })
        emit('update:messages', updatedMessages)
      }

      mediaRecorder.start()
      isRecording.value = true
    } catch (err) {
      console.error('Error accessing microphone:', err)
    }
  } else {
    if (mediaRecorder) {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach(track => track.stop())
    }
    isRecording.value = false
  }
}

watch(() => props.messages, () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }, 100)
}, { deep: true })
</script>

<style scoped>
.chat-interface {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
}

.file-message {
  padding: 0.5rem;
  background: #f0f0f0;
  border-radius: 8px;
}

.file-message a {
  color: #2c3e50;
  text-decoration: none;
}

.audio-message {
  padding: 0.5rem;
}

.audio-message audio {
  max-width: 300px;
}

.attach-file {
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
}

.voice-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.voice-btn.recording {
  color: red;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style>