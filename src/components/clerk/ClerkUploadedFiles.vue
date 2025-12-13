<template>
  <v-card class="h-100">
    <v-card-title class="text-h6">
      {{ $t('uploadedFiles.title') }}
    </v-card-title>
    <v-card-text class="pa-4">
      <v-alert v-if="!hasDocuments" type="error" variant="tonal" color="error">
        {{ $t('uploadedFiles.noFiles') }}
      </v-alert>

      <v-carousel
        v-if="hasDocuments"
        v-model="currentSlide"
        show-arrows="hover"
        hide-delimiters
        height="auto"
      >
        <v-carousel-item v-for="(item, index) in pdfItems" :key="index">
          <div class="d-flex flex-column align-center pa-4">
            <p class="text-subtitle-1 font-weight-bold mb-4">
              {{ item.title }}
            </p>

            <!-- Loading State -->
            <div v-if="loadingStates[item.type]" class="text-center">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
              ></v-progress-circular>
              <p class="mt-2">{{ $t('app.loading') }}</p>
            </div>

            <!-- Error State -->
            <div v-else-if="pdfErrors[item.type]" class="text-center">
              <p>{{ $t('uploadedFiles.pdfLoadError') }}</p>
              <v-btn @click="retryLoad(item.type)" class="mt-2">
                {{ $t('uploadedFiles.retry') }}
              </v-btn>
            </div>

            <!-- PDF Display  -->
            <div v-else class="pdf-container">
              <vue-pdf-embed
                :source="item.blobUrl"
                :page="1"
                class="pdf-embed"
                @error="(err) => handlePdfError(err, item.type)"
              />
            </div>

            <!-- Download Button -->
            <v-btn
              v-if="
                !loadingStates[item.type] &&
                !pdfErrors[item.type] &&
                item.blobUrl
              "
              color="primary"
              variant="outlined"
              class="mt-4"
              :loading="downloadStates[item.type]"
              @click="downloadDocument(item)"
            >
              <v-icon start>{{ icons.mdiDownload }}</v-icon>
              {{ $t('actions.download') }}
            </v-btn>
          </div>
        </v-carousel-item>
      </v-carousel>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch, computed, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import ContentApiService from '@/services/contentApiService';
import VuePdfEmbed from 'vue-pdf-embed';
import { mdiDownload } from '@mdi/js';

const props = defineProps({
  petition: {
    type: Object,
    required: true,
  },
});
const icons = { mdiDownload };
const { t } = useI18n();
const store = useStore();

const documents = ref({});
const currentSlide = ref(0);
const blobUrls = ref([]);
const loadingStates = ref({
  elstam: false,
  studienbescheinigung: false,
  versicherung: false,
});
const pdfErrors = ref({
  elstam: false,
  studienbescheinigung: false,
  versicherung: false,
});
const downloadStates = ref({
  elstam: false,
  studienbescheinigung: false,
  versicherung: false,
});

// PDF items calculation
const pdfItems = computed(() => {
  const items = [];
  const types = {
    elstam: 'elstam_url',
    studienbescheinigung: 'studienbescheinigung_url',
    versicherung: 'versicherungsbescheinigung_url',
  };

  for (const [type, urlProp] of Object.entries(types)) {
    if (documents.value[urlProp]) {
      items.push({
        type,
        title: t(`uploadedFiles.${type}`),
        url: documents.value[urlProp],
        blobUrl: documents.value[`${type}_blobUrl`],
        fileName: getFileName(documents.value[urlProp], type),
      });
    }
  }
  return items;
});

const hasDocuments = computed(() => pdfItems.value.length > 0);

// Download function for carousel items
const downloadDocument = async (item) => {
  try {
    downloadStates.value[item.type] = true;

    let downloadUrl = item.blobUrl;
    let shouldRevokeUrl = false;

    // If no blob URL exists, create one from the original URL
    if (!downloadUrl && item.url) {
      const response = await ContentApiService.get('/download-file/', {
        params: { file_url: item.url },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/pdf',
      });
      downloadUrl = URL.createObjectURL(blob);
      shouldRevokeUrl = true; // Mark for cleanup since we created it
    }

    if (!downloadUrl) {
      throw new Error('No download source available');
    }

    triggerDownload(downloadUrl, item.fileName);

    // Clean up temporary URL if we created it
    if (shouldRevokeUrl) {
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
    }
  } catch (error) {
    console.error('Download failed:', error);

    // Fallback: try direct download
    if (item.url) {
      const directLink = document.createElement('a');
      directLink.href = item.url;
      directLink.download = item.fileName;
      directLink.target = '_blank';
      directLink.style.display = 'none';
      document.body.appendChild(directLink);
      directLink.click();
      document.body.removeChild(directLink);
    }

    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.uploadedFilesClerk.pdfDownload'),
    });
  } finally {
    downloadStates.value[item.type] = false;
  }
};

const triggerDownload = (url, fileName) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate filename from URL or type
const getFileName = (url, type) => {
  if (url && url.includes('/')) {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    if (fileName && fileName.includes('.')) {
      return fileName;
    }
  }

  const typeNames = {
    elstam: 'eltsam',
    studienbescheinigung: 'study_certificate',
    versicherung: 'insurance_certificate',
  };
  return `${typeNames[type] || type}.pdf`;
};

const loadPdfDocument = async (type, url) => {
  try {
    loadingStates.value[type] = true;
    pdfErrors.value[type] = false;

    const response = await ContentApiService.get('/download-file/', {
      params: { file_url: url },
      responseType: 'arraybuffer',
      validateStatus: (status) => status === 200,
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    blobUrls.value.push(blobUrl);
    documents.value[`${type}_blobUrl`] = blobUrl;
  } catch (error) {
    console.error(`PDF load failed (${type}):`, error);
    documents.value = {};
    pdfErrors.value[type] = true;
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.uploadedFilesClerk.loadingDocs'),
    });
  } finally {
    loadingStates.value[type] = false;
  }
};

// Retry failed loads
const retryLoad = (type) => {
  const url = documents.value[`${type}_url`];
  if (url) loadPdfDocument(type, url);
};

const handlePdfError = (error, type) => {
  console.error('PDF render error:', error);
  store.dispatch('snackbar/setErrorSnacks', {
    message: t('errors.uploadedFilesClerk.pdfRender'),
  });
  documents.value = {};
  pdfErrors.value[type] = true;
};

// Document fetching
const fetchDocuments = async () => {
  if (!props.petition?.student_mail) {
    documents.value = {};
    return;
  }
  try {
    // Fetch document URLs
    const response = await ContentApiService.get('/clerk/documents-by-email/', {
      params: { email: props.petition.student_mail },
    });
    documents.value = response.data;

    // Load PDFs in parallel
    const loadTasks = [];
    const types = {
      elstam: 'elstam_url',
      studienbescheinigung: 'studienbescheinigung_url',
      versicherung: 'versicherungsbescheinigung_url',
    };

    for (const [type, urlProp] of Object.entries(types)) {
      if (documents.value[urlProp]) {
        loadTasks.push(loadPdfDocument(type, documents.value[urlProp]));
      }
    }

    await Promise.all(loadTasks);
  } catch (error) {
    console.error('Document fetch failed:', error);
    documents.value = {};
    store.dispatch('snackbar/setErrorSnacks', {
      message: t('errors.uploadedFilesClerk.fetchingDocs'),
    });
  }
};

// Cleanup
onBeforeUnmount(() => {
  blobUrls.value.forEach((url) => URL.revokeObjectURL(url));
});

// Watchers
watch(() => props.petition, fetchDocuments, { immediate: true, deep: true });
</script>

<style scoped>
.pdf-container {
  width: 100%;
  max-width: 800px;
  height: 75vh;
  overflow: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.pdf-embed {
  width: 100%;
  min-width: 600px;
}

:deep(.vue-pdf-embed__page) {
  margin: 0 auto;
}

:deep(.vue-pdf-embed__container) {
  display: flex;
  justify-content: center;
}
</style>
