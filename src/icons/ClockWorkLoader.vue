<script setup>
const props = defineProps({loading:{type:Boolean}});
const colorClasses = ['st1', 'st2'];

const randomColorClass = () => [colorClasses[Math.floor(0.5 + Math.random())],];
</script>

<template>
  <svg
    v-if="props.loading"
    id="Ebene_1"
    style="scale: 0.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-50.5 -50.5 256 266"
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
</style>
