import React, { useEffect, useState, useRef } from "react";
import Hero from "../Characters/Hero";
import Forest from "../Worlds/Forest";

function Game() {
  const canvas = useRef(null);

  const [gameState, setGameState] = useState({
    characters: {
      hero: {
        x: 50,
        y: 50 / 2,
        radius: 20,
        animationStep: 0,
        currentAnimation: Hero.animations.attack3,
      },
    },
  });

  const drawCharacters = (ctx) => {
    Object.values(gameState.characters).forEach((el) => {
      ctx.drawImage(
        el.currentAnimation,
        (el.animationStep * el.tileSize) % el.currentAnimation.width,
        0,
        el.tileSize,
        el.tileSize,
        160,
        160,
        el.tileSize,
        el.tileSize
      );
    });
  };

  const draw = () => {
    const ctx = canvas.current.getContext("2d");
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    ctx.drawImage(
      gameState.characters.hero.currentAnimation,
      (gameState.characters.hero.animationStep * 162) %
        gameState.characters.hero.currentAnimation.width,
      0,
      162,
      162,
      0,
      0,
      162,
      162
    );
    // drawCharacters(ctx);
    ctx.beginPath();
  };

  const update = () => {
    console.log(gameState);
    setGameState({
      characters: {
        hero: {
          x: 50,
          y: 50 / 2,
          radius: 20,
          animationStep: gameState.characters.hero.animationStep + 1,
          currentAnimation: Hero.animations.attack3,
        },
      },
    });
    console.log(gameState);
    draw();
  };

  useEffect(() => {
    setInterval(() => {
      update();
    }, 1000 / );
  }, []);

  return (
    <canvas ref={canvas} id="game__board" width="800" height="400"></canvas>
  );
}

export default Game;
