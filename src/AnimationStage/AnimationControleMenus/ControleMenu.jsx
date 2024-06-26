import "./ControleMenu.css";
import PropTypes from "prop-types";
import React, { useState } from "react";
import StacksMenu from "./AllAnimationMenus/SimpleDataTypes/StacksMenu.jsx";
import QueuesMenu from "./AllAnimationMenus/SimpleDataTypes/QueuesMenu.jsx";

function ControleMenu({
  Animation_name,
  updateSpeed,
  speed,
  Push,
  Pop,
  Clear,
  Input,
  updateInput,
}) {
  const updateSpeed_ = (num) => {
    updateSpeed(num);
  };
  const updateInput_ = (input) => {
    updateInput(input);
  };

  switch (Animation_name) {
    case "Stacks":
      return (
        <>
          <StacksMenu
            Push={Push}
            Pop={Pop}
            Clear={Clear}
            updateSpeed={updateSpeed_}
            speed={speed}
            Input={Input}
            updateInput={updateInput_}
          />

          <div className="Console">Console</div>
        </>
      );

    case "Queues":
      return (
        <>
          <QueuesMenu
            Queue={Push}
            UnQueue={Pop}
            Clear={Clear}
            updateSpeed={updateSpeed_}
            speed={speed}
            Input={Input}
            updateInput={updateInput_}
          />

          <div>Console</div>
        </>
      );

    default:
      return (
        <>
          <div>Controles menu</div>
          <div>Console</div>
        </>
      );
  }
}
export default ControleMenu;
ControleMenu.prototype = {
  toggle: PropTypes.func.isRequired,
};
