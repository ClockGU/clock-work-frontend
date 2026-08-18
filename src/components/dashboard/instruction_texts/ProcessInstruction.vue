<script setup>
import { useDisplay } from 'vuetify';

const props = defineProps({
  locale: {
    type: String,
    default: 'de',
  },
});
const { mdAndDown } = useDisplay();
</script>

<template>
  <div v-if="locale === 'de'">
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
          anders als der Analoge. Während Sie, als Antragsteller*in, zuvor alle
          nötigen Daten und Unterschriften von Studierenden und
          Kostenstellenverantwortlichen zusammen sammeln mussten ist dies im
          digitalen nicht mehr der Fall.
        </p>
        <p>
          Im digitalen Prozess gibt jede Prozessbeteiligt*e die von ihr*ihm
          benötigten Daten und Zustimmungen selbsständig ab. Hierfür wird nach
          jeder Prozessaktion, die den Status eines Antrags ändert, Emails an
          die Prozessbeteiligten gesendet die als nächstes eine Aktion
          durchführen müssen. Es passiert folglich nichts, worüber die
          betreffenden Personen nicht auch benachrichtigt werden.
        </p>
        <p>Also: <strong>Augen auf im Mail-Postfach</strong>!</p>
        <div class="inset">
          <span class="mt-2">
            Der Prozess gliedert sich grundsätzlich in 6-Schritte:
          </span>
          <ol class="shift-lists">
            <li>Prozessstart: Antragstellung</li>
            <li>Genehmigung durch Kostenstellenbeauftragt*e</li>
            <li>Dateneingabe und Akzeptieren des Antrags der Studierende*n</li>
            <li>Datenprüfung durch Sachbearbeitung (HR)</li>
            <li>Versenden der Vertragsdokumente an Studierende</li>
            <li>
              Prozessende: Eingang der unterschriebenen Vertragsdokumente bei
              Sachbearbeitung (HR)
            </li>
          </ol>
        </div>
        <div :class="[mdAndDown ? 'inset-md-and-down' : 'inset-lg-and-up']">
          <span class="mt-2">
            Über diese Prozessschritte hinaus existieren noch Revisionsschritte:
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
              Sachbearbeitung-Revision: Studierenden Daten fehlerhaft (Details
              in Mail>
            </li>
            <p>Studierend*e muss handeln.</p>
          </ul>
        </div>
        <p class="mt-2">
          Der Status in der sich ein Antrag befindet wird in der
          Übersichtstabelle zu jeder Zeit angezeigt. Durch Hover-over (Cursor
          über das Icon bewegen) wird der Statustext sichtbar. Durch klicken des
          Icons wird eine Übersicht des
          <strong>allgemeinen Porzessablaufs</strong> angezeigt. des
        </p>
      </v-card-text>
    </v-card>
  </div>
  <div v-else>
    <h3>Process flow</h3>
    <v-card>
      <v-card-title
        class="text-info v-alert--variant-tonal"
        style="position: relative"
      >
        <span class="v-alert__underlay"></span>
        <h4>Process steps</h4>
      </v-card-title>
      <v-card-text class="pl-8 pt-2">
        <p>
          The digital application process is fundamentally different from the
          analog one. Whereas you, as the applicant, previously had to collect
          all the necessary data and signatures from students and cost center
          managers, this is no longer the case in the digital process.
        </p>
        <p>
          In the digital process, each participant submits the required data and
          consents on their own. To this end, after every process action that
          changes the status of an application, emails are sent to the
          participants who must next take an action. Consequently, nothing
          happens without the relevant individuals being notified. Translated
          with DeepL.com (free version)
        </p>
        <p>So: <strong>Be aware of your Email-Inbox</strong>!</p>
        <div class="inset">
          <span class="mt-2">
            The process flow is conceptuall structured in 6 steps:
          </span>
          <ol class="shift-lists">
            <li>Processs start: Submission</li>
            <li>Approval by budget approver(s)</li>
            <li>Information input and approval by student</li>
            <li>Review of data by clerks (HR)</li>
            <li>Sending out contract forms to student</li>
            <li>
              Process end: Receipt of signed contract documents at clerks (HR)
            </li>
          </ol>
        </div>
        <div :class="[mdAndDown ? 'inset-md-and-down' : 'inset-lg-and-up']">
          <span class="mt-2">
            In addition to these process steps, there are also revision steps:
          </span>
          <ul class="shift-lists">
            <li>
              Budget approver revision: Request from budget approver not
              acceptable in the specified amount (details in email)
            </li>
            <p>Supervisor must act.</p>
            <li>
              Studient revision: Request from student not acceptable in the
              specified amount (details in email)
            </li>
            <p>Supervisor must act.</p>
            <li>
              Clerk revision: Student data incorrect or faulty (details in
              email)
            </li>
            <p>Supervisor must act.</p>
          </ul>
        </div>
        <p class="mt-2">
          The status of a request is displayed in the overview table at all
          times. When you hover (move the cursor over the icon), the status text
          becomes visible. When you click the icon, an overview of the
          <strong>general process flow</strong> is displayed.
        </p>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped></style>
