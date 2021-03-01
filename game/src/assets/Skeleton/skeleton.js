import Run from './Walk.png';
import Runrev from './Walkrev.png';
import Attack from './Attack.png';
import Attackrev from './Attackrev.png';
import death from './death.png';
import deathrev from './death.png';

const Demon = {
  animations: {
    attack: {src: null, reversed: null, tileSizeX: 150, tileSizeY: 150, centerXOffset: -40, centerYOffset: -20},
    run: {src: null, reversed: null, tileSizeX: 150, tileSizeY: 150, centerXOffset: -40, centerYOffset: -20},
    death: {src: null, reversed: null, tileSizeX: 160, tileSizeY: 160, centerXOffset: -40, centerYOffset: 10}
  }, 
  checker: [],
  loadAnimations() {
    const names = {
      normal: {
      'attack':Attack,
      'death': death,
      'run': Run,
      },
      rev:{    
      'attack':Attackrev,
      'death': deathrev,
      'run': Runrev,
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

