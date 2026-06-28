<script setup>
import { computed } from 'vue';

const props = defineProps({
  width:  { type: [Number, String], default: null },
  height: { type: [Number, String], default: null },
});

const colorClasses = ['st1', 'st2'];
const randomColorClass = () => [colorClasses[Math.floor(0.5 + Math.random())]];

const VIEWBOX_W = 256;
const VIEWBOX_H = 266;

const svgWidth = computed(() =>
  props.width  ?? (props.height ? Math.round(Number(props.height) * VIEWBOX_W / VIEWBOX_H) : VIEWBOX_W)
);
const svgHeight = computed(() =>
  props.height ?? (props.width  ? Math.round(Number(props.width)  * VIEWBOX_H / VIEWBOX_W) : VIEWBOX_H)
);
</script>

<template>
  <svg
    class="center"
    viewBox="-50.5 -50.5 256 266"
    :width="svgWidth"
    :height="svgHeight"
  >
    <g :class="randomColorClass()">
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
        transform="rotate(0)"
      />
      <rect
        x="-5"
        y="-51"
        width="10"
        height="12"
        rx="2"
        transform="rotate(45)"
      />
      <rect
        x="-5"
        y="-51"
        width="10"
        height="12"
        rx="2"
        transform="rotate(90)"
      />
      <rect
        x="-5"
        y="-51"
        width="10"
        height="12"
        rx="2"
        transform="rotate(135)"
      />
      <rect
        x="-5"
        y="-51"
        width="10"
        height="12"
        rx="2"
        transform="rotate(180)"
      />
      <rect
        x="-5"
        y="-51"
        width="10"
        height="12"
        rx="2"
        transform="rotate(225)"
      />
      <rect
        x="-5"
        y="-51"
        width="10"
        height="12"
        rx="2"
        transform="rotate(270)"
      />
      <rect
        x="-5"
        y="-51"
        width="10"
        height="12"
        rx="2"
        transform="rotate(315)"
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
        attributeName="transform"
        type="rotate"
        from="0"
        to="360"
        dur="3s"
        repeatCount="indefinite"
        calcMode="linear"
        keyTimes="0;1"
      />
    </g>
    <g transform="translate(60 80)">
      <g :class="randomColorClass()">
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
          transform="rotate(0)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(45)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(90)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(135)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(180)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(225)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(270)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(315)"
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
          attributeName="transform"
          type="rotate"
          from="0"
          to="-360"
          dur="3s"
          repeatCount="indefinite"
          calcMode="linear"
          keyTimes="0;1"
        />
      </g>
    </g>
    <g :class="randomColorClass()" transform="translate(10 165)">
      <g>
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
          transform="rotate(0)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(45)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(90)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(135)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(180)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(225)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(270)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(315)"
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
          attributeName="transform"
          type="rotate"
          from="0"
          to="360"
          dur="3s"
          repeatCount="indefinite"
          calcMode="linear"
          keyTimes="0;1"
        />
      </g>
    </g>
    <g :class="randomColorClass()" transform="translate(155 60)">
      <g>
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
          transform="rotate(0)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(45)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(90)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(135)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(180)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(225)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(270)"
        />
        <rect
          x="-5"
          y="-51"
          width="10"
          height="12"
          rx="2"
          transform="rotate(315)"
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
          attributeName="transform"
          type="rotate"
          from="0"
          to="360"
          dur="3s"
          repeatCount="indefinite"
          calcMode="linear"
          keyTimes="0;1"
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
.center {
  display: block;
  margin: auto;
}
</style>
