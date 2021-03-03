import Config from "../../Config/Config";
import Forest from "../../assets/World/Forest";

export default class OffscreenRenderer{
  constructor(state, setState) {
    this.state = state;
    this.setState = setState;
  }
 
  setSize() {
    const newState = this.state;
    newState.displayElement.width = Config.canvas.width * Config.canvas.prerenderWidthMultiplier;
    newState.displayElement.height = Config.canvas.height;
    this.setState(newState);
  }

  getContext(){
    const newState = this.state;
    newState.ctx = newState.displayElement.getContext('2d');
    this.setState(newState);
  }

  refresh(translateSpeed, ctx, lockMap) {
    this.setTranslation(translateSpeed, lockMap);
    this.reallyDraw(ctx);
  }
 
  changeTranslation(amount) {
    const newState = this.state;
    newState.currTranslation += amount;
    this.setState(newState);
  } 

  setTranslation(translateSpeed, lockMap){
    this.state.translationPx = 0;
    if (translateSpeed) {
      const newState = this.state;
      let translationPx = translateSpeed * (Config.canvas.width / 180 );
      if (lockMap)  {
        if ((newState.currTranslation > ((Config.canvas.prerenderWidthMultiplier - 1) 
        * Config.canvas.width - (Config.canvas.distGroundSize * 5))
        && translationPx > 0) || ((newState.currTranslation < 0 && translationPx < 0))) {
          newState.mapEnded = true;
        } else {
          this.state.translationPx = translationPx;
          this.changeTranslation(translationPx);
        }
      } else {
        if (newState.currTranslation > (Config.canvas.distGroundSize * Config.canvas.offsetTiles) && translationPx > 0) {
          let offsetAmount = Math.round(newState.currTranslation / Config.canvas.distGroundSize) - 1;
          this.clear();
          this.delete(offsetAmount);
          this.generate(offsetAmount);
          this.draw();
        } else if (newState.currTranslation < -(Config.canvas.distGroundSize * 1) && translationPx < 0) {
          newState.mapEnded = true;
        } else {
          this.state.translationPx = translationPx;
          this.changeTranslation(translationPx);
        }
      }
      this.setState(newState);
    }
  }

  generate(num) {
    const newState = this.state;
    for (let i = 0; i < num; i++) {
      const groundLine = [];
      if (Math.random() > Config.world.rareSurfaceRandThreshold) {
        groundLine.push(Forest.surfaceOutRare[Math.floor((Forest.surfaceOutRare.length) * Math.random())]);
      } else {
        groundLine.push(Forest.surfaceOut[Math.floor((Forest.surfaceOut.length) * Math.random())]);
      }
      for(let i = 1; i < Config.world.groundDepth; i++){
        if (Math.random() > Config.world.rareSurfaceRandThreshold) {
          groundLine.push(Forest.surfaceInRare[Math.floor((Forest.surfaceInRare.length) * Math.random())]);
        } else {
          groundLine.push(Forest.surfaceIn[Math.floor((Forest.surfaceIn.length) * Math.random())]);
        }
      }
      newState.ground.push(groundLine);
    }
    this.setState(newState);
  }

  delete(num) {
    const newState = this.state;
    this.changeTranslation(num * -Config.canvas.distGroundSize);
    for(let i = 0; i < num; i++) {
      newState.ground.shift();
    }
    this.setState(newState);
  }

  clear() {    
    this.state.ctx.clearRect(0, 0, Config.canvas.width + (Config.canvas.distGroundSize * Config.canvas.offsetTiles * 2), Config.canvas.height)
  }

  draw() {
    this.state.ground.forEach((el, x) => {
      el.forEach((tile, y) => {
        this.state.ctx.drawImage(
          Forest.assets.ground,
          Forest.groundSize * tile[0],
          Forest.groundSize * tile[1],
          Forest.groundSize,
          Forest.groundSize,
          Config.canvas.distGroundSize * x,
          Math.floor((this.state.yAxisGround + 0.12 * (y)) * Config.canvas.height),
          Forest.groundSize,
          Forest.groundSize,
        )
      })
    })
  }

  reallyDraw(ctx) {
    ctx.drawImage(
      this.state.displayElement,
      Math.floor(this.state.currTranslation) + (Config.canvas.distGroundSize * Config.canvas.offsetTiles),
      0,
      Config.canvas.width,
      Config.canvas.height,
      0,
      0,
      Config.canvas.width,
      Config.canvas.height,
      )
  } 
}  