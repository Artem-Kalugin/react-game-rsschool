import Config from "../../Config/Config";
import DemonAssets from "../../assets/Demon/demon";
import SoundEngine from '../SoundEngine/SoundEngine';
import copySoundSource from '../../util/copySoundSource';

export default class Demon{
  constructor(difficulty, giveReward) {
    this.state = {
    positions: {
      x: 1.2 * Math.random(),
      yOffset: Config.demon.position.yBase + Math.random() * Config.demon.position.yRandom,
      yBase: Config.demon.position.yBase,
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
      currentAnimation: DemonAssets.animations.idle,
      reversed: true,
    },
    gameOptions: {
      isDied: false,
      action: false,
      waitForKeypress: true,
    },
    characteristics: {
      maxHealth: Config.demon.characteristics.health * difficulty,
      health: Config.demon.characteristics.health * difficulty,
      damage: 0,
      attackDistance: 180,
      reward: Config.demon.characteristics.reward * difficulty,
    },
    clear: false,
    size: Config.demon.size,
    }
    this.difficulty = difficulty;
    this.giveReward = giveReward;
    this.yAxisGround = Config.world.yAxisGround;
    this.soundsSource = SoundEngine.demon;
    this.soundsState = copySoundSource(SoundEngine.demon);
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
  }

  updateAnimation() {
    if (this.state.gameOptions.action !== 'takeHit') {
      if (this.state.gameOptions.action === 'attack') {
        if ((this.state.animations.animationStep + 1) !== (this.state.animations.currentAnimation.framesLength)) {
          if (this.state.animations.animationStep > 7) {
            this.state.characteristics.damage = Config.demon.characteristics.damage * this.difficulty;
          }
          this.state.animations.currentAnimation = DemonAssets.animations.attack
          this.state.animations.animationStep = (this.state.animations.animationStep + 1) % (this.state.animations.currentAnimation.framesLength + 1);
        } else {
          this.state.characteristics.damage = 0;
          this.state.gameOptions.action = false;
          this.state.animations.currentAnimation = DemonAssets.animations.idle;
        }
      } else if (this.state.gameOptions.action === 'die') {
        this.state.animations.currentAnimation = DemonAssets.animations.death;
        if (this.state.animations.animationStep < 6) this.state.animations.animationStep = this.state.animations.animationStep + 1;
        else this.state.clear = true;
      } else {
        this.state.animations.animationStep = (this.state.animations.animationStep + 1) % (this.state.animations.currentAnimation.framesLength);
      }
    }
  }
  
  Attack() {
    if (!this.state.gameOptions.action && this.state.gameOptions.waitForKeypress) {
      this.soundsState.attack.isLocked = false;
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
    this.giveReward(this.state.characteristics.reward);
  }

  StopAttack() {
    this.state.gameOptions.waitForKeypress = true;
  }
 
  calculateSpeed(x2, y2) {
    if (this.state.gameOptions.action !== 'die') {
      this.soundsState.steps.isLocked = false;
      let x1 = this.state.positions.centerX;
      let y1 = this.state.positions.centerY;
      let xDifference = x1 - x2;
      let yDifference = y1 - y2;
      let distanceDifference = Math.sqrt(xDifference ** 2 + yDifference **2); 
      let sinA = Math.sin(xDifference / distanceDifference);
      let sinB = Math.sin(yDifference / distanceDifference);
      if (sinA < 0) {
      this.state.speed.right = -sinA * Config.demon.position.speed;
      } else if (sinA > 0) this.state.speed.left = sinA * Config.demon.position.speed;
      if (sinB) this.state.speed.y = -sinB * Config.demon.position.speed;
    }
  }

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

  checkIsHeroOnAttackDistance(hero) {
    return (this.state.characteristics.damage
      && Math.max(this.state.positions.centerX 
      + (this.state.animations.reversed? -1 : 1) * this.state.characteristics.attackDistance,
      this.state.positions.centerX) > hero.positions.centerX && (
      Math.min(this.state.positions.centerX 
      + (this.state.animations.reversed? -1 : 1) * this.state.characteristics.attackDistance,
      this.state.positions.centerX) < hero.positions.centerX
      ) && ((
      (this.state.positions.centerY + this.state.characteristics.attackDistance / 2 + 20)
      > hero.positions.centerY) && 
      (this.state.positions.centerY - this.state.characteristics.attackDistance / 3)
      < hero.positions.centerY));
  }

  checkIsHeroInteraction(hero) {
    return (Math.abs(hero.positions.centerY - this.state.positions.centerY) < 50 &&
      Math.abs(hero.positions.centerX - this.state.positions.centerX) < 50);
  }

  takeHit(hero) {
    if (this.state.gameOptions.action !== 'takeHit') {
      this.soundsState.takeHit.isLocked = false;
      this.state.gameOptions.action = 'takeHit';
      !hero.animations.reversed? this.state.speed.right = 0.007 : this.state.speed.left = 0.007;
      this.state.characteristics.health -= hero.characteristics.damage;
      if (this.state.characteristics.health < 0) {
        this.die();
      } else {
        setTimeout(() => {
          this.state.speed.right = 0;
          this.state.speed.left = 0;
        }, 200);
        setTimeout(() => {
          if (this.state.gameOptions.action !== 'die') this.state.gameOptions.action = null;
        }, 300);
      }
    }
  }

  updateSound() {
    let target = null;
    if (this.state.gameOptions.action === 'die') {
      target = 'death'; 
    } else if (this.state.gameOptions.action === 'takeHit') {
      target = 'takeHit';
    } else 
    if (this.state.gameOptions.action === 'attack') {
      target = 'attack';
    } 
    if ((this.state.speed.right || this.state.speed.left) && (
      this.state.speed.right !== this.state.speed.left
    )) {
      target = 'steps';
    } 
    if (target) {
      this.playSound(target);
      this.soundsState[target].isLocked = true;
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
    if (!this.state.gameOptions.action) {
      if (hero.positions.centerX > this.state.positions.centerX) {
        this.state.animations.reversed = false;
      }
      if (hero.positions.centerX < this.state.positions.centerX) {
        this.state.animations.reversed = true;
      }
      this.state.speed.right = 0;
      this.state.speed.left = 0;
      this.state.speed.y = 0;
    }
    if (this.state.gameOptions.action !== 'die') {
      if (this.checkIsHeroOnAttackDistance(hero)) {
        heroTakeHit(this.state.characteristics.damage, this.state.positions.centerX);
      } else if (this.checkIsHeroInteraction(hero)) {
        heroTakeHit(Config.demon.characteristics.damage * this.difficulty, this.state.positions.centerX);
      } else {
        if (this.checkHeroAttackCrossing(hero)) {
            this.takeHit(hero);
          } else {
            if (((Math.abs(hero.positions.centerX - this.state.positions.centerX) > 150) ||
              (Math.abs(hero.positions.centerY - this.state.positions.centerY) > 50)) &&
              !this.state.gameOptions.action){
              this.calculateSpeed(hero.positions.centerX, hero.positions.centerY);
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

