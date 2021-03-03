import classes from "../control.module.scss";

function Textfield(props) {
  return (
    <div className={classes.control__stretch}>
      <span className={classes.align__start}>{props.text}</span>
      <input
        type="text"
        onChange={props.onInput}
        defaultValue={props.value}
        className={classes.textfield}
      ></input>
    </div>
  );
}

export default Textfield;
