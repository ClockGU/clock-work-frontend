<script setup>
import BaseDataDisplay from '@/components/tables/base/DataDisplayTable.vue';
import { mdiDownloadMultiple, mdiFileDocumentAlert } from '@mdi/js';
import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import PdfViewerDialog from '@/components/dialogs/PdfViewerDialog.vue';
import ContentApiService from '@/services/contentApiService';
import { useI18n } from 'vue-i18n';
import { displayDate } from '@/utils/date';

const { t } = useI18n();

const props = defineProps({
  employmentData: {
    type: Array,
    required: true,
  },
});
const fileToView = ref(null);
const downloadedProofs = reactive({});
const downloadingAll = ref(false);
const emptyEntry = { start: null, end: null, employer_name: null, proof: null };

function getKeyDisplay(key) {
  return t(`dataDisplayTable.prevEmploymentData.subfields.fields.${key}`);
}

function tryDateFormat(value) {
  try {
    return displayDate(value);
  } catch (e) {
    return e;
  }
}

const entryToRow = (entry) =>
  Object.keys(emptyEntry).map((key) => ({
    key: getKeyDisplay(key),
    origKey: key,
    value: tryDateFormat(entry[key]) ?? emptyEntry[key],
  }));

const tableRows = computed(() =>
  props.employmentData.map((entry, i) => {
    return {
      key: t('dataDisplayTable.prevEmploymentData.entryNameStub', { n: i + 1 }),
      id: entry.id,
      value: entryToRow(entry),
    };
  })
);

function triggerDownload(url, fileName) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'document.pdf';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function getProofAsBlob(id) {
  const response = await ContentApiService.get(
    `/clerk/prev_employments/${id}/download`,
    { responseType: 'arraybuffer' }
  );
  const blobUrl = URL.createObjectURL(
    new Blob([response.data], { type: 'application/pdf' })
  );
  downloadedProofs[id] = blobUrl;
  return blobUrl;
}

async function downloadAll() {
  downloadingAll.value = true;
  try {
    for (const entry of props.employmentData) {
      if (!downloadedProofs[entry.id]) {
        await getProofAsBlob(entry.id);
      }
      triggerDownload(downloadedProofs[entry.id], entry.proof);
      await new Promise((r) => setTimeout(r, 150));
    }
  } catch (e) {
    store.dispatch('snackbar/setErrorSnacks', {
      message: 'Error downloading files.',
    });
  } finally {
    downloadingAll.value = false;
  }
}

async function viewProof(id) {
  let blobUrl = downloadedProofs[id];
  if (!blobUrl) {
    blobUrl = await getProofAsBlob(id);
  }
  fileToView.value = blobUrl;
}
onBeforeUnmount(() => {
  for (const blob of downloadedProofs) {
    URL.revokeObjectURL(blob);
  }
});
</script>

<template>
  <div v-if="!!employmentData">
    <BaseDataDisplay
      class="mt-4"
      :rows="tableRows"
      :table-title="$t('dataDisplayTable.employeeData.title')"
      :header-key="$t('dataDisplayTable.prevEmploymentData.headers.field')"
      :header-value="$t('dataDisplayTable.prevEmploymentData.headers.value')"
    >
      <template #bottom>
        <v-btn
          color="primary"
          variant="outlined"
          :loading="downloadingAll"
          @click="downloadAll"
        >
          <v-icon start :icon="mdiDownloadMultiple" />
          {{ $t('actions.downloadAll') }}
        </v-btn>
      </template>
      <template #value-cell="{ row: prevEmployment }">
        <BaseDataDisplay :rows="prevEmployment.value">
          <template #value-cell="{ row }">
            <div v-if="row.origKey === 'proof'" class="d-flex align-center">
              <v-btn
                variant="flat"
                :append-icon="mdiFileDocumentAlert"
                @click="viewProof(prevEmployment.id)"
              >
                {{ t('dataDisplayTable.prevEmploymentData.downloadBtnText') }}
              </v-btn>
            </div>
          </template>
        </BaseDataDisplay>
      </template>
    </BaseDataDisplay>
    <PdfViewerDialog
      :model-value="!!fileToView"
      :source="fileToView"
      @update:model-value="(open) => !open && (fileToView = null)"
      @error="(err) => console.log('EROOOOR', err)"
    >
    </PdfViewerDialog>
  </div>
</template>

<style scoped></style>
