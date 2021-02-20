import Runrev from './Runrev.png';
import Idlerev  from './Idlerev.png';
import Attack1rev from './Attack1rev.png';
import Attack2rev from './Attack2rev.png';
import Attack3rev from './Attack3rev.png';
import Fallrev from './Fallrev.png';
import Jumprev from './Jumprev.png';
import TakeHitrev from './TakeHitrev.png';
import deathrev from './Deathrev.png';
import Run from './Run.png';
import Idle  from './Idle.png';
import Attack1 from './Attack1.png';
import Attack2 from './Attack2.png';
import Attack3 from './Attack3.png';
import Fall from './Fall.png';
import Jump from './Jump.png';
import TakeHit from './TakeHit.png';
import death from './Death.png';


const Hero = {
  animations: {
    attack1: {src: null, reversed: null},
    attack2: {src: null, reversed: null},
    attack3: {src: null, reversed: null},
    death: {src: null, reversed: null},
    fall: {src: null, reversed: null},
    idle: {src: null, reversed: null},
    jump: {src: null, reversed: null},
    run: {src: null, reversed: null},
    takeHit: {src: null, reversed: null}
  }, 
  checker: [],
  tileSize: 162,
  loadAnimations() {
    const names = {
      normal: {
      'run': Run,
      'idle':Idle,
      'attack1':Attack1,
      'attack2':Attack2,
      'attack3':Attack3,
      'fall':Fall,
      'jump':Jump,
      'takeHit':TakeHit,
      'death':death,
      },
      rev:{
      'run': Runrev,
      'idle':Idlerev,
      'attack1':Attack1rev,
      'attack2':Attack2rev,
      'attack3':Attack3rev,
      'fall':Fallrev,
      'jump':Jumprev,
      'takeHit':TakeHitrev,
      'death':deathrev,
      }
    };
    for (const [key, value] of Object.entries(names.normal)){
      const check = new Promise((resolve, reject) => {
        try {
          const img = document.createElement('img');
          img.addEventListener('load', () => {
            this.animations[key].src = img;
            this.animations[key].framesLength = img.width / this.tileSize;
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

export default Hero;


{}

