class Mover {
	constructor(x, y, name, size, context, orbit, amplitude, infoPath, waveColor, audioSrc, prx, pry) {
		this.position = [x, y];
		this.topspeed = 5;
		this.radiusParticle = size;
		this.centerParticle = [x, y];
		this.theta = 0;
		this.angleAux = 0;
		this.shiftAng = 0;
		this.name = name;
		this.color = `blue`;
		this.sizeParticle = size;
		this.orbit = orbit;
		this.amplitude = amplitude;
		this.canvas = 0;
		this.canvasWidth = 1000;
		this.canvasHeight = 780;
		this.canvasCtx = context;
		this.angleMov = 0;
		this.isToMouse = false;
		this.isMouseInside = false;
		this.mousex = 0;
		this.mousey = 0;
		this.shiftCx = 0;
		this.shiftCy = 0;
		this.slowPeriod = 0.01;
		this.regularPeriod = 0.03;
		this.centerAux = [x, y];
		this.collide = false;
		this.px = x;
		this.py = y;
		this.stepsInCollision = 0;
		this.outOfGrid = false;
		this.centerGrid = [x, y];
		this.partx = prx;
		this.party = pry;
		this.val = 0;
		this.angleAux2 = 0;
		this.px2 = 0;
		this.py2 = 0;
		this.childPosX = x;
		this.childPosY = y;
		this.sizeChildParticle = 0;
		this.path = infoPath;
		this.isSelected = false;
		this.waveColor = waveColor;
		this.audioSrc = audioSrc;
		this.play = false;
		this.color1 = `rgb(206, 238, 234)`;
		this.color2 = `rgb(0, 168, 143)`;
		this.color3 = `rgb(255, 255, 255)`;
		this.val = 0;
		this.scaleInChP = 0.9;
	}
	// Getter
	get generateWaveDraw() {
		return this.display();
	}
	// Getter
	get getDistance() {
		return this.distance();
	}

	get randomNumber() {
		return this.getRandom();
	}

	display() {
		this.movementParticle(this.isToMouse, this.theta, this.mousex, this.mousey);
		this.drawSimpleParticle(this.position[0], this.position[1], this.sizeParticle);
		this.checkChildParticle();
	}

	movementParticle(isToMouse, mx, my) {
		const dist = this.distance(mx, my, this.position[0], this.position[1]) - this.sizeParticle / 2;
		// console.log(dist);
		// if mouse is in the acttraction radius. Multiply 1.5 in order to the particle do not approach inside
		if (dist > this.sizeParticle * 1.5 && this.isToMouse) {
			this.toMouse(mx, my);
		} else {
			this.localMovement(dist < 0 && !isToMouse ? this.slowPeriod : this.regularPeriod, 0, 0);
		}
		this.compareToGrid();
		this.position[0] = this.px;
		this.position[1] = this.py;

		// position of child particle
		this.childPosX = this.px2;
		this.childPosY = this.py2;
	}

	checkChildParticle() {
		if (this.isMouseInside || this.isSelected) {
			this.canvasCtx.globalAlpha = 1;
			const psx = this.position[0] + 2 * this.sizeParticle;
			const psy = this.position[1] + 2 * this.sizeParticle;

			this.drawParticleAndChild(psx, psy);
			// gorwing size effect
			// const childParticleSizeBound = this.sizeParticle * 1.3;
			const childParticleSizeBound = this.sizeParticle;
			if (this.sizeChildParticle < childParticleSizeBound) {
				// control the speed of growing
				this.sizeChildParticle += 5;
			}
		} else {
			this.sizeChildParticle = 0;
		}
	}

	drawParticleAndChild() {
		// save the canvas because of the image clip
		this.canvasCtx.save();
		this.canvasCtx.lineWidth = 2;
		// Parent Particle
		this.drawParentParticle();
		// Child Particle
		this.drawChildParticle();

		this.canvasCtx.restore();
	}

	drawParentParticle() {
		const postx = this.position[0];
		const posty = this.position[1];
		const sizeP = this.sizeParticle;
		const ang0 = 0;
		const ang1 = 2 * Math.PI;

		// inner simple particle
		this.drawCircle(postx, posty, sizeP * 0.5, ang0, ang1, this.color2, false, true);
		const sizeP1 = this.sizeParticle / 2;
		const pX0 = postx - sizeP1 * 0.5 / 2;
		const pY0 = posty - sizeP1 * 0.5;
		const pX1 = postx + sizeP1 * 0.5;
		const pY1 = posty + sizeP1 * 0.5;

		// simple litle play triangle
		this.drawTriangle(pX0, pY0, pX1, pY1);

		// simple litle point
		// this.drawCircle(postx, posty, sizeP * 0.07, ang0, ang1, this.color3, true, true);
	}

	drawChildParticle() {
		const postx = this.position[0];
		const posty = this.position[1];
		const chPosX = this.childPosX;
		const chPosY = this.childPosY;
		const sizeP = this.sizeParticle;
		const chSizeP = this.sizeChildParticle;
		const ang0 = 0;
		const ang1 = 2 * Math.PI;
		// child particle
		this.drawCircle(chPosX, chPosY, chSizeP * 1.1, ang0, ang1, this.color2, true, false);

		// child little point
		const scaleChLP = 0.8;
		/*
		const indX = this.addDirection(postx, this.canvas.width / 2);
		const indY = this.addDirection(posty, this.canvas.height / 2); */
		const indX = this.addDirection(this.centerAux[0], chPosX);
		const indY = this.addDirection(this.centerAux[1], chPosY);
		const posxScaled = chPosX + indX * chSizeP * scaleChLP;
		const posyScaled = chPosY + indY * chSizeP * scaleChLP;
		this.drawCircle(posxScaled, posyScaled, sizeP * 0.07, ang0, ang1, this.color3, true, true);

		// this.drawCircle(chPosX - 80, chPosY - 80, sizeP * 0.07, ang0, ang1, `green`, true, true);

		// this.drawLine(this.color3, postx, posty, chPosX - 90, chPosY - 90, true);

		// diagonal line
		this.drawLine(this.color3, postx, posty, posxScaled, posyScaled, true);
		// insert name of the people
		this.addPeopleName();
		// inner child particle
		this.drawCircle(chPosX, chPosY, chSizeP * this.scaleInChP, ang0, ang1, this.color2, true, true);

		this.canvasCtx.clip();
		// insert the image of the particle in the inner child particle
		this.addPeopleImage();
	}

	compareToGrid() {
		const radx = this.px;
		const rady = this.py;
		const c = this.centerGrid[0] + this.partx / 2;
		const d = this.centerGrid[1] + this.party / 2;
		const e = this.centerGrid[0] - this.partx / 2;
		const f = this.centerGrid[1] - this.party / 2;
		if (
			radx > c - this.sizeParticle ||
			rady > d - this.sizeParticle ||
			radx < e + this.sizeParticle ||
			rady < f + this.sizeParticle
		) {
			this.outOfGrid = true;
			[this.px, this.py] = [this.position[0], this.position[1]];
		} else {
			this.outOfGrid = false;
		}
	}

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
	}

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
	}

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
	}

	addPeopleImage() {
		const image = new Image();
		image.src = this.path;
		this.canvasCtx.drawImage(
			image,
			this.childPosX - this.sizeChildParticle,
			this.childPosY - this.sizeChildParticle,
			this.sizeChildParticle * 2,
			this.sizeChildParticle * 2,
		);
	}

	addPeopleName() {
		const chPosX = this.childPosX;
		const chPosY = this.childPosY;
		const chSizeP = this.sizeChildParticle;
		const posxScaled = chSizeP * Math.cos(0) + chPosX + 20;
		const posyScaled = chSizeP * Math.sin(60) + chPosY;
		this.canvasCtx.font = `24px serif`;
		this.canvasCtx.fillText(this.name, posxScaled, posyScaled);
	}

	toMouse(mx, my) {
		const magMouse = this.magnitude(mx, my);
		const normMx = mx / magMouse;
		const normMy = my / magMouse;
		const dirX = this.addDirection(mx, this.position[0]);
		const dirY = this.addDirection(my, this.position[1]);
		this.shiftCx = normMx * dirX;
		this.shiftCy = normMy * dirY;

		// angle that makes to traslate particle with some period
		this.angleAux += this.shiftAng;

		this.centerAux[0] += this.shiftCx;
		this.centerAux[1] += this.shiftCy;
		this.centerParticle = this.centerAux;

		this.px = this.orbit * (this.radiusParticle / 2) * Math.cos(this.angleAux * this.amplitude) + this.centerAux[0];
		this.py = this.orbit * (this.radiusParticle / 2) * Math.sin(this.angleAux * this.amplitude) + this.centerAux[1];

		// position of child particle
		this.px2 = this.px;
		this.py2 = this.py;
	}

	localMovement(shiftA, shiftx, shifty) {
		// console.log(`in locla movement`);
		const orb = this.orbit;
		this.shiftAng = shiftA;
		this.shiftCx = shiftx;
		this.shiftCy = shifty;

		this.angleAux += shiftA;
		this.theta = this.angleAux;

		// angle change of child particle
		this.angleAux2 += shiftA * 3;

		this.centerAux[0] += this.shiftCx;
		this.centerAux[1] += this.shiftCy;
		this.centerParticle = this.centerAux;

		const pxAux = orb * (this.radiusParticle / 2) * Math.cos(this.angleAux * this.amplitude) + this.centerAux[0];
		const pyAux = orb * (this.radiusParticle / 2) * Math.sin(this.angleAux * this.amplitude) + this.centerAux[1];

		this.px = pxAux;
		this.py = pyAux;

		// position of child particle. direction to center of canvas
		const d1 = this.addDirection(this.canvasWidth / 2, this.centerAux[0]);
		const d2 = this.addDirection(this.canvasHeight / 2, this.centerAux[1]);
		this.px2 =
			orb * this.radiusParticle * Math.cos(this.angleAux2 * this.amplitude / 2) +
			this.centerParticle[0] +
			this.sizeParticle * 3 * d1;
		this.py2 =
			orb * this.radiusParticle * Math.sin(this.angleAux2 * this.amplitude / 2) +
			this.centerParticle[1] +
			this.sizeParticle * 3 * d2;
	}

	drawSimpleParticle(posx, posy, size) {
		this.canvasCtx.lineWidth = 2;
		this.canvasCtx.strokeStyle = 'white';
		this.canvasCtx.beginPath();
		this.canvasCtx.arc(posx, posy, size, 0, 2 * Math.PI);
		this.canvasCtx.fillStyle = this.color1;
		this.canvasCtx.globalAlpha = 0.2;
		this.canvasCtx.fill();
	}

	handleMouseInside(isItClicked) {
		// console.log(`c;licked in particle`);
		this.color = 'red';
		this.isToMouse = false;
		this.isMouseInside = true;
		if (isItClicked) {
			if (this.isSelected) {
				// this.particleSelected = {};
				this.isSelected = false;
				this.isMouseInside = false;
				// this.play = false;
			} else {
				// this.particleSelected = this;
				this.isSelected = true;
				this.play = true;
			}
			// this.$emit('particleSelect', this.particleSelected);
			// this.$emit('particleSelect', this);
		} else {
			// this.particleSelected = this;
		}
	}

	handleMouseInRadiusWhenClick() {
		this.color = 'green';
		this.isToMouse = true;
		this.isMouseInside = false;
		// this.particleSelected = {};
		this.isSelected = false;
	}

	handleMouseInRadiusWhenHover() {
		this.color = 'green';
		this.isMouseInside = false;
		// if particle is selected do not go to the mouse
		if (this.isSelected) {
			this.isToMouse = false;
		} else {
			this.isToMouse = true;
		}
	}

	handleMouseOutOfRadius(isItClicked) {
		this.color = 'blue';
		this.isToMouse = false;
		this.isMouseInside = false;
		this.stepsToMouse = 0;
		if (isItClicked) {
			// this.particleSelected = {};
			this.isSelected = false;
		}
	}

	magnitude(x, y) {
		this.val = Math.sqrt(x * x + y * y);
		return this.val;
	}

	addDirection(mx, x) {
		if (mx - x > 0) {
			this.val = 1;
		} else {
			this.val = -1;
		}
		return this.val;
	}

	distance(x1, y1, x2, y2) {
		const a = x1 - x2;
		const b = y1 - y2;
		const c = Math.sqrt(a * a + b * b);
		this.val = c;
		return this.val;
	}

	getRandom(min, max) {
		this.val = Math.random() * (max - min) + min;
		return this.val;
	}
}

export default Mover;
