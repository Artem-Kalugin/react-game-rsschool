import React, { useEffect, useState, useRef } from "react";
import Hero from "../Characters/Hero";
import Forest from "../Worlds/Forest";

function Game() {
  const canvas = useRef(null);

  const [gameState, setGameState] = useState({
    yAxisGround: 0.755,
    displaySize: 1.5,
    groundLength: 800 / (Forest.groundSize * Forest.groundSizeMultiplier),
  });
  const [enemies, setEnemies] = useState([]);
  const [hero, setHero] = useState({
    x: 0.2,
    yOffset: -0.03,
    yBase: -0.03,
    size: 1.3,
    jumpSpeed: 0,
    radius: 20,
    isDied: false,
    animationStep: 0,
    tileSize: Hero.tileSize,
    currentAnimation: Hero.animations.idle,
  });
  const [ground, setGround] = useState();

  const drawCharacters = (ctx) => {
    Object.values([hero, ...enemies].filter((el) => !el.isDied)).forEach(
      (el) => {
        if (el) {
          ctx.drawImage(
            el.currentAnimation,
            (el.animationStep * el.tileSize) % el.currentAnimation.width,
            0,
            el.tileSize,
            el.tileSize,
            el.x * canvas.current.width - el.tileSize,
            (gameState.yAxisGround + hero.yOffset) * canvas.current.height -
              el.tileSize,
            el.tileSize * gameState.displaySize * el.size,
            el.tileSize * gameState.displaySize * el.size
          );
        }
      }
    );
  };

  const drawWorld = (ctx) => {
    ctx.drawImage(
      Forest.assets.sky,
      0,
      0,
      canvas.current.width,
      canvas.current.height
    );
    ctx.drawImage(
      Forest.assets.bg1,
      0.5 * canvas.current.width,
      0.5 * canvas.current.height,
      Forest.assets.bg1.width * 1.1 * gameState.displaySize,
      Forest.assets.bg1.height * 1.1 * gameState.displaySize
    );
    let groundStep = 1 / gameState.groundLength;
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < gameState.groundLength; i++) {
        ctx.drawImage(
          Forest.assets.ground,
          Forest.groundSize * 1,
          Forest.groundSize * 1,
          Forest.groundSize,
          Forest.groundSize,
          groundStep * i * canvas.current.width,
          (gameState.yAxisGround + 0.05 * (j + 1)) * canvas.current.height,
          Forest.groundSize *
            gameState.displaySize *
            Forest.groundSizeMultiplier,
          Forest.groundSize *
            gameState.displaySize *
            Forest.groundSizeMultiplier
        );
      }
    }
    for (let i = 0; i < gameState.groundLength; i++) {
      ctx.drawImage(
        Forest.assets.ground,
        0,
        0,
        Forest.groundSize,
        Forest.groundSize,
        groundStep * i * canvas.current.width,
        gameState.yAxisGround * canvas.current.height,
        Forest.groundSize * gameState.displaySize * Forest.groundSizeMultiplier,
        Forest.groundSize * gameState.displaySize * Forest.groundSizeMultiplier
      );
    }
  };

  const draw = () => {
    const ctx = canvas.current.getContext("2d");
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    updatePositions();
    drawWorld(ctx);
    drawCharacters(ctx);
    ctx.beginPath();
  };

  const updateCharacters = () => {
    const newHeroState = hero;
    newHeroState.animationStep++;
    setHero(newHeroState);
  };

  const updatePositions = () => {
    const newHeroState = hero;
    newHeroState.currentAnimation = Hero.animations.idle;
    newHeroState.yOffset = hero.yOffset - newHeroState.jumpSpeed * 0.01;
    if (hero.yOffset > hero.yBase) {
      newHeroState.yOffset = hero.yBase;
      newHeroState.jumpSpeed = 0;
      newHeroState.currentAnimation = Hero.animations.idle;
    }
    if (hero.jumpSpeed !== 0) {
      newHeroState.jumpSpeed -= 0.09;
    }
    if (hero.jumpSpeed < 0) {
      newHeroState.currentAnimation = Hero.animations.fall;
    } else if (hero.jumpSpeed > 0) {
      newHeroState.currentAnimation = Hero.animations.jump;
    }
    setHero(newHeroState);
  };

  useEffect(() => {
    console.log("update");
    console.log(hero);
  });

  const heroJump = () => {
    const newHeroState = hero;
    if (hero.jumpSpeed === 0) {
      newHeroState.jumpSpeed = 3;
      newHeroState.currentAnimation = Hero.animations.jump;
    }
    setHero(newHeroState);
  };

  const heroFall = () => {
    const newHeroState = hero;
    if (hero.jumpSpeed > 0) {
      newHeroState.jumpSpeed = hero.jumpSpeed / 2.2;
      newHeroState.currentAnimation = Hero.animations.jump;
    }
    setHero(newHeroState);
  };

  useEffect(() => {
    console.log("render");
    document.addEventListener("keydown", (e) => {
      if (e.keyCode === 32) heroJump();
    });
    document.addEventListener("keyup", (e) => {
      if (e.keyCode === 32) heroFall();
    });
    setInterval(() => {
      updateCharacters();
    }, 1000 / 20);
    setInterval(() => {
      draw();
    }, 1000 / 60);
  }, [gameState]);

  return (
    <canvas ref={canvas} id="game__board" width="1200" height="600"></canvas>
  );
}

export default Game;
