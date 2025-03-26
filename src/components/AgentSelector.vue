
<template>
  <div class="agent-selector">
    <button 
      class="agent-button analytic"
      :class="{ active: selectedAgent === 'analitica' }"
      @click="selectAgent('analitica')"
    >
      <i class="fas fa-chart-line"></i>
      ELSA ANALITICA
    </button>
    <button 
      class="agent-button resources"
      :class="{ active: selectedAgent === 'recursos' }"
      @click="selectAgent('recursos')"
    >
      <i class="fas fa-book"></i>
      ELSA RECURSOS
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedAgent = ref('analitica');
const emit = defineEmits(['update:agent']);

const selectAgent = (agent: string) => {
  selectedAgent.value = agent;
  emit('update:agent', agent);
};
</script>

<style scoped>
.agent-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.agent-button {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.analytic {
  background-color: #4285f4;
}

.resources {
  background-color: #34a853;
}

.active {
  transform: scale(1.05);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
