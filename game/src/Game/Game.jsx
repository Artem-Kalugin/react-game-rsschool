import React, { useEffect, useState, useRef } from "react";
import HeroAssets from "../assets/Hero/Hero";
import Hero from "./Characters/Hero";
import Forest from "../assets/World/Forest";
import Config from "../Config/Config";
import GroundRenderer from "./GroundRenderer/GroundRenderer";
import SkyRenderer from "./SkyRenderer/SkyRenderer";
import Demon from "./Characters/Demon";
import Hound from "./Characters/Hound";
import Skeleton from "./Characters/Skeleton";

function Game() {
  const canvas = useRef(null);

  // const [gameState, setGameState] = useState({
  //   yAxisGround: Config.world.yAxisGround,
  //   displaySize: Config.world.displaySize,
  //   groundLength: Config.canvas.width / Forest.groundSize,
  //   opacity: 1,
  // });
  const [groundState, setGroundState] = useState({
    displayElement: document.createElement("canvas"),
    yAxisGround: Config.world.yAxisGround,
    ground: [],
    additionalElements: [],
    currTranslation: 0,
    realGroundSize: Config.canvas.width * Config.canvas.groundStep,
    mapEnded: false,
    translationPx: 0,
  });
  const [skyState, setSkyState] = useState({
    displayElement: document.createElement("canvas"),
    yAxisGround: Config.world.yAxisGround,
    elements: [],
    currTranslation: 0,
    translationOffset: 0,
    realGroundSize: Config.canvas.width * Config.canvas.groundStep,
    mapEnded: false,
  });
  const [TreeLayer1, setTreeLayes1] = useState({
    displayElement: document.createElement("canvas"),
    yAxisGround: Config.world.yAxisGround,
    elements: [],
    currTranslation: 0,
    translationOffset: 0,
    realGroundSize: Config.canvas.width * Config.canvas.groundStep,
    mapEnded: false,
    yOffset: -0.15,
    sizeMultiplier: 2.2,
    translationSpeedReduction: 0.9,
  });
  const [TreeLayer2, setTreeLayes2] = useState({
    displayElement: document.createElement("canvas"),
    yAxisGround: Config.world.yAxisGround,
    elements: [],
    currTranslation: 0,
    translationOffset: 4000,
    realGroundSize: Config.canvas.width * Config.canvas.groundStep,
    mapEnded: false,
    yOffset: -0.075,
    sizeMultiplier: 1.4,
    translationSpeedReduction: 0.5,
  });
  const [TreeLayer3, setTreeLayes3] = useState({
    displayElement: document.createElement("canvas"),
    yAxisGround: Config.world.yAxisGround,
    elements: [],
    currTranslation: 0,
    translationOffset: 6000,
    realGroundSize: Config.canvas.width * Config.canvas.groundStep,
    mapEnded: false,
    yOffset: -0.05,
    sizeMultiplier: 1.1,
    translationSpeedReduction: 0.2,
  });
  let [gameState, setGameState] = useState({
    currentDistance: 0,
    distanceOffset: 0,
    money: 0,
    previousEnemiesDistanceSpawn: 0,
  });
  let [enemies, setEnemies] = useState([]);
  const [hero, setHero] = useState({
    positions: {
      x: Config.hero.position.xBase,
      yOffset: Config.hero.position.yBase,
      yBase: Config.hero.position.yBase,
      lockMap: false,
      centerX: 200,
      centerY: 200,
    },
    speed: {
      jump: 0,
      right: 0,
      left: 0,
      translate: 0,
      hit: 0,
    },
    animations: {
      animationStep: 0,
      tileSize: HeroAssets.tileSize,
      currentAnimation: HeroAssets.animations.idle,
      reversed: false,
      attackCounter: 2,
    },
    gameOptions: {
      isDied: false,
      action: null,
      waitForKeypress: true,
      blocked: false,
    },
    characteristics: {
      maxHealth: 100,
      health: 100,
      damage: 0,
      attackDistance: 150,
    },
    size: Config.hero.size,
  });
  const mainHero = new Hero(hero, setHero);
  const groundRenderer = new GroundRenderer(groundState, setGroundState);
  const skyRenderer = new SkyRenderer(skyState, setSkyState);
  let characters = [];
  const treeLayers = [];
  characters.push(mainHero);

  const drawCharacters = (ctx) => {
    enemies.forEach((el) => {
      el.draw(ctx, canvas);
    });
    characters.forEach((el) => {
      el.draw(ctx, canvas);
    });
  };

  const drawGround = (ctx) => {
    groundRenderer.refresh(hero.speed.translate, ctx, hero.positions.lockMap);
  };

  const drawBackground = (ctx) => {
    treeLayers.forEach((el) => {
      el.refresh(
        groundState.currTranslation,
        ctx,
        hero.positions.lockMap,
        hero.speed.translate
      );
    });
  };

  const generateTreeLayers = () => {
    const TreeLayerRenderer1 = new SkyRenderer(TreeLayer1, setTreeLayes1);
    treeLayers.push(TreeLayerRenderer1);
    TreeLayerRenderer1.getContext();
    TreeLayerRenderer1.setSize();
    TreeLayerRenderer1.generate();
    TreeLayerRenderer1.generate();
    TreeLayerRenderer1.generate();
    TreeLayerRenderer1.generate();
    TreeLayerRenderer1.draw();
    const TreeLayerRenderer2 = new SkyRenderer(TreeLayer2, setTreeLayes2);
    TreeLayerRenderer2.getContext();
    TreeLayerRenderer2.setSize();
    TreeLayerRenderer2.generate();
    TreeLayerRenderer2.generate();
    TreeLayerRenderer2.generate();
    TreeLayerRenderer2.generate();
    TreeLayerRenderer2.draw();
    treeLayers.push(TreeLayerRenderer2);
    const TreeLayerRenderer3 = new SkyRenderer(TreeLayer3, setTreeLayes3);
    TreeLayerRenderer3.getContext();
    TreeLayerRenderer3.setSize();
    TreeLayerRenderer3.generate();
    TreeLayerRenderer3.generate();
    TreeLayerRenderer3.generate();
    TreeLayerRenderer3.generate();
    TreeLayerRenderer3.draw();
    treeLayers.push(TreeLayerRenderer3);
  };

  const drawSky = (ctx) => {
    ctx.drawImage(
      Forest.assets.sky,
      0,
      0,
      canvas.current.width,
      canvas.current.height
    );
  };

  const draw = () => {
    const ctx = canvas.current.getContext("2d");
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    updatePositions();
    drawSky(ctx);
    drawBackground(ctx);
    drawGround(ctx);
    drawCharacters(ctx);
    drawInterface(ctx);
    ctx.beginPath();
  };

  const drawInterface = (ctx) => {
    ctx.fillStyle = "white";
    ctx.font = "18px serif";
    ctx.fillText(
      `Distance: ${gameState.currentDistance.toFixed()}m`,
      canvas.current.width - 120,
      52
    );
    ctx.fillText(`Money: ${gameState.money}`, canvas.current.width - 120, 74);
  };

  const updateCharacters = () => {
    characters.forEach((el) => {
      el.updateAnimation();
    });
    enemies.forEach((el, index) => {
      el.updateAnimation();
    });
  };

  const updatePositions = () => {
    enemies = enemies.filter((el) => !el.state.clear);
    enemies.forEach((el) => {
      el.refresh(
        hero,
        groundState.translationPx,
        mainHero.takeHit.bind(mainHero)
      );
    });
    characters.forEach((el) => {
      el.updatePosition();
    });
    countGround();
    if (enemies.length === 0) {
      if (checkDistance()) {
        spawnEnemies();
      }
      setHeroMapLock(false);
    } else {
      setHeroMapLock(true);
    }
    setEnemies(enemies);
  };

  const spawnEnemies = () => {
    console.log("spawning enemies");
    const difficulty =
      gameState.currentDistance /
        (Config.difficulty.maxEnemies * Config.difficulty.distancePerEnemy) +
      1;
    let amount =
      (gameState.currentDistance %
        (Config.difficulty.maxEnemies * Config.difficulty.distancePerEnemy)) /
        Config.difficulty.distancePerEnemy +
      1;
    if (
      amount <
      Config.difficulty.maxEnemies - Config.difficulty.enemiesRandomizator
    ) {
      amount += Math.round(
        Config.difficulty.enemiesRandomizator * Math.random()
      );
    }
    for (let i = 0; i < amount; i++) {
      // eslint-disable-next-line no-loop-func
      setTimeout(() => {
        enemies.push(
          new [Hound, Skeleton, Demon][Math.floor(Math.random() * 3)](
            difficulty,
            giveReward
          )
        );
      }, 2000 * Math.random());
    }
  };

  const checkDistance = () => {
    let newGameState = gameState;
    console.log("checking distance");
    console.log();
    if (
      newGameState.currentDistance - newGameState.previousEnemiesDistanceSpawn >
      Config.difficulty.distancePerEnemy +
        Config.difficulty.distancePerEnemy * Math.random()
    ) {
      console.log("distance for enemy");
      console.log(enemies.length === 0);
      newGameState.previousEnemiesDistanceSpawn = newGameState.currentDistance;
      setGameState(newGameState);
      if (Math.random() > 0.6) {
        console.log("distance has returned true");
        return true;
      } else {
        console.log("distance has returned false");
      }
    }
    return false;
  };

  const setHeroMapLock = (val) => {
    const newState = hero;
    newState.positions.lockMap = val;
    setHero(newState);
  };

  const giveReward = (reward) => {
    let newGameState = gameState;
    newGameState.money += Math.floor(reward);
    setGameState(newGameState);
  };

  const countGround = () => {
    const newGameState = gameState;
    if (groundState.translationPx > 0 && hero.positions.lockMap !== true) {
      if (newGameState.distanceOffset < 0) {
        newGameState.distanceOffset += groundState.translationPx;
      } else {
        newGameState.currentDistance +=
          groundState.translationPx.toFixed(2) / 100;
      }
    } else {
      newGameState.distanceOffset -= groundState.translationPx;
    }
    setGameState(newGameState);
  };

  useEffect(() => {
    console.log("render");
    groundRenderer.width = canvas.current.width;
    groundRenderer.height = canvas.current.height;
    mainHero.handleEvents();
    groundRenderer.setSize();
    groundRenderer.getContext();
    groundRenderer.generate(200);
    groundRenderer.draw();
    generateTreeLayers();
    enemies.push(new Skeleton(1, giveReward));
    // mainHero2.handleEvents();
    // setTimeout(() => {
    //   setHeroMapLock(true);
    // }, 1000);
    // setTimeout(() => {
    //   setHeroMapLock(false);
    // }, 7500);
    setInterval(() => {
      updateCharacters();
    }, 1000 / 20);
    setInterval(() => {
      draw();
    }, 1000 / 60);
  }, []);

  return (
    <canvas
      ref={canvas}
      id="game__board"
      width={Config.canvas.width}
      height={Config.canvas.height}
    ></canvas>
  );
}

export default Game;
