<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <!-- Card Title -->
      <v-card-title class="text-h5 font-weight-bold primary--text">
        Petition Details
      </v-card-title>
      <v-divider class="mb-4"></v-divider>

      <!-- List of Petition Details -->
      <v-list class="pa-0">
        <v-list-item
          v-for="(value, key) in petition"
          :key="key"
          class="d-flex align-center pa-4"
          :class="{ 'grey lighten-4': $vuetify.theme.dark }"
        >
          <v-list-item-content>
            <v-list-item-title class="font-weight-medium secondary--text">
              {{ formatKey(key) }}
            </v-list-item-title>
            <v-list-item-subtitle class="mt-1 text-body-1">
              {{ formatValue(value) }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="key !== Object.keys(petition).pop()" :key="`divider-${key}`"></v-divider>
      </v-list>

      <!-- Card Actions -->
      <v-card-actions class="pa-4">
        <v-btn color="grey darken-1" text @click="closeDialog">CANCEL</v-btn>
        <v-btn color="primary" text @click="editPetition">EDIT</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="deletePetition">DELETE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  petition: {
    type: [Object, null],
    required: true,
  },
  role: {
    type: String,
    required: false,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "editPetition", "deletePetition"]);
const dialog = ref(props.modelValue);
const petition = ref(props.petition);

// Watch for changes in modelValue prop
watch(
  () => props.modelValue,
  (newValue) => {
    dialog.value = newValue;
  }
);

// Watch dialog state and emit update to parent
watch(dialog, (newValue) => {
  emit("update:modelValue", newValue);
});

watch(
  () => props.petition,
  (newVal) => {
    petition.value = newVal;
  }
);

// Close the dialog
const closeDialog = () => {
  dialog.value = false;
};

// Edit the petition
const editPetition = () => {
  closeDialog();
  emit("editPetition");
};

// Delete the petition
const deletePetition = () => {
  closeDialog();
  emit("deletePetition", props.petition);
};

// Format key for display
const formatKey = (key) => {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Format value for display
const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return new Date(value).toLocaleDateString();
  }
  return value;
};
</script>

<style scoped>
/* Custom Styles */
.v-list-item {
  transition: background-color 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.v-list-item-title {
  font-size: 1rem;
  font-weight: 500;
  color: #424242; /* Dark grey for keys */
}

.v-list-item-subtitle {
  font-size: 0.9rem;
  color: #616161; /* Medium grey for values */
}

</style>