import Mover from './mover';

import peoplesData from './peoples-data';

export default {
	name: 'Particles',
	// declare the props
	// like data, the prop can be used inside templates and is also made available in the vm as this.shouldAutoplay
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
			numberParticlesX: 3,
			numberParticlesY: 2,
			numberParticles: 0,
			particles: [],
			partx: 0,
			party: 0,
			posMatrix: [],
			scaleInChP: 0.9,
			particleSelected: {},
			isItClicked: false,
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
		generateIndividualParticle() {
			for (let i = 0; i < this.numberParticles; i++) {
				const psx = this.posMatrix[i].x;
				const psy = this.posMatrix[i].y + this.getRandom(-this.party / 3, this.party / 3);
				const minxy = Math.min(this.partx / 2, this.party / 2);
				const size = this.getRandom(minxy / 1.5, minxy / 1.7);
				const orbit = this.getRandom(0.5, 0.7);
				const amplitude = this.getRandom(1, 1.5);
				// adding the path of the image
				const pathImg = peoplesData[i].path;
				const nameP = peoplesData[i].name;
				const colorWave = peoplesData[i].waveColor;
				const audioSrc = peoplesData[i].pathSound;
				this.particles.push(
					new Mover(psx, psy, nameP, size, this.canvasCtx, orbit, amplitude, pathImg, colorWave, audioSrc),
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
				this.display(p);
			}
		},
		display(particle) {
			particle.display();
			// this.movementParticle(particle, particle.isToMouse, particle.theta, particle.mousex, particle.mousey);
			// this.drawSimpleParticle(particle);
			// this.checkChildParticle(particle);
		},
		drawSimpleParticle(ptc) {
			this.canvasCtx.lineWidth = 2;
			this.canvasCtx.strokeStyle = 'white';
			this.canvasCtx.beginPath();
			this.canvasCtx.arc(ptc.position[0], ptc.position[1], ptc.sizeParticle, 0, 2 * Math.PI);
			this.canvasCtx.fillStyle = this.color1;
			this.canvasCtx.globalAlpha = 0.2;
			this.canvasCtx.fill();
		},
		checkChildParticle(particle) {
			if (particle.isMouseInside || particle.isSelected) {
				this.canvasCtx.globalAlpha = 1;
				const psx = particle.position[0] + 2 * particle.sizeParticle;
				const psy = particle.position[1] + 2 * particle.sizeParticle;

				this.drawParticleAndChild(psx, psy, particle);
				// gorwing size effect
				// const childParticleSizeBound = particle.sizeParticle * 1.3;
				const childParticleSizeBound = particle.sizeParticle;
				if (particle.sizeChildParticle < childParticleSizeBound) {
					// control the speed of growing
					particle.sizeChildParticle += 5;
				}
			} else {
				particle.sizeChildParticle = 0;
			}
		},
		drawParticleAndChild(posx, posy, ptc) {
			// save the canvas because of the image clip
			this.canvasCtx.save();
			this.canvasCtx.lineWidth = 2;
			// Parent Particle
			this.drawParentParticle(ptc);
			// Child Particle
			this.drawChildParticle(ptc);

			this.canvasCtx.restore();
		},
		drawParentParticle(ptc) {
			const postx = ptc.position[0];
			const posty = ptc.position[1];
			const sizeP = ptc.sizeParticle;
			const ang0 = 0;
			const ang1 = 2 * Math.PI;

			// inner simple particle
			this.drawCircle(postx, posty, sizeP * 0.5, ang0, ang1, this.color2, false, true);
			const sizeP1 = ptc.sizeParticle / 2;
			const pX0 = postx - sizeP1 * 0.5 / 2;
			const pY0 = posty - sizeP1 * 0.5;
			const pX1 = postx + sizeP1 * 0.5;
			const pY1 = posty + sizeP1 * 0.5;

			// simple litle play triangle
			this.drawTriangle(pX0, pY0, pX1, pY1);

			// simple litle point
			// this.drawCircle(postx, posty, sizeP * 0.07, ang0, ang1, this.color3, true, true);
		},
		drawChildParticle(ptc) {
			const postx = ptc.position[0];
			const posty = ptc.position[1];
			const chPosX = ptc.childPosX;
			const chPosY = ptc.childPosY;
			const sizeP = ptc.sizeParticle;
			const chSizeP = ptc.sizeChildParticle;
			const ang0 = 0;
			const ang1 = 2 * Math.PI;
			// child particle
			this.drawCircle(chPosX, chPosY, chSizeP * 1.1, ang0, ang1, this.color2, true, false);

			// child little point
			const scaleChLP = 0.8;
			/*
			const indX = this.addDirection(postx, this.canvas.width / 2);
			const indY = this.addDirection(posty, this.canvas.height / 2); */
			const indX = this.addDirection(ptc.centerAux[0], chPosX);
			const indY = this.addDirection(ptc.centerAux[1], chPosY);
			const posxScaled = chPosX + indX * chSizeP * scaleChLP;
			const posyScaled = chPosY + indY * chSizeP * scaleChLP;
			this.drawCircle(posxScaled, posyScaled, sizeP * 0.07, ang0, ang1, this.color3, true, true);

			// this.drawCircle(chPosX - 80, chPosY - 80, sizeP * 0.07, ang0, ang1, `green`, true, true);

			// this.drawLine(this.color3, postx, posty, chPosX - 90, chPosY - 90, true);

			// diagonal line
			this.drawLine(this.color3, postx, posty, posxScaled, posyScaled, true);
			// insert name of the people
			this.addPeopleName(ptc);
			// inner child particle
			this.drawCircle(chPosX, chPosY, chSizeP * this.scaleInChP, ang0, ang1, this.color2, true, true);

			this.canvasCtx.clip();
			// insert the image of the particle in the inner child particle
			this.addPeopleImage(ptc);
		},
		drawCircle(positionX, positionY, size, angle0, angle1, color, itHasStroke, isItFilled) {
			this.canvasCtx.beginPath();
			this.canvasCtx.arc(positionX, positionY, size, angle0, angle1);
			this.canvasCtx.fillStyle = color;
			if (isItFilled) {
				this.canvasCtx.fill();
			}
			if (itHasStroke) {
				this.canvasCtx.strokeStyle = color;
				this.canvasCtx.stroke();
			}
		},
		drawTriangle(x0, y0, x1, y1) {
			const avgY = (y1 - y0) / 2;
			this.canvasCtx.beginPath();
			this.canvasCtx.fillStyle = `white`;
			// the start of our path
			this.canvasCtx.moveTo(x0, y0);

			this.canvasCtx.lineTo(x0, y1);
			this.canvasCtx.lineTo(x1, y1 - avgY);
			this.canvasCtx.fill();
			this.canvasCtx.closePath();
		},
		drawLine(color, px1, py1, px2, py2, isItDashed) {
			this.canvasCtx.beginPath();
			this.canvasCtx.setLineDash([1, 5]);
			if (isItDashed) {
				this.canvasCtx.setLineDash([1, 5]);
			}
			this.canvasCtx.moveTo(px1, py1);
			this.canvasCtx.lineTo(px2, py2);
			this.canvasCtx.strokeStyle = color;
			this.canvasCtx.stroke();
			// reset the dashed stroke
			this.canvasCtx.setLineDash([]);
		},
		addPeopleImage(ptc) {
			const image = new Image();
			image.src = ptc.path;
			this.canvasCtx.drawImage(
				image,
				ptc.childPosX - ptc.sizeChildParticle,
				ptc.childPosY - ptc.sizeChildParticle,
				ptc.sizeChildParticle * 2,
				ptc.sizeChildParticle * 2,
			);
		},
		addPeopleName(ptc) {
			const chPosX = ptc.childPosX;
			const chPosY = ptc.childPosY;
			const chSizeP = ptc.sizeChildParticle;
			const posxScaled = chSizeP * Math.cos(0) + chPosX + 20;
			const posyScaled = chSizeP * Math.sin(60) + chPosY;
			this.canvasCtx.font = `24px serif`;
			this.canvasCtx.fillText(ptc.name, posxScaled, posyScaled);
		},
		movementParticle(ptc, isToMouse, angle, mx, my) {
			const dist = this.distance(mx, my, ptc.position[0], ptc.position[1]) - ptc.sizeParticle / 2;
			// console.log(dist);
			// if mouse is in the acttraction radius. Multiply 1.5 in order to the particle do not approach inside
			if (dist > ptc.sizeParticle * 1.5 && ptc.isToMouse) {
				this.toMouse(mx, my, ptc);
			} else {
				this.localMovement(dist < 0 && !isToMouse ? this.slowPeriod : this.regularPeriod, 0, 0, ptc);
			}
			this.compareToGrid(ptc);
			ptc.position[0] = ptc.px;
			ptc.position[1] = ptc.py;

			// position of child particle
			ptc.childPosX = ptc.px2;
			ptc.childPosY = ptc.py2;
		},
		toMouse(mx, my, ptc) {
			const magMouse = this.magnitude(mx, my);
			const normMx = mx / magMouse;
			const normMy = my / magMouse;
			const dirX = this.addDirection(mx, ptc.position[0]);
			const dirY = this.addDirection(my, ptc.position[1]);
			ptc.shiftCx = normMx * dirX;
			ptc.shiftCy = normMy * dirY;

			// angle that makes to traslate particle with some period
			ptc.angleAux += ptc.shiftAng;

			ptc.centerAux[0] += ptc.shiftCx;
			ptc.centerAux[1] += ptc.shiftCy;
			ptc.centerParticle = ptc.centerAux;

			ptc.px = ptc.orbit * (ptc.radiusParticle / 2) * Math.cos(ptc.angleAux * ptc.amplitude) + ptc.centerAux[0];
			ptc.py = ptc.orbit * (ptc.radiusParticle / 2) * Math.sin(ptc.angleAux * ptc.amplitude) + ptc.centerAux[1];

			// position of child particle
			ptc.px2 = ptc.px;
			ptc.py2 = ptc.py;
		},
		localMovement(shiftA, shiftx, shifty, ptc) {
			// console.log(`in locla movement`);
			const orb = ptc.orbit;
			ptc.shiftAng = shiftA;
			ptc.shiftCx = shiftx;
			ptc.shiftCy = shifty;

			ptc.angleAux += shiftA;
			ptc.theta = ptc.angleAux;

			// angle change of child particle
			ptc.angleAux2 += shiftA * 3;

			ptc.centerAux[0] += ptc.shiftCx;
			ptc.centerAux[1] += ptc.shiftCy;
			ptc.centerParticle = ptc.centerAux;

			const pxAux = orb * (ptc.radiusParticle / 2) * Math.cos(ptc.angleAux * ptc.amplitude) + ptc.centerAux[0];
			const pyAux = orb * (ptc.radiusParticle / 2) * Math.sin(ptc.angleAux * ptc.amplitude) + ptc.centerAux[1];

			ptc.px = pxAux;
			ptc.py = pyAux;

			// position of child particle. direction to center of canvas
			const d1 = this.addDirection(this.canvas.width / 2, ptc.centerAux[0]);
			const d2 = this.addDirection(this.canvas.height / 2, ptc.centerAux[1]);
			ptc.px2 =
				orb * ptc.radiusParticle * Math.cos(ptc.angleAux2 * ptc.amplitude / 2) +
				ptc.centerParticle[0] +
				ptc.sizeParticle * 3 * d1;
			ptc.py2 =
				orb * ptc.radiusParticle * Math.sin(ptc.angleAux2 * ptc.amplitude / 2) +
				ptc.centerParticle[1] +
				ptc.sizeParticle * 3 * d2;
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
			// console.log(`clicked!`);
			const rect = this.canvas.getBoundingClientRect();
			for (let i = 0; i < this.numberParticles; i++) {
				const ptc = this.particles[i];
				const mx = event.clientX - rect.left;
				const my = event.clientY - rect.top;
				const cx = ptc.centerParticle[0];
				const cy = ptc.centerParticle[1];
				const distMousePart = this.distance(mx, my, cx, cy) - ptc.sizeParticle;
				ptc.mousex = mx;
				ptc.mousey = my;
				if (distMousePart < 5) {
					// inside particle
					// this.handleMouseInside(ptc, true);
					ptc.handleMouseInside(true);
					if (ptc.isSelected) {
						this.particleSelected = ptc;
					}
				} else if (distMousePart > 0 && distMousePart > 100) {
					// out of the action radius
					// this.handleMouseOutOfRadius(ptc, true);
					ptc.handleMouseOutOfRadius(true);
				} else {
					// in the action radius
					// this.handleMouseInRadiusWhenClick(ptc, true);
					ptc.handleMouseInRadiusWhenClick(true);
				}
			}
		},
		handleMouseInside(ptc, isItClicked) {
			// console.log(`c;licked in particle`);
			ptc.color = 'red';
			ptc.isToMouse = false;
			ptc.isMouseInside = true;
			if (isItClicked) {
				if (ptc.isSelected) {
					this.particleSelected = {};
					ptc.isSelected = false;
					ptc.isMouseInside = false;
					// ptc.play = false;
				} else {
					this.particleSelected = ptc;
					ptc.isSelected = true;
					ptc.play = true;
				}
				this.$emit('particleSelect', this.particleSelected);
				// this.$emit('particleSelect', ptc);
			} else {
				this.particleSelected = ptc;
			}
		},
		handleMouseInRadiusWhenClick(ptc) {
			ptc.color = 'green';
			ptc.isToMouse = true;
			ptc.isMouseInside = false;
			this.particleSelected = {};
			ptc.isSelected = false;
		},
		handleMouseInRadiusWhenHover(ptc) {
			ptc.color = 'green';
			ptc.isMouseInside = false;
			// if particle is selected do not go to the mouse
			if (ptc.isSelected) {
				ptc.isToMouse = false;
			} else {
				ptc.isToMouse = true;
			}
		},
		handleMouseOutOfRadius(ptc, isItClicked) {
			ptc.color = 'blue';
			ptc.isToMouse = false;
			ptc.isMouseInside = false;
			ptc.stepsToMouse = 0;
			if (isItClicked) {
				this.particleSelected = {};
				ptc.isSelected = false;
			}
		},
		mouseMove(event) {
			// console.log(`mouse moved`);
			const rect = this.canvas.getBoundingClientRect();
			for (let i = 0; i < this.numberParticles; i++) {
				const ptc = this.particles[i];
				const mx = event.clientX - rect.left;
				const my = event.clientY - rect.top;
				const cx = ptc.centerParticle[0];
				const cy = ptc.centerParticle[1];
				const distMousePart = this.distance(mx, my, cx, cy) - ptc.sizeParticle;
				ptc.mousex = mx;
				ptc.mousey = my;
				if (distMousePart < 5) {
					// inside particle
					// this.handleMouseInside(ptc, false);
					ptc.handleMouseInside(false);
				} else if (distMousePart > 0 && distMousePart > 100) {
					// out of the action radius
					// this.handleMouseOutOfRadius(ptc, false);
					ptc.handleMouseOutOfRadius(false);
				} else {
					// in the action radius
					// this.handleMouseInRadiusWhenHover(ptc);
					ptc.handleMouseInRadiusWhenHover();
				}
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

		compareToGrid(ptc) {
			const radx = ptc.px;
			const rady = ptc.py;
			const c = ptc.centerGrid[0] + this.partx / 2;
			const d = ptc.centerGrid[1] + this.party / 2;
			const e = ptc.centerGrid[0] - this.partx / 2;
			const f = ptc.centerGrid[1] - this.party / 2;
			if (
				radx > c - ptc.sizeParticle ||
				rady > d - ptc.sizeParticle ||
				radx < e + ptc.sizeParticle ||
				rady < f + ptc.sizeParticle
			) {
				ptc.outOfGrid = true;
				[ptc.px, ptc.py] = [ptc.position[0], ptc.position[1]];
			} else {
				ptc.outOfGrid = false;
			}
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
