<template>
    <v-card class="mt-4 pa-8 w-100" elevation="2">
        <v-card-title class="mb-4">Petition Data display</v-card-title>
        <v-card-text>
            <v-row >
                <v-col cols="12" md="6" class="d-flex flex-column">
                    <FreeFormData class="flex-grow-1" style="overflow-y: auto;"/>
                </v-col>
                <v-col cols="12" md="6" class="d-flex flex-column">
                    <UploadedFiles class="flex-grow-1"/>
                </v-col>
            </v-row>
            <div class="d-flex flex-columns justify-space-around mt-6 ">
                <v-btn color="error" size="large" class="px-10"> 
                    Decline
                </v-btn>
                <v-btn color="success" size="large" class="px-10"> 
                    Accept
                </v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
import FreeFormData from './FreeFormData.vue';
import UploadedFiles from './UploadedFiles.vue';
</script>