<template>
  <div class="agent-selector">
    <select v-model="selectedAgent" @change="updateAgent" class="agent-select">
      <option value="ANALITICA">ELSA Analítica</option>
      <option value="GPT">ELSA GPT</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedAgent = ref('ANALITICA')
const emit = defineEmits(['update:agent'])

const updateAgent = () => {
  emit('update:agent', selectedAgent.value)
}
</script>

<style scoped>
.agent-selector {
  display: flex;
  align-items: center;
}

.agent-select {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #fff;
  font-size: 1rem;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
}

.agent-select:hover {
  border-color: #4CAF50;
}

.agent-select:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}
</style>