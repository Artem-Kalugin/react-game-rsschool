import healthbar from './healthbar.png';


const UI = {
  assets: {
    healthbar: null,
  }, 
  checker: [],
  loadAssets() {
    const names = {
      normal: {
      'healthbar':healthbar,
      }
    }
    for (const [key, value] of Object.entries(names.normal)){
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

export default UI;

