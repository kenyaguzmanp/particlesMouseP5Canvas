<style src="./Soundwave.scss" module lang="scss"></style>
<script src="./Soundwave.js"></script>

<template>
	<div :class="$style.soundwave_container">
		<canvas class="soundwave_canvas" ref="wave" :class="$style.soundwave_img"></canvas>
		<!-- <img src="../../asset/svg/soundwave.svg" alt=""> -->
		<!-- <svg ref="soundwave" :class="$style.soundwave_img" preserveAspectRatio="none" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 457.06 119.97"><title>soundwave</title><g id="Layer_2" data-name="Layer 2"><g id="Isolation_Mode" data-name="Isolation Mode"><path d="M456.69,58.39h0" transform="translate(0 0)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.75"/><path d="M456.15,55.9c-2.64-11.87-5.59-23.62-10.74-25.39-12-4.56-12,65.33-24.09,68.48-12,2.77-10.47-91.57-26-91.56-12.11,0-9.55,112-21.6,112.17-12.07-.12-12.65-99.41-24.65-98.4-12,1.23-11.47,76.84-23.51,74.9-12-2.12-12-98.31-24.09-95.67s-11,104.46-23.08,101.33-13.64-68.42-25.68-65-12,48.43-24.09,45-12-38-24.1-34.85-12,28.13-24.09,25.36-12-19.37-24.1-17.25c-12,1.94-12,12.45-24.1,11.21-12-1-11.89-12.35-23.93-12.23C96.3,53.85,96.09,65.19,84,66.4,72,67.94,72,56.75,59.94,54c-12-3.15-11.4,22-24.1,21.56-6.36-.24-9-4.77-12-13.7s-5.34-23.28-12-22.52C2.28,39.41.84,53.51.56,57.91" preserveAspectRatio="none" transform="translate(0 0)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.75" stroke-dasharray="0.1 2.5"/><path d="M.38,59.15h0" transform="translate(0 0)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="0.75"/></g></g></svg> -->
	</div>
</template>

