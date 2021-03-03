import classes from "../control.module.scss";

function Select(props) {
  return (
    <div className={classes.control__stretch}>
      <span className={classes.align__start}>{props.text}</span>
      <select
        onChange={props.onChange}
        className={classes.select}
        value={props.value}
      >
        {props.elements.map((el, index) => {
          return (
            <option key={index} value={el.value}>
              {el.text}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default Select;
