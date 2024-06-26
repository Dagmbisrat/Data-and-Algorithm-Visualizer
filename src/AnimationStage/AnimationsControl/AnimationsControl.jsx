import { useRef, useEffect, useState } from "react";
import "./AnimationsControl.css";
import PropTypes from "prop-types";
import StacksAnimations from "./AllAnimations/SimpleDataTypes/StacksAnimation.jsx";
import QueuesAnimation from "./AllAnimations/SimpleDataTypes/QueuesAnimation.jsx";

const Animations = ({
  Animation_name,
  speed,
  height,
  Add,
  Remove,
  Clear,
  Input,
  menuWidth,
}) => {
  const canvasRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.height = height - 10;
      canvas.width = windowWidth - menuWidth;
    }
  }, [height, windowWidth, menuWidth]);

  switch (Animation_name) {
    case "Stacks":
      return (
        <StacksAnimations
          speed={speed}
          height={height}
          Push={Add}
          Pop={Remove}
          Clear={Clear}
          Input={Input}
          menuWidth={menuWidth}
        />
      );

    case "Queues":
      return (
        <QueuesAnimation
          speed={speed}
          height={height}
          Queue={Add}
          UnQueue={Remove}
          Clear={Clear}
          Input={Input}
          menuWidth={menuWidth}
        />
      );

    default:
      return <canvas className="DefaultCanvas" ref={canvasRef} />;
  }
};
export default Animations;
Animations.prototype = {
  toggle: PropTypes.func.isRequired,
};
