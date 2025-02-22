<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title class="headline">Petition Details</v-card-title>
      <v-divider></v-divider>

      <v-list>
        <v-list-item v-for="(value, key) in petition" :key="key">
          <v-list-item-title>{{ formatKey(key) }}</v-list-item-title>
          <v-list-item-subtitle>{{ formatValue(value) }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="closeDialog">CANCEL</v-btn>
        <v-btn color="primary" text @click="editPetition">EDIT</v-btn>
        <v-btn @click="deletePetition" color="red">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  petition: {
    type: [Object,null],
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