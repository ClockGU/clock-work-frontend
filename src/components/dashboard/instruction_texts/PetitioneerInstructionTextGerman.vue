<script setup>
import { mdiAccountCog, mdiSchool, mdiNumeric8Box, mdiMailbox } from '@mdi/js';
</script>

<template>
  <v-card-text>
    <v-row>
      <v-col cols="6">
        <h3>
          Hier können Sie einen Antrag auf Einstellung einer neuen Hilfskraft
          stellen und laufende Anträge überblicken.
        </h3>
        <p>
          Bitte stellen Sie sicher, dass Sie vor dem Start einer Antragstellung
          alle notwendigen Informationen parat haben.
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
                Beispiel s7735755)</v-list-item
              >
              <v-list-item :prepend-icon="mdiSchool"
                >Information ob die Studierend*e
                <strong>bereits einen Bachelorabschluss</strong>
                besitzt</v-list-item
              >
            </v-list>
            <p>Daten für die Budgetierung:</p>
            <v-list>
              <v-list-item :prepend-icon="mdiNumeric8Box"
                ><strong>Bezeichnung</strong> der Kostenstelle</v-list-item
              >
              <v-list-item :prepend-icon="mdiMailbox"
                ><strong>Emailadresse</strong> der für die Angegebene Kostelle
                verantwortlichen Person
              </v-list-item>
            </v-list>
            <p class="mt-2">
              Ohne diese Daten können Sie <strong>keinen</strong> Antrag
              absenden/erstellen
            </p>
            <h3 class="text-red-darken-3">
              Ein zwischenspeichern von nicht vollständig ausgefüllten Antragen
              ist <strong>nicht</strong> möglich.
            </h3>
          </v-card-text>
        </v-card>
        <h2 class="text-green-darken-3 mt-2">Support</h2>
        <h3>
          Sollten Sie Fragen zur Funktionsweise oder Probleme bei der Nutzung
          haben, wenden Sie sich bitte per mail an
          <a href="mailto:clock@uni-frankfurt.de?subject=Support%20Clockwork"
            >clock@uni-frankfurt.de</a
          >.
        </h3>
      </v-col>
      <v-col cols="6">
        <h3>Prozessablauf</h3>
        <v-card>
          <v-card-title
            class="text-info v-alert--variant-tonal"
            style="position: relative"
          >
            <span class="v-alert__underlay"></span>
            <h4>Prozesschritte</h4>
          </v-card-title>
          <v-card-text class="pl-8 pt-2">
            <p>
              Der digitale Prozess der Antragstellung verhält sich grundlegend
              anders als der Analoge. Während Sie, als Antragsteller*in, zuvor
              alle nötigen Daten und Unterschriften von Studierenden und
              Kostenstellenverantwortlichen zusammen sammeln mussten ist dies im
              digitalen nicht mehr der Fall.
            </p>
            <p>
              Im digitalen Prozess gibt jede Prozessbeteiligt*e die von ihr*ihm
              benötigten Daten und Zustimmungen selbsständig ab. Hierfür wird
              nach jeder Prozessaktion, die den Status eines Antrags ändert,
              Emails an die Prozessbeteiligten gesendet die als nächstes eine
              Aktion durchführen müssen. Es passiert folglich nichts, worüber
              die betreffenden Personen nicht auch benachrichtigt werden.
            </p>
            <p>Also: <strong>Augen auf im Mail-Postfach</strong>!</p>
            <div class="inset">
              <span class="mt-2">
                Der Prozess gliedert sich grundsätzlich in 6-Schritte:
              </span>
              <ol class="shift-lists">
                <li>Prozessstart: Antragstellung</li>
                <li>Genehmigung durch Kostenstellenbeauftragt*e</li>
                <li>
                  Dateneingabe und Akzeptieren des Antrags der Studierende*n
                </li>
                <li>Datenprüfung durch Sachbearbeitung (HR)</li>
                <li>Versenden der Vertragsdokumente an Studierende</li>
                <li>
                  Prozessende: Eingang der unterschriebenen Vertragsdokumente
                  bei Sachbearbeitung (HR)
                </li>
              </ol>
            </div>
            <div class="inset">
              <span class="mt-2">
                Über diese Prozessschritte hinaus existieren noch
                Revisionsschritte:
              </span>
              <ul class="shift-lists">
                <li>
                  Kostenstellen-Revision: Antrag von Kostenstelle nicht im
                  angegebenen Umfang akzeptierbar (Details in Mail)
                </li>
                <p>Antragsteller muss handeln.</p>
                <li>
                  Studierenden-Revision: Antrag von Studierende*r nicht im
                  angegebenen Umfang akzeptierbar (Details in Mail)
                </li>
                <p>Antragsteller muss handeln.</p>
                <li>
                  Sachbearbeitung-Revision: Studierenden Daten fehlerhaft
                  (Details in Mail>
                </li>
                <p>Studierend*e muss handeln.</p>
              </ul>
            </div>
            <p class="mt-2">
              Der Status in der sich ein Antrag befindet wird in der
              Übersichtstabelle zu jeder Zeit angezeigt. Durch Hover-over
              (Cursor über das Icon bewegen) wird der Statustext sichtbar. Durch
              klicken des Icons wird eine Übersicht des <strong>allgemeinen
              Porzessablaufs</strong> angezeigt. des
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<style scoped>
</style>
