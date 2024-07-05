import "./Stage.css";
import ControleMenu from "./AnimationControleMenus/ControleMenu.jsx";
import PropTypes from "prop-types";
import { useState } from "react";
import Animations from "./AnimationsControl/AnimationsControl.jsx";

function Stage({ Animation_name, menuWidth }) {
  const [hight, setHight] = useState(550);
  const [mouseDown, setMouseDown] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [doAdd, setDoAdd] = useState(false);
  const [doRemove, setDoRemove] = useState(false);
  const [doClear, setDoClear] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loggedMessage, setloggedMessage] = useState("");
  const [doSort, setDoSort] = useState(false);
  const [doRandom, setDoRandom] = useState(false);

  const handleMouseDown = (event) => {
    setMouseDown(true);
    event.preventDefault();
  };

  const handleMouseUp = () => {
    setMouseDown(false);
  };

  const handleMouseMove = (event) => {
    if (mouseDown) {
      setHight(event.pageY);
      // console.log(event.pageY);
    }
  };
  const updateSpeed = (num) => {
    setSpeed(num);
    // console.log("speed: " + num); //testing
  };
  const updateInput_ = (input) => {
    setInputValue(input);
    //console.log("Input: " + input); //testing
  };
  const clear = () => {
    //console.log("cleared"); //for testing
    setDoClear(!doClear);
  };
  const remove = () => {
    //console.log("removed"); //for testing
    setDoRemove(!doRemove);
  };
  const add = () => {
    // console.log("added"); //for testing
    setDoAdd(!doAdd);
  };
  const sort = () => {
    setDoSort(!doSort);
  };
  const random = () => {
    setDoRandom(!doRandom);
  };
  const log = (message) => {
    setloggedMessage(message);
  };

  return (
    <div
      className="alg-visual-window"
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div className="alg-window" style={{ height: hight }}>
        <div className="Animation-canvas" style={{ height: hight }}>
          <Animations
            Animation_name={Animation_name}
            menuWidth={menuWidth}
            speed={speed}
            height={hight}
            Remove={doRemove}
            Add={doAdd}
            Clear={doClear}
            Input={inputValue}
            Log={log}
            Random={doRandom}
            Sort={doSort}
          />
        </div>
        <div className="resize-bar" onMouseDown={handleMouseDown}></div>
      </div>
      <ControleMenu
        Animation_name={Animation_name}
        updateSpeed={updateSpeed}
        speed={speed}
        Add={add}
        Remove={remove}
        Clear={clear}
        Input={inputValue}
        updateInput={updateInput_}
        LoggedMessage={loggedMessage}
        Sort={sort}
        Random={random}
      />
    </div>
  );
}

export default Stage;
Stage.prototype = {
  toggle: PropTypes.func.isRequired,
};
