import classes from "./Footer.module.scss";
import githubIcon from "../../assets/Ui/github.png";
import rsschoolIcon from "../../assets/Ui/rs_school_js.png";

function Footer() {
  return (
    <div className={classes.wrapper}>
      <a href="https://github.com/Artem-Kalugin">
        <span>Artem Kalugin</span>
      </a>
      <a href="https://rs.school/js/">
        <img src={rsschoolIcon} alt="" className={classes.rsschool__icon} />
      </a>
    </div>
  );
}

export default Footer;
