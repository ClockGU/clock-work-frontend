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
          <v-carousel-item v-for="item in pdfItems" :key="item.kind">
            <div class="d-flex flex-column align-center pa-4">
              <p class="text-subtitle-1 font-weight-bold mb-4">
                {{ item.title }}
              </p>

              <!-- Loading -->
              <div v-if="state.loading[item.kind]" class="text-center">
                <ClockWorkLoader height="64" width="64" />
                <p class="mt-2">{{ $t('app.loading') }}</p>
              </div>

              <!-- Error -->
              <div v-else-if="state.error[item.kind]" class="text-center">
                <p>{{ $t('uploadedFiles.pdfLoadError') }}</p>
                <v-btn class="mt-2" @click="retryLoad(item.kind)">
                  {{ $t('uploadedFiles.retry') }}
                </v-btn>
              </div>

              <!-- PDF Preview (page 1 only) -->
              <div v-else class="w-100" style="max-width: 800px">
                <v-hover v-slot="{ isHovering, props: hoverProps }">
                  <div v-bind="hoverProps" class="position-relative">
                    <vue-pdf-embed
                      :source="state.blobUrl[item.kind]"
                      :page="1"
                      :width="previewPdfWidth"
                      @loaded="(pdf) => captureAspect(item.kind, pdf)"
                      @error="(err) => handlePdfError(err, item.kind)"
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
                      @click="openViewer(item.kind)"
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
    <PdfViewerDialog
      v-model="state.viewer.open"
      :source="docKindToDisplay ? state.blobUrl[docKindToDisplay] : null"
      :aspect="docKindToDisplay ? state.aspect[docKindToDisplay] : null"
      @error="(err) => handlePdfError(err, docKindToDisplay)"
      @loaded="(pdf) => captureAspect(docKindToDisplay, pdf)"
    />
  </v-card>
</template>

<script setup>
import { mdiDownloadMultiple, mdiFullscreen } from '@mdi/js';
import { computed, reactive, watch, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';
import ContentApiService from '@/services/contentApiService';
import VuePdfEmbed from 'vue-pdf-embed';
import ClockWorkLoader from '@/icons/ClockWorkLoader.vue';
import PdfViewerDialog from '@/components/dialogs/PdfViewerDialog.vue';

const props = defineProps({
  petition: { type: Object, required: true },
});

const icons = {
  mdiDownloadMultiple,
  mdiFullscreen,
};

const { t } = useI18n();
const store = useStore();
const display = useDisplay();

const DOCS = [
  {
    kind: 'elstam',
    urlProp: 'elstam_file',
    i18nKey: 'files.elstam',
    defaultName: 'elstam.pdf',
  },
  {
    kind: 'studienbescheinigung',
    urlProp: 'studienbescheinigung_file',
    i18nKey: 'files.studienbescheinigung',
    defaultName: 'study_certificate.pdf',
  },
  {
    kind: 'versicherung',
    urlProp: 'versicherungsbescheinigung_file',
    i18nKey: 'files.versicherungsbescheinigung',
    defaultName: 'insurance_certificate.pdf',
  },
  {
    kind: 'sozialversicherungsbogen',
    urlProp: 'sozialversicherungsbogen_file',
    i18nKey: 'files.sozialversicherungsbogen',
    defaultName: 'social_insurance_form.pdf',
  },
  {
    kind: 'ba_degree',
    urlProp: 'ba_degree_file',
    i18nKey: 'files.ba_degree',
    defaultName: 'ba_degree.pdf',
  },
];

const docKinds = DOCS.map((d) => d.kind);
const makeKindMap = (initial) =>
  Object.fromEntries(docKinds.map((kind) => [kind, initial]));

const state = reactive({
  documents: {},
  currentSlide: 0,

  blobUrl: makeKindMap(null),
  loading: makeKindMap(false),
  error: makeKindMap(false),
  aspect: makeKindMap(null),

  createdBlobUrls: [],
  downloadingAll: false,

  viewer: {
    open: false,
    docKind: null,
  },
});

const pdfItems = computed(() =>
  DOCS.filter((d) => !!state.documents?.[d.urlProp]).map((d) => {
    const url = state.documents[d.urlProp];
    return {
      kind: d.kind,
      title: t(d.i18nKey),
      url,
      fileName: extractFileName(url) || d.defaultName,
    };
  })
);

const hasDocuments = computed(() => pdfItems.value.length > 0);
const anyLoading = computed(() => Object.values(state.loading).some(Boolean));
const anyError = computed(() => Object.values(state.error).some(Boolean));
const docKindToDisplay = computed(() => state.viewer.docKind);

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

function getDocUrl(docKind) {
  const doc = DOCS.find((d) => d.kind === docKind);
  return doc ? state.documents?.[doc.urlProp] : null;
}

/**
 * loading function for the carousel/viewer docs:
 * - fetches ArrayBuffer via /download-file/
 * - creates blob URL
 * - caches it per document kind
 */
async function ensureBlobUrl(docKind, { force = false } = {}) {
  const url = getDocUrl(docKind);
  if (!url) return null;
  if (state.blobUrl[docKind] && !force) return state.blobUrl[docKind];

  try {
    state.loading[docKind] = true;
    state.error[docKind] = false;

    const res = await ContentApiService.get('/download-file', {
      params: { file_url: url },
      responseType: 'arraybuffer',
      validateStatus: (s) => s === 200,
    });

    const blob = new Blob([res.data], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    revokeIfCreated(state.blobUrl[docKind]);

    state.blobUrl[docKind] = blobUrl;
    state.createdBlobUrls.push(blobUrl);

    return blobUrl;
  } catch (err) {
    console.error(`PDF load failed (${docKind}):`, err);
    state.error[docKind] = true;
    notifyError('errors.uploadedFilesClerk.loadingDocs');
    return null;
  } finally {
    state.loading[docKind] = false;
  }
}

function retryLoad(docKind) {
  ensureBlobUrl(docKind, { force: true });
}

function handlePdfError(error, docKind) {
  console.error('PDF render error:', error);
  state.error[docKind] = true;
  notifyError('errors.uploadedFilesClerk.pdfRender');
}

function openViewer(docKind) {
  state.viewer.docKind = docKind;
  state.viewer.open = true;
}

function closeViewer() {
  state.viewer.open = false;
  state.viewer.docKind = null;
}

// Capture page-1 aspect ratio so dialog can tightly wrap the PDF
function captureAspect(docKind, pdf) {
  if (!docKind || state.aspect[docKind]) return;
  try {
    if (!pdf?.getPage) return;
    pdf.getPage(1).then((page) => {
      const viewport = page.getViewport({ scale: 1 });
      if (viewport?.width && viewport?.height) {
        state.aspect[docKind] = viewport.width / viewport.height;
      }
    });
  } catch {}
}

async function fetchEmployeeStudentDataPdf() {
  return ContentApiService.get(`/clerk/petitions/${props.petition.id}/student-data-pdf`, {
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
      const blobUrl = await ensureBlobUrl(item.kind);
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

  // reset per-document-kind caches
  for (const kind of docKinds) {
    state.blobUrl[kind] = null;
    state.loading[kind] = false;
    state.error[kind] = false;
    state.aspect[kind] = null;
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

    const res = await ContentApiService.get('/clerk/documents-by-username', {
      params: { student_username: studentUsername },
    });

    state.documents = res.data || {};
    // load all available docs in parallel
    await Promise.all(
      DOCS.map((d) =>
        state.documents?.[d.urlProp] ? ensureBlobUrl(d.kind) : null
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

// Reset viewer on any close (button, Esc, backdrop)
watch(
  () => state.viewer.open,
  (open) => {
    if (!open) closeViewer();
  }
);

onBeforeUnmount(() => {
  resetCache();
});
</script>
