const Config = {
  hero :{
    size: 1.3,
    position: { 
      yBase: -0.04,
      xBase: 0.3,
      speed: 0.01,
      jumpSpeed: 3,
      jumpDecreaseRate: 0.09,
      jumpReductionMultiplier: 2.5,
    },
    damage: 40,
    animationIdleDelay: 0,
  },
  demon :{
    size: 0.8,
    position: { 
      yBase: -1.00,
      yRandom: -0.5,
      xBase: 0.7,
      speed: 0.0055,
      jumpSpeed: 2,
      jumpDecreaseRate: 0.09,
      jumpReductionMultiplier: 2.5,
    },
    characteristics: {
      health: 120,
      damage: 35,
      reward: 10,
    },
  },
  pan: {
    reductionMultiplier: 0.5,
  },
  hound :{
    size: 1.3,
    position: { 
      yBase: -0.03,
      xBase: 1,
      xRandom: 0.5,
      speed: 0.01,
      jumpSpeed: 2,
      jumpDecreaseRate: 0.09,
      jumpReductionMultiplier: 2.5,
    },
    characteristics: {
      health: 50,
      damage: 15,
      reward: 2,
    },
  },
  skeleton :{
    size: 1.1,
    position: { 
      yBase: -0.01,
      xBase: 1,
      xRandom: 0.5,
      speed: 0.0045,
      jumpSpeed: 2,
      jumpDecreaseRate: 0.09,
      jumpReductionMultiplier: 2.5,
    },
    characteristics: {
      health: 160,
      damage: 25,
      reward: 5,
    },
  },
  world :{
    displaySize: 1.5,
    yAxisGround: 0.765,
    groundDepth: 2,
    rareSurfaceRandThreshold: 0.9,
  },
  canvas :{
    width: 1000,
    height: 500,
    groundStep: 1 / 15.625,
    prerenderWidthMultiplier: 3,
    offsetTiles: 2,
    distGroundSize: 1000 / 15.625,
  },
  game: {
    healthbar: {
      width: 50,
      height: 5,
      color: 'red',
    },
  },
  background: {
    translationReductionMultiplier: 15,
  },
  difficulty: {
    maxEnemies: 8,
    distancePerEnemy: 10,
    enemiesRandomizator: 7,
  }
}

export default Config;