import React, { useEffect, useState, useRef } from "react";
import Hero from "../Characters/Hero";
import Forest from "../Worlds/Forest";

function Game() {
  const canvas = useRef(null);

  const [gameState, setGameState] = useState({
    displaySize: 1.5,
    groundLength: 800 / (Forest.groundSize * Forest.groundSizeMultiplier),
  });
  const [enemies, setEnemies] = useState([]);
  const [hero, setHero] = useState({
    x: 0.2,
    y: 0.8,
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
            el.y * canvas.current.height - el.tileSize,
            el.tileSize * gameState.displaySize,
            el.tileSize * gameState.displaySize
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

    for (let i = 0; i < gameState.groundLength; i++) {
      ctx.drawImage(
        Forest.assets.ground,
        32 * 14,
        0,
        32,
        32,
        groundStep * i * canvas.current.width,
        0.785 * canvas.current.height,
        Forest.groundSize * gameState.displaySize * Forest.groundSizeMultiplier,
        Forest.groundSize * gameState.displaySize * Forest.groundSizeMultiplier
      );
    }
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < gameState.groundLength; i++) {
        ctx.drawImage(
          Forest.assets.ground,
          32 * 15,
          0,
          32,
          32,
          groundStep * i * canvas.current.width,
          (0.785 + 0.05 * (j + 1)) * canvas.current.height,
          Forest.groundSize *
            gameState.displaySize *
            Forest.groundSizeMultiplier,
          Forest.groundSize *
            gameState.displaySize *
            Forest.groundSizeMultiplier
        );
      }
    }
  };

  const draw = () => {
    const ctx = canvas.current.getContext("2d");
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    // ctx.drawImage(
    //   gameState.characters.hero.currentAnimation,
    //   (gameState.characters.hero.animationStep * 162) %
    //     gameState.characters.hero.currentAnimation.width,
    //   0,
    //   162,
    //   162,
    //   gameState.characters.hero.x,
    //   gameState.characters.hero.y,
    //   162,
    //   162
    // );
    drawWorld(ctx);
    drawCharacters(ctx);
    ctx.beginPath();
  };

  const updateCharacters = () => {
    setHero((hero, hero.animationStep++));
  };

  useEffect(() => {
    console.log("update");
    console.log(hero);
  });

  useEffect(() => {
    console.log("render");
    setInterval(() => {
      updateCharacters();
    }, 1000 / 15);
    setInterval(() => {
      draw();
    }, 1000 / 30);
  }, [gameState]);

  return (
    <canvas ref={canvas} id="game__board" width="1200" height="600"></canvas>
  );
}

export default Game;
