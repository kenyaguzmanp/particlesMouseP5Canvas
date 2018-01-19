class Mover {
	constructor(
		x,
		y,
		name,
		size,
		context,
		orbit,
		amplitude,
		infoPath,
		waveColor,
		audioSrc,
		prx,
		pry,
		radiusHelper,
		cgy,
		sound,
	) {
		this.position = [x, y];
		this.topspeed = 5;
		this.radiusParticle = size;
		this.centerParticle = [x, y];
		this.centerGrid = [x, cgy];
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
		// this.centerGrid = [x, y];
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
		this.radiusHelper = radiusHelper;
		this.isMouseInSubgrid = false;
		this.showChildParticle = false;
		this.soundEnd = sound;
		this.isPlaying = false;
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
		// console.log(`mover sound`);
		// console.log(this.soundEnd);
		this.handdleParticleInSubgrid();
		this.handleChildParticle(`growing`);
		// if mouse inside or is selected draw inner simple particle (the litle triangle)
		this.drawSimpleParticle(this.position[0], this.position[1], this.sizeParticle);
		this.addMovementValuesToParticle();
	}

	handdleParticleInSubgrid() {
		// If mouse is inside particle's subgrid then check if its inside and selected or not, then handle movement
		if (this.isMouseInSubgrid) {
			this.generateSubgrid();
			this.checkMouseInsideParticle(this.mousex, this.mousey);
			if (!this.isMouseInside && !this.isSelected) {
				this.toMouseMovement(this.mousex, this.mousey);
			} else {
				this.localMovement(0.03, 0, 0);
			}
		} else {
			this.localMovement(0.05, 0, 0); // if mouse is not in particle's subgrid then local movement
		}
	}

	addMovementValuesToParticle() {
		this.position[0] = this.px;
		this.position[1] = this.py;

		// position of child particle
		this.childPosX = this.px2;
		this.childPosY = this.py2;
	}

	checkMouseInsideParticle(mx, my) {
		const dist = this.distance(mx, my, this.position[0], this.position[1]) - this.sizeParticle;
		// if mouse is inside particle
		if (dist < 5) {
			this.isMouseInside = true;
		} else {
			this.isMouseInside = false;
		}
	}

	/*

	handleChildParticle() {
		if (this.isSelected) {
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
	*/

	handleChildParticle(effect) {
		this.canvasCtx.globalAlpha = 1;
		// is sound is ended and the particle has been selected
		if (this.isSelected && !this.isPlaying) {
			const postx = this.position[0];
			const posty = this.position[1];
			const sizeP = this.sizeParticle;
			this.drawRepeatArrow(postx, posty, sizeP);
		}
		// Hover on particle when no other has been selected
		// draw the play triangle, not the child particle
		if (this.isMouseInside && !this.isPlaying) {
			// Parent Particle
			this.drawParticleAndChild(false, 0);
		}
		// Click on particle when someone has been selected
		// draw the child particle and the growing effect
		if (this.isSelected && this.isPlaying) {
			this.canvasCtx.globalAlpha = 1;
			if (effect === `growing`) {
				this.addGrowingEffect();
			} else {
				this.drawParticleAndChild(true, this.sizeParticle);
			}
		}
	}

	addGrowingEffect() {
		if (this.sizeChildParticle < this.sizeParticle) {
			// control the speed of growing
			this.sizeChildParticle += 0.5;
			this.drawParticleAndChild(true, this.sizeChildParticle);
		} else {
			this.drawParticleAndChild(true, this.sizeParticle);
		}
	}

	drawParticleAndChild(drawChild, sizeCh) {
		if (drawChild) {
			// save the canvas because of the image clip
			this.canvasCtx.save();
			this.canvasCtx.lineWidth = 2;
			// Parent Particle
			this.drawParentParticle();
			// Child Particle
			this.drawChildParticle(sizeCh);

			this.canvasCtx.restore();
		} else {
			// Parent Particle
			this.drawParentParticle();
		}
	}

	drawParentParticle() {
		const postx = this.position[0];
		const posty = this.position[1];
		const sizeP = this.sizeParticle;
		const ang0 = 0;
		const ang1 = 2 * Math.PI;

		// inner simple particle
		this.drawCircle(postx, posty, sizeP * 0.5, ang0, ang1, this.color2, false, 2, true);
		const sizeP1 = this.sizeParticle / 2;
		const pX0 = postx - sizeP1 * 0.5 / 2;
		const pY0 = posty - sizeP1 * 0.5;
		const pX1 = postx + sizeP1 * 0.5;
		const pY1 = posty + sizeP1 * 0.5;

		// repeat arrow
		// this.drawRepeatArrow(postx, posty, sizeP);

		// simple litle play triangle
		this.drawTriangle(pX0, pY0, pX1, pY1);

		// simple litle point
		this.drawCircle(postx, posty, sizeP * 0.07, ang0, ang1, this.color3, true, true);
	}

	drawRepeatArrow(postx, posty, sizeP) {
		const ang0 = Math.PI / 2;
		const ang1 = 0;
		this.drawCircle(postx, posty, sizeP * 0.3, ang0, ang1, `white`, true, 3, false);
		// const sizeP1 = this.sizeParticle / 2;

		const eps = 10;
		const r2 = sizeP * 0.3;
		this.drawTriangle(postx, posty + r2 - eps, postx + r2 / 2, posty + r2 + eps);
	}

	drawChildParticle(sizeCh) {
		const postx = this.position[0];
		const posty = this.position[1];
		const chPosX = this.childPosX;
		const chPosY = this.childPosY;
		const sizeP = this.sizeParticle;
		// const chSizeP = this.sizeChildParticle;
		const chSizeP = sizeCh;
		const ang0 = 0;
		const ang1 = 2 * Math.PI;
		// child particle
		this.drawCircle(chPosX, chPosY, chSizeP * 1.1, ang0, ang1, this.color2, true, 2, false);

		// child little point
		const scaleChLP = 0.8;
		/*
		const indX = this.addDirection(postx, this.canvas.width / 2);
		const indY = this.addDirection(posty, this.canvas.height / 2); */
		const indX = this.addDirection(this.centerAux[0], chPosX);
		const indY = this.addDirection(this.centerAux[1], chPosY);
		const posxScaled = chPosX + indX * chSizeP * scaleChLP;
		const posyScaled = chPosY + indY * chSizeP * scaleChLP;
		this.drawCircle(posxScaled, posyScaled, sizeP * 0.07, ang0, ang1, this.color3, true, 1, true);

		// this.drawCircle(chPosX - 80, chPosY - 80, sizeP * 0.07, ang0, ang1, `green`, true, true);

		// this.drawLine(this.color3, postx, posty, chPosX - 90, chPosY - 90, true);

		// diagonal line
		this.drawLine(this.color3, postx, posty, posxScaled, posyScaled, true);
		// insert name of the people
		this.addPeopleName();
		// inner child particle
		this.drawCircle(chPosX, chPosY, chSizeP * this.scaleInChP, ang0, ang1, this.color2, true, 2, true);

		this.canvasCtx.clip();
		// insert the image of the particle in the inner child particle
		this.addPeopleImage(sizeCh);
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

	drawCircle(positionX, positionY, size, angle0, angle1, color, itHasStroke, strokeVal, isItFilled) {
		this.canvasCtx.beginPath();
		this.canvasCtx.arc(positionX, positionY, size, angle0, angle1);
		this.canvasCtx.fillStyle = color;
		if (isItFilled) {
			this.canvasCtx.fill();
		}
		if (itHasStroke) {
			this.canvasCtx.strokeStyle = color;
			// lineWidth for repeat arrow
			this.canvasCtx.lineWidth = strokeVal;
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

	addPeopleImage(sizeCh) {
		const image = new Image();
		image.src = this.path;
		this.canvasCtx.drawImage(image, this.childPosX - sizeCh, this.childPosY - sizeCh, sizeCh * 2, sizeCh * 2);
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

	toMouseMovement(mx, my) {
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
		// draw inner Simple Particle, when mouse is inside
		if (this.isMouseInside) {
			this.canvasCtx.globalAlpha = 1;
			// this.drawParentParticle();
		}

		// radius helper
		// this.drawRadiusHelper(posx, posy, size);
	}

	drawRadiusHelper(posx, posy, size) {
		this.canvasCtx.lineWidth = 2;
		this.canvasCtx.strokeStyle = 'white';
		this.canvasCtx.beginPath();
		this.canvasCtx.arc(posx, posy, size + this.radiusHelper, 0, 2 * Math.PI);
		this.canvasCtx.fillStyle = `blue`;
		this.canvasCtx.globalAlpha = 0.2;
		this.canvasCtx.fill();
	}

	generateSubgrid() {
		this.canvasCtx.globalAlpha = 0.1;
		const x0 = this.centerGrid[0];
		const y0 = this.centerGrid[1];
		const bound = this.partx / 8;

		this.canvasCtx.rect(
			x0 - this.partx / 2 + bound,
			y0 - this.party / 2 + bound,
			this.partx - bound * 2,
			this.party - bound * 2,
		);
		this.canvasCtx.fill();
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
