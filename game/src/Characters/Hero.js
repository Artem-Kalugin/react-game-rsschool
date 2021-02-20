import Run from '../assets/Hero/Run.png';
import Idle  from '../assets/Hero/Idle.png';
import Attack1 from '../assets/Hero/Attack1.png';
import Attack2 from '../assets/Hero/Attack2.png';
import Attack3 from '../assets/Hero/Attack3.png';
import Fall from '../assets/Hero/Fall.png';
import Jump from '../assets/Hero/Jump.png';
import TakeHit from '../assets/Hero/Take hit.png';
import death from '../assets/Hero/Death.png';

const Hero = {
  animations: [], 
  checker: [],
  tileSize: 162,
  loadAnimations() {
    const names = {
      'run': Run,
      'idle':Idle,
      'attack1':Attack1,
      'attack2':Attack2,
      'attack3':Attack3,
      'fall':Fall,
      'jump':Jump,
      'takeHit':TakeHit,
      'death':death,
    };
    for (const [key, value] of Object.entries(names)){
      const check = new Promise((resolve, reject) => {
        try {
          const img = document.createElement('img');
          img.addEventListener('load', () => {
            this.animations[key] = img;
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