<script setup>
import { onMounted, useTemplateRef } from 'vue';

const anim1 = useTemplateRef('anim1');
const anim2 = useTemplateRef('anim2');

function scheduleNext(anim, minMs, maxMs) {
  const delay = minMs + Math.random() * (maxMs - minMs);
  setTimeout(() => anim.beginElement(), delay);
}

onMounted(() => {
  anim1.value.addEventListener('endEvent', () =>
    scheduleNext(anim1.value, 5000, 20000)
  );
  anim2.value.addEventListener('endEvent', () =>
    scheduleNext(anim2.value, 5000, 20000)
  );
  scheduleNext(anim1.value, 1000, 8000);
  scheduleNext(anim2.value, 1000, 8000);
});

const props = defineProps({
  width: {
    type: [Number, String],
    required: false,
    default: 785,
  },
  height: {
    type: [Number, String],
    required: false,
    default: 110,
  },
});
</script>

<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 785 110"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!--
      Strategy: Scale the CLOCK SVG (396.7 × 97.2) to fit height=97.2 at y=6 (leaving 6px top/bottom pad).
      Scale factor = 1.0 (keep native size, just translate).
      Then place Work glyphs after, with an 18px gap between CLOCK and Work.

      CLOCK glyph x-positions (native):
        C:  0      – 77.6
        l:  91.8   – 130
        O:  133.9  – 228.9  (center x=181.4)
        c:  235.9  – 313.1
        k:  327.8  – 396.7

      After CLOCK (396.7), gap 18 → Work starts at x=414.7
      Work glyphs (designed to match ~97.2 height, stroke ~10px):
        W:  0–82   (wide)
        gap 14
        O:  96–191 (cog, r≈47)
        gap 8
        r:  199–240
        k:  254–320

      Total: 414.7 + 320 ≈ 735 → fits in 920 viewBox with margins
    -->

    <!-- ── CLOCK (blue paths) ── -->
    <g transform="translate(0,6)" class="st1">
      <!-- C (left) -->
      <path
        d="M49,0C22,0,0,22,0,49c0,26.6,22,48.2,49,48.2c9.9,0,19.8-3.3,28.1-9.2l0.6-0.4V70.6l-2.6,2.6
       c-7.4,7.4-17,11.6-26.5,11.6c-19.2,0-35.5-16.6-35.5-36.2s16.1-36.2,35.2-36.2c9.8,0,19.6,4.2,26.7,11.6l2.6,2.7v-17L77,9.2
       C68.7,3,59.5,0,49,0z"
      />

      <!-- L -->
      <polygon
        points="104.9,1.6 91.8,1.6 91.8,95.6 130,95.6 130,83.2 104.9,83.2"
      />
      <!-- O -->
      <g transform="translate(181.1,52)">
        <g id="cog1" class="clock-cog-rotation">
          <path
            d="
          M42.75,0
          A42.75,42.75 0 1 1 -42.75,0
          A42.75,42.75 0 1 1 42.75,0
          Z

          M33.57,0
          A33.57,33.57 0 1 0 -33.57,0
          A33.57,33.57 0 1 0 33.57,0
          Z"
          />

          <rect
            x="-5"
            y="-51"
            width="10"
            height="12"
            rx="2"
            transform="rotate(13)"
          />
          <rect
            x="-5"
            y="-51"
            width="10"
            height="12"
            rx="2"
            transform="rotate(58)"
          />
          <rect
            x="-5"
            y="-51"
            width="10"
            height="12"
            rx="2"
            transform="rotate(108)"
          />
          <rect
            x="-5"
            y="-51"
            width="10"
            height="12"
            rx="2"
            transform="rotate(148)"
          />
          <rect
            x="-5"
            y="-51"
            width="10"
            height="12"
            rx="2"
            transform="rotate(193)"
          />
          <rect
            x="-5"
            y="-51"
            width="10"
            height="12"
            rx="2"
            transform="rotate(238)"
          />
          <rect
            x="-5"
            y="-51"
            width="10"
            height="12"
            rx="2"
            transform="rotate(283)"
          />
          <rect
            x="-5"
            y="-51"
            width="10"
            height="12"
            rx="2"
            transform="rotate(328)"
          />

          <path
            d="
          M6,0
          A6,6 0 1,1 -6,0
          A6,6 0 1,1 6,0
          Z

          M2.5,0
          A2.5,2.5 0 1,1 -2.5,0
          A2.5,2.5 0 1,1 2.5,0
          Z"
          />
          <animateTransform
            ref="anim1"
            attributeName="transform"
            type="rotate"
            from="0"
            to="1080"
            dur="3s"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.42 0 0.58 1"
            repeatCount="1"
            fill="freeze"
            begin="indefinite"
          />
        </g>
      </g>
      <!-- c (right C) -->
      <path
        d="M284.9,0c-27,0-49,22-49,49c0,26.6,22,48.2,49,48.2c9.9,0,19.8-3.3,28.1-9.2l0.6-0.4V70.6l-2.6,2.6
       c-7.4,7.4-17,11.6-26.5,11.6c-19.2,0-35.5-16.6-35.5-36.2s16.1-36.2,35.2-36.2c9.8,0,19.6,4.2,26.7,11.6l2.6,2.7v-17L313,9.2
       C304.7,3,295.5,0,284.9,0z"
      />

      <!-- k -->
      <polygon
        points="351.1,45.5 395.5,1.6 377.6,1.6 340.9,38.4 340.9,1.6 327.8,1.6 327.8,95.6 340.9,95.6
       340.9,55.5 341.9,54.5 378.1,95.1 378.6,95.6 396.7,95.6"
      />
    </g>

    <!-- ── WORK (red paths) — starts at x=414 ── -->
    <g transform="translate(414,6)" class="st2">
      <!--
        W: geometric, matching stroke weight ~13.1px
      -->

      <!-- W fill using polygon for crisp render -->
      <!-- Left stem -->
      <polygon points="0,1.6  13.1,1.6  13.1,95.6  0,95.6" />
      <!-- Right stem -->
      <polygon points="66.9,1.6  80,1.6  80,95.6  66.9,95.6" />
      <!-- Left arm -->
      <polygon points="0,95.6  13.1,95.6  46.5,40.3  33.4,40.3" />
      <!-- Right arm (mirror) -->
      <polygon points="80,95.6  66.9,95.6 33.5,40.3  46.6,40.3 " />

      <!-- COG-O: center at x=88+16+47=151, y=48.6, r=47.5 -->
      <g transform="translate(146,48)">
        <g id="cog2" class="work-cog-rotation">
          <path
            d="
          M42.75,0
          A42.75,42.75 0 1 1 -42.75,0
          A42.75,42.75 0 1 1 42.75,0
          Z

          M33.57,0
          A33.57,33.57 0 1 0 -33.57,0
          A33.57,33.57 0 1 0 33.57,0
          Z"
          />

          <rect
            x="-5"
            y="-51"
            width="10"
            height="12"
            rx="2"
            transform="rotate(13)"
          />
          <rect
            x="-5"
            y="-51"
            width="10"
            height="12"
            rx="2"
            transform="rotate(58)"
          />
          <rect
            x="-5"
            y="-51"
            width="10"
            height="12"
            rx="2"
            transform="rotate(108)"
          />
          <rect
            x="-5"
            y="-51"
            width="10"
            height="12"
            rx="2"
            transform="rotate(148)"
          />
          <rect
            x="-5"
            y="-51"
            width="10"
            height="12"
            rx="2"
            transform="rotate(193)"
          />
          <rect
            x="-5"
            y="-51"
            width="10"
            height="12"
            rx="2"
            transform="rotate(238)"
          />
          <rect
            x="-5"
            y="-51"
            width="10"
            height="12"
            rx="2"
            transform="rotate(283)"
          />
          <rect
            x="-5"
            y="-51"
            width="10"
            height="12"
            rx="2"
            transform="rotate(328)"
          />

          <path
            d="
          M6,0
          A6,6 0 1,1 -6,0
          A6,6 0 1,1 6,0
          Z

          M2.5,0
          A2.5,2.5 0 1,1 -2.5,0
          A2.5,2.5 0 1,1 2.5,0
          Z"
          />
          <animateTransform
            ref="anim2"
            attributeName="transform"
            type="rotate"
            from="0"
            to="1080"
            dur="3s"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.42 0 0.58 1"
            repeatCount="1"
            fill="freeze"
            begin="indefinite"
          />
        </g>
      </g>

      <!-- r: starts after cog right edge = 151+47+14=212, width ~76 -->
      <!-- Geometric r matching font weight — stem + curved shoulder -->
      <g transform="translate(212,1)">
        <path
          d="M0,0 H38 C58,0 72,12 72,31 C72,45 63,55 49,60 L76,94 H61 L36,63 H10 V94 H0 Z M10,10 V53 H37 C50,53 61,45 61,31 C61,17 50,10 37,10 Z"
        />
      </g>

      <!-- k: starts at 214+52+10=276, width ~70 -->
      <g transform="translate(302,1)">
        <polygon
          points="23.3,43.9 69,0 49.8,0 13.1,36.8 13.1,0 0,0 0,94 13.1,94 13.1,53.9 14.1,52.9 50.3,93.5 50.8,94 69,94"
        />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.st1 {
  fill: #1953a1;
}
.st2 {
  fill: #c0392b;
}
</style>
