import Sky from './Sky.png';
import Ground  from './Ground.png';
import Bg1 from './Background1.png';
import Bg2 from './Background2.png';
import Bg3 from './Background3.png';

const World = {
  assets: [], 
  checker: [],
  groundVarietyRare: [1, 9],
  groundSurfaceUsuall: [4, 6, 13, 11],
  groundSize:64,
  groundSizeMultiplier: 0.75,
  loadAssets() {
    const names = {
      'sky': Sky,
      'ground': Ground,
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
  },
}

export default World;