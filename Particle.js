import Mover from './mover';

import peoplesData from './peoples-data';

export default {
	name: 'Particles',
	// declare the props
	// like data, the prop can be used inside templates and is also made available in the vm as this.shouldAutoplay
	props: ['soundend'],
	watch: {
		soundend() {
			// console.log(`changed the soundEnded flag`);
			this.handleSoundEnded();
		},
	},
	data() {
		return {
			canvas: ``,
			canvasCtx: ``,
			containerWidth: ``,
			color1: `rgb(206, 238, 234)`,
			color2: `rgb(0, 168, 143)`,
			color3: `rgb(255, 255, 255)`,
			orbit: 0.7,
			amplitude: 0.5,
			slowPeriod: 0.01,
			regularPeriod: 0.03,
			numberParticlesX: 2,
			numberParticlesY: 1,
			numberParticles: 0,
			particles: [],
			partx: 0,
			party: 0,
			posMatrix: [],
			scaleInChP: 0.9,
			particleSelected: {},
			isItClicked: false,
			selected: false,
			repeatedSound: false,
		};
	},
	mounted() {
		this.$nextTick(() => {
			// Code that will run only after the entire view has been rendered
			this.init();
		});
	},
	beforeDestroy() {
		cancelAnimationFrame(this.animFrame);
	},
	methods: {
		init() {
			console.log(peoplesData);
			this.createCanvas();
		},
		createCanvas() {
			this.canvas = document.querySelector('.particles_canvas');
			this.canvasCtx = this.canvas.getContext('2d');
			this.canvas.width = 1000;
			this.canvas.height = 780;
			console.log(this.canvas.width / 2);
			console.log(this.canvas.height / 2);
			// create the particles array
			this.numberParticles = this.numberParticlesX * this.numberParticlesY;
			this.generateGrid(0, 0);
			this.generateIndividualParticle();
			this.draw();
		},
		checkMouseInSubgrid(ptc, mx, my) {
			const bound = this.partx / 8;
			const xMin = ptc.centerGrid[0] - this.partx / 2 + bound;
			const xMax = ptc.centerGrid[0] + this.partx / 2 - bound;
			const yMin = ptc.centerGrid[1] - this.party / 2 + bound;
			const yMax = ptc.centerGrid[1] + this.party / 2 - bound;
			// if is inside the subgrid
			if (mx > xMin && mx < xMax && my > yMin && my < yMax) {
				// console.log(`inside some grid`);
				ptc.isMouseInSubgrid = true;
			} else {
				// console.log(`outside of grid`);
				ptc.isMouseInSubgrid = false;
			}
		},
		generateIndividualParticle() {
			for (let i = 0; i < this.numberParticles; i++) {
				const psx = this.posMatrix[i].x;
				const psy = this.posMatrix[i].y + this.getRandom(-this.party / 3, this.party / 3);
				const minxy = Math.min(this.partx / 2, this.party / 2);
				// const size = this.getRandom(minxy / 1.5, minxy / 1.7);
				const size = this.getRandom(minxy / 1.5, minxy / 1.7) / 1.5;
				const orbit = this.getRandom(0.5, 0.7);
				const sign = (-1) ** (i + 1);
				const amplitude = sign * this.getRandom(1, 1.5);
				// adding the path of the image
				const pathImg = peoplesData[i].path;
				const nameP = peoplesData[i].name;
				const colorWave = peoplesData[i].waveColor;
				const audioSrc = peoplesData[i].pathSound;
				const prx = this.partx;
				const pry = this.party;
				const radiusHelper = this.partx / 2 - size;
				const sound = false;
				this.particles.push(
					new Mover(
						psx,
						psy,
						nameP,
						size,
						this.canvasCtx,
						orbit,
						amplitude,
						pathImg,
						colorWave,
						audioSrc,
						prx,
						pry,
						radiusHelper,
						this.posMatrix[i].y,
						sound,
					),
				);
			}
		},
		draw() {
			this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.animFrame = requestAnimationFrame(this.draw);
			this.calculateCollisions(this.particles); // not so important
			this.drawReferenceCanvasLines(); // global use
			this.drawReferenceParticleLines(); // globval use
			// iterate trough the particles array to display them
			for (let i = 0; i < this.numberParticles; i++) {
				const p = this.particles[i];
				p.soundEnd = this.soundend;
				p.display();
			}
		},
		handleSoundEnded() {
			// sound ended. Update value in particles
			for (let i = 0; i < this.numberParticles; i++) {
				const p = this.particles[i];
				p.soundEnd = this.soundend;
				p.isPlaying = !this.soundend;
			}
		},
		magnitude(x, y) {
			return Math.sqrt(x * x + y * y);
		},
		addDirection(mx, x) {
			if (mx - x > 0) {
				return 1;
			}
			return -1;
		},
		distance(x1, y1, x2, y2) {
			const a = x1 - x2;
			const b = y1 - y2;
			const c = Math.sqrt(a * a + b * b);
			return c;
		},
		getRandom(min, max) {
			return Math.random() * (max - min) + min;
		},
		click(event) {
			console.log(`clicked!`);
			const rect = this.canvas.getBoundingClientRect();
			for (let i = 0; i < this.numberParticles; i++) {
				const ptc = this.particles[i];
				const mx = event.clientX - rect.left;
				const my = event.clientY - rect.top;
				this.checkMouseInSubgrid(ptc, mx, my);
				console.log(`is selected? ${ptc.isSelected}`);
				if (ptc.isMouseInSubgrid && ptc.isMouseInside) {
					// toggle playing sound
					if (this.repeatedSound) {
						// if clicked in the same particle more than twice
						this.repeatedSound = false; // change the flag
						this.$emit('selected', true); // emit the value that repeat the sound
					} else {
						this.repeatedSound = true;
						this.$emit('selected', false);
					}
					ptc.isSelected = true;
					ptc.showChildParticle = true;
					ptc.isPlaying = true;
					this.$emit('particleSelect', ptc);
				} else {
					ptc.isSelected = false;
					ptc.showChildParticle = false;
				}
			}
		},
		mouseMove(event) {
			const rect = this.canvas.getBoundingClientRect();
			for (let i = 0; i < this.numberParticles; i++) {
				const ptc = this.particles[i];
				const mx = event.clientX - rect.left;
				const my = event.clientY - rect.top;
				ptc.mousex = mx;
				ptc.mousey = my;
				// check if mouse is inside the particle's subgrid
				this.checkMouseInSubgrid(ptc, mx, my);
			}
		},
		calculateCollisions(particles) {
			for (let i = 0; i < this.numberParticles - 1; i++) {
				const part1 = particles[i];
				for (let j = i + 1; j < this.numberParticles; j++) {
					const part2 = particles[j];
					const dx = part1.position[0] - part2.position[0];
					const dy = part1.position[1] - part2.position[1];
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < part1.radiusParticle + part2.radiusParticle) {
						part1.color = 'yellow';
						part2.color = 'yellow';
						part1.collide = true;
						part2.collide = true;
					}
				}
			}
		},
		generateGrid(x0, y0) {
			this.partx = this.canvas.width / this.numberParticlesX;
			this.party = this.canvas.height / this.numberParticlesY;
			let pos = {
				x: 0,
				y: 0,
			};
			const c = [];
			for (let j = 0; j < this.numberParticlesX; j++) {
				const a = (2 * j + 1) * 0.5;
				const cx = x0 + a * this.partx;
				for (let k = 0; k < this.numberParticlesY; k++) {
					const b = (2 * k + 1) * 0.5;
					const cy = y0 + b * this.party;
					pos.y = cy;
					pos.x = cx;
					c.push(pos);
					pos = {
						x: 0,
						y: 0,
					};
				}
			}
			this.posMatrix = c;
			console.log(this.posMatrix);
		},
		drawReferenceCanvasLines() {
			const epsilon = 0;
			this.canvasCtx.strokeRect(
				epsilon,
				epsilon,
				this.canvas.width - 2 * epsilon,
				this.canvas.height - 2 * epsilon,
			);
		},

		drawReferenceParticleLines() {
			for (let i = 0; i < this.numberParticlesX; i++) {
				for (let j = 0; j < this.numberParticlesY; j++) {
					this.canvasCtx.strokeRect(i * this.partx, j * this.party, this.partx, this.party);
				}
			}
		},
	},
};
