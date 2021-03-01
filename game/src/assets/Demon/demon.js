import Idle from './demon-idle.png';
import Attack from './demon-attack.png';
import Idlerev from './demon-idlerev.png';
import Attackrev from './demon-attackrev.png';
import death from './death.png';
import deathrev from './death.png';

const Demon = {
  animations: {
    attack: {src: null, reversed: null, tileSizeX: 240, tileSizeY: 192, centerXOffset: -40, centerYOffset: -16},
    idle: {src: null, reversed: null, tileSizeX: 160, tileSizeY: 144, centerXOffset: 0, centerYOffset: 0},
    death: {src: null, reversed: null, tileSizeX: 160, tileSizeY: 160, centerXOffset: 0, centerYOffset: 0}
  }, 
  checker: [],
  loadAnimations() {
    const names = {
      normal: {
      'idle':Idle,
      'attack':Attack,
      'death': death,
      },
      rev:{    
      'idle':Idlerev,
      'attack':Attackrev,
      'death': deathrev,
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

