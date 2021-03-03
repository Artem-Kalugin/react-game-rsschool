import Config from "../../Config/Config";
import HeroAssets from "../../assets/Hero/Hero";
import UI from '../../assets/Ui/UI';
import SoundEngine from '../SoundEngine/SoundEngine';
import copySoundSource from '../../util/copySoundSource';

export default class Hero{
  constructor(state, setState) {
    this.state = state;
    this.setState = setState;
    this.yAxisGround = Config.world.yAxisGround;
    this.soundsSource = SoundEngine.hero;
    this.soundsState = copySoundSource(SoundEngine.hero);
    this.currTarget = null;
  }

  draw(ctx, canvas){
    let source = this.state.animations.currentAnimation;
    if (this.state.animations.reversed) source = source.reversed;
    else source = source.src
    ctx.drawImage(
      source,
      (this.state.animations.animationStep * this.state.animations.tileSize) % source.width,
      0,
      this.state.animations.tileSize,
      this.state.animations.tileSize,
      Math.floor(this.state.positions.x * canvas.current.width) - this.state.animations.tileSize,
      Math.floor((this.yAxisGround + this.state.positions.yOffset) * canvas.current.height) -
        this.state.animations.tileSize,
      this.state.animations.tileSize * Config.world.displaySize * this.state.size,
      this.state.animations.tileSize * Config.world.displaySize * this.state.size
    );
    if (this.state.gameOptions.action !== 'die') {
      ctx.fillStyle = 'rgb(180, 50, 50)';
      ctx.fillRect(
        0.025 * Config.canvas.width + 25,
        0.025 * Config.canvas.height + 25,
        (UI.assets.healthbar.width / 3.5 - 55) * this.state.characteristics.health / this.state.characteristics.maxHealth, 
        UI.assets.healthbar.height / 3.5 - 50,
      );
      ctx.drawImage(
        UI.assets.healthbar,
        0,
        0,
        UI.assets.healthbar.width,
        UI.assets.healthbar.height,
        0.025 * Config.canvas.width,
        0.025 * Config.canvas.height,
        UI.assets.healthbar.width / 3.5,
        UI.assets.healthbar.height / 3.5
      );
      ctx.fill();
    }
  }

  takeHit(damage, enemiesCenter) {
    const newHeroState = this.state;
    if (!this.state.gameOptions.invulnerable && damage && this.state.gameOptions.action !== 'die') {
      this.soundsState.takeHit.isLocked = false;
      newHeroState.gameOptions.invulnerable = true;
      newHeroState.characteristics.damage = 0;
      newHeroState.characteristics.health -= damage;
      if (newHeroState.characteristics.health > 0) {
        newHeroState.gameOptions.action = 'takeHit';
        newHeroState.speed.jump = 1.5;
        newHeroState.speed.hit =  (this.state.positions.centerX > enemiesCenter? 1 : -1)
        * Config.hero.position.speed / 1.5;
        setTimeout(() => {
          this.state.gameOptions.invulnerable = false;
        }, 750)
      } else {
        this.die();
      }
    }
    this.setState(newHeroState);
  }

  die() {
    const newHeroState = this.state;
    newHeroState.animations.animationStep = 0;
    newHeroState.gameOptions.action = 'die';
    newHeroState.gameOptions.blocked = true;
    newHeroState.speed.left = 0;
    newHeroState.speed.right = 0;
    this.Fall();
    this.setState(newHeroState);
  }

  updatePosition() {
    const newHeroState = this.state;
    newHeroState.positions.centerX = Math.floor(this.state.positions.x * Config.canvas.width);
    newHeroState.positions.centerY = Math.floor((this.yAxisGround + this.state.positions.yOffset) * Config.canvas.height);
    newHeroState.speed.translate = 0;
    if (this.state.positions.yOffset > this.state.positions.yBase) {
      newHeroState.positions.yOffset = this.state.positions.yBase;
      newHeroState.speed.jump = 0;
      newHeroState.speed.hit = 0;
      this.soundsState.jump.isLocked = false;
      this.soundsState.steps.isLocked = false;
      newHeroState.gameOptions.blocked = false;
      if (this.state.gameOptions.action === 'takeHit') {
        this.state.gameOptions.action = null;
      }
    }
    if (!this.state.positions.lockMap) {
      if (newHeroState.positions.x < 0.05 && newHeroState.speed.left && !newHeroState.speed.right ) {
        newHeroState.speed.translate = -2;
        newHeroState.speed.hit = 0;
      } else if (newHeroState.positions.x > 0.35 && newHeroState.speed.right && !newHeroState.speed.left) {
        newHeroState.speed.translate = 2;
        newHeroState.speed.hit = 0;
      } else {
        if  (newHeroState.speed.hit) {
          newHeroState.positions.x += newHeroState.speed.hit;
        } else {
          newHeroState.positions.x += newHeroState.speed.right - newHeroState.speed.left;
        }
      }
    } else {
      if (newHeroState.positions.x < 0.1 && newHeroState.speed.left && !newHeroState.speed.right ) {
        newHeroState.speed.translate = -2;
        newHeroState.speed.hit = 0;
      } else if (newHeroState.positions.x > 0.9 && newHeroState.speed.right && !newHeroState.speed.left) {
        newHeroState.speed.translate = 2;
        newHeroState.speed.hit = 0;
      } else {
        if  (newHeroState.speed.hit) {
          newHeroState.positions.x += newHeroState.speed.hit;
        } else {
          newHeroState.positions.x += newHeroState.speed.right - newHeroState.speed.left;
        }
      }
    }
    if (newHeroState.positions.x < 0.02) {
      newHeroState.positions.x = 0.02;
    }
    if (newHeroState.positions.x > 0.98) {
      newHeroState.positions.x = 0.98;
    }
    if (this.state.speed.jump !== 0) {
      newHeroState.positions.yOffset =
        newHeroState.positions.yOffset - newHeroState.speed.jump * 0.01;
      newHeroState.speed.jump -= Config.hero.position.jumpDecreaseRate;
    }
    this.updateSound();
    this.setState(newHeroState);
  }

  Center(){
    const newHeroState = this.state;
    newHeroState.gameOptions.action = 'centring';
    this.setState(newHeroState);
  }

  updateAnimation() {
    const newHeroState = this.state;
    if (this.state.gameOptions.action === 'die') {
      if ((this.state.animations.animationStep + 1) !== (this.state.animations.currentAnimation.framesLength)) {
        newHeroState.animations.currentAnimation = HeroAssets.animations.death;
        newHeroState.animations.animationStep = (this.state.animations.animationStep + 1) % (this.state.animations.currentAnimation.framesLength + 1);
      } else {
      }
    } else if (this.state.gameOptions.action === 'attack') {
      if ((this.state.animations.animationStep + 1) !== (this.state.animations.currentAnimation.framesLength)) {
        newHeroState.animations.currentAnimation = HeroAssets.animations[`attack${newHeroState.animations.attackCounter + 1}`];
        newHeroState.animations.animationStep = (this.state.animations.animationStep + 1) % (this.state.animations.currentAnimation.framesLength + 1);
      } else {
        setTimeout(() => {
          newHeroState.characteristics.damage = 0;
          newHeroState.gameOptions.action = false;
          this.setState(newHeroState);
        },20)
        setTimeout(() => {
          if (this.state.gameOptions.action !== 'attack') newHeroState.gameOptions.attackCounter = 2;
          this.setState(newHeroState);
        }, 2500);
      }
    } else {
      newHeroState.animations.animationStep = (this.state.animations.animationStep + 1) % (this.state.animations.currentAnimation.framesLength);
      if (newHeroState.speed.right || newHeroState.speed.left) {
        newHeroState.animations.currentAnimation = HeroAssets.animations.run;
      } 
      if (newHeroState.speed.right === newHeroState.speed.left) {
        newHeroState.animations.currentAnimation = HeroAssets.animations.idle;
      } 
      if (this.state.speed.jump < 0) {
        newHeroState.animations.currentAnimation = HeroAssets.animations.fall;
      } else if (this.state.speed.jump > 0) {
        newHeroState.animations.currentAnimation = HeroAssets.animations.jump;
      } 
      if (this.state.speed.right > this.state.speed.left) {
        newHeroState.animations.reversed = false;
      } else if (this.state.speed.right < this.state.speed.left){
        newHeroState.animations.reversed = true;
      }
    }
    this.setState(newHeroState);
  }

  Jump() {
    if (!this.state.gameOptions.blocked) {
      if (this.state.gameOptions.action !== 'takeHit'){ 
        const newHeroState = this.state;
        if (newHeroState.speed.jump === 0) {
          newHeroState.speed.jump = Config.hero.position.jumpSpeed;
        }
        this.setState(newHeroState);
      }
    }
  };
  
  Fall() {
    const newHeroState = this.state;
    if (newHeroState.speed.jump > 0) {
      newHeroState.speed.jump /= Config.hero.position.jumpReductionMultiplier;
    }
    this.setState(newHeroState);
  };
  
  Move(dir) {
    const newHeroState = this.state;
    this.soundsState.steps.isLocked = false;
    if (dir === 1) {
        newHeroState.speed.right = Config.hero.position.speed;
        newHeroState.animations.reversed = false;
    } 
    if (dir === -1) {
        newHeroState.speed.left = Config.hero.position.speed;
        newHeroState.animations.reversed = true;
    }
    this.setState(newHeroState);
  };

  autoplay(enemies) {
    if (this.state.gameOptions.action !== 'die') {
      if (this.currTarget) {
        if (this.currTarget.clear || this.currTarget.state.characteristics.health < 0) this.currTarget = null;
      }
      if (enemies.length === 0) {
        this.Move(1);
      } else {
        this.Stop(1);
        this.Stop(-1);
        this.getNewTarget(enemies);
        if (this.currTarget) {
          if (this.currTarget.state.positions.centerX > 
          this.state.positions.centerX) this.state.animations.reversed = false;
          else this.state.animations.reversed = true;
          console.log(this.currTarget, this.state.animations.reversed);
          if (Math.abs(this.currTarget.state.positions.centerX - this.state.positions.centerX) < 200) {
            this.Attack();
            this.StopAttack();
          }
          if (Math.abs(this.currTarget.state.positions.centerX - this.state.positions.centerX) < 50) {
            this.Move(this.currTarget.state.speed.right > 0 ? 1 : -1);
          }
          if (this.state.positions.centerX 
            - this.currTarget.state.positions.centerX > 150 ) {
              this.Move(-1);
          } else if (this.state.positions.centerX 
            - this.currTarget.state.positions.centerX < -150 ) {
              this.Move(1);
          } else if (Math.abs(this.state.positions.centerY
            - this.currTarget.state.positions.centerY) > 150) {
              this.Jump();
          } else if (Math.abs(this.state.positions.centerY
            - this.currTarget.state.positions.centerY) < 50) {
              this.Fall();
          }
        }
      }
    }
  }

  getNewTarget(enemies) {
    let filterEnemies = enemies.filter((el) => {
      return ((el.state.positions.centerX > 200 && el.state.positions.centerX < 900) && (
        Math.abs(el.state.positions.centerY - this.state.positions.centerY) < 200))
    });
    if (filterEnemies.length > 0) {
      enemies.sort((a, b) => {
        return Math.abs(this.state.positions.centerX - a.state.positions.centerX) -
        Math.abs(this.state.positions.centerX - b.state.positions.centerX);
      });
      this.currTarget = filterEnemies[0];
    }
    else if (this.state.positions.x < 0.45) {
      this.Move(1);
    } else if (this.state.positions.x > 0.55) {
      this.Move(-1);
    }
  }
  
  Attack() {
    if (!this.state.gameOptions.blocked) {
      const newHeroState = this.state;
      if (!this.state.gameOptions.action && this.state.gameOptions.waitForKeypress) {
        this.soundsState.steps.isLocked = false;
        newHeroState.animations.animationStep = 0;
        newHeroState.gameOptions.action = 'attack';
        newHeroState.characteristics.damage = Config.hero.damage;
        newHeroState.gameOptions.waitForKeypress = false;
        newHeroState.animations.attackCounter = (newHeroState.animations.attackCounter + 1) % 3;
        this.soundsState[`attack${newHeroState.animations.attackCounter + 1}`].isLocked = false;
      }
      this.setState(newHeroState);
    }
  }

  StopAttack() {
    const newHeroState = this.state;
    newHeroState.gameOptions.waitForKeypress = true;
    this.setState(newHeroState);
  }

  updateSound() {
    let target = null;
    if (this.state.gameOptions.action === 'die') {
      target = 'death'; 
    } else if (this.state.gameOptions.action === 'takeHit') {
      target = 'takeHit';
    } else if (this.state.gameOptions.action === 'attack') {
      target = `attack${this.state.animations.attackCounter + 1}`;
    } else if (this.state.speed.jump > 2.9) {
      target = 'jump';
    } else if ((this.state.speed.right || this.state.speed.left) && (
      this.state.speed.right !== this.state.speed.left
    ) && this.state.positions.yOffset === this.state.positions.yBase) {
      target = 'steps';
    } 
    if (target) {
      this.playSound(target);
      if (target !== 'steps') {
        this.soundsState[target].isLocked = true;
      }
    }
  }
  
  playSound(target) {
    if (this.soundsState[target].isLocked !== true &&
      this.soundsState[target].isPlayed !== true) {
      this.soundsState[target].isPlayed = true;
      SoundEngine.play(this.soundsSource[target], this.state.positions.x);
      setTimeout(() => {
        this.soundsState[target].isPlayed = false;
      }, this.soundsSource[target].src.duration * 1000)
    }
  }

  Stop(dir) {
    const newHeroState = this.state;
    if (dir === 1) {
      newHeroState.speed.right = 0;
    }
    if (dir === -1) {
      newHeroState.speed.left = 0;
    }   
    this.setState(newHeroState);
  };

  handleEvents() {
    document.addEventListener("keydown", (e) => {
      if (this.state.gameOptions.action !== 'die') {
        if (e.keyCode === 32) this.Jump();
        if (e.keyCode === 68) this.Move(1);
        if (e.keyCode === 65) this.Move(-1);
        if (e.keyCode === 83) this.Attack();
      }
    });
    document.addEventListener("keyup", (e) => {
      if (e.keyCode === 32) this.Fall();
      if (e.keyCode === 68) this.Stop(1);
      if (e.keyCode === 65) this.Stop(-1);
      if (e.keyCode === 83) this.StopAttack();
    });
  }
}  