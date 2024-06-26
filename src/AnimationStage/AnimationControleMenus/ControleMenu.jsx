import "./ControleMenu.css";
import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import StacksMenu from "./AllAnimationMenus/SimpleDataTypes/StacksMenu.jsx";
import QueuesMenu from "./AllAnimationMenus/SimpleDataTypes/QueuesMenu.jsx";

function ControleMenu({
  Animation_name,
  updateSpeed,
  speed,
  Add,
  Remove,
  Clear,
  Input,
  updateInput,
  LoggedMessage,
}) {
  const isMounted = useRef(false);
  const updateSpeed_ = (num) => {
    updateSpeed(num);
  };
  const updateInput_ = (input) => {
    updateInput(input);
  };

  //Logs of all the actions for each simple data type
  const [stacksConsoleOuput, setStacksConsoleOuput] = useState([]);
  const [stacksLinkedListConsoleOuput, setStacksLinkedListConsoleOuput] =
    useState([]);
  const [queuesConsoleOuput, setQueuesConsoleOuput] = useState([]);
  const [queueslinkedListConsoleOuput, setQueueslinkedListConsoleOuput] =
    useState([]);

  //Makes shure the logs are cleared when ever a Diffrent Animation is pressed
  useEffect(() => {
    setStacksConsoleOuput([]);
    setStacksLinkedListConsoleOuput([]);
    setQueuesConsoleOuput([]);
    setQueueslinkedListConsoleOuput([]);
  }, [Animation_name]);

  //Displays the Logs when ever the logmessage changes (displays in the console the last action done)
  useEffect(() => {
    if (isMounted.current) {
      switch (Animation_name) {
        case "Stacks":
          setStacksConsoleOuput([...stacksConsoleOuput, " > " + LoggedMessage]);
          break;
        case "Queues":
          setQueuesConsoleOuput([...queuesConsoleOuput, " > " + LoggedMessage]);
          break;
        case "Stacks-linkedList":
          setStacksLinkedListConsoleOuput([
            ...stacksLinkedListConsoleOuput,
            " > " + LoggedMessage,
          ]);
          break;
        case "Queues-linkedList":
          setQueueslinkedListConsoleOuput([
            ...queueslinkedListConsoleOuput,
            " > " + LoggedMessage,
          ]);
      }
    }
    isMounted.current = true;
  }, [LoggedMessage]);

  switch (Animation_name) {
    case "Stacks":
      return (
        <>
          <StacksMenu
            Push={Add}
            Pop={Remove}
            Clear={Clear}
            updateSpeed={updateSpeed_}
            speed={speed}
            Input={Input}
            updateInput={updateInput_}
          />

          <div className="Console">Console</div>
          <div className="Console-Text">
            <ul className="list">
              {stacksConsoleOuput.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      );

    case "Stacks-linkedList":
      return (
        <>
          <StacksMenu
            Push={Add}
            Pop={Remove}
            Clear={Clear}
            updateSpeed={updateSpeed_}
            speed={speed}
            Input={Input}
            updateInput={updateInput_}
          />

          <div className="Console">Console</div>
          <div className="Console-Text">
            <ul className="list">
              {stacksLinkedListConsoleOuput.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      );

    case "Queues":
      return (
        <>
          <QueuesMenu
            Queue={Add}
            UnQueue={Remove}
            Clear={Clear}
            updateSpeed={updateSpeed_}
            speed={speed}
            Input={Input}
            updateInput={updateInput_}
          />
          <div className="Console">Console</div>
          <div className="Console-Text">
            <ul className="list">
              {queuesConsoleOuput.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      );

    case "Queues-linkedList":
      return (
        <>
          <QueuesMenu
            Queue={Add}
            UnQueue={Remove}
            Clear={Clear}
            updateSpeed={updateSpeed_}
            speed={speed}
            Input={Input}
            updateInput={updateInput_}
          />
          <div className="Console">Console</div>
          <div className="Console-Text">
            <ul className="list">
              {queueslinkedListConsoleOuput.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      );

    default:
      return (
        <>
          <div>Controles menu</div>
          <div>Builder</div>
          <div>Console</div>
        </>
      );
  }
}
export default ControleMenu;
ControleMenu.prototype = {
  toggle: PropTypes.func.isRequired,
};
