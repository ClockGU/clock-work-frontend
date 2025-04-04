<template>
    <v-card class="px-4 h-100"> 
        <v-card-title class="text-h6 px-4">
            Free Form Data
        </v-card-title>
        <v-card-text>
            <PetitionDetailsTable 
            :role="'clerk'" petition="null"/>
        </v-card-text>
    </v-card>
</template>

<script setup>
import PetitionDetailsTable from '../dashboard/PetitionDetailsTable.vue';

const petition = {  
  "petitioneer": "John Doe",  
  "student_mail": "john.doe@example.com",  
  "start_date": "2025-04-01",  
  "end_date": "2025-04-30",  
  "org_unit": "Computer Science Department",  
  "eos_number": "EOS123456",  
  "minutes": "This petition is to request funding for the annual tech conference.",  
  "ba_degree": true,  
  "budget_position": "Tech Conference Coordinator",  
  "budget_approver": "Jane Smith",  
  "time_exec": true,  
  "time_exce_name": "Tech Conference Execution",  
  "time_exce_start": "2025-04-01T09:00:00",  
  "time_exce_end": "2025-04-30T17:00:00",  
  "duration_exec": true,  
  "duration_exce_name": "Conference Duration",  
  "duration_exce_start": "2025-04-15T09:00:00",  
  "duration_exce_end": "2025-04-16T17:00:00"  
}
</script>