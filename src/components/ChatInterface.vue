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
    <div class="input-area">
      <div class="chat-controls">
        <button 
          class="control-btn"
          @click="toggleAudio"
          :class="{ active: isAudioEnabled }"
        >
          <i :class="isAudioEnabled ? 'fas fa-microphone' : 'fas fa-microphone-slash'"></i>
        </button>
      </div>
      <input 
        v-model="newMessage" 
        @keyup.enter="sendMessage"
        placeholder="Type your message..."
        class="message-input"
      />
      <div class="button-group">
        <button @click="generatePrompt" class="generate-btn">
          <i class="fas fa-magic"></i> Generate
        </button>
        <button @click="sendMessage" class="send-btn">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
      <input
        type="file"
        ref="fileInput"
        @change="handleFileUpload"
        style="display: none"
      />
      <button @click="$refs.fileInput.click()" class="attachment-btn">
        <i class="fas fa-paperclip"></i>
      </button>
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
const isAudioEnabled = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const toggleAudio = () => {
  isAudioEnabled.value = !isAudioEnabled.value
  // Add audio toggling logic here if needed (e.g., play/pause sound)
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const updatedMessages = [...props.messages, { text: newMessage.value, isUser: true }]
  emit('update:messages', updatedMessages)
  newMessage.value = ''

  // Simulate bot response (replace with actual API call)
  setTimeout(() => {
    const botResponse = { text: `${props.currentAgent}: I received your message`, isUser: false }
    emit('update:messages', [...updatedMessages, botResponse])
  }, 1000)
}

const generatePrompt = () => {
  // Implement logic to generate a prompt from chat history here.
  // This would likely involve accessing and processing the `messages` array.
  // For example:
  const lastMessage = props.messages[props.messages.length -1];
  newMessage.value = `Based on the previous conversation: ${lastMessage.text}, what is the next step?`;
}


const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    // Handle file upload here
    newMessage.value = `Attached file: ${file.name}`
  }
}

watch(
  () => props.messages,
  async () => {
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }
)
</script>

<style scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 150px);
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.message {
  margin: 0.5rem 0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  max-width: 80%;
}

.message.user {
  background: #e3f2fd;
  margin-left: auto;
}

.message.bot {
  background: #f5f5f5;
  margin-right: auto;
}

.input-area {
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 0.5rem;
  border-top: 1px solid #eee;
}

.message-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.chat-controls {
  padding: 0.5rem;
  display: flex;
  justify-content: flex-start;
}

.control-btn,
.send-btn,
.attachment-btn,
.generate-btn {
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background: #f5f5f5;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover,
.send-btn:hover,
.attachment-btn:hover,
.generate-btn:hover {
  background: #eee;
}

.control-btn.active {
  background: #4CAF50;
  color: white;
}

.send-btn {
  background: #4CAF50;
  color: white;
}

.send-btn:hover {
  background: #45a049;
}

.generate-btn {
  background-color: #2196F3;
  color: white;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;
}

.control-btn:hover {
  color: #333;
}

</style>