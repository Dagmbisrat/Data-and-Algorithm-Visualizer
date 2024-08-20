import "./SortingMenu.css";
import PropTypes from "prop-types";
import React, { useState } from "react";

function SortingMenu({
  Add,
  Remove,
  Clear,
  updateSpeed,
  speed,
  Input,
  updateInput,
  Sort,
  Pause,
  Random,
  isAnimating,
}) {
  const largestAcceptedInput = 99;
  const [isClicked, setIsClicked] = useState(false);
  const delay = 1500;

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

  //makes shure multiple clicks wont be registed at once
  const handleSort = () => {
    if (isClicked) return;

    setIsClicked(true);
    Sort();

    // Re-enable the button after the delay
    setTimeout(() => {
      setIsClicked(false);
    }, delay);
  };

  //makes shure multiple clicks wont be registed at once
  const handlePause = () => {
    if (isClicked) return;

    setIsClicked(true);
    Pause();

    // Re-enable the button after the delay
    setTimeout(() => {
      setIsClicked(false);
    }, delay);
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
          {!isAnimating ? (
            <button class="sort-button" onClick={handleSort}>
              <span class="play-icon">▶</span>
              Search
            </button>
          ) : (
            <button class="sort-button" onClick={handlePause}>
              <span class="play-icon">▐▐</span>
              Pause
            </button>
          )}
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
