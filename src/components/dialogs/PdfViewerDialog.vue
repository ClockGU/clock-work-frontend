<template>
  <v-dialog
    v-model="model"
    :fullscreen="display.smAndDown.value"
    :max-width="dialogMaxWidth"
    :max-height="dialogMaxHeight"
    content-class="pa-0"
    transition="slide-y-reverse-transition"
  >
    <div
      class="position-relative"
      :style="{
        width: dialogBox.width + 'px',
        height: dialogBox.height + 'px',
        overflow: 'hidden',
      }"
    >
      <!-- Close -->
      <v-btn
        icon
        variant="tonal"
        size="small"
        :aria-label="$t('actions.close')"
        style="position: absolute; top: 8px; right: 8px; z-index: 3"
        @click="model = false"
      >
        <v-icon :icon="icons.mdiClose" />
      </v-btn>

      <!-- PDF (page turning) -->
      <vue-pdf-embed
        v-if="source"
        :source="source"
        :page="page"
        :width="dialogBox.width"
        :height="dialogBox.height"
        @loaded="onLoaded"
        @error="(err) => emit('error', err)"
      />

      <!-- Page controls -->
      <div
        v-if="source"
        style="
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 10px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.85);
        "
      >
        <v-btn
          icon
          variant="tonal"
          size="small"
          :disabled="page <= 1"
          :aria-label="$t('actions.back')"
          @click="prevPage"
        >
          <v-icon :icon="icons.mdiChevronLeft" />
        </v-btn>

        <span style="min-width: 70px; text-align: center">
          {{ page }} / {{ totalPages }}
        </span>

        <v-btn
          icon
          variant="tonal"
          size="small"
          :disabled="page >= totalPages"
          :aria-label="$t('actions.next')"
          @click="nextPage"
        >
          <v-icon :icon="icons.mdiChevronRight" />
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
import { mdiClose, mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { computed, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import VuePdfEmbed from 'vue-pdf-embed';

const props = defineProps({
  source: { type: String, default: null },
  // width / height of page 1; read from the PDF on load if not given
  aspect: { type: Number, default: null },
});

const emit = defineEmits(['error', 'loaded']);

const model = defineModel({ type: Boolean, default: false });

const icons = { mdiClose, mdiChevronLeft, mdiChevronRight };

const display = useDisplay();

const page = ref(1);
const totalPages = ref(1);
const loadedAspect = ref(null);

watch(
  () => [props.source, model.value],
  () => {
    page.value = 1;
    totalPages.value = 1;
  }
);

watch(
  () => props.source,
  () => {
    loadedAspect.value = null;
  }
);

function prevPage() {
  if (page.value > 1) page.value -= 1;
}

function nextPage() {
  if (page.value < totalPages.value) page.value += 1;
}

function onLoaded(pdf) {
  if (pdf?.numPages) totalPages.value = pdf.numPages;
  if (!props.aspect && !loadedAspect.value) captureAspect(pdf);
  emit('loaded', pdf);
}

function captureAspect(pdf) {
  try {
    if (!pdf?.getPage) return;
    pdf.getPage(1).then((p) => {
      const viewport = p.getViewport({ scale: 1 });
      if (viewport?.width && viewport?.height) {
        loadedAspect.value = viewport.width / viewport.height;
      }
    });
  } catch {}
}

// Dialog sizing (tight wrap)
function fitBox(maxW, maxH, aspect) {
  let h = maxH;
  let w = Math.floor(h * aspect);
  if (w > maxW) {
    w = maxW;
    h = Math.floor(w / aspect);
  }
  return { width: w, height: h };
}

const dialogBox = computed(() => {
  if (display.smAndDown.value) {
    return {
      width: Math.floor(display.width.value),
      height: Math.floor(display.height.value),
    };
  }

  const chrome = 32;
  const maxW = Math.max(320, Math.floor(display.width.value - chrome));
  const maxH = Math.max(320, Math.floor(display.height.value - chrome));

  const aspect = props.aspect || loadedAspect.value || 1 / Math.SQRT2;

  return fitBox(maxW, maxH, aspect);
});

const dialogMaxWidth = computed(() =>
  display.smAndDown.value ? '100vw' : `${dialogBox.value.width}px`
);

const dialogMaxHeight = computed(() =>
  display.smAndDown.value ? '100vh' : `${dialogBox.value.height}px`
);
</script>
