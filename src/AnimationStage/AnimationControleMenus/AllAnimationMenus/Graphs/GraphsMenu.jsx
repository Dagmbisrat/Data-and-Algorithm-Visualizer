import "./GraphsMenu.css";
import PropTypes from "prop-types";
import React, { useState } from "react";

function GraphsMenu({
  Clear,
  updateSpeed,
  speed,
  Sort,
  Random,
  isAnimating,
  Pause,
}) {
  const [isClicked, setIsClicked] = useState(false);
  const delay = 500;

  const handleSpeedChange = (event) => {
    // console.log("handleSpeedChange");
    updateSpeed(event.target.value);
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

export default GraphsMenu;
GraphsMenu.prototype = {
  toggle: PropTypes.func.isRequired,
};
