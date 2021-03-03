import classes from "../control.module.scss";

function Checkbox(props) {
  return (
    <div className={classes.control__stretch}>
      <span className={classes.align__start}>{props.text}</span>
      <input
        type="checkbox"
        onChange={props.onInput}
        className={classes.checkbox}
      ></input>
    </div>
  );
}

export default Checkbox;
