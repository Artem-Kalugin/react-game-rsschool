import classes from "./Settings.module.scss";
import SoundControl from "./SoundControls/SoundControl";
import KeyboardControl from "./KeyboardControl/KeyboardControl";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import SoundEngine from "../../Game/SoundEngine/SoundEngine";
import localStorageWorker from "../../util/localStorageWorker";
import Textfield from "./Textfield/Textfield";
import Checkbox from "./Checkbox/Checkbox";
import Select from "./Select/Select";

function Settings() {
  const [musicGain, setMusicGain] = useState(
    localStorageWorker.read("options").musicGain
  );
  const [difficulty, setDifficulty] = useState(
    localStorageWorker.read("options").difficulty
  );
  const [saveInterval, setSaveInterval] = useState(
    localStorageWorker.read("options").saveInterval
  );
  const [name, setName] = useState(localStorageWorker.read("options").name);
  const [soundEffectsGain, setSoundEffectsGain] = useState(
    localStorageWorker.read("options").soundEffectsGain
  );
  const [buttonsState, setButtonsState] = useState([
    {
      text: "Run Left",
      value: localStorageWorker.read("options").runLeft,
      isActive: false,
    },
    {
      text: "Run Right",
      value: localStorageWorker.read("options").runRight,
      isActive: false,
    },
    {
      text: "Attack",
      value: localStorageWorker.read("options").attack,
      isActive: false,
    },
    {
      text: "Jump",
      value: localStorageWorker.read("options").jump,
      isActive: false,
    },
    {
      text: "Back to menu",
      value: localStorageWorker.read("options").menu,
      isActive: false,
    },
  ]);
  function changeButton(e, element) {
    if (element.isActive) {
      if (
        buttonsState.filter((el) => {
          return el.value === e.keyCode - 32;
        }).length === 0
      ) {
        element.value = e.keyCode - 32;
        element.isActive = false;
        setButtonsState(buttonsState, element);
        setActive(element, false);
      }
    }
  }

  function setActive(element, shouldActive) {
    const newState = buttonsState.map((el) => {
      el.isActive = false;
      return el;
    });
    if (shouldActive) {
      element.isActive = true;
    }
    setButtonsState(newState, element);
  }

  function changeMusicGain(val) {
    setMusicGain(val);
    SoundEngine.changeMusicGain(val);
  }

  function changeSoundEffectsGain(val) {
    setSoundEffectsGain(val);
  }

  function changeDifficulty(val) {
    setDifficulty(val);
  }

  function changeSaveInterval(val) {
    setSaveInterval(val);
  }

  async function changeName(val) {
    await setName(val);
  }

  function changeFullscreen(val) {
    console.log(val);
    if (val) {
      document.querySelector("#root").requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  useEffect(() => {
    function updateOptions() {
      let options = {
        musicGain: musicGain,
        soundEffectsGain: soundEffectsGain,
        runLeft: buttonsState[0].value,
        runRight: buttonsState[1].value,
        attack: buttonsState[2].value,
        jump: buttonsState[3].value,
        menu: buttonsState[4].value,
        name: name,
        difficulty: difficulty,
        saveInterval: saveInterval,
      };
      localStorageWorker.write("options", options);
      console.log(localStorageWorker.read("options"));
    }
    updateOptions();
  }, [
    name,
    soundEffectsGain,
    musicGain,
    buttonsState,
    difficulty,
    saveInterval,
  ]);

  return (
    <div className={`textured + ${classes.inner__wrapper}`}>
      <span>Settings</span>
      <SoundControl
        text="Music"
        value={musicGain}
        changeValue={(e) => changeMusicGain(e.target.value)}
        onoff={() => {
          changeMusicGain(0);
        }}
      />
      <SoundControl
        text="Sound Effects"
        value={soundEffectsGain}
        changeValue={(e) => changeSoundEffectsGain(e.target.value)}
        onoff={() => {
          changeSoundEffectsGain(0);
        }}
      />
      {buttonsState.map((el, index) => {
        return (
          <KeyboardControl
            el={el}
            handleKeypress={(e) => {
              changeButton(e, el);
            }}
            key={index}
            onClick={() => {
              setActive(el, true);
            }}
          />
        );
      })}
      <Textfield
        text="Your name"
        onInput={(e) => changeName(e.target.value)}
        value={name}
      />
      <Checkbox
        text="Fullscreen mode"
        onInput={(e) => changeFullscreen(e.target.checked)}
      />
      <Select
        onChange={(e) => {
          changeDifficulty(e.target.value);
        }}
        value={difficulty}
        text="Difficulty"
        elements={[
          {
            text: "Easy",
            value: 0.5,
          },
          {
            text: "Medium",
            value: 1,
          },
          {
            text: "Hard",
            value: 1.5,
          },
        ]}
      />
      <Select
        onChange={(e) => {
          changeSaveInterval(e.target.value);
        }}
        value={saveInterval}
        text="Save every"
        elements={[
          {
            text: "5s",
            value: 5,
          },
          {
            text: "15s",
            value: 15,
          },
          {
            text: "30s",
            value: 30,
          },
        ]}
      />
      <NavLink to="/">Ok</NavLink>
    </div>
  );
}

export default Settings;
