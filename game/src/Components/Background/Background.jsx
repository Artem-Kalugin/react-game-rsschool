import classes from "./Background.module.scss";
import { useEffect, useRef } from "react";
import floatingCanvasBackgound from "./floatingCanvasBackground";

function Background() {
  const canvas = useRef(null);

  useEffect(() => {
    const background = new floatingCanvasBackgound(canvas.current, 1.5);
    background.drawParticles();
  }, []);

  return (
    <canvas
      ref={canvas}
      width="1000"
      height="1000"
      className={classes.wrapper}
    ></canvas>
  );
}

export default Background;
