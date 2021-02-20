import React, { useEffect, useState, useRef } from "react";
import HeroAssets from "../assets/Hero/Hero";
import Hero from "./Characters/Hero";
import Forest from "../assets/World/Forest";
import Config from "../Config/Config";

function Game() {
  const canvas = useRef(null);

  const [gameState, setGameState] = useState({
    yAxisGround: Config.world.yAxisGround,
    displaySize: Config.world.displaySize,
    groundLength: 800 / (Forest.groundSize * Forest.groundSizeMultiplier),
  });
  const [enemies, setEnemies] = useState([]);
  const [hero, setHero] = useState({
    x: Config.hero.position.xBase,
    yOffset: Config.hero.position.yBase,
    yBase: Config.hero.position.yBase,
    size: Config.hero.size,
    jumpSpeed: 0,
    isDied: false,
    animationStep: 0,
    tileSize: HeroAssets.tileSize,
    currentAnimation: HeroAssets.animations.idle,
    rightSpeed: 0,
    leftSpeed: 0,
    reversed: false,
    action: null,
    waitForKeypress: true,
  });
  const [SecondHero, setSecondHero] = useState({
    x: Config.hero.position.xBase * 1.5,
    yOffset: Config.hero.position.yBase,
    yBase: Config.hero.position.yBase,
    size: Config.hero.size,
    jumpSpeed: 0,
    isDied: false,
    animationStep: 0,
    tileSize: HeroAssets.tileSize,
    currentAnimation: HeroAssets.animations.idle,
    rightSpeed: 0,
    leftSpeed: 0,
    reversed: true,
    action: null,
    waitForKeypress: true,
  });
  const mainHero2 = new Hero(SecondHero, setSecondHero);
  const mainHero = new Hero(hero, setHero);
  const characters = [];
  characters.push(mainHero, mainHero2);
  const [ground, setGround] = useState();

  const drawCharacters = (ctx) => {
    mainHero2.draw(ctx, canvas);
    mainHero.draw(ctx, canvas);
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
      Forest.assets.bg2,
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
    characters.forEach((el) => {
      el.updateAnimation();
    });
  };

  const updatePositions = () => {
    characters.forEach((el) => {
      el.updatePosition();
    });
  };

  useEffect(() => {
    console.log("render");
    const ctx = canvas.current.getContext("2d");
    mainHero.handleEvents();
    // mainHero2.handleEvents();
    setInterval(() => {
      updateCharacters();
    }, 1000 / 20);
    setInterval(() => {
      draw();
    }, 1000 / 60);
  }, [gameState]);

  return (
    <canvas ref={canvas} id="game__board" width="1000" height="500"></canvas>
  );
}

export default Game;
