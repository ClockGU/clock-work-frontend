<template>
    <CustomDialog  title="Student Data Management">
      <template #content>      
        <v-container>
                <v-tabs v-model="tab" grow>
                    <v-tab value="personal">Personal Information</v-tab>
                    <v-tab value="files">Uploaded Files</v-tab>
                    <v-tab value="petition">Petition</v-tab>
                </v-tabs>
            
                <v-window v-model="tab">
                    <v-window-item value="personal">
                    <v-card flat>
                        <v-card-text>
                            <h2>Personal Information</h2>
                            <p>Here you can see and edit your personal information.</p>
                            <EmployeeDataForm class="mt-6"/>
                        </v-card-text>
                    </v-card>          
                    </v-window-item>
            
                    <v-window-item value="files">
                    <v-card flat>
                        <v-card-text>
                        <h2>Uploaded Files</h2>
                        <p>Here you can see the files you've uploaded.</p>
                        <FilesUploadForm class="mt-6"/>
                        </v-card-text>
                    </v-card>
                    </v-window-item>
            
                    <v-window-item value="petition">
                    <v-card flat>
                        <v-card-text>
                        <h2>Petition</h2>
                        <p>Here you can select your petition and then edit it.</p>
                        <div>
                            <v-select
                            :items="petitions"
                            item-title="eos_number"
                            label="Select a Petition"
                            v-model="selectedPetition"
                            return-object
                            class="my-4"
                            ></v-select>

                            <PetitionForm
                            v-if="selectedPetition"
                            ref="petitionFormRef"
                            :petition="selectedPetition"
                            isEditing
                            />
                        </div>
                        </v-card-text>
                    </v-card>
                    </v-window-item>
                </v-window>
                </v-container>
      </template>
  
      </CustomDialog>


</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import EmployeeDataForm from '@/components/forms/EmployeeDataForm.vue';
import PetitionForm from '@/components/forms/PetitionForm.vue';
import CustomDialog from '@/components/dialogs/CustomDialog.vue';
import FilesUploadForm from '@/components/forms/FilesUploadForm.vue';

const store = useStore();
const petitionFormRef = ref(null);
const tab = ref('personal');
const selectedPetition = ref(null);

const petitions = computed(() => store.getters['petitions/petitions']);
 

</script>
