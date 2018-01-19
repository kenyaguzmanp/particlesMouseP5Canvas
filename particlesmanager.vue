<style src="./Particlesmanager.scss" module lang="scss"></style>
<script src="./Particlesmanager.js"></script>

<template>
	<div class="particles_manager" :class="$style.particlesmanager_container">
		<particles @particleSelect="handleSelect" @selected="handleSelect2" :soundend="end" /> 
		<soundwave :shouldAutoplay="false" :particle="selected" @soundended="handleSoundEnded" :repeatsound="repeat"  />
	</div>
</template>