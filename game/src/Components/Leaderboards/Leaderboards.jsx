import classes from "./Leaderboards.module.scss";
import { NavLink } from "react-router-dom";
import localStorageWorker from "../../util/localStorageWorker";

function Record(props) {
  return (
    <>
      <div>{props.id}</div>
      <div>{props.name}</div>
      <div>{props.distance}</div>
      <div>{props.money}</div>
    </>
  );
}
function Leaderboards() {
  function getRecords() {
    let records = localStorageWorker.read("records");
    console.log(records);
    if (records) {
      return records.map((el, index) => (
        <Record
          id={`${index + 1}.`}
          name={el.name}
          distance={`${el.distance.toFixed()}m`}
          money={el.money.toFixed()}
        />
      ));
    } else return <span>There is no records!</span>;
  }

  return (
    <div className={`textured + ${classes.inner__wrapper}`}>
      <span>Last 10 results</span>
      <div className={classes.grid__container}>
        <Record id="№" name="Name" distance="Distance" money="Money" />
        {getRecords()}
      </div>
      <NavLink to="/">Ok</NavLink>
    </div>
  );
}

export default Leaderboards;
