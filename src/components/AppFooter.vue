<template>  
  <v-footer
    color="primary-darken-2"  
    theme="dark"  
    style="padding: 16px 0 0; 
    min-height: 72px"
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
            :aria-label="$t(`appFooter.links.${link.text}`)"
          >  
            {{ $t(`appFooter.links.${link.text}`) }}  
          </v-btn>  
        </div>  

        <div class="my-2">  
          &copy; {{ new Date().getFullYear() }}   
          <a  
            href="https://uni-frankfurt.de/clock"  
            rel="noopener noreferrer"  
            target="_blank"  
            class="text-white" 
            aria-label="clock"
          >  
            CLOCK-Work 
          </a>  
        </div>  

        <div class="my-2 pb-10">  
          <p class="mb-4">  
            {{ $t('appFooter.text') }}  
          </p>  
            {{ $t('appFooter.code') }}  
            <a  
              class="text-no-wrap"   
              href="https://github.com/ClockGU"  
              aria-label="Github"
            >  
              Github 
            </a>  
        
        </div>  
      </v-col>  
    </v-row>  
  </v-footer>  
</template>  

<script setup>  
const links = [  
  { text: "Datenschutz", to: "https://clock.uni-frankfurt.de/privacy" },  
  { text: "Impressum", to: "https://clock.uni-frankfurt.de/impressum" }  
]  
</script>  

<style scoped>  
a {  
  text-decoration: none;  
  color: #EA80FC;  
}  
.text-white {  
  color: white;  
}  
</style>
