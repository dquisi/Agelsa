
<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>{{ currentAgent }}</h2>
      <div class="actions">
        <button class="icon-button"><i class="fas fa-trash"></i></button>
        <button class="icon-button"><i class="fas fa-cog"></i></button>
        <button class="icon-button"><i class="fas fa-volume-up"></i></button>
        <button class="icon-button"><i class="fas fa-times"></i></button>
      </div>
    </div>
    
    <div class="messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" class="message">
        {{ message }}
      </div>
    </div>

    <div class="input-container">
      <input 
        v-model="newMessage" 
        @keyup.enter="sendMessage"
        placeholder="Escribe tu mensaje..."
        type="text"
      />
      <button class="voice-button" @click="toggleVoiceInput">
        <i class="fas fa-microphone"></i>
      </button>
      <button class="send-button" @click="sendMessage">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  currentAgent: string
}>();

const messages = ref<string[]>([]);
const newMessage = ref('');
const isRecording = ref(false);

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push(newMessage.value);
    newMessage.value = '';
  }
};

const toggleVoiceInput = () => {
  isRecording.value = !isRecording.value;
  // Implement voice recording logic here
};
</script>

<style scoped>
.chat-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 600px;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.message {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.input-container {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #eee;
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.voice-button, .send-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.voice-button {
  background: #4285f4;
  color: white;
}

.send-button {
  background: #34a853;
  color: white;
}
</style>
