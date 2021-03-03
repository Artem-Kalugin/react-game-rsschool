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
  HashRouter as Router,
  Switch,
  Route,
  NavLink, 
  useHistory
} from "react-router-dom";
import Menu from './Components/Menu/Menu';
import Logo from './Components/Logo/Logo';
import localStorageWorker from './util/localStorageWorker';
import Settings from './Components/Settings/Settings';
import Leaderboards from './Components/Leaderboards/Leaderboards';
import Background from './Components/Background/Background';
import Footer from './Components/Footer/Footer';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  let musicPlayingInterval = null;
  let history = useHistory();
  
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
    let options = localStorageWorker.read('options') || localStorageWorker.generateOptions();
    SoundEngine.changeMusicGain(options.musicGain);
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
          <Background />
          <Footer />
        </Route>
        <Route path="/continue">
          <div className="game__wrapper">
            {isLoaded &&  <Game type='continue'/>}
          </div>
        </Route>
        <Route path="/game">
          <div className="game__wrapper">
            {isLoaded &&  <Game type='new'/>}
          </div>
        </Route>
        <Route path="/demo">
          <div className="game__wrapper">
            {isLoaded &&  <Game type='autoplay'/>}
          </div>
        </Route>
        <Route path="/settings">
          <Logo />
          <Settings />
          <Background />
          <Footer />
        </Route>
        <Route path="/leaderboards">
          <Logo />
          <Leaderboards />
          <Background />
          <Footer />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
