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
          anders als der Analoge Prozess. Während Sie als Antragsteller*in zuvor
          alle nötigen Daten und Unterschriften von Studierenden und
          Kostenstellenverantwortlichen zusammen sammeln mussten, ist dies im
          digitalen Prozess nicht mehr der Fall.
        </p>
        <p>
          Im digitalen Prozess gibt jede*r Prozessbeteiligt*e die von ihr*ihm
          benötigten Daten und Zustimmungen selbsständig ab. Hierfür werden nach
          jeder Aktion, die den Status eines Antrags ändert, Emails an die
          Prozessbeteiligten gesendet, die als nächstes eine Aktion durchführen
          müssen. Es passiert folglich nichts, worüber die betreffenden Personen
          nicht auch benachrichtigt werden.
        </p>
        <p>Also: <strong>Augen auf im Mail-Postfach</strong>!</p>
        <div class="inset">
          <span class="mt-2">
            Der Prozess gliedert sich grundsätzlich in 6 Schritte:
          </span>
          <ol class="shift-lists">
            <li>Prozessstart: Antragstellung</li>
            <li>Genehmigung durch Kostenstellenbeauftragt*e</li>
            <li>
              Dateneingabe und Akzeptieren des Antrags der*des Studierende*n
            </li>
            <li>Datenprüfung durch Sachbearbeitung (HR-PS)</li>
            <li>Versenden der Vertragsdokumente an Studierende</li>
            <li>
              Prozesende: Eingang der unterschriebenen Vertragsdokumente bei der
              Sachbearbeitung (HR-PS)
            </li>
          </ol>
        </div>
        <div :class="[mdAndDown ? 'inset-md-and-down' : 'inset-lg-and-up']">
          <span class="mt-2">
            Über diese Prozessschritte hinaus sind Revisionsschritte möglich:
          </span>
          <ul class="shift-lists">
            <li>
              Kostenstellen-Revision: Finanzierung von der Kostenstelle nicht im
              angegebenen Umfang akzeptierbar (Details in Mail)
            </li>
            <p>&#8594; Antragsteller muss handeln.</p>
            <li>
              Studierenden-Revision: Antrag von Studierende*r nicht im
              angegebenen Umfang akzeptierbar (Details in Mail)
            </li>
            <p>&#8594; Antragsteller muss handeln.</p>
            <li>
              Sachbearbeitung-Revision: Studierendendaten unvollständig oder
              fehlerhaft (Details in Mail)
            </li>
            <p>&#8594; Studierend*e muss handeln.</p>
          </ul>
        </div>
        <p class="mt-2">
          Der Status, in dem sich ein Antrag befindet, wird jederzeit in der
          Übersichtstabelle angezeigt. Durch Hover-over (Cursor über das Icon
          bewegen) wird der Statustext sichtbar. Durch klicken des Icons wird
          eine Übersicht des
          <strong>allgemeinen Porzessablaufs</strong> angezeigt.
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
          analog process. While applicants previously had to collect all
          necessary data and signatures from students and cost center managers,
          this is no longer the case in the digital process.
        </p>
        <p>
          In the digital process, each participant submits the required data and
          approves the respective request. After every process action that
          changes the status of an application, emails are sent to the
          participants who must next take an action: Nothing happens without the
          relevant individuals being notified.
        </p>
        <p>So: <strong>Be aware of your Email-Inbox</strong>!</p>
        <div class="inset">
          <span class="mt-2">
            The process flow is conceptually structured in 6 steps:
          </span>
          <ol class="shift-lists">
            <li>Processs start: Submission</li>
            <li>Approval by budget approver(s)</li>
            <li>Information input and approval by student</li>
            <li>Review of data by clerks (HR)</li>
            <li>Sending out contract forms to the student</li>
            <li>
              Process end: Receipt of signed contract documents by the clerks
              (HR)
            </li>
          </ol>
        </div>
        <div :class="[mdAndDown ? 'inset-md-and-down' : 'inset-lg-and-up']">
          <span class="mt-2">
            In addition to these process steps, revision steps are possible:
          </span>
          <ul class="shift-lists">
            <li>
              Budget approver revision: Budget request not acceptable for the
              specified budget position (details in email)
            </li>
            <p>&#8594; Supervisor must act.</p>
            <li>
              Student revision: Request not acceptable due to duration or number
              of hours (details in email)
            </li>
            <p>&#8594; Supervisor must act.</p>
            <li>
              Clerk revision: Student data incorrect or incomplete (details in
              email)
            </li>
            <p>&#8594; Student must act.</p>
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
