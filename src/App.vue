
<script setup lang="ts">
import { ref } from 'vue'
import ChatInterface from './components/ChatInterface.vue'
import FileUpload from './components/FileUpload.vue'

const activeTab = ref('chat')
</script>

<template>
  <div class="app">
    <header>
      <h1>ELSA RECURSOS</h1>
      <p class="subtitle">Asistente virtual para gestión de cursos en Moodle y análisis de datos educativos</p>
    </header>

    <nav class="tabs">
      <button 
        :class="{ active: activeTab === 'chat' }" 
        @click="activeTab = 'chat'"
      >
        Chat
      </button>
      <button 
        :class="{ active: activeTab === 'files' }" 
        @click="activeTab = 'files'"
      >
        Archivos
      </button>
    </nav>

    <main>
      <div v-if="activeTab === 'chat'" class="chat-container">
        <ChatInterface />
      </div>
      <div v-if="activeTab === 'files'" class="file-container">
        <FileUpload />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  margin: 0;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 1rem;
}

.tabs button {
  padding: 0.5rem 2rem;
  border: none;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.tabs button.active {
  background: #4CAF50;
  color: white;
}

.chat-container, .file-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 1.5rem;
}
</style>
