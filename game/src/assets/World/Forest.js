import Sky from './Sky.png';
import Ground  from './Ground.png';
import Bg1 from './Background1.png';
import Bg2 from './Background2.png';
import Bg3 from './Background3.png';

const World = {
  assets: [],
  backgroundAssets: {
    bg1:{
      src: null,
      yOffset: -0.05,
    },
    bg3:{
      src: null,
      yOffset: 0,
    },
    bg2:{
      src: null,
      yOffset: -0.0,
    }
  }, 
  checker: [],
  groundSize:64,
  surfaceOut: [[0,0], [1,0], [3,2]],
  surfaceIn: [[1,1]],
  surfaceInRare: [[3,3], [1,2]],
  surfaceOutRare: [[3,0]],
  groundSizeMultiplier: 0.75,
  loadAssets() {
    const names = {
      'sky': Sky,
      'ground': Ground,
    };
    const backgroundNames = {
      'bg1': Bg1,
      'bg2': Bg2,
      'bg3': Bg3,
    };
    for (const [key, value] of Object.entries(names)){
      const check = new Promise((resolve, reject) => {
        try {
          const img = document.createElement('img');
          img.addEventListener('load', () => {
            this.assets[key] = img;
            resolve('done');
          })
          img.src = value;
        } catch(e) {
          reject(e);
        }
      })
      this.checker.push(check);
    }
    for (const [key, value] of Object.entries(backgroundNames)){
      const check = new Promise((resolve, reject) => {
        try {
          const img = document.createElement('img');
          img.addEventListener('load', () => {
            this.backgroundAssets[key].src = img;
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

export default World;