<template>
  <div class="chat-interface">
    <div class="messages" ref="messagesContainer">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        :class="['message', message.isUser ? 'user' : 'bot']"
      >
        {{ message.text }}
      </div>
    </div>

    <div class="input-container">
      <textarea 
        v-model="newMessage" 
        @keyup.enter="sendMessage"
        placeholder="Type your message..."
        rows="1"
      ></textarea>
      <div class="button-group">
        <button @click="toggleMute" class="action-button">
          <i :class="['fas', isMuted ? 'fa-volume-mute' : 'fa-volume-up']"></i>
        </button>
        <button @click="sendMessage" class="send-button">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  currentAgent: string
  messages: Array<{text: string, isUser: boolean}>
}>()

const emit = defineEmits(['update:messages'])
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const isMuted = ref(false)

const toggleMute = () => {
  isMuted.value = !isMuted.value
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const updatedMessages = [...props.messages, { text: newMessage.value, isUser: true }]
  emit('update:messages', updatedMessages)
  newMessage.value = ''

  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(() => props.messages, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
})
</script>

<style scoped>
.chat-interface {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  height: 100%;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.message {
  max-width: 80%;
  margin: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  word-wrap: break-word;
}

.message.user {
  background-color: #e3f2fd;
  margin-left: auto;
  border-bottom-right-radius: 0.25rem;
}

.message.bot {
  background-color: #f5f5f5;
  margin-right: auto;
  border-bottom-left-radius: 0.25rem;
}

.input-container {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  background: white;
}

textarea {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  outline: none;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: #e0e0e0;
}

.send-button {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  background: #4CAF50;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-button:hover {
  background: #45a049;
}
</style>