<script setup>
import { mdiAccountCog, mdiMailbox, mdiNumeric8Box, mdiSchool } from '@mdi/js';
</script>

<template>
  <v-card-text>
    <v-row>
      <v-col cols="6">
        <h3>
          Here you can submit aa petition to hire a new student assisten and
          view your pending petitions.
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
              Information needed to submit a petition, which relates to the
              student assistant:
            </p>
            <v-list>
              <v-list-item :prepend-icon="mdiAccountCog"
                ><strong>HRZ-Accountname</strong> of the student (S-Number,
                example s7735755)</v-list-item
              >
              <v-list-item :prepend-icon="mdiSchool"
                >Information whether the student
                <strong>already acquired a Bachelors degree</strong>
              </v-list-item>
            </v-list>
            <p>Information concerning the budget position:</p>
            <v-list>
              <v-list-item :prepend-icon="mdiNumeric8Box"
                ><strong>Designation</strong> of the budget
                position</v-list-item
              >
              <v-list-item :prepend-icon="mdiMailbox"
                ><strong>Email adress</strong> of the person responsible for the
                specified budget position
              </v-list-item>
            </v-list>
            <p class="mt-2">
              It is <strong>not possible</strong> to submit a petition without
              this information.
            </p>
            <h3 class="text-red-darken-3">
              It is not furthermore <strong>not possible</strong> to save a
              petition with incomplete data and modify it later on.
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
      </v-col>
      <v-col cols="6">
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
              The digital application process is fundamentally different from
              the analog one. Whereas you, as the applicant, previously had to
              collect all the necessary data and signatures from students and
              cost center managers, this is no longer the case in the digital
              process.
            </p>
            <p>
              In the digital process, each participant submits the required data
              and consents on their own. To this end, after every process action
              that changes the status of an application, emails are sent to the
              participants who must next take an action. Consequently, nothing
              happens without the relevant individuals being notified.
              Translated with DeepL.com (free version)
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
                  Process end: Receipt of signed contract documents at clerks
                  (HR)
                </li>
              </ol>
            </div>
            <div class="inset">
              <span class="mt-2">
                In addition to these process steps, there are also revision
                steps:
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
              times. When you hover (move the cursor over the icon), the status
              text becomes visible. When you click the icon, an overview of the
              <strong>general process flow</strong> is displayed.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<style scoped></style>
