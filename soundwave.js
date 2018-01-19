import sampleAudio from '../../asset/audio/audio-sample.mp3';

import Wave from './wave';

export default {
	name: 'Soundwave',
	// declare the props
	props: ['shouldAutoplay', 'particle', 'repeatsound'],
	// like data, the prop can be used inside templates and is also made available in the vm as this.shouldAutoplay
	watch: {
		repeatsound() {
			console.log(`repeat prop changed`);
			this.init();
		},
		particle(val1, val2) {
			// watch it
			console.log(`Prop changed, val1: ${val1.name}`);
			if (val1 !== val2) {
				// console.log(`different values`);
			} else {
				// console.log(`equal values`);
			}
			this.init();
		},
	},
	data() {
		return {
			sound: sampleAudio,
			animFrame: null,
			canvas: ``,
			canvasCtx: ``,
			wavequant: 11,
			bufferLength: ``,
			barWidth: ``,
			posX: ``,
			posX2: ``,
			posY2: ``,
			posY2Up: ``,
			upValue: ``,
			dataArray: ``,
			analyser: ``,
			audioEle: {},
			containerWidth: ``,
			isPlaying: false,
			playedAt: 0,
			pausedAt: 0,
			context: {},
			isPaused: false,
			wave1: {},
			wave2: {},
			doAnimation: false,
			staticWaveArray: [],
			dataArrayStatic: [-10, -20, -30, -40, -50, -20, -25, -35, -50, -44, -33],
			val1: ``,
			val2: ``,
		};
	},
	mounted() {
		this.$nextTick(() => {
			// Code that will run only after the entire view has been rendered
			this.createCanvas();
		});
	},
	beforeDestroy() {
		cancelAnimationFrame(this.animFrame);
	},
	methods: {
		init() {
			if (this.particle.play === undefined || this.isPlaying) {
				this.pauseSound();
			}
			this.val1 = this.particle.name;
			this.checkSelectedParticle();
		},
		handleClick() {
			console.log(`click in soundwave`);
		},
		pauseSound() {
			this.pausedAt = this.audioEle.currentTime;
			this.audioEle.pause();
			this.audioEle.currentTime = 0;
			// close the audio context
			this.context.close();
			this.isPaused = true;
			this.doAnimation = false;
		},
		checkSelectedParticle() {
			if (this.particle.play !== undefined) {
				this.isPlaying = true;
				this.doAnimation = true;
				this.isPaused = false;
				this.manageSound();
			} else {
				console.log(`else chekselectedparticle`);
				this.doAnimation = false;
				this.isPlaying = false;
				this.isPaused = true;
				this.createCanvas();
			}
		},
		createCanvas() {
			this.canvas = document.querySelector('.soundwave_canvas');
			this.canvasCtx = this.canvas.getContext('2d');
			this.canvas.width = 1000;
			this.canvas.height = 780;
			this.canvasCtx.globalAlpha = 0.3;
			console.log(`val1 ${this.val1}`);
			/*
			if (this.particle.name) {
				console.log(`the same aprticle`);
			} */
			if (this.doAnimation) {
				this.isPlaying = true;
				this.canvasCtx.globalAlpha = 1;
				this.createSoundWave();
			} else {
				// console.log(`create static waves`);
				this.canvasCtx.globalAlpha = 0.3;
				this.createStaticWaves(3, this.canvasCtx);
			}
		},
		createSoundWave() {
			const color = `rgb(0, 168, 143)`;
			this.wave1 = new Wave(this.canvasCtx, this.canvas, 11, this.dataArray, this.particle, this.analyser, color);
			this.animateSoundWave();
		},
		createStaticWaves(numberOfWaves, context) {
			const color = `rgb(255, 255, 255)`;
			for (let i = 0; i < numberOfWaves; i++) {
				let wave = new Wave(context, this.canvas, 8 + i, this.dataArray, this.particle, this.analyser, color);
				this.staticWaveArray.push(wave);
				wave = this.staticWaveArray[i];
				const datStatic = [70, 20, 30, 40, 50, 20, 25, 35, 50, 44, 33];
				const ampl1 = 1.3 + 0.1 * i;
				const ampl2 = 1.5 - 0.2 * i;
				const spacesFromOrigin = 0;
				const originX = 0;
				wave.changeSoundwaveFromData(datStatic, false, true, ampl1, ampl2, spacesFromOrigin, originX);
			}
		},
		manageSound() {
			const ptc = this.particle;
			this.context = new AudioContext();
			this.audioEle = new Audio();
			this.audioEle.src = ptc.audioSrc;
			this.playedAt = Date.now();
			this.audioEle.play(this.pausedAt);

			const source = this.context.createMediaElementSource(this.audioEle);
			this.createAnalyserNode(this.context, source);
		},
		animateSoundWave() {
			const dur = this.audioEle.duration;
			const currentT = this.audioEle.currentTime;
			this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			// stop the animation when the sound finished
			if (dur !== currentT && !this.isPaused) {
				this.animFrame = requestAnimationFrame(this.animateSoundWave);
				this.analyser.getFloatFrequencyData(this.dataArray);
				const ampl1 = 1.1; // Amplitude in up wave
				const ampl2 = 1.5; // Amplitude in down wave
				const spacesFromOrigin = 0;
				const originX = 0;
				const data = this.dataArray;
				this.isPaused = false;
				this.$emit('soundended', false);
				this.canvasCtx.globalAlpha = 1;
				this.wave1.changeSoundwaveFromData(data, true, false, ampl1, ampl2, spacesFromOrigin, originX);
			} else {
				this.canvasCtx.globalAlpha = 0.3;
				this.$emit('soundended', true);
				this.createStaticWaves(3, this.canvasCtx);
			}
		},
		createAnalyserNode(context, source) {
			this.analyser = context.createAnalyser();
			this.analyser.fftSize = 256;
			const bufferLength = this.analyser.frequencyBinCount;
			this.dataArray = new Float32Array(bufferLength);
			source.connect(this.analyser);
			this.analyser.connect(context.destination);
			this.createCanvas();
		},
	},
};
