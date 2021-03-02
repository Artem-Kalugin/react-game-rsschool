import Config from '../../Config/Config';
import heroSteps from './Hero/steps.mp3';
import heroTakeHit from './Hero/takeHit.mp3';
import heroDeath from './Hero/death.mp3';
import heroJump from './Hero/jump.mp3';
import heroAttack1 from './Hero/attack1.mp3';
import heroAttack2 from './Hero/attack2.mp3';
import heroAttack3 from './Hero/attack3.mp3';
import skeletonSteps from './Skeleton/steps.mp3';
import skeletonTakeHit from './Skeleton/takeHit.mp3';
import skeletonAttack from './Skeleton/attack.mp3';
import enemyDeath from './Skeleton/death.mp3';
import demonAttack from './Demon/attack.mp3';
import demonSteps from './Demon/idle.mp3';
import demonTakeHit from './Demon/takeHit.mp3';
import houndAttack from './Hound/attack.mp3';
import houndTakeHit from './Hound/takeHit.mp3';
import houndJump from './Hound/jump.mp3';
import houndSteps from './Hound/steps.mp3';
import Track1 from './Music/track1.mp3';
import Track2 from './Music/track2.mp3';
import localStorageWorker from '../../util/localStorageWorker';

const SoundEngine = {
  hero: {
    steps: {src: null, vol: 1},
    takeHit: {src: null, vol: 1},
    death: {src: null, vol: 1},
    jump: {src: null, vol: 1},
    attack1: {src: null, vol: 1},
    attack2: {src: null, vol: 1},
    attack3: {src: null, vol: 1},
  }, 
  skeleton: {
    steps: {src: null, vol: 0.32},
    takeHit: {src: null, vol: 0.7},
    death: {src: null, vol: 0.5},
    attack: {src: null, vol: 0.5},
  }, 
  demon: {
    steps: {src: null, vol: 1},
    takeHit: {src: null, vol: 1},
    death: {src: null, vol: 0.5},
    attack: {src: null, vol: 1},
  },
  hound: {
    steps: {src: null, vol: 0.3},
    takeHit: {src: null, vol: 1},
    death: {src: null, vol: 0.5},
    attack: {src: null, vol: 0.7},
    jump: {src: null, vol: 0.7},
  },
  music: {
    track1: {src: null, vol: 0.3},
    track2: {src: null, vol: 0.7},
  },
  isMusicPlaying: false,
  checker: [],
  loadSounds() {
    const hero = 
    {
      steps: heroSteps,
      takeHit: heroTakeHit,
      death: heroDeath,
      jump: heroJump,
      attack1: heroAttack1,
      attack2: heroAttack2,
      attack3: heroAttack3,
    } 
    const skeleton = 
    {
      steps: skeletonSteps,
      takeHit: skeletonTakeHit,
      death: enemyDeath,
      attack: skeletonAttack,
    } 
    const demon = 
    {
      steps: demonSteps,
      takeHit: demonTakeHit,
      death: enemyDeath,
      attack: demonAttack,
    } 
    const hound = 
    {
      steps: houndSteps,
      takeHit: houndTakeHit,
      death: enemyDeath,
      attack: houndAttack,
      jump: houndJump,
    } 
    const music = {
      track1: Track1,
      track2: Track2,
    }
    this.loadOneInstance(hero, 'hero');
    this.loadOneInstance(hound, 'hound');
    this.loadOneInstance(skeleton, 'skeleton');
    this.loadOneInstance(demon, 'demon');
    this.loadOneInstance(music, 'music');
  },

  loadOneInstance(args, name) {
    for (const [key, value] of Object.entries(args)){
      const check = new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(value);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
          this[name][key].src = audioBuffer;
          resolve('done');
        } catch(e) {
          reject(e);
        }
      })
      this.checker.push(check);
    }
  },

  initialize() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();  
    this.musicCtx = new AudioContext();
    this.musicGainNode = this.musicCtx.createGain();
  },

  changeMusicGain(val) {
    this.musicGainNode.gain.value = val;
  },

  playMusic() {
    if (!this.isMusicPlaying  && this.musicCtx.state !== 'suspended') {
      console.log()
      this.isMusicPlaying = true;
      const trackSource = this.musicCtx.createBufferSource();
      trackSource.connect(this.musicGainNode);
      this.musicGainNode.connect(this.musicCtx.destination);
      const source = this.music[`track${Math.round(Math.random()) + 1}`].src;
      trackSource.buffer = source;
      trackSource.start();
      setTimeout(() => {
        this.isMusicPlaying = false;
      }, source.duration * 1000);
    } else {
      this.musicCtx.resume();
    }
  },

  play(target, x) {
    let pannerNode = null;
    if (x) {
      x -= 0.5;
      if (x > 1 * Config.pan.resuctionMultiplier) {
        x = 1 * Config.pan.reductionMultiplier;
      } else if (x < -1 * Config.pan.resuctionMultiplier){
        x = -1 * Config.pan.reductionMultiplier;
      }
      pannerNode = this.audioCtx.createStereoPanner();
      pannerNode.pan.value = x / Config.pan.reductionMultiplier;
      pannerNode.connect(this.audioCtx.destination);
    }
    const gainNode = this.audioCtx.createGain();
    const trackSource = this.audioCtx.createBufferSource();
    gainNode.gain.value = target.vol * localStorageWorker.read("options").soundEffectsGain;
    trackSource.connect(gainNode);
    if (pannerNode) {
      gainNode.connect(pannerNode);
    } else {
      gainNode.connect(this.audioCtx.destination);
    }
    trackSource.buffer = target.src;
    trackSource.start(); 
  }
}

export default SoundEngine;


