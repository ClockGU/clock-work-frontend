<template>
    <div>
      <h3>Uploaded Files</h3>
      <div v-if="!hasDocuments">
        No documents found
      </div>
      
      <div v-if="documents.elstam_url" class="document-item">
        <span>ELSTAM: </span>
        <a @click.prevent="downloadFile(documents.elstam_url, 'elstam')">Download</a>
        <span v-if="loading.elstam" class="loading">Loading...</span>
      </div>
      
      <div v-if="documents.studienbescheinigung_url" class="document-item">
        <span>Studienbescheinigung: </span>
        <a @click.prevent="downloadFile(documents.studienbescheinigung_url, 'studienbescheinigung')">Download</a>
        <span v-if="loading.studienbescheinigung" class="loading">Loading...</span>
      </div>
      
      <div v-if="documents.versicherungsbescheinigung_url" class="document-item">
        <span>Versicherung: </span>
        <a @click.prevent="downloadFile(documents.versicherungsbescheinigung_url, 'versicherung')">Download</a>
        <span v-if="loading.versicherung" class="loading">Loading...</span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, computed } from 'vue'
  import ContentApiService from '@/services/contentApiService'
  
  const props = defineProps({
    petition: {
      type: Object,
      default: null
    }
  })
  
  const documents = ref({})
  const loading = ref({
    elstam: false,
    studienbescheinigung: false,
    versicherung: false
  })
  
  const hasDocuments = computed(() => {
    return documents.value.elstam_url || 
           documents.value.studienbescheinigung_url || 
           documents.value.versicherungsbescheinigung_url
  })
  
  const downloadFile = async (filePath, type) => {
    try {
      loading.value[type] = true
      
      const response = await ContentApiService.get('download-file/', {
        params: {
          file_url: filePath
        },
        responseType: 'blob'
      })
      
      // Create download link from blob response
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      // Extract filename from content-disposition header or use default
      const contentDisposition = response.headers['content-disposition']
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
      const fileName = fileNameMatch ? fileNameMatch[1] : 'document'
      
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
    } catch (err) {
      console.error('Download error:', err)
      alert('Failed to download file')
    } finally {
      loading.value[type] = false
    }
  }
  
  const fetchDocuments = async () => {
    if (!props.petition?.student_mail) {
      documents.value = {}
      return
    }
    
    try {
      const response = await ContentApiService.get("clerk/documents-by-email/", {
        params: { email: props.petition.student_mail }
      })
      documents.value = response.data
    } catch (err) {
      console.error("Error fetching documents:", err)
    }
  }
  
  watch(() => props.petition, fetchDocuments, { immediate: true })
  </script>
  
  <style scoped>
  .document-item {
    margin: 10px 0;
    padding: 8px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  a {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  }
  
  a:hover {
    color: darkblue;
  }
  
  .loading {
    color: #666;
    font-style: italic;
  }
  </style>