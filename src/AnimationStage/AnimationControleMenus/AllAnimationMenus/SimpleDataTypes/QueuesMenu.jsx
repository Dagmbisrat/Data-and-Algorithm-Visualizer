import "./QueuesMenu.css";
import PropTypes from "prop-types";
import React, { useState } from "react";

function QueuesMenu({
  Queue,
  UnQueue,
  Clear,
  updateSpeed,
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
        <div class="set">
          <input
            className="input"
            type="number"
            maxLength="1"
            id="input"
            value={Input}
            onChange={handleInputChange}
          />
          <button class="button" onClick={Queue}>
            <span class="icon">⊕</span>
            EnQueue
          </button>
          <button class="button" onClick={UnQueue}>
            <span class="icon">&#8854;</span>
            DeQueue
          </button>
        </div>
        <div class="set">
          <button class="button" onClick={Clear}>
            <span class="icon">⌫</span>
            Clear
          </button>
        </div>
      </header>
    </>
  );
}

export default QueuesMenu;
QueuesMenu.prototype = {
  toggle: PropTypes.func.isRequired,
};
