<template>
    <v-card class="px-4 h-100"> 
        <v-card-title class="text-h6 px-4">
            {{ $t('freeFormData.title') }}
        </v-card-title>
        <v-card-text>
            <PetitionDetailsTable 
            v-if="petition"
            :petition="petition"
            @close="emit('close')"
            @refresh="handleRefresh"            />
            <p v-else class="mt-4 ml-1 text-subtitle-1 text-medium-emphasis" role="status" aria-live="polite">
            {{ $t('editCard.noPetitionSelected') }}
            </p>
        </v-card-text>
    </v-card>
</template>

<script setup>
import PetitionDetailsTable from '@/components/tables/PetitionDetailsTable.vue';
const props=defineProps({
    petition:{
        type: [Object,null],
        required: true
    }
})
const emit=defineEmits(["close","refresh"])
const handleRefresh = (payload) => {
    emit('refresh', payload);
};
</script>