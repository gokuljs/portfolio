'use client';
import React, { useEffect, useRef } from 'react';
import styles from '@styles/projects.module.scss';
import gsap from 'gsap';

class Meteor {
  canvas: HTMLCanvasElement;
  options: {
    element: HTMLCanvasElement;
    width: number;
    collision: boolean;
  };
  context: CanvasRenderingContext2D;
  meteorWidth: number;
  meteorSpeed: number;
  meteorLength: number;
  gradient: CanvasGradient;
  particles: {
    x: number;
    y: number;
    size: number;
    speed: number;
    dead: boolean;
    tl: gsap.core.Timeline;
  }[] = [];
  collided: boolean = false;
  exploder = {
    size: 0,
    alpha: 1,
  };
  sparks: {
    x: number;
    y: number;
    size: number;
    destination: { x: number; y: number };
    alpha: number;
  }[] = [];
  imminentCollision: boolean = false;

  constructor(options: {
    element: HTMLCanvasElement;
    width: number;
    collision: boolean;
  }) {
    const that = this;
    this.canvas = options.element;
    this.options = options;
    this.context = this.canvas.getContext('2d')!;
    this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
    this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
    this.meteorWidth = that.options.width;
    this.meteorSpeed = gsap.utils.mapRange(4, 12, 6, 12, that.meteorWidth);
    this.meteorLength = gsap.utils.mapRange(4, 12, 50, 80, that.meteorWidth);
    // Create a reusable gradient
    that.gradient = that.context.createLinearGradient(
      that.canvas.width * 0.5,
      that.canvas.height * 0.5,
      that.canvas.width * 0.5,
      0,
    );
    that.gradient.addColorStop(0, 'hsl(30, 100%, 100%)');
    that.gradient.addColorStop(0.025, 'hsl(30, 100%, 70%)');
    that.gradient.addColorStop(0.15, 'hsl(30, 100%, 40%)');
    that.gradient.addColorStop(0.55, 'hsl(30, 100%, 20%)');
    that.gradient.addColorStop(1, 'transparent');

    this.particles = that.genParticles(gsap.utils.random(50, 100, 1));
    this.setParticlesMotion();
    gsap.ticker.add(this.draw.bind(that));

    if (options.collision) {
      that.canvas.addEventListener('animationend', () => {
        console.info('reset animation');
        if (that.imminentCollision) that.explode();
        else that.ignite(Math.random() > 0.25);
      });

      that.ignite = (ignite: boolean) => {
        if (that.collided) {
          that.collided = false;
          that.particles = that.genParticles(gsap.utils.random(50, 100, 1));
          that.setParticlesMotion();
          that.exploder.size = 0;
          that.exploder.alpha = 1;
          that.options.width = gsap.utils.random(4, 8, 1);
          that.meteorWidth = that.options.width;
          that.meteorLength = gsap.utils.random(50, 80, 1);
        }
        const speed = ignite
          ? gsap.utils.random(4, 8, 0.1)
          : gsap.utils.random(8, 16, 0.1);
        const delay = ignite ? 0 : gsap.utils.random(-5, 0, 0.1);
        that.imminentCollision = ignite;
        that.canvas.style.setProperty(
          '--distance',
          ignite ? '100cqh' : '200cqh',
        );
        that.canvas.style.setProperty('--buffer', ignite ? '50%' : '100%');
        that.canvas.style.setProperty('--speed', `${speed}s`);
        that.canvas.style.setProperty('--delay', `${delay}s`);
        const anim = that.canvas.getAnimations()[0];
        anim.cancel();
        anim.play();
      };
      that.ignite(false);
    }
  }

  genParticles(amount: number) {
    const that = this;
    const particles: {
      size: number;
    }[] = [];
    for (let p = 0; p < amount; p++) {
      const particle = {
        size:
          gsap.utils.random(1, that.options.width * 1.25, 1) *
          window.devicePixelRatio,
      };
      particles.push(particle);
    }
    return particles;
  }

  draw() {
    const that = this;
    that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);
    that.context.shadowBlur = 10 * window.devicePixelRatio;
    that.context.shadowColor = 'hsl(30, 100%, 40%)';

    for (const particle of that.particles.filter((p) => !p.dead)) {
      that.context.beginPath();
      that.context.fillStyle = that.gradient;
      that.context.arc(
        particle.x,
        particle.y,
        particle.size / 2,
        0,
        2 * Math.PI,
      );
      that.context.fill();
    }

    that.context.beginPath();
    const radius = (that.meteorWidth / 2) * window.devicePixelRatio;
    that.context.arc(
      that.canvas.width * 0.5,
      that.canvas.height * 0.5 - radius,
      radius,
      0,
      1 * Math.PI,
    );
    that.context.fill();

    that.context.fillStyle = that.gradient;
    that.context.moveTo(
      that.canvas.width * 0.5 - radius,
      that.canvas.height * 0.5 - radius,
    );
    that.context.lineTo(
      that.canvas.width * 0.5,
      that.canvas.height * 0.5 - that.meteorLength * window.devicePixelRatio,
    );
    that.context.lineTo(
      that.canvas.width * 0.5 + radius,
      that.canvas.height * 0.5 - radius,
    );
    that.context.fill();

    if (that.collided) {
      const sparkGradient = that.context.createRadialGradient(
        that.canvas.width * 0.5,
        that.canvas.width * 0.5,
        that.options.width * 0.5,
        that.canvas.width * 0.5,
        that.canvas.width * 0.5,
        that.canvas.width * 0.5,
      );
      const alpha = that.exploder.alpha * 0.25;
      sparkGradient.addColorStop(0, `hsl(30 100% 80% / ${alpha})`);
      sparkGradient.addColorStop(0.05, `hsl(30 100% 70% / ${alpha})`);
      sparkGradient.addColorStop(0.2, `hsl(30 100% 40% / ${alpha})`);
      sparkGradient.addColorStop(0.25, `hsl(30 100% 20% / ${alpha})`);
      sparkGradient.addColorStop(1, `hsl(30 100% 20% / 0)`);

      for (const spark of that.sparks) {
        that.context.beginPath();
        that.context.fillStyle = sparkGradient;
        that.context.arc(spark.x, spark.y, spark.size / 2, 0, 2 * Math.PI);
        that.context.fill();
      }

      that.context.beginPath();
      that.context.fillStyle = sparkGradient;
      const offset = ((2 * Math.PI) / 360) * that.options.offset;
      that.context.arc(
        that.canvas.width * 0.5,
        that.canvas.height * 0.5,
        that.exploder.size / 2,
        -Math.PI - offset,
        -offset,
      );
      that.context.fill();
    }
  }

  setParticlesMotion() {
    const that = this;
    for (const particle of that.particles) {
      particle.x = that.canvas.width * 0.5;
      particle.y = that.canvas.height * 0.5;
      particle.speed = gsap.utils.mapRange(4, 12, 2, 1, that.meteorWidth);
      particle.dead = false;
      if (particle.size === 0)
        particle.size =
          gsap.utils.random(1, that.options.width * 1.25, 1) *
          window.devicePixelRatio;
      if (particle.tl) particle.tl.kill();
      particle.tl = gsap.timeline().to(particle, {
        x: () =>
          gsap.utils.random(
            that.canvas.width * 0.5 - that.meteorWidth * 2.5,
            that.canvas.width * 0.5 + that.meteorWidth * 2.5,
            1,
          ),
        y: () => gsap.utils.random(0, 0, 1),
        size: 0,
        repeat: -1,
        onRepeat: function () {
          if (that.collided) {
            particle.dead = true;
            particle.tl.kill();
          }
        },
        ease: 'power4.out',
        repeatDelay: Math.random(),
        delay: particle.speed * -1,
        duration: particle.speed,
      });
    }
  }

  explode() {
    const that = this;
    if (that.sparks) that.sparks.length = 0;
    that.sparks = [];
    for (let p = 0; p < gsap.utils.random(10, 50, 1); p++) {
      const spark = {
        destination: {
          x: gsap.utils.random(
            that.canvas.width * 0.5 - that.options.width * 10,
            that.canvas.width * 0.5 + that.options.width * 10,
            1,
          ),
          y: gsap.utils.random(
            that.canvas.width * 0.5 - that.options.width * 10,
            that.canvas.width * 0.5 + that.options.width * 10,
            1,
          ),
        },
        alpha: 1.5,
        x: that.canvas.width * 0.5,
        y: that.canvas.height * 0.5,
        size: gsap.utils.random(
          that.options.width * 0.2,
          that.options.width,
          1,
        ),
      };
      that.sparks.push(spark);
    }
    gsap
      .timeline({
        onStart: function () {
          that.collided = true;
        },
        onComplete: function () {
          that.ignite(Math.random() > 0.25);
        },
      })
      .to(that, {
        duration: 0.5,
        meteorLength: 0,
        meteorWidth: 0,
      })
      .to(
        that.exploder,
        {
          size: that.options.width * 20,
          duration: 0.5,
        },
        0,
      )
      .to(
        that.sparks,
        {
          x: function (index) {
            return that.sparks[index].destination.x;
          },
          y: function (index) {
            return that.sparks[index].destination.y;
          },
          size: 0,
          duration: () => gsap.utils.random(0.5, 1.5),
        },
        0,
      )
      .to(
        that.exploder,
        {
          alpha: 0,
          duration: 0.5,
        },
        0.25,
      );
  }
}

// gsap.ticker.fps(24)

const Page = () => {
  useEffect(() => {
    const SOARERS: NodeListOf<HTMLCanvasElement> =
      document.querySelectorAll('canvas');
    SOARERS.forEach((c) => {
      const collision = c.dataset.offset !== undefined;
      new Meteor({
        collision,
        element: c,
        offset: c.dataset.offset ? parseInt(c.dataset.offset) : 0,
        width: gsap.utils.random(4, 8, 1),
      });
    });
  }, []);

  return (
    <div className={styles.projects}>
      <div className={styles.wrapper}>
        <div className={styles.line}>
          <canvas className={styles.meteor}></canvas>
        </div>
        <div className={styles.line}>
          <canvas className={styles.meteor}></canvas>
        </div>
        {/* <article></article> */}
        <div className={`${styles.line} ${styles['line--collider']}`}>
          <canvas className={styles.meteor} data-offset="-40"></canvas>
        </div>
        <div className="line line--collider">
          <canvas className={styles.meteor} data-offset="50"></canvas>
        </div>
        <svg
          className={styles['sr-only']}
          viewBox="0 0 30 10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="drop">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="16"
                flood-color="orange"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default Page;
