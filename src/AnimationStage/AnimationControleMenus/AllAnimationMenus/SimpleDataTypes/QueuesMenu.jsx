import "./QueuesMenu.css";
import PropTypes from "prop-types";
import React, { useState } from "react";

function QueuesMenu({
  Queue,
  UnQueue,
  Clear,
  updateSpeed,
  speed,
  Input,
  updateInput,
}) {
  const handleSpeedChange = (event) => {
    // console.log("handleSpeedChange");
    updateSpeed(event.target.value);
  };

  const handleInputChange = (event) => {
    // console.log("handleInputChange");
    updateInput(event.target.value);
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
        <button onClick={Queue}> Queue </button>
        <button onClick={UnQueue}> UnQueue </button>
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

export default QueuesMenu;
QueuesMenu.prototype = {
  toggle: PropTypes.func.isRequired,
};
