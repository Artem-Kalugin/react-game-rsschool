import Config from "../../Config/Config";
import HeroAssets from "../../assets/Hero/Hero";

export default class Hero{
  constructor(state, setState) {
    this.state = state;
    this.setState = setState;
    this.yAxisGround = Config.world.yAxisGround;
  }

  draw(ctx, canvas){
    let source =  this.state.currentAnimation;
    if (this.state.reversed) source = source.reversed;
    else source = source.src
    ctx.drawImage(
      source,
      (this.state.animationStep * this.state.tileSize) % source.width,
      0,
      this.state.tileSize,
      this.state.tileSize,
      this.state.x * canvas.current.width - this.state.tileSize,
      (this.yAxisGround + this.state.yOffset) * canvas.current.height -
        this.state.tileSize,
      this.state.tileSize * Config.world.displaySize * this.state.size,
      this.state.tileSize * Config.world.displaySize * this.state.size
    );
  }

  updatePosition() {
    const newHeroState = this.state;
    if (this.state.yOffset > this.state.yBase) {
      newHeroState.yOffset = this.state.yBase;
      newHeroState.jumpSpeed = 0;
      newHeroState.currentAnimation = HeroAssets.animations.idle;
    }
    if (!this.state.action || this.state.jumpSpeed) {
      newHeroState.x += newHeroState.rightSpeed - newHeroState.leftSpeed;
    }
    if (this.state.jumpSpeed !== 0) {
      newHeroState.yOffset =
        newHeroState.yOffset - newHeroState.jumpSpeed * 0.01;
      newHeroState.jumpSpeed -= Config.hero.position.jumpDecreaseRate;
    }
    this.setState(newHeroState);
  }

  updateAnimation() {
    const newHeroState = this.state;
    if (this.state.action === 'attack') {
      if ((this.state.animationStep + 1) !== (this.state.currentAnimation.framesLength)) {
        newHeroState.currentAnimation = HeroAssets.animations.attack3;
        newHeroState.animationStep = (this.state.animationStep + 1) % (this.state.currentAnimation.framesLength + 1);
      } else {
        this.state.action = false;
      }
    } else {
      newHeroState.animationStep = (this.state.animationStep + 1) % (this.state.currentAnimation.framesLength + 1);
      if (newHeroState.rightSpeed || newHeroState.leftSpeed) {
        newHeroState.currentAnimation = HeroAssets.animations.run;
      } 
      if (newHeroState.rightSpeed === newHeroState.leftSpeed) {
        newHeroState.currentAnimation = HeroAssets.animations.idle;
      } 
      if (this.state.jumpSpeed < 0) {
        newHeroState.currentAnimation = HeroAssets.animations.fall;
      } else if (this.state.jumpSpeed > 0) {
        newHeroState.currentAnimation = HeroAssets.animations.jump;
      } 
      if (this.state.rightSpeed > this.state.leftSpeed) {
        newHeroState.reversed = false;
      } else if (this.state.rightSpeed < this.state.leftSpeed){
        newHeroState.reversed = true;
      }
    }
    this.setState(newHeroState);
  }

  Jump() {
    const newHeroState = this.state;
    if (newHeroState.jumpSpeed === 0) {
      newHeroState.jumpSpeed = Config.hero.position.jumpSpeed;
    }
    this.setState(newHeroState);
  };
  
  Fall() {
    const newHeroState = this.state;
    if (newHeroState.jumpSpeed > 0) {
      newHeroState.jumpSpeed =
        newHeroState.jumpSpeed / Config.hero.position.jumpReductionMultiplier;
    }
    this.setState(newHeroState);
  };
  
  Move(dir) {
    const newHeroState = this.state;
    if (dir === 1) {
        newHeroState.rightSpeed = Config.hero.position.speed;
        newHeroState.reversed = false;
    } 
    if (dir === -1) {
        newHeroState.leftSpeed = Config.hero.position.speed;
        newHeroState.reversed = true;
    }
    this.setState(newHeroState);
  };
  
  Attack() {
    const newHeroState = this.state;
    if (!this.state.action && this.state.waitForKeypress) {
      newHeroState.animationStep = 0;
      newHeroState.action = 'attack';
      newHeroState.waitForKeypress = false;
    }
    this.setState(newHeroState);
  }

  StopAttack() {
    const newHeroState = this.state;
    if (!this.state.action) {
      newHeroState.waitForKeypress = true;
    }
    this.setState(newHeroState);
  }
  
  Stop(dir) {
    const newHeroState = this.state;
    if (dir === 1) {
      newHeroState.rightSpeed = 0;
    }
    if (dir === -1) {
      newHeroState.leftSpeed = 0;
    }   
    this.setState(newHeroState);
  };

  handleEvents() {
    document.addEventListener("keydown", (e) => {
      console.log('keydown', e.keyCode);
      if (e.keyCode === 32) this.Jump();
      if (e.keyCode === 39) this.Move(1);
      if (e.keyCode === 37) this.Move(-1);
      if (e.keyCode === 65) this.Attack();
    });
    document.addEventListener("keyup", (e) => {
      console.log('keyup', e.keyCode);
      if (e.keyCode === 32) this.Fall();
      if (e.keyCode === 39) this.Stop(1);
      if (e.keyCode === 37) this.Stop(-1);
      if (e.keyCode === 65) this.StopAttack();
    });
  }
}  