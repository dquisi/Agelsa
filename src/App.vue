
<script setup lang="ts">
import { ref } from 'vue'
import ApiService from './services/ApiService'
import FileUpload from './components/FileUpload.vue'
import ChatInterface from './components/ChatInterface.vue'

const apiService = new ApiService()
const message = ref('')
const response = ref('')

const sendMessage = async () => {
  try {
    const result = await apiService.sendToDify(message.value)
    response.value = result
  } catch (error) {
    console.error('Error:', error)
  }
}
</script>

<template>
  <div class="app">
    <h1>ELSA ANALITICA</h1>
    <div class="chat-container">
      <ChatInterface />
    </div>
    <div class="file-upload">
      <FileUpload />
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.chat-container {
  margin-bottom: 20px;
}
</style>
