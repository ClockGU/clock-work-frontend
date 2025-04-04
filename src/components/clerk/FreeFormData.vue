<template>
    <v-card class="px-4 h-100"> 
        <v-card-title class="text-h6 px-4">
            Free Form Data
        </v-card-title>
        <v-card-text>
            <PetitionDetailsTable 
            v-if="petition"
            :role="'clerk'" 
            :petition="petition"
            @close="emit('close')"/>
            <p v-else class="mt-4 ml-1 text-subtitle-1 text-medium-emphasis" role="status" aria-live="polite">
            {{ $t('editCard.noPetitionSelected') }}
            </p>
        </v-card-text>
    </v-card>
</template>

<script setup>
import PetitionDetailsTable from '../dashboard/PetitionDetailsTable.vue';
const props=defineProps({
    petition:{
        type: [Object,null],
        required: true
    }
})
const emit=defineEmits(["close"])
</script>