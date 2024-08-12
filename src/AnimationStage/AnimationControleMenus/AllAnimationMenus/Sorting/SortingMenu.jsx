import "./SortingMenu.css";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

function SortingMenu({
  Add,
  Remove,
  Clear,
  updateSpeed,
  speed,
  Input,
  updateInput,
  Sort,
  Random,
  isAnimating,
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
        <div class="set">
          <input
            className="input"
            type="number"
            maxLength="1"
            id="input"
            value={Input}
            onChange={handleInputChange}
          />
          <button class="random-button" onClick={Add}>
            <span class="random-icon">⊕</span>Add
          </button>
          <button class="random-button" onClick={Remove}>
            <span class="random-icon">&#8854;</span>
            Remove
          </button>
          <button class="random-button" onClick={Random}>
            <span class="random-icon">⇄</span>
            Randomize
          </button>
          <button class="clear-button" onClick={Clear}>
            <span class="clear-icon">⌫</span>
            Clear
          </button>
        </div>
        <div class="set">
          <button class="sort-button" onClick={Sort}>
            {!isAnimating ? (
              <span class="play-icon">▶</span>
            ) : (
              <span class="play-icon">▐▐</span>
            )}
            {!isAnimating ? "Sort" : "Pause"}
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

export default SortingMenu;
SortingMenu.prototype = {
  toggle: PropTypes.func.isRequired,
};
