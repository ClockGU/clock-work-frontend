<template>
  <v-footer
    color="primary-darken-2"
    theme="dark"
    style="padding: 16px 0 0; min-height: 72px"
    aria-label="Footer"
  >
    <v-row justify="center" no-gutters>
      <v-col class="text-center d-flex align-center justify-center flex-column">
        <div class="d-flex align-center justify-center my-2">
          <v-btn
            v-for="link in links"
            :key="link.text"
            :href="link.to"
            color="white"
            variant="text"
            rounded
            class="mx-2"
            :aria-label="$t(`footer.links.${link.text}`)"
          >
            {{ $t(`footer.links.${link.text}`) }}
          </v-btn>
        </div>

        <div class="my-2">
          &copy; {{ new Date().getFullYear() }}
          <a
            href="https://uni-frankfurt.de/clock"
            rel="noopener noreferrer"
            target="_blank"
            class="footer-link"
            aria-label="clock"
          >
            CLOCK-Work
          </a>
        </div>
        <div class="my-2 pb-10">
          <i18n-t keypath="footer.acknowledgeGU.text" tag="p" scope="global">
            <template #link>
              <a
                :href="$t('footer.acknowledgeGU.url')"
                target="_blank"
                rel="noopener noreferrer"
                class="footer-link"
                :aria-label="$t('footer.acknowledgeGU.university')"
              >
                {{ $t('footer.acknowledgeGU.university') }}
              </a>
            </template>
          </i18n-t>
          <i18n-t keypath="footer.github_repo.text" tag="p" scope="global">
            <template #link>
              <a
                :href="$t('footer.github_repo.url')"
                target="_blank"
                rel="noopener noreferrer"
                class="footer-link"
                :aria-label="$t('footer.github_repo.github')"
              >
                {{ $t('footer.github_repo.github') }}
              </a>
            </template>
          </i18n-t>
        </div>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup>
const links = [
  { text: 'Datenschutz', to: 'https://clock.uni-frankfurt.de/privacy' },
  { text: 'Impressum', to: 'https://clock.uni-frankfurt.de/impressum' },
];
</script>

<style scoped>
.footer-link {
  color: #fff394 !important;
  text-decoration: underline !important;
  text-underline-offset: 0.3em !important;
  text-decoration-thickness: 1.5px !important;
  transition: all 0.2s ease !important;
  font-weight: 600 !important;
}
.footer-link:hover {
  text-decoration-thickness: 2px !important;
  color: #00ffbf !important;
}
</style>
