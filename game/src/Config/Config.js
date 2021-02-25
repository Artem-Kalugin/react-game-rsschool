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
    animationIdleDelay: 0,
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
  background: {
    translationReductionMultiplier: 15,
  }
}

export default Config;