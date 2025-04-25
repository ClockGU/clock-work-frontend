<template>
  <v-card class="h-100"> 
    <v-card-title class="text-h6">
      {{ $t('uploadedFiles.title') }}
    </v-card-title>
    <v-card-text class="pa-4">
      <v-alert v-if="!hasDocuments"
        type="error"
        variant="tonal" 
        color="error">
        {{ $t('uploadedFiles.noFiles') }}
      </v-alert>

      <div v-if="documents.elstam_url" class="document-item">
        <span>{{ $t('uploadedFiles.elstam') }}: </span>
        <a @click.prevent="downloadFile(documents.elstam_url, 'elstam')">
          {{ $t('download') }}
        </a>
        <span v-if="loading.elstam" class="loading">
          {{ $t('app.loading') }}
        </span>
      </div>

      <div v-if="documents.studienbescheinigung_url" class="document-item">
        <span>{{ $t('uploadedFiles.studienbescheinigung') }}: </span>
        <a @click.prevent="downloadFile(documents.studienbescheinigung_url, 'studienbescheinigung')">
          {{ $t('download') }}
        </a>
        <span v-if="loading.studienbescheinigung" class="loading">
          {{ $t('app.loading') }}
        </span>
      </div>
      
      <div v-if="documents.versicherungsbescheinigung_url" class="document-item">
        <span>{{ $t('uploadedFiles.versicherung') }}: </span>
        <a @click.prevent="downloadFile(documents.versicherungsbescheinigung_url, 'versicherung')">
          {{ $t('download') }}
        </a>
        <span v-if="loading.versicherung" class="loading">
          {{ $t('app.loading') }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>
  
  <script setup>
  import { ref, watch, computed } from 'vue'
  import { useStore } from 'vuex'
  import ContentApiService from '@/services/contentApiService'
  
  const props = defineProps({
    petition: {
      type: Object,
      default: null
    }
  })
  const store = useStore()
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
      loading.value[type] = true; 
      // 1. Request the file from your API
      const response = await ContentApiService.get('download-file/', {
        params: { file_url: filePath },
        responseType: 'blob' 
      });
      // 2. Create a temporary download link
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      // 3. Set up the download with a filename
      link.href = url;
      link.download = filePath.split('/').pop() || 'document'; 
      // 4. Trigger the download
      document.body.appendChild(link);
      link.click();
      // 5. Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download failed:', error);
      store.dispatch('snackbar/setErrorSnacks', {
        message: 'Download failed. Please try again later.',
      });
    } finally {
      loading.value[type] = false; 
    }
  };
  
  const fetchDocuments = async () => {
    if (!props.petition || !props.petition?.student_mail) {
      documents.value = {}
      return
    }
    
    try {
      const response = await ContentApiService.get("clerk/documents-by-email/", {
        params: { email: props.petition.student_mail }
      })
      documents.value = response.data
    } catch (err) {
      documents.value = {}
      console.error("Error fetching documents:", err)
      store.dispatch('snackbar/setErrorSnacks', {
        message:'Error fetching documents',
      });
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