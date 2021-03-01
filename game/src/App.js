import './App.css';
import { useEffect, useState } from 'react';
import Game from './Game/Game.jsx'
import Hero from './assets/Hero/Hero';
import Forest from './assets/World/Forest';
import Demon from './assets/Demon/demon';
import Hound from './assets/Hound/hound';
import Skeleton from './assets/Skeleton/skeleton';
import UI from './assets/Ui/UI';
import SoundEngine from './Game/SoundEngine/SoundEngine';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const watchLoading = () => {
    Promise.all([...Hero.checker, ...Forest.checker, ...Demon.checker, ...UI.checker, ...Hound.checker, ...Skeleton.checker]).then(() => {
      console.log(Hero);
      console.log(SoundEngine);
      setIsLoaded(true);
    })
  }

  const loadAssets = () => {
    SoundEngine.initialize();
    Hero.loadAnimations();
    Forest.loadAssets();
    Demon.loadAnimations();
    Hound.loadAnimations();
    Skeleton.loadAnimations();
    SoundEngine.loadSounds();
    UI.loadAssets();
    watchLoading();
  }

  useEffect(() => {
    loadAssets();
  }, []);

  return (
    <div>
      {isLoaded && type === 'game' <Game/>};
    </div>
  );
}

export default App;
