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

  refresh(translationNew, ctx, lockMap, translationSpeed) {
    if (!lockMap) this.checkOutOfBounds();
    this.changeTranslation(translationNew, lockMap, translationSpeed);
    this.reallyDraw(ctx);
  }
 
  changeTranslation(amount, lockMap, translationSpeed) {
    const newState = this.state;
    newState.currTranslation = amount;
    if (!lockMap && translationSpeed > 0) {
        if (amount > 128) {
        let offset = Math.ceil((amount - 128) / Config.canvas.distGroundSize);
        newState.currTranslation -= Config.canvas.distGroundSize * offset;
        newState.translationOffset += Config.canvas.distGroundSize * offset;
      }
    }
    this.setState(newState);
  } 

  generate() {
    const newState = this.state;  
    // newState.elements.push(Forest.backgroundAssets[`bg${Math.ceil(Math.random() * Object.keys(Forest.backgroundAssets).length)}`]);
    newState.elements.push(Forest.backgroundAssets.bg2);
    this.setState(newState);
  }

  delete() {
    const newState = this.state;
    newState.elements.shift();
    this.setState(newState);
  } 

  checkOutOfBounds() {
    const newState = this.state;
    // newState.elements.shift();
    const currDistOffsetPx = this.state.translationOffset / 
    (Config.background.translationReductionMultiplier * 
      this.state.translationSpeedReduction);
    if ((currDistOffsetPx) > 
      this.state.elements[0].src.width * this.state.sizeMultiplier) {
        newState.translationOffset -= this.state.elements[0].src.width * this.state.sizeMultiplier  * (Config.background.translationReductionMultiplier * 
          this.state.translationSpeedReduction);
    }
    this.setState(newState);
  }

  clear() {    
    this.state.ctx.clearRect(0, 0, Config.canvas.width + (this.state.realGroundSize * Config.canvas.offsetTiles * 2), Config.canvas.height)
  }

  draw() {
    this.state.elements.forEach((el, index) => {
      this.state.ctx.drawImage(
        el.src,
        index * el.src.width * this.state.sizeMultiplier,
        (0.5 + el.yOffset + this.state.yOffset) * Config.canvas.height,
        el.src.width * this.state.sizeMultiplier,
        el.src.height * this.state.sizeMultiplier,
      )});
  }

  reallyDraw(ctx) {
    ctx.drawImage(
      this.state.displayElement,
      Math.floor((this.state.currTranslation + this.state.translationOffset + (this.state.realGroundSize * Config.canvas.offsetTiles)) / (Config.background.translationReductionMultiplier * this.state.translationSpeedReduction)),
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