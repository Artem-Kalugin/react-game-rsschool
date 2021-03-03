import classes from "../control.module.scss";

function SoundControl(props) {
  return (
    <div className={classes.control__stretch}>
      <span className={classes.align__start}>{props.text}</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        onInput={props.changeValue}
        defaultValue={props.value}
      ></input>
      <button className={classes.off} onClick={props.onoff}>
        off
      </button>
    </div>
  );
}

export default SoundControl;
