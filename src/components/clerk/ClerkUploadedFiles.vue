<template>
  <v-card class="h-100">
    <v-card-title class="text-h6">
      {{ $t('uploadedFiles.title') }}
    </v-card-title>

    <v-card-text class="pa-4">
      <v-alert v-if="!hasDocuments" type="error" variant="tonal" color="error">
        {{ $t('uploadedFiles.noFiles') }}
      </v-alert>

      <template v-else>
        <v-carousel
          v-model="state.currentSlide"
          show-arrows="hover"
          hide-delimiters
          height="auto"
        >
          <v-carousel-item v-for="item in pdfItems" :key="item.type">
            <div class="d-flex flex-column align-center pa-4">
              <p class="text-subtitle-1 font-weight-bold mb-4">
                {{ item.title }}
              </p>

              <!-- Loading -->
              <div v-if="state.loading[item.type]" class="text-center">
                <v-progress-circular indeterminate color="primary" size="64" />
                <p class="mt-2">{{ $t('app.loading') }}</p>
              </div>

              <!-- Error -->
              <div v-else-if="state.error[item.type]" class="text-center">
                <p>{{ $t('uploadedFiles.pdfLoadError') }}</p>
                <v-btn class="mt-2" @click="retryLoad(item.type)">
                  {{ $t('uploadedFiles.retry') }}
                </v-btn>
              </div>

              <!-- PDF Preview (page 1 only) -->
              <div v-else class="w-100" style="max-width: 800px">
                <v-hover v-slot="{ isHovering, props: hoverProps }">
                  <div v-bind="hoverProps" class="position-relative">
                    <vue-pdf-embed
                      :source="state.blobUrl[item.type]"
                      :page="1"
                      :width="previewPdfWidth"
                      @loaded="(pdf) => captureAspect(item.type, pdf)"
                      @error="(err) => handlePdfError(err, item.type)"
                    />

                    <v-btn
                      v-show="isHovering || display.smAndDown.value"
                      icon
                      variant="tonal"
                      size="small"
                      :aria-label="$t('actions.view')"
                      style="
                        position: absolute;
                        top: 8px;
                        right: 8px;
                        z-index: 2;
                      "
                      @click="openViewer(item.type)"
                    >
                      <v-icon :icon="icons.mdiFullscreen" />
                    </v-btn>
                  </div>
                </v-hover>
              </div>
            </div>
          </v-carousel-item>
        </v-carousel>

        <!-- Download all (centered) -->
        <div class="d-flex justify-center mt-4">
          <v-btn
            color="primary"
            variant="outlined"
            :loading="state.downloadingAll"
            :disabled="anyLoading || anyError"
            @click="downloadAll"
          >
            <v-icon start :icon="icons.mdiDownloadMultiple" />
            {{ $t('actions.downloadAll') }}
          </v-btn>
        </div>
      </template>
    </v-card-text>

    <!-- Viewer dialog -->
    <v-dialog
      v-model="state.viewer.open"
      :fullscreen="display.smAndDown.value"
      :max-width="dialogMaxWidth"
      :max-height="dialogMaxHeight"
      content-class="pa-0"
      transition="slide-y-reverse-transition"
    >
      <div
        class="position-relative"
        :style="{
          width: dialogBox.width + 'px',
          height: dialogBox.height + 'px',
          overflow: 'hidden',
        }"
      >
        <!-- Close -->
        <v-btn
          icon
          variant="tonal"
          size="small"
          :aria-label="$t('actions.close')"
          style="position: absolute; top: 8px; right: 8px; z-index: 3"
          @click="closeViewer"
        >
          <v-icon :icon="icons.mdiClose" />
        </v-btn>

        <!-- PDF (page turning) -->
        <vue-pdf-embed
          v-if="viewerType"
          :source="state.blobUrl[viewerType]"
          :page="state.viewer.page"
          :width="dialogBox.width"
          :height="dialogBox.height"
          @loaded="onViewerLoaded"
          @error="(err) => handlePdfError(err, viewerType)"
        />

        <!-- Page controls -->
        <div
          v-if="viewerType"
          style="
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 3;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 6px 10px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.85);
          "
        >
          <v-btn
            icon
            variant="tonal"
            size="small"
            :disabled="state.viewer.page <= 1"
            :aria-label="$t('actions.back')"
            @click="prevViewerPage"
          >
            <v-icon :icon="icons.mdiChevronLeft" />
          </v-btn>

          <span style="min-width: 70px; text-align: center">
            {{ state.viewer.page }} / {{ state.viewer.totalPages }}
          </span>

          <v-btn
            icon
            variant="tonal"
            size="small"
            :disabled="state.viewer.page >= state.viewer.totalPages"
            :aria-label="$t('actions.next')"
            @click="nextViewerPage"
          >
            <v-icon :icon="icons.mdiChevronRight" />
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </v-card>
</template>

<script setup>
import {
  mdiDownloadMultiple,
  mdiFullscreen,
  mdiClose,
  mdiChevronLeft,
  mdiChevronRight,
} from '@mdi/js';
import { computed, reactive, watch, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';
import ContentApiService from '@/services/contentApiService';
import VuePdfEmbed from 'vue-pdf-embed';

const props = defineProps({
  petition: { type: Object, required: true },
});

const icons = {
  mdiDownloadMultiple,
  mdiFullscreen,
  mdiClose,
  mdiChevronLeft,
  mdiChevronRight,
};

const { t } = useI18n();
const store = useStore();
const display = useDisplay();

const DOCS = [
  {
    type: 'elstam',
    urlProp: 'elstam_url',
    i18nKey: 'files.elstam',
    defaultName: 'elstam.pdf',
  },
  {
    type: 'studienbescheinigung',
    urlProp: 'studienbescheinigung_url',
    i18nKey: 'files.studienbescheinigung',
    defaultName: 'study_certificate.pdf',
  },
  {
    type: 'versicherung',
    urlProp: 'versicherungsbescheinigung_url',
    i18nKey: 'files.versicherungsbescheinigung',
    defaultName: 'insurance_certificate.pdf',
  },
  {
    type: 'sozialversicherungsbogen',
    urlProp: 'sozialversicherungsbogen_url',
    i18nKey: 'files.sozialversicherungsbogen',
    defaultName: 'social_insurance_form.pdf',
  },
  {
    type: 'ba_degree',
    urlProp: 'ba_degree_url',
    i18nKey: 'files.ba_degree',
    defaultName: 'ba_degree.pdf',
  },
];

const typeKeys = DOCS.map((d) => d.type);
const makeTypeMap = (initial) =>
  Object.fromEntries(typeKeys.map((k) => [k, initial]));

const state = reactive({
  documents: {},
  currentSlide: 0,

  blobUrl: makeTypeMap(null),
  loading: makeTypeMap(false),
  error: makeTypeMap(false),
  aspect: makeTypeMap(null),

  createdBlobUrls: [],
  downloadingAll: false,

  viewer: {
    open: false,
    type: null,
    page: 1,
    totalPages: 1,
  },
});

const pdfItems = computed(() =>
  DOCS.filter((d) => !!state.documents?.[d.urlProp]).map((d) => {
    const url = state.documents[d.urlProp];
    return {
      type: d.type,
      title: t(d.i18nKey),
      url,
      fileName: extractFileName(url) || d.defaultName,
    };
  })
);

const hasDocuments = computed(() => pdfItems.value.length > 0);
const anyLoading = computed(() => Object.values(state.loading).some(Boolean));
const anyError = computed(() => Object.values(state.error).some(Boolean));
const viewerType = computed(() => state.viewer.type);

const previewPdfWidth = computed(() => {
  const max = 800;
  const padding = 96;
  return Math.max(320, Math.min(max, display.width.value - padding));
});

function notifyError(i18nKey) {
  store.dispatch('snackbar/setErrorSnacks', { message: t(i18nKey) });
}

function extractFileName(url) {
  try {
    const clean = url.split('?')[0];
    const last = clean.split('/').pop();
    return last && last.includes('.') ? last : null;
  } catch {
    return null;
  }
}

function triggerDownload(url, fileName) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'document.pdf';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function revokeIfCreated(url) {
  if (!url) return;
  const idx = state.createdBlobUrls.indexOf(url);
  if (idx !== -1) {
    URL.revokeObjectURL(url);
    state.createdBlobUrls.splice(idx, 1);
  }
}

function getDocUrl(type) {
  const doc = DOCS.find((d) => d.type === type);
  return doc ? state.documents?.[doc.urlProp] : null;
}

/**
 * loading function for the carousel/viewer docs:
 * - fetches ArrayBuffer via /download-file/
 * - creates blob URL
 * - caches it per type
 */
async function ensureBlobUrl(type, { force = false } = {}) {
  const url = getDocUrl(type);
  if (!url) return null;
  if (state.blobUrl[type] && !force) return state.blobUrl[type];

  try {
    state.loading[type] = true;
    state.error[type] = false;

    const res = await ContentApiService.get('/download-file/', {
      params: { file_url: url },
      responseType: 'arraybuffer',
      validateStatus: (s) => s === 200,
    });

    const blob = new Blob([res.data], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    revokeIfCreated(state.blobUrl[type]);

    state.blobUrl[type] = blobUrl;
    state.createdBlobUrls.push(blobUrl);

    return blobUrl;
  } catch (err) {
    console.error(`PDF load failed (${type}):`, err);
    state.error[type] = true;
    notifyError('errors.uploadedFilesClerk.loadingDocs');
    return null;
  } finally {
    state.loading[type] = false;
  }
}

function retryLoad(type) {
  ensureBlobUrl(type, { force: true });
}

function handlePdfError(error, type) {
  console.error('PDF render error:', error);
  state.error[type] = true;
  notifyError('errors.uploadedFilesClerk.pdfRender');
}

function openViewer(type) {
  state.viewer.type = type;
  state.viewer.page = 1;
  state.viewer.totalPages = 1;
  state.viewer.open = true;
}

function closeViewer() {
  state.viewer.open = false;
  state.viewer.type = null;
  state.viewer.page = 1;
  state.viewer.totalPages = 1;
}

function prevViewerPage() {
  if (state.viewer.page > 1) state.viewer.page -= 1;
}

function nextViewerPage() {
  if (state.viewer.page < state.viewer.totalPages) state.viewer.page += 1;
}

function onViewerLoaded(pdf) {
  if (pdf?.numPages) state.viewer.totalPages = pdf.numPages;
  if (state.viewer.type) captureAspect(state.viewer.type, pdf);
}

// Capture page-1 aspect ratio so dialog can tightly wrap the PDF
function captureAspect(type, pdf) {
  if (!type || state.aspect[type]) return;
  try {
    if (!pdf?.getPage) return;
    pdf.getPage(1).then((page) => {
      const viewport = page.getViewport({ scale: 1 });
      if (viewport?.width && viewport?.height) {
        state.aspect[type] = viewport.width / viewport.height;
      }
    });
  } catch {}
}

async function fetchEmployeeStudentDataPdf() {
  return ContentApiService.get('/employees/student-data-pdf', {
    params: { petition_id: props.petition?.id },
    responseType: 'arraybuffer',
  });
}

async function downloadEmployeeStudentDataPdf(studentUsername = 'student') {
  try {
    const res = await fetchEmployeeStudentDataPdf();

    const contentType = res?.headers?.['content-type'] || 'application/pdf';
    const blob = new Blob([res.data], { type: contentType });
    const blobUrl = URL.createObjectURL(blob);

    const fileName = `student_data_${studentUsername}.pdf`;
    triggerDownload(blobUrl, fileName);

    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch (err) {
    console.error('Employee student-data-pdf download failed:', err);
    notifyError('errors.uploadedFilesClerk.pdfDownload');
  }
}

async function downloadAll() {
  try {
    state.downloadingAll = true;

    // 1) Download the uploaded documents (carousel docs)
    for (const item of pdfItems.value) {
      const blobUrl = await ensureBlobUrl(item.type);
      if (blobUrl) triggerDownload(blobUrl, item.fileName);
      await new Promise((r) => setTimeout(r, 150));
    }

    // 2) Download the extra employee document
    await downloadEmployeeStudentDataPdf(props.petition?.student_username);
  } catch (err) {
    console.error('Download all failed:', err);
    notifyError('errors.uploadedFilesClerk.pdfDownload');
  } finally {
    state.downloadingAll = false;
  }
}

function resetCache() {
  // revoke all created blob urls
  state.createdBlobUrls.forEach((u) => URL.revokeObjectURL(u));
  state.createdBlobUrls = [];

  // reset per-type caches
  for (const k of typeKeys) {
    state.blobUrl[k] = null;
    state.loading[k] = false;
    state.error[k] = false;
    state.aspect[k] = null;
  }

  state.currentSlide = 0;
  closeViewer();
}

async function fetchDocuments(studentUsername) {
  if (!studentUsername) {
    resetCache();
    state.documents = {};
    return;
  }

  try {
    resetCache();

    const res = await ContentApiService.get('/clerk/documents-by-username/', {
      params: { student_username: studentUsername },
    });

    state.documents = res.data || {};
    // load all available docs in parallel
    await Promise.all(
      DOCS.map((d) =>
        state.documents?.[d.urlProp] ? ensureBlobUrl(d.type) : null
      )
    );
  } catch (err) {
    console.error('Document fetch failed:', err);
    state.documents = {};
    notifyError('errors.uploadedFilesClerk.fetchingDocs');
  }
}

watch(
  () => props.petition?.student_username,
  (username) => fetchDocuments(username),
  { immediate: true }
);

onBeforeUnmount(() => {
  resetCache();
});

// Dialog sizing (tight wrap)
function fitBox(maxW, maxH, aspect) {
  let h = maxH;
  let w = Math.floor(h * aspect);
  if (w > maxW) {
    w = maxW;
    h = Math.floor(w / aspect);
  }
  return { width: w, height: h };
}

const dialogBox = computed(() => {
  if (display.smAndDown.value) {
    return {
      width: Math.floor(display.width.value),
      height: Math.floor(display.height.value),
    };
  }

  const chrome = 32;
  const maxW = Math.max(320, Math.floor(display.width.value - chrome));
  const maxH = Math.max(320, Math.floor(display.height.value - chrome));

  const type = viewerType.value;
  const aspect =
    type && state.aspect[type] ? state.aspect[type] : 1 / Math.SQRT2;

  return fitBox(maxW, maxH, aspect);
});

const dialogMaxWidth = computed(() =>
  display.smAndDown.value ? '100vw' : `${dialogBox.value.width}px`
);

const dialogMaxHeight = computed(() =>
  display.smAndDown.value ? '100vh' : `${dialogBox.value.height}px`
);
</script>
