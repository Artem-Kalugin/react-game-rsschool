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
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import Menu from './Components/Menu/Menu';
import Logo from './Components/Logo/Logo';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  let musicPlayingInterval = null;
  
  const watchLoading = () => {
    Promise.all([...Hero.checker, ...Forest.checker, ...Demon.checker, ...UI.checker, ...Hound.checker, ...Skeleton.checker, ...SoundEngine.checker]).then(() => {
      console.log(SoundEngine);
      setIsLoaded(true);
      SoundEngine.playMusic();
      musicPlayingInterval = setInterval(() => {
        SoundEngine.playMusic();
      }, 5000)
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
    return function cleanup() {
      if (musicPlayingInterval) {
        clearInterval(musicPlayingInterval);
      }
    }
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Logo />
          <Menu />
        </Route>
        <Route path="/game">
          <div>
            {isLoaded &&  <Game/>};
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
