import Idle from './idle.png';
import Idlerev from './idlerev.png';
import Run from './run.png';
import Runrev from './runrev.png';
import Jump from './jump.png';
import Jumprev from './jumprev.png';
import death from './death.png';
import deathrev from './death.png';

const Demon = {
  animations: {
    idle: {src: null, reversed: null, tileSizeX: 64, tileSizeY: 32, centerXOffset: 0, centerYOffset: 0},
    run: {src: null, reversed: null, tileSizeX: 67, tileSizeY: 32, centerXOffset: 0, centerYOffset: 0},
    jump: {src: null, reversed: null, tileSizeX: 65, tileSizeY: 48, centerXOffset: 0, centerYOffset: 0},
    death: {src: null, reversed: null, tileSizeX: 53, tileSizeY: 53, centerXOffset: 0, centerYOffset: 0}
  }, 
  checker: [],
  loadAnimations() {
    const names = {
      normal: {
      'idle':Idle,
      'death': death,
      'run': Run,
      'jump': Jump,
      },
      rev:{    
      'idle':Idlerev,
      'death': deathrev,
      'run': Runrev,
      'jump': Jumprev,
      }
    };
    for (const [key, value] of Object.entries(names.normal)){
      const check = new Promise((resolve, reject) => {
        try {
          const img = document.createElement('img');
          img.addEventListener('load', () => {
            this.animations[key].src = img;
            this.animations[key].framesLength = img.width / this.animations[key].tileSizeX;
            resolve('done');
          })
          img.src = value;
        } catch(e) {
          reject(e);
        }
      })
      this.checker.push(check);
    }
    for (const [key, value] of Object.entries(names.rev)){
      const check = new Promise((resolve, reject) => {
        try {
          const img = document.createElement('img');
          img.addEventListener('load', () => {
            this.animations[key].reversed = img;
            resolve('done');
          })
          img.src = value;
        } catch(e) {
          reject(e);
        }
      })
      this.checker.push(check);
    }
  },
}

export default Demon;

