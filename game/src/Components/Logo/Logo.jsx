import logo from "../../assets/Ui/logo.png";
import classes from "./Logo.module.scss";

function Logo() {
  return (
    <div className={classes.logo__wrapper}>
      <img src={logo} alt="logo" className={classes.logo}></img>
    </div>
  );
}

export default Logo;
