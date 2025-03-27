<template>
    <v-form>
      <v-row>
        <v-col cols="12">
          <!-- File input for Elstam -->
          <v-file-input
            :label="$t('filesUploadForm.elstam')"
            outlined
            dense
          />
        </v-col>
        <v-col cols="12">
          <!-- File input for Studienbescheinigung -->
          <v-file-input
            :label="$t('filesUploadForm.studienbescheinigung')"
            outlined
            dense
          />
        </v-col>
        <v-col cols="12">
          <!-- File input for Versicherungsbescheinigung -->
          <v-file-input
            :label="$t('filesUploadForm.versicherungsbescheinigung')"
            outlined
            dense
          />
        </v-col>
      </v-row>
    </v-form>
</template>
