<script setup>
import BaseDataDisplay from '@/components/tables/base/DataDisplayTable.vue';
import { mdiFileDocumentAlert } from '@mdi/js';
import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import PdfViewerDialog from '@/components/dialogs/PdfViewerDialog.vue';
import ContentApiService from '@/services/contentApiService';

const props = defineProps({
  employmentData: {
    type: Array,
    required: true,
  },
});
const fileToView = ref(null);
const downloadedProofs = reactive({});
const emptyEntry = { start: null, end: null, employer_name: null, proof: null };

const entryToRow = (entry) =>
  Object.keys(emptyEntry).map((key) => ({
    key,
    value: entry[key] ?? emptyEntry[key],
  }));

const tableRows = computed(() =>
  props.employmentData.map((entry, i) => {
    return { key: `Prev emp ${i + 1}`, id: entry.id, value: entryToRow(entry) };
  })
);

async function viewProof(id) {
  let blobUrl = downloadedProofs[id];
  if (!blobUrl) {
    const response = await ContentApiService.get(
      `/clerk/prev_employments/${id}/download`,
      { responseType: 'arraybuffer' }
    );
    blobUrl = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    downloadedProofs[id] = blobUrl;
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
      :rows="tableRows"
      :table-title="$t('dataDisplayTable.employeeData.title')"
      :header-key="$t('dataDisplayTable.employeeData.headers.field')"
      :header-value="$t('dataDisplayTable.employeeData.headers.value')"
    >
      <template #value-cell="{ row: prevEmployment }">
        <BaseDataDisplay :rows="prevEmployment.value">
          <template #value-cell="{ row }">
            <div v-if="row.key === 'proof'" class="d-flex align-center">
              <v-btn
                class="ml-auto"
                variant="flat"
                :append-icon="mdiFileDocumentAlert"
                @click="viewProof(prevEmployment.id)"
              >
                View Proof
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
