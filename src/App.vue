<script setup lang="ts">
import { ref } from 'vue'
import ChatInterface from './components/ChatInterface.vue'
import FileUpload from './components/FileUpload.vue'
</script>

<template>
  <div class="app">
    <h1>Vue + TypeScript App</h1>
    <ChatInterface />
    <FileUpload />
  </div>
</template>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif; /* From original styles */
}

h1 {
  text-align: center;
  color: #2c3e50; /* From original styles */
  margin-bottom: 0.5rem; /* From original styles */
}

</style>