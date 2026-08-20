<script setup>
import {
  mdiAccountCog,
  mdiHelpCircleOutline,
  mdiMailbox,
  mdiNumeric8Box,
  mdiSchool,
} from '@mdi/js';

const props = defineProps({
  locale: {
    type: String,
    default: 'de',
  },
});
</script>

<template>
  <div v-if="locale === 'de'">
    <h3>
      Hier können Sie einen Antrag auf Einstellung einer neuen Hilfskraft
      stellen und laufende Anträge überblicken.
    </h3>
    <p>
      Bitte stellen Sie sicher, dass Sie vor dem Start einer Antragstellung alle
      notwendigen Informationen parat haben.
    </p>
    <v-card>
      <v-card-title
        class="text-info v-alert--variant-tonal"
        style="position: relative"
      >
        <span class="v-alert__underlay"></span>
        <h4>Benötigte Daten</h4>
      </v-card-title>
      <v-card-text class="pl-8 pt-2">
        <p>
          Daten die für die Antragstellung benötigt werden, die die
          einzustellende Hilfskraft betreffen sind:
        </p>
        <v-list>
          <v-list-item :prepend-icon="mdiAccountCog"
            ><strong>HRZ-Accountname</strong> der Studierende*n (S-Nummer,
            Beispiel s7735755)
            <v-tooltip :open-on-hover="false" open-on-click>
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="mdiHelpCircleOutline"
                  variant="plain"
                ></v-btn>
              </template>
              <span
                >Diese Information bekommen Sie, indem Sie mit den Studierenden
                REDEN &#128521;
              </span>
            </v-tooltip>
          </v-list-item>
          <v-list-item :prepend-icon="mdiSchool"
            >Information ob der*die Studierend*e
            <strong>bereits über einen Bachelorabschluss</strong>
            verfügt
            <v-tooltip :open-on-hover="false" open-on-click>
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="mdiHelpCircleOutline"
                  variant="plain"
                ></v-btn>
              </template>
              <span
                >Diese Information bekommen Sie, indem Sie mit den Studierenden
                REDEN &#128521;
              </span>
            </v-tooltip>
          </v-list-item>
        </v-list>
        <p>Daten für die Finanzierung:</p>
        <v-list>
          <v-list-item :prepend-icon="mdiNumeric8Box"
            ><strong>Bezeichnung</strong> der Kostenstelle</v-list-item
          >
          <v-list-item :prepend-icon="mdiMailbox"
            ><strong>Emailadresse</strong> der für die angegebene Kostelle
            verantwortlichen Person
          </v-list-item>
        </v-list>
        <p class="mt-2">
          Ohne diese Daten können Sie <strong>keinen</strong> Antrag
          absenden/erstellen
        </p>
        <h3 class="text-red-darken-3">
          Ein Zwischenspeichern von nicht vollständig ausgefüllten Antragen ist
          <strong>nicht</strong> möglich.
        </h3>
      </v-card-text>
    </v-card>
    <h2 class="text-green-darken-3 mt-2">Support</h2>
    <h3>
      Sollten Sie Fragen zur Funktionsweise oder Probleme bei der Nutzung haben,
      wenden Sie sich bitte per mail an
      <a href="mailto:clock@uni-frankfurt.de?subject=Support%20Clockwork"
        >clock@uni-frankfurt.de</a
      >.
    </h3>
  </div>
  <div v-else>
    <h3>
      Here, you can submit a petition to hire a new student assistant and view
      your pending petitions.
    </h3>
    <p>
      Please ensure that you have all the necessary information ready before
      starting an application.
    </p>
    <v-card>
      <v-card-title
        class="text-info v-alert--variant-tonal"
        style="position: relative"
      >
        <span class="v-alert__underlay"></span>
        <h4>Necessary information</h4>
      </v-card-title>
      <v-card-text class="pl-8 pt-2">
        <p>
          Information needed to submit a petition relating to the student
          assistant:
        </p>
        <v-list>
          <v-list-item :prepend-icon="mdiAccountCog"
            ><strong>HRZ-Accountname</strong> of the student (S-Number, example
            s7735755)
            <v-tooltip :open-on-hover="false" open-on-click>
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="mdiHelpCircleOutline"
                  variant="plain"
                ></v-btn>
              </template>
              <span>
                You will get this information by TALKING to the student
                &#128521;
              </span>
            </v-tooltip>
          </v-list-item>
          <v-list-item :prepend-icon="mdiSchool">
            Information whether the student
            <strong>already acquired a Bachelors degree</strong>
            <v-tooltip :open-on-hover="false" open-on-click>
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="mdiHelpCircleOutline"
                  variant="plain"
                ></v-btn>
              </template>
              <span>
                You will get this information by TALKING to the student
                &#128521;
              </span>
            </v-tooltip>
          </v-list-item>
        </v-list>
        <p>Information concerning the budget:</p>
        <v-list>
          <v-list-item :prepend-icon="mdiNumeric8Box"
            ><strong>Designation</strong> of the budget position</v-list-item
          >
          <v-list-item :prepend-icon="mdiMailbox"
            ><strong>Email address</strong> of the person responsible for the
            specified budget position
          </v-list-item>
        </v-list>
        <p class="mt-2">
          It is <strong>not possible</strong> to submit a petition without this
          information.
        </p>
        <h3 class="text-red-darken-3">
          Furthermore, it is <strong>not possible</strong> to save a petition
          with incomplete data and modify it later on.
        </h3>
      </v-card-text>
    </v-card>
    <h2 class="text-green-darken-3 mt-2">Support</h2>
    <h3>
      Should question about the functionality of the application arise or you
      encounter any problems while using it, please contact us by email at
      <a href="mailto:clock@uni-frankfurt.de?subject=Support%20Clockwork"
        >clock@uni-frankfurt.de</a
      >.
    </h3>
  </div>
</template>

<style scoped></style>
