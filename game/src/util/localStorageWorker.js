const localStorageWorker = {
  write(key, value) {
    localStorage.setItem(`delliusGame${key}`, JSON.stringify(value));
  },

  read(key) {
    return JSON.parse(localStorage.getItem(`delliusGame${key}`));
  },

  delete(key) {
    localStorage.removeItem(`delliusGame${key}`);
  },

  generateOptions() {
    let options = {
      musicGain: 0.5,
      soundEffectsGain: 0.7,
      runLeft: 65,
      runRight: 68,
      attack: 83,
      jump: 0,
      menu: 66,
      name: 'hero',
      difficulty: 1,
      saveInterval: 5,
    };
    this.write('options', options);
    return options;
  }
}

export default localStorageWorker;