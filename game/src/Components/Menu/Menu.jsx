import { NavLink } from "react-router-dom";
import classes from "./Menu.module.scss";
import localStorageWorker from "../../util/localStorageWorker";

function MenuLink(props) {
  return (
    <li className={`textured + ${classes.menu__link}`}>
      <NavLink className={classes.NavLink} to={props.link}>
        {props.text}
      </NavLink>
    </li>
  );
}

function Menu() {
  return (
    <div className={classes.menu__wrapper}>
      <ul className={classes.menu}>
        {localStorageWorker.read("save") && (
          <MenuLink link="/continue" text="Continue"></MenuLink>
        )}
        <MenuLink link="/game" text="New Game"></MenuLink>
        <MenuLink link="/demo" text="Demo"></MenuLink>
        <MenuLink link="/" text="Shop"></MenuLink>
        <MenuLink link="/settings" text="Settings"></MenuLink>
        <MenuLink link="/leaderboards" text="Leaderboards"></MenuLink>
      </ul>
    </div>
  );
}

export default Menu;
