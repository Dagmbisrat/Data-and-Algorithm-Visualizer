import "./StacksMenu.css";
import PropTypes from "prop-types";
import React, { useState } from "react";

function StacksMenu({
  Push,
  Pop,
  Clear,
  updateSpeed,
  speed,
  Input,
  updateInput,
}) {
  const largestAcceptedInput = 99;
  const handleSpeedChange = (event) => {
    // console.log("handleSpeedChange");
    updateSpeed(event.target.value);
  };

  const handleInputChange = (event) => {
    // console.log("handleInputChange");
    if (
      event.target.value <= largestAcceptedInput &&
      event.target.value >= -largestAcceptedInput
    ) {
      updateInput(event.target.value);
    }
  };

  return (
    <>
      <header className="Menubackground">
        <input
          className="input"
          type="number"
          maxLength="1"
          id="input"
          value={Input}
          onChange={handleInputChange}
        />
        <button onClick={Push}> Push </button>
        <button onClick={Pop}> Pop </button>
        <button onClick={Clear}> Clear</button>
        <div className="slidecontainer">
          {/* <p>Speed</p> */}
          {/* <input
            id="slider"
            className="slider"
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={handleSpeedChange}
            style={{ width: "100%" }}
          /> */}
          {/* <p>{speed}</p> */}
        </div>
      </header>
    </>
  );
}

export default StacksMenu;
StacksMenu.prototype = {
  toggle: PropTypes.func.isRequired,
};
