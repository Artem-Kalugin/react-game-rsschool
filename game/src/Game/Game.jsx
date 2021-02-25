import React, { useEffect, useState, useRef } from "react";
import HeroAssets from "../assets/Hero/Hero";
import Hero from "./Characters/Hero";
import Forest from "../assets/World/Forest";
import Config from "../Config/Config";
import GroundRenderer from "./GroundRenderer/GroundRenderer";
import SkyRenderer from "./SkyRenderer/SkyRenderer";

function Game() {
  const canvas = useRef(null);

  const [gameState, setGameState] = useState({
    yAxisGround: Config.world.yAxisGround,
    displaySize: Config.world.displaySize,
    groundLength: Config.canvas.width / Forest.groundSize,
  });
  const [groundState, setGroundState] = useState({
    displayElement: document.createElement("canvas"),
    yAxisGround: Config.world.yAxisGround,
    ground: [],
    additionalElements: [],
    currTranslation: 0,
    realGroundSize: Config.canvas.width * Config.canvas.groundStep,
    mapEnded: false,
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
    translateSpeed: 0,
    reversed: false,
    action: null,
    waitForKeypress: true,
    lockMap: false,
    attackCounter: 2,
  });
  const mainHero = new Hero(hero, setHero);
  const groundRenderer = new GroundRenderer(groundState, setGroundState);
  const skyRenderer = new SkyRenderer(skyState, setSkyState);
  const characters = [];
  const treeLayers = [];
  characters.push(mainHero);

  const drawCharacters = (ctx) => {
    characters.forEach((el) => {
      el.draw(ctx, canvas);
    });
  };

  const drawGround = (ctx) => {
    groundRenderer.refresh(hero.translateSpeed, ctx, hero.lockMap);
  };

  const drawBackground = (ctx) => {
    treeLayers.forEach((el) => {
      el.refresh(
        groundState.currTranslation,
        ctx,
        hero.lockMap,
        hero.translateSpeed
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

  const setHeroMapLock = (val) => {
    const newState = hero;
    newState.lockMap = val;
    setHero(newState);
  };

  useEffect(() => {
    console.log("render");
    console.log(gameState.groundLength);
    groundRenderer.width = canvas.current.width;
    groundRenderer.height = canvas.current.height;
    mainHero.handleEvents();
    groundRenderer.setSize();
    groundRenderer.getContext();
    groundRenderer.generate(200);
    groundRenderer.draw();
    generateTreeLayers();
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
  }, [gameState]);

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
