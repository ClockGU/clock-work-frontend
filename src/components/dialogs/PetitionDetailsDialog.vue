<template>
  <CustomDialog title="Petition Details" >
    <template #content>
      <v-list class="pa-2">
        <template v-for="(value, key, index) in petition" :key="key">
          <v-list-item class="d-flex align-center pa-4" :class="{ 'grey lighten-4': $vuetify.theme.dark }">
            <template v-slot:default>
              <v-list-item-title class="font-weight-medium secondary--text">
                {{ formatKey(key) }}
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1 text-body-1">
                {{ formatValue(value) }}
              </v-list-item-subtitle>
            </template>
          </v-list-item>
        </template>
      </v-list>
    </template>

    <template #actions="{ close }">
      <v-btn color="primary" text @click="editPetition">EDIT</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="deletePetition">DELETE</v-btn>
    </template>
  </CustomDialog>
</template>

<script setup>
import { ref, computed } from "vue";
import CustomDialog from "./CustomDialog.vue";
import { useStore } from "vuex";

const props = defineProps({
  petition: {
    type: [Object, null],
    required: true,
  },
  role: {
    type: String,
    required: false,
  },

});

const emit = defineEmits(["edit","close"]);
const store= useStore()
const petition = computed(() => props.petition);

const editPetition = () => {
  emit("edit");
  emit("close");

};
const deletePetition = () => {
  store.dispatch("petitions/removePetition", petition.value);
  emit("close");
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