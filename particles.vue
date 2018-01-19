<style src="./Particles.scss" module lang="scss"></style>
<script src="./Particles.js"></script>

<template>
	<div :class="$style.particles_container">
		
		<canvas class="particles_canvas" @mousemove="mouseMove" @click="click" ref="particles" :class="$style.particles_img"></canvas>
		
	</div>
</template>