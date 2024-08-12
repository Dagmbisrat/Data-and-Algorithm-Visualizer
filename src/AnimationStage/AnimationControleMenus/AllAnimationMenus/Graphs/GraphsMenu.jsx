import "./GraphsMenu.css";
import PropTypes from "prop-types";
import React, { useState } from "react";

function GraphsMenu({ Clear, updateSpeed, speed, updateInput, Sort, Random }) {
  const handleSpeedChange = (event) => {
    // console.log("handleSpeedChange");
    updateSpeed(event.target.value);
  };

  return (
    <>
      <header className="Menubackground">
        <div class="set">
          <button class="random-button" onClick={Random}>
            <span class="random-icon">⇄</span>
            Random
          </button>
          <button class="clear-button" onClick={Clear}>
            <span class="clear-icon">⌫</span>
            UnSearch
          </button>
        </div>
        <div class="set">
          <button class="sort-button" onClick={Sort}>
            <span class="play-icon">▶</span>
            Search
          </button>
          <div className="slidecontainer">
            <div class="slider-container">
              <label for="speed-slider">Speed</label>
              <input
                id="speed-slider"
                class="slider"
                type="range"
                min="1"
                max="100"
                value={speed}
                onChange={handleSpeedChange}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default GraphsMenu;
GraphsMenu.prototype = {
  toggle: PropTypes.func.isRequired,
};
