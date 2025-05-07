<template>
   <!--  AlertDialog to confirm petition deletion-->
   <AlertDialog 
    v-model="showDeleteConfirmationDialog"
    :action-text="$t('actions.confirm')"
    :action="deletePetition"
    >
    <template #content>
      <p>{{ $t('petitionDetailsTable.deletionConfirmationMessage') }}</p>
    </template>
  </AlertDialog>

  <!--Dialog to report an issue wuith a petition -->
  <PetitionIssueDialog
    v-if="userRole==0||userRole==2"
    v-model="showPetitionIssueDialog"
    :petition="petition"
    @close="showPetitionIssueDialog = false"
  ></PetitionIssueDialog>

  <!-- Tooltips for petitions actions like edit,delete...-->
  <div class="d-flex justify-space-between align-center mb-3 ">
    <v-btn
        color="error"
        :aria-label="$t('actions.close')"
        @click="$emit('close')"
      >
        <v-icon>{{ icons.mdiClose }}</v-icon>
        <v-tooltip 
          activator="parent"
          location="top"
          :text="$t('actions.close')"
        ></v-tooltip>
      </v-btn>

    <div class="d-flex align-center ga-3 ml-1" >
      <v-btn
        v-if="userRole==0||userRole==2"
        color="warning"
        :aria-label="$t('actions.report')"
        @click="showPetitionIssueDialog = true"
        >   
        <v-icon>{{ icons.mdiAlertCircleOutline }}</v-icon>
        <v-tooltip 
          activator="parent"
          location="top"
          :text="$t('actions.report')"
        ></v-tooltip>
      </v-btn>
      <v-btn
        v-if="userRole>0"
        color="primary"
        :aria-label="$t('actions.edit')"
        @click="$emit('edit')"
        >   
        <v-icon>{{ icons.mdiPencil }}</v-icon>
        <v-tooltip 
          activator="parent"
          location="top"
          :text="$t('actions.edit')"
        ></v-tooltip>
        </v-btn>
      <v-btn
        v-if="userRole>0"
        color="error"
        :aria-label="$t('actions.delete')"
        @click="showDeleteConfirmationDialog = true">
        <v-icon>{{ icons.mdiTrashCan }}</v-icon>
        <v-tooltip 
          activator="parent"
          location="top"
          :text="$t('actions.delete')"
        ></v-tooltip>
      </v-btn>
    </div>  
  </div>

  <!-- Main Table -->
  <v-table
    class="styled-table mb-4"
    density="comfortable"
    hover
    role="table"
    :aria-label="$t('petitionDetailsTable.title')"
  >
    <thead>
      <tr role="row">
        <th
          class="key-column"
          scope="col"
          role="columnheader"
          :aria-label="$t('petitionDetailsTable.headers.petitionField')"
        >
          {{ $t('petitionDetailsTable.headers.petitionField') }}
        </th>
        <th
          class="value-column"
          scope="col"
          role="columnheader"
          :aria-label="$t('petitionDetailsTable.headers.value')"
        >
          {{ $t('petitionDetailsTable.headers.value') }}
        </th>
      </tr>
    </thead>
    <tbody role="rowgroup">
      <tr
        v-for="key in getOrderedFields(petition)"
        :key="key"
        role="row"
      >
        <td class="key-cell" role="cell">
          {{ $t(`petition.${formatKey(key)}`) || key }}
        </td>
        <td class="value-cell" role="cell">
          {{ formatValue(petition[key]) }}
        </td>
      </tr>
   </tbody>
  </v-table>
</template>
  
<script setup>
import {ref,computed} from 'vue'
import { mdiClose, mdiPencil ,mdiTrashCan,mdiAlertCircleOutline} from '@mdi/js';
import ContentApiService from '@/services/contentApiService.js'
import {useStore} from "vuex"

const props = defineProps({
  petition: {
    type: Object,
    required: true,
  }
});

const emit = defineEmits(['close', 'edit','refresh']);
const icons = { mdiClose, mdiPencil,mdiTrashCan ,mdiAlertCircleOutline};

const store=useStore()
const showDeleteConfirmationDialog = ref(false);
const showPetitionIssueDialog = ref(false);
const userRole = computed(()=>store.getters['auth/user'].user_role);

const formatKey = (key) => {
  return key
    .split("_")
    .map((word, index) => (index ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join("");
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return new Date(value).toLocaleDateString();
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return value;
};

function formatPetition(petition) {
  const formattedPetition = {}; 
  const skippedKeys = [
    'id',
    'status',
    'time_exce_student', 
    'duration_exce_course', 
    'time_exce_course', 
    'user_account',
  ];

  for (const [key, value] of Object.entries(petition)) {
    // Skip skipped keys and time/duration exception fields if exception is not enabled
    if (skippedKeys.includes(key)) continue;
    if ((key.startsWith('time_exce_')) && !petition.time_exce_course) continue;
    if ((key.startsWith('duration_exce_')) && !petition.duration_exce_course) continue; 
    formattedPetition[key] = value;
  }
  return formattedPetition;
}
const FIELD_ORDER = [
  'supervisor_mail',
  'student_mail',
  'start_date',
  'end_date',
  'minutes',
  'org_unit',
  'eos_number',
  'ba_degree',
  'budget_position',
  'budget_approver',
  'time_exce_name',
  'time_exce_start',
  'time_exce_end',
  'duration_exce_name',
  'duration_exce_start',
  'duration_exce_end',
];

function getOrderedFields(petition) {
  const fields = formatPetition(petition);
  return FIELD_ORDER.filter(key => {
    return fields.hasOwnProperty(key);
  });
}
const deletePetition = async () => {
  try {
    await ContentApiService.delete(`supervisor/petitions/${props.petition.id}`);
    emit('refresh', {
      type: 'delete',
      data: props.petition.id
    });
  } catch (error) {
    console.error("Error deleting petition:", error);
    store.dispatch("snackbar/setErrorSnacks", {
        message: "Error deleting the petition",
      });
  }finally {
    showDeleteConfirmationDialog.value = false;
  }
}
</script>
  
<style scoped>
  .styled-table {
    border-collapse: collapse;
    border: 1px solid #d6d3d3; 
  }
  .styled-table th,
  .styled-table td {
    border-bottom: 1px solid #fafafa;
  }
  .styled-table th {
    background-color: #fafafa;
    font-weight: 500;
    color: #333;
    text-align: left;
    border-right: 1px solid #e0e0e0;
  }
  .styled-table td {
    color: #555;
    border-right: 1px solid #e0e0e0;
  }
  .key-column {
    width: 30%;
    font-weight: 500;
  }
  .value-column {
    width: 70%;
  }
  .key-cell {
    background-color: #fafafa;
    font-weight: 500;
  }
  .value-cell {
    background-color: #ffffff;
  }
</style>

