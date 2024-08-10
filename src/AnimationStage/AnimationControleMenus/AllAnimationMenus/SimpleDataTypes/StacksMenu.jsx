import "./StacksMenu.css";
import PropTypes from "prop-types";
import React, { useState } from "react";

function StacksMenu({ Push, Pop, Clear, updateSpeed, Input, updateInput }) {
  const largestAcceptedInput = 99;

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
          <button class="button" onClick={Push}>
            <span class="icon">⊕</span>
            Push
          </button>
          <button class="button" onClick={Pop}>
            <span class="icon">&#8854;</span>
            Pop
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

export default StacksMenu;
StacksMenu.prototype = {
  toggle: PropTypes.func.isRequired,
};
