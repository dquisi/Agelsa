<template>
  <div class="chat-interface">
    <div class="messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" :class="message.type">
        {{ message.text }}
      </div>
    </div>
    <div class="controls">
      <button @click="toggleAudio" class="audio-toggle">
        {{ audioEnabled ? '🔊 Audio ON' : '🔈 Audio OFF' }}
      </button>
    </div>
    <div class="input-area">
      <input 
        v-model="inputMessage" 
        @keyup.enter="sendMessage"
        placeholder="Escribe tu mensaje..."
      />
      <button @click="sendMessage">Enviar</button>
      <button @click="toggleListening" class="voice-btn">
        {{ isListening ? '🎤 Detener' : '🎤 Hablar' }}
      </button>
      <input 
        type="file" 
        @change="handleFileUpload" 
        accept=".pdf,.doc,.docx,.txt"
        class="file-input"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ApiService from '../services/ApiService'

const api = new ApiService()
const messages = ref([])
const inputMessage = ref('')
const isListening = ref(false)
const audioEnabled = ref(true)
const recognition = new webkitSpeechRecognition()
const messagesContainer = ref(null)

recognition.lang = 'es-ES'
recognition.continuous = true
recognition.interimResults = false

recognition.onresult = (event) => {
  const result = event.results[event.results.length - 1]
  if (result.isFinal) {
    inputMessage.value = result[0].transcript
    sendMessage()
  }
}

const toggleListening = () => {
  if (isListening.value) {
    recognition.stop()
  } else {
    recognition.start()
  }
  isListening.value = !isListening.value
}

const toggleAudio = () => {
  audioEnabled.value = !audioEnabled.value
}

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // Handle file upload logic here
    console.log('File selected:', file.name)
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim()) return

  const userMessage = {
    text: inputMessage.value,
    type: 'user-message'
  }

  messages.value.push(userMessage)

  try {
    const response = await api.sendToOpenAI(inputMessage.value)
    const botMessage = {
      text: response,
      type: 'bot-message'
    }
    messages.value.push(botMessage)

    // Text-to-speech for bot response only if audio is enabled
    if (audioEnabled.value) {
      const speech = new SpeechSynthesisUtterance(response)
      speech.lang = 'es-ES'
      window.speechSynthesis.speak(speech)
    }

  } catch (error) {
    console.error('Error:', error)
    messages.value.push({
      text: 'Lo siento, hubo un error al procesar tu mensaje.',
      type: 'error-message'
    })
  }

  inputMessage.value = ''
  scrollToBottom()
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }, 100)
}
</script>

<style scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.input-area {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.audio-toggle {
  background-color: #2196F3;
}

.voice-btn {
  background-color: #9c27b0;
}

button:hover {
  opacity: 0.9;
}

.file-input {
  max-width: 200px;
}

.user-message {
  background-color: #e3f2fd;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 4px;
  text-align: right;
}

.bot-message {
  background-color: #f5f5f5;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 4px;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 4px;
}
</style>