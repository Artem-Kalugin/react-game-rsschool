import classes from "../control.module.scss";
import { useEffect, useState } from "react";

function KeyboardControl(props) {
  function checkValue() {
    if (props.el.value === 0) return "Space";
    else return String.fromCharCode(props.el.value);
  }

  useEffect(() => {
    document.addEventListener("keypress", props.handleKeypress);
    return function cleanup() {
      document.removeEventListener("keypress", props.handleKeypress);
    };
  });

  return (
    <div className={classes.control__stretch}>
      <span className={classes.align__start}>{props.el.text}</span>
      <span>{checkValue()}</span>
      <button
        className={`${classes.record} + ${
          props.el.isActive && classes.record__active
        }`}
        onClick={props.onClick}
      >
        ●
      </button>
    </div>
  );
}

export default KeyboardControl;
