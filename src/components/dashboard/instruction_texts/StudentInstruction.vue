<script setup>
import { mdiPaperclip } from '@mdi/js';
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
      Hier können Sie die für Sie gestellten Anträge auf Einstellung als
      Hilfskraft überblicken, Ihre Daten verwalten und Anträgen
      zustimmen/ablehnen/Änderungen anfragen.
    </h3>
    <p class="mt-2 mb-4">
      Bitte stellen Sie sicher, dass Sie vor dem Start der
      Dateneingabe/Genehmigung alle notwendigen Daten und Dateien parat haben.
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
          Dateien die für das Ausfüllen Ihrer persönlichen Daten benötigt
          werden:
        </p>
        <v-list>
          <v-list-item :prepend-icon="mdiPaperclip">
            <strong>Ausgefülltes</strong> ELStAM Formular, zu finden
            <a
              href="https://www.uni-kassel.de/einrichtung/hochschulbezuegestelle/lohnsteuerabzugsverfahren.html"
              >hier</a
            >.
          </v-list-item>
          <v-list-item :prepend-icon="mdiPaperclip">
            <strong>Aktuelle</strong> Studienbescheinigung
          </v-list-item>
          <v-list-item :prepend-icon="mdiPaperclip"
            >Versicherungsnachweis der Krankenkasse
          </v-list-item>
          <v-list-item :prepend-icon="mdiPaperclip">
            <strong>Ausgefüllter</strong> Fragebogen zur Sozailversicherung, zu
            finden
            <a
              href="https://www.uni-kassel.de/einrichtung/hochschulbezuegestelle/formulare-informationen.html"
              >hier
            </a>
            unter dem Tab "Sozialversicherung".
          </v-list-item>
          <v-list-item :prepend-icon="mdiPaperclip">
            <strong>Bild ode Scan</strong>
            des Personalausweises
          </v-list-item>
          <v-list-item :prepend-icon="mdiPaperclip">
            Optional: Visum/Aufenthaltsgenehmigung
          </v-list-item>
          <v-list-item :prepend-icon="mdiPaperclip">
            Optional: Scan Bachelorabschluss
          </v-list-item>
        </v-list>
        <p class="mt-2">
          Ohne diese Daten können Sie <strong>keinen</strong> Antrag
          absenden/erstellen
        </p>
        <h3 class="text-red-darken-3">
          Ein akzeptieren von Anträgen mit nicht vollständig ausgefüllten Daten
          ist
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
      Here you can view the requests submitted to you for employment as a
      student assistant, manage your information, and approve, reject, or
      request changes to these requests.
    </h3>
    <p class="mt-2 mb-4">
      Please make sure you have all the necessary data and files ready before
      you begin data entry/approval.
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
        <p>Files required to enter your personal information :</p>
        <v-list>
          <v-list-item :prepend-icon="mdiPaperclip">
            <strong>Completed</strong> ELStAM form, available
            <a
              href="https://www.uni-kassel.de/einrichtung/hochschulbezuegestelle/lohnsteuerabzugsverfahren.html"
              >here</a
            >.
          </v-list-item>
          <v-list-item :prepend-icon="mdiPaperclip">
            <strong>Up-to-date</strong> enrolment vertificate
          </v-list-item>
          <v-list-item :prepend-icon="mdiPaperclip"
            >Health Insurance Membership Certificate
          </v-list-item>
          <v-list-item :prepend-icon="mdiPaperclip">
            <strong>Completed</strong> social security questionnaire, available
            <a
              href="https://www.uni-kassel.de/einrichtung/hochschulbezuegestelle/formulare-informationen.html"
              >here
            </a>
            in the tab "Sozialversicherung".
          </v-list-item>
          <v-list-item :prepend-icon="mdiPaperclip">
            <strong>Photo or scan</strong>
            of the ID card
          </v-list-item>
          <v-list-item :prepend-icon="mdiPaperclip">
            Optional: Visa/Residence permit
          </v-list-item>
          <v-list-item :prepend-icon="mdiPaperclip">
            Optional: Scan Bachelors degree
          </v-list-item>
        </v-list>
        <p class="mt-2">
          Without this information, you cannot <strong>submit</strong> a
          petition.
        </p>
        <h3 class="text-red-darken-3">
          Petitions cannot
          <strong>be accepted</strong> with incomplete personal information.
        </h3>
      </v-card-text>
    </v-card>
    <h2 class="text-green-darken-3 mt-2">Support</h2>
    <h3>
      Should question about the functioning of the application arise or you
      encounter any problems while using it, please contact us by email at
      <a href="mailto:clock@uni-frankfurt.de?subject=Support%20Clockwork"
        >clock@uni-frankfurt.de</a
      >.
    </h3>
  </div>
</template>

<style scoped></style>
