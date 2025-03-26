
<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const file = ref<File | null>(null)
const uploadStatus = ref('')

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    file.value = target.files[0]
  }
}

const uploadFile = async () => {
  if (!file.value) return

  const formData = new FormData()
  formData.append('file', file.value)

  try {
    const response = await axios.post(
      import.meta.env.VITE_FILES_API_URL,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    uploadStatus.value = 'File uploaded successfully!'
  } catch (error) {
    uploadStatus.value = 'Error uploading file'
    console.error('Error:', error)
  }
}
</script>

<template>
  <div class="file-upload">
    <input type="file" @change="handleFileChange" accept="image/*, application/pdf" />
    <button @click="uploadFile" :disabled="!file">Upload</button>
    <p v-if="uploadStatus">{{ uploadStatus }}</p>
  </div>
</template>
