import Sky from '../assets/World/Sky.png';
import Ground  from '../assets/World/Ground.png';
import Bg1 from '../assets/World/Background1.png';
import Bg2 from '../assets/World/Background2.png';
import Bg3 from '../assets/World/Background3.png';

const World = {
  assets: [], 
  checker: [],
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