<template>
  <div class="chat-interface">
    <div class="chat-header">
      <h2>{{ currentAgent }}</h2>
      <div class="header-controls">
        <button class="toggle-btn" @click="isActive = !isActive">
          {{ isActive ? 'Desactivar' : 'Activar' }}
        </button>
      </div>
    </div>
    <div class="chat-messages" ref="messagesContainer" :class="{ inactive: !isActive }">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
        {{ message.text }}
      </div>
    </div>
    <div class="chat-input" :class="{ inactive: !isActive }">
      <input 
        type="text" 
        v-model="newMessage" 
        @keyup.enter="sendMessage"
        placeholder="Escribe tu mensaje aquí..."
        :disabled="!isActive"
      >
      <label class="file-input">
        <input type="file" @change="handleFileUpload" :disabled="!isActive">
        <i class="fas fa-paperclip"></i>
      </label>
      <button @click="sendMessage" :disabled="!isActive">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  currentAgent: string
}>()

const messages = ref<Array<{ text: string, type: string }>>([])
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const isActive = ref(true)

const sendMessage = () => {
  if (!isActive.value || !newMessage.value.trim()) return

  messages.value.push({
    text: newMessage.value,
    type: 'user'
  })
  newMessage.value = ''

  // Simulate response
  setTimeout(() => {
    messages.value.push({
      text: `Respuesta de ${props.currentAgent}`,
      type: 'bot'
    })
  }, 1000)
}

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    messages.value.push({
      text: `Archivo adjunto: ${file.name}`,
      type: 'user'
    })
  }
}
</script>

<style scoped>
.chat-interface {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.chat-header {
  background-color: #f0f0f0;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-controls {
  display: flex;
  gap: 1rem;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
}

.toggle-btn:hover {
  background-color: #45a049;
}

.chat-messages {
  height: 400px;
  overflow-y: auto;
  padding: 1rem;
}

.chat-messages.inactive {
  opacity: 0.5;
}

.message {
  margin: 0.5rem 0;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.message.user {
  background-color: #e3f2fd;
  margin-left: 20%;
}

.message.bot {
  background-color: #f5f5f5;
  margin-right: 20%;
}

.chat-input {
  display: flex;
  padding: 1rem;
  gap: 0.5rem;
  background-color: #fff;
  border-top: 1px solid #ccc;
}

.chat-input.inactive {
  opacity: 0.5;
}

.chat-input input[type="text"] {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.file-input {
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  color: #666;
}

.file-input input[type="file"] {
  display: none;
}

.file-input:hover {
  color: #333;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #1976d2;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #1565c0;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>