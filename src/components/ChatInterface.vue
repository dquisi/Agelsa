
<script setup lang="ts">
import { ref } from 'vue'
import ApiService from '../services/ApiService'

const apiService = new ApiService()
const message = ref('')
const chatHistory = ref<Array<{type: 'user' | 'bot', content: string}>>([])

const sendMessage = async () => {
  if (!message.value.trim()) return
  
  chatHistory.value.push({ type: 'user', content: message.value })
  
  try {
    const difyResponse = await apiService.sendToDify(message.value)
    chatHistory.value.push({ type: 'bot', content: difyResponse })
    
    const openAIResponse = await apiService.sendToOpenAI(message.value)
    chatHistory.value.push({ type: 'bot', content: openAIResponse })
  } catch (error) {
    console.error('Error:', error)
    chatHistory.value.push({ type: 'bot', content: 'Error processing your request' })
  }
  
  message.value = ''
}
</script>

<template>
  <div class="chat-interface">
    <div class="chat-history">
      <div v-for="(msg, index) in chatHistory" :key="index" :class="msg.type">
        <p>{{ msg.content }}</p>
      </div>
    </div>
    <div class="input-area">
      <input v-model="message" @keyup.enter="sendMessage" placeholder="Type your message..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<style scoped>
.chat-interface {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
}

.chat-history {
  height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.user, .bot {
  margin: 10px 0;
  padding: 10px;
  border-radius: 8px;
}

.user {
  background-color: #e3f2fd;
  margin-left: 20%;
}

.bot {
  background-color: #f5f5f5;
  margin-right: 20%;
}

.input-area {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
