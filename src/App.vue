
<template>
  <div class="app">
    <AgentSelector @update:agent="updateAgent" />
    <ChatInterface :currentAgent="currentAgent" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AgentSelector from './components/AgentSelector.vue'
import ChatInterface from './components/ChatInterface.vue'

const currentAgent = ref('ELSA ANALITICA')

const updateAgent = (agent: string) => {
  currentAgent.value = `ELSA ${agent.toUpperCase()}`
}
</script>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';

.app {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: #f5f5f5;
}
</style>
