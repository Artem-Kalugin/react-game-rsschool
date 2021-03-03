import Config from "../../Config/Config";
import HoundAssets from "../../assets/Hound/hound";
import SoundEngine from '../SoundEngine/SoundEngine';
import copySoundSource from '../../util/copySoundSource';


export default class Hound{
  constructor(difficulty, giveReward) {
    this.state = {
    positions: {
      x: (1 + (Config.hound.position.xRandom * Math.random())) * Math.random() > 0.5 ? 1 : -1,
      yOffset: Config.hound.position.yBase,
      yBase: Config.hound.position.yBase,
      centerX: 0,
      centerY: 0,
    },
    speed: {
      jump: 0,
      right: 0,
      left: 0,
      y: 0,
    },
    animations: {
      animationStep: 0,
      currentAnimation: HoundAssets.animations.idle,
      reversed: true,
    },
    gameOptions: {
      isDied: false,
      action: false,
      waitForKeypress: true,
    },
    characteristics: {
      maxHealth: Config.hound.characteristics.health * difficulty,
      health: Config.hound.characteristics.health * difficulty,
      damage: 0,
      attackDistance: 180,
      reward: Config.hound.characteristics.reward * difficulty,
    },
    clear: false,
    size: Config.hound.size,
    }
    this.difficulty = difficulty;
    this.giveReward = giveReward;
    this.soundsSource = SoundEngine.hound;
    this.soundsState = copySoundSource(SoundEngine.hound);
    this.yAxisGround = Config.world.yAxisGround;
    // this.Move(-1);
  }

  draw(ctx, canvas){
    let source =  this.state.animations.currentAnimation;
    if (this.state.animations.reversed) source = source.reversed;
    else source = source.src
    ctx.drawImage(
      source,
      (this.state.animations.animationStep * this.state.animations.currentAnimation.tileSizeX) % source.width,
      0,
      this.state.animations.currentAnimation.tileSizeX,
      this.state.animations.currentAnimation.tileSizeY,
      Math.floor(this.state.positions.x * canvas.current.width) - this.state.animations.currentAnimation.tileSizeX,
      Math.floor((this.yAxisGround + this.state.positions.yOffset) * canvas.current.height) -
        this.state.animations.currentAnimation.tileSizeY,
      this.state.animations.currentAnimation.tileSizeX * Config.world.displaySize * this.state.size,
      this.state.animations.currentAnimation.tileSizeY * Config.world.displaySize * this.state.size
    );
    if (this.state.gameOptions.action !== 'die') {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.state.positions.centerX - (Config.game.healthbar.width / 2),
          this.state.positions.centerY - 50,
          Config.game.healthbar.width * this.state.characteristics.health / this.state.characteristics.maxHealth ,
          Config.game.healthbar.height);
      ctx.fill();
    }
  }

  updatePosition(translationPx) {
    this.state.speed.translate = 0;
    this.state.positions.centerX = Math.floor(this.state.positions.x * Config.canvas.width) 
    - (this.state.animations.currentAnimation.tileSizeX / 2) - this.state.animations.currentAnimation.centerXOffset;
    this.state.positions.centerY = Math.floor((this.yAxisGround + this.state.positions.yOffset) * Config.canvas.height) - 
    (this.state.animations.currentAnimation.tileSizeY / 3) - this.state.animations.currentAnimation.centerYOffset;
    this.state.positions.yOffset += this.state.speed.y;
    this.state.positions.x += this.state.speed.right - this.state.speed.left - translationPx / Config.canvas.width;
    if (this.state.positions.yOffset > this.state.positions.yBase) {
      this.state.positions.yOffset = this.state.positions.yBase;
      this.state.speed.jump = 0;
      this.state.gameOptions.blocked = false;
      this.state.animations.currentAnimation = HoundAssets.animations.idle;
    }
    if (this.state.speed.jump !== 0) {
      this.state.positions.yOffset =
      this.state.positions.yOffset - this.state.speed.jump * 0.01;
      this.state.speed.jump -= Config.hero.position.jumpDecreaseRate;
    }
  }

  updateAnimation() {
    if (this.state.gameOptions.action === 'die') {
        this.state.animations.currentAnimation = HoundAssets.animations.death;
        if (this.state.animations.animationStep < 6) {
          this.state.animations.animationStep = this.state.animations.animationStep + 1;
        } else {
          this.state.clear = true;
        }
      } else {
        if (this.state.gameOptions.action !== 'takeHit') {
          this.state.animations.animationStep = (this.state.animations.animationStep + 1) % (this.state.animations.currentAnimation.framesLength);
        }
    } 
    if (this.state.speed.right || this.state.speed.left) {
      this.state.animations.currentAnimation = HoundAssets.animations.run;
    } 
    if (this.state.gameOptions.action !== 'takeHit') {
      if (this.state.speed.right > this.state.speed.left) {
        this.state.animations.reversed = false;
      } else if (this.state.speed.right < this.state.speed.left){
        this.state.animations.reversed = true;
      }
    }
  }
  
  Attack() {
    if (!this.state.gameOptions.action && this.state.gameOptions.waitForKeypress) {
      this.state.animations.animationStep = 0;
      this.state.gameOptions.action = 'attack';
    }
  }

  die() {
    this.state.speed.right = 0;
    this.state.speed.left = 0;
    this.state.speed.y = 0;
    this.state.animations.animationStep = 0;
    this.state.gameOptions.action = 'die';
    this.giveReward(this.state.characteristics.reward)
  }

  StopAttack() {
    this.state.gameOptions.waitForKeypress = true;
  }
 
  changePosition(x2, y2) {
    if (!this.state.isBlocked) {
      this.state.speed.right = 0;
      this.state.speed.left = 0;
      this.state.isBlocked = true;
      let x1 = this.state.positions.centerX;
      if (x1 > x2) {
        this.Move(-1);
      } else {
        this.Move(1);
      }
      if (Math.random() > 0.7) {
        this.Jump();
      }
    setTimeout(() => {
      this.state.speed.right = 0;
      this.state.speed.left = 0;
      this.state.animations.currentAnimation = HoundAssets.animations.idle;
    }, 800 + Math.random() * 2000)
    setTimeout(() => {
      this.state.isBlocked = false;
    }, 2000 + Math.random() * 1000)
    }
  }

  Jump() {
    if (this.state.gameOptions.action !== 'takeHit'){ 
      if (this.state.speed.jump === 0) {
        this.state.speed.jump = Config.hound.position.jumpSpeed;
      }
    }
  };

  Move(dir) {
    if (this.state.gameOptions.action !== 'takeHit') {
      if (dir === 1) {
          this.state.speed.right = Config.hound.position.speed;
          this.state.animations.reversed = false;
      } 
      if (dir === -1) {
          this.state.speed.left = Config.hound.position.speed;
          this.state.animations.reversed = true;
      }
    }
  };

  checkHeroAttackCrossing(hero) {
    return ( (hero.characteristics.damage && this.state.gameOptions.action !== 'takeHit')
      && Math.max(hero.positions.centerX 
      + (hero.animations.reversed? -1 : 1) * hero.characteristics.attackDistance,
      hero.positions.centerX) > this.state.positions.centerX && (
      Math.min(hero.positions.centerX 
      + (hero.animations.reversed? -1 : 1) * hero.characteristics.attackDistance,
      hero.positions.centerX) < this.state.positions.centerX
      ) && ((
      (hero.positions.centerY + hero.characteristics.attackDistance / 2)
      > this.state.positions.centerY) && 
      (hero.positions.centerY - hero.characteristics.attackDistance)
      < this.state.positions.centerY));
  }

  checkIsHeroInteraction(hero) {
    return (Math.abs(hero.positions.centerY - this.state.positions.centerY) < 50 &&
      Math.abs(hero.positions.centerX - this.state.positions.centerX) < 50);
  }

  takeHit(hero) {
    if (this.state.gameOptions.action !== 'takeHit') {
      this.state.speed.right = 0;
      this.state.speed.left = 0;
      this.state.gameOptions.action = 'takeHit';
      !hero.animations.reversed? this.state.speed.right = 0.012 : this.state.speed.left = 0.012;
      this.state.characteristics.health -= hero.characteristics.damage;
      if (this.state.characteristics.health < 0) this.die();
      setTimeout(() => {
        this.state.speed.right = 0;
        this.state.speed.left = 0;
        this.state.isBlocked = false;
      }, 200);
      setTimeout(() => {
        if (this.state.gameOptions.action !== 'die') this.state.gameOptions.action = null;
      }, 300);
    }
  }

  updateSound() {
    let target = null;
    if (this.state.gameOptions.action === 'die') {
      target = 'death'; 
    } else if (this.state.gameOptions.action === 'takeHit') {
      target = 'takeHit';
    } else if (this.state.gameOptions.action === 'attack') {
      target = `attack`;
    } else if (this.state.speed.jump >  Config.hound.position.jumpSpeed * 0.8) {
      target = 'jump';
    } else if ((this.state.speed.right || this.state.speed.left) && (
      this.state.speed.right !== this.state.speed.left
    ) && this.state.positions.yOffset === this.state.positions.yBase) {
      target = 'steps';
    } 
    if (target) {
      this.playSound(target);
      if (target !== 'steps' &&
      target !== 'attack') {
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

  refresh(hero, translationPx, heroTakeHit) {
    if (this.state.gameOptions.action !== 'die') {
      if (this.checkIsHeroInteraction(hero)) {
        heroTakeHit(Config.hound.characteristics.damage * this.difficulty, this.state.positions.centerX);
        this.state.gameOptions.action = 'attack';
        setTimeout(() => {
          if (this.state.gameOptions.action === 'attack') {
            this.state.gameOptions.action = null;
          }
        }, 500); 
      } else {
        if (this.checkHeroAttackCrossing(hero)) {
            this.takeHit(hero);
          } else {
            if (((Math.abs(hero.positions.centerX - this.state.positions.centerX) > 50) ||
              (Math.abs(hero.positions.centerY - this.state.positions.centerY) > 50)) &&
              !this.state.gameOptions.action){
              this.changePosition(hero.positions.centerX, hero.positions.centerY);
            } else {  
              this.Attack();
            }
          }
        }
      }
    this.updatePosition(translationPx);
    this.updateSound();
  }
}  

