export default class floatingCanvasBackground {
  constructor(element, amountPerSec) {
    this.canvas = element;
    this.ctx = this.canvas.getContext('2d');
    this.setAmount(amountPerSec);
    this.fps = 60;
    this.frameLength = 1000 / this.fps;
    this.opacityChangeAmount = 1.2;
    this.speedMultiplier = 0.30;
    this.lifetimeMultiplier = 1000;
    this.particles = [];
    this.resize();
    this.startGeneration();
    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  resize() {
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height =  window.innerHeight * 1.1;
  }

  setAmount(amountPerSec) {
    this.generationRate = 1000 / amountPerSec;
  }

  randomizeElProp() {
    this.elSize = Math.random() * 70 + 5;
    this.elLifetime = Math.random() * 2500 + this.lifetimeMultiplier * Math.cbrt(this.elSize);
    this.distanceX = Math.random();
    this.speed = (Math.random() * 1.5 + 0.5) * this.speedMultiplier;
  }

  drawParticles() {
    this.clearCanvas();
    this.particles = this.particles.filter((el) => el.opacity > 0);
    this.particles.forEach((el) => {
      el.draw();
    });
    this.drawTimeout = this.drawTimeout = setTimeout(() => {
      requestAnimationFrame(this.drawParticles.bind(this));
    }, this.frameLength);
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width,  this.ctx.canvas.height);
  }

  startGeneration() {
    this.generationTimeout = setTimeout(() => {
      this.randomizeElProp();
      this.createParticle();
      this.startGeneration();
    }, this.generationRate);
  }
 
  clearTimeout() {
    clearTimeout(this.generationTimeout);
    clearTimeout(this.drawTimeout);
  }
  createParticle() {
    let elem = {
      size: this.elSize,
      x: this.distanceX * this.ctx.canvas.width,
      y: this.ctx.canvas.height,
      fps: this.fps,
      opacity: 1 - (Math.sqrt(this.elSize) / 10) * this.opacityChangeAmount + 0.2,
      opacityTransitionDuration: 100,
      opacityStep: 0,
      speedY: this.speed,
      color: '219, 9, 58',
      lifeTime: this.elLifetime,
      frameLength: this.frameLength,
      ctx: this.ctx,
      draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        this.ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        this.ctx.fill();
      },
      initializeOpacityStep() {
        this.opacityStep = this.opacity / ((this.opacityTransitionDuration / 1000) * this.fps);
      },
      fade() {
        this.opacity -= this.opacityStep;
        this.fader = setTimeout(() => {
          this.fade();
        }, this.frameLength);
      },
      move() {
        setInterval(() => {
          this.y -= this.speedY;
        }, this.frameLength);
      },
      spawn() {
        this.move();
        setTimeout(() => {
          this.initializeOpacityStep();
          this.fade();
        }, this.lifeTime - this.opacityTransitionDuration);
      },
    };
    elem.spawn();
    this.particles.push(elem);
    setTimeout(() => {
      clearTimeout(elem.fader);
      elem = null;
    }, this.elLifetime);
  }
}
