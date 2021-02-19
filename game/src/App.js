import './App.css';
import { useEffect, useState } from 'react';
import Game from './Game/Game.jsx'
import Hero from './Characters/Hero';
import Forest from './Worlds/Forest';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const watchLoading = () => {
    Promise.all([...Hero.checker, ...Forest.checker]).then(() => {
      console.log(Hero);
      // console.log(Forest);
      setIsLoaded(true);
    })
  }

  const loadAssets = () => {
    Hero.loadAnimations();
    Forest.loadAssets();
    watchLoading();
  }

  useEffect(() => {
    loadAssets();
  }, []);

  return (
    <div>
      {isLoaded && <Game/>};
    </div>
  );
}

export default App;
