import "./ControleMenu.css";
import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import StacksMenu from "./AllAnimationMenus/SimpleDataTypes/StacksMenu.jsx";
import QueuesMenu from "./AllAnimationMenus/SimpleDataTypes/QueuesMenu.jsx";
import SortingMenu from "./AllAnimationMenus/Sorting/SortingMenu.jsx";
import GraphsMenu from "./AllAnimationMenus/Graphs/GraphsMenu.jsx";
import DefaultMenuScreen from "./AllAnimationMenus/Default/DefaultAnimationsMenu.jsx";

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
  Sort,
  Random,
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
  const [bubbleSortConsoleOuput, setBubbleSortConsoleOuput] = useState([]);
  const [insertionSortConsoleOuput, setInsertionSortConsoleOuput] = useState(
    [],
  );
  const [mergeSortConsoleOuput, setmergeSortConsoleOuput] = useState([]);
  const [heapSortConsoleOuput, setHeapSortConsoleOuput] = useState([]);
  const [bfsAlgorithmsConsoleOuput, setbfsAlgorithmsConsoleOuput] = useState(
    [],
  );
  const [dfsAlgorithmsConsoleOuput, setdfsAlgorithmsConsoleOuput] = useState(
    [],
  );
  const [dijkstrasAlgConsoleOuput, setdijkstrasAlgConsoleOuput] = useState([]);

  const [aStarAlgConsoleOuput, setAStarAlgConsoleOuput] = useState([]);

  //Makes shure the logs are cleared when ever a Diffrent Animation is pressed
  useEffect(() => {
    setStacksConsoleOuput([]);
    setStacksLinkedListConsoleOuput([]);
    setQueuesConsoleOuput([]);
    setQueueslinkedListConsoleOuput([]);
    setBubbleSortConsoleOuput([]);
    setInsertionSortConsoleOuput([]);
    setmergeSortConsoleOuput([]);
    setHeapSortConsoleOuput([]);
    setbfsAlgorithmsConsoleOuput([]);
    setdfsAlgorithmsConsoleOuput([]);
    setdijkstrasAlgConsoleOuput([]);
    setAStarAlgConsoleOuput([]);
  }, [Animation_name]);

  //Displays the Logs when ever the logmessage changes (displays in the console the last action done)
  useEffect(() => {
    if (isMounted.current && LoggedMessage != "") {
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
        case "Bubble Sort":
          setBubbleSortConsoleOuput([
            ...bubbleSortConsoleOuput,
            " > " + LoggedMessage,
          ]);
        case "Insertion Sort":
          setInsertionSortConsoleOuput([
            ...insertionSortConsoleOuput,
            " > " + LoggedMessage,
          ]);
        case "Merge Sort":
          setmergeSortConsoleOuput([
            ...mergeSortConsoleOuput,
            " > " + LoggedMessage,
          ]);
        case "Heap Sort":
          setHeapSortConsoleOuput([
            ...heapSortConsoleOuput,
            " > " + LoggedMessage,
          ]);
        case "Breath First Search":
          setbfsAlgorithmsConsoleOuput([
            ...bfsAlgorithmsConsoleOuput,
            " > " + LoggedMessage,
          ]);
        case "Depth First Search":
          setdfsAlgorithmsConsoleOuput([
            ...dfsAlgorithmsConsoleOuput,
            " > " + LoggedMessage,
          ]);

        case "Dijkstra's Alg":
          setdijkstrasAlgConsoleOuput([
            ...dijkstrasAlgConsoleOuput,
            " > " + LoggedMessage,
          ]);
        case "A* Alg":
          setAStarAlgConsoleOuput([
            ...aStarAlgConsoleOuput,
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

    case "Bubble Sort":
      return (
        <>
          <SortingMenu
            Add={Add}
            Remove={Remove}
            Clear={Clear}
            updateSpeed={updateSpeed_}
            speed={speed}
            Input={Input}
            updateInput={updateInput_}
            Sort={Sort}
            Random={Random}
          />
          <div className="Console">Console</div>
          <div className="Console-Text">
            <ul className="list">
              {bubbleSortConsoleOuput.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      );

    case "Insertion Sort":
      return (
        <>
          <SortingMenu
            Add={Add}
            Remove={Remove}
            Clear={Clear}
            updateSpeed={updateSpeed_}
            speed={speed}
            Input={Input}
            updateInput={updateInput_}
            Sort={Sort}
            Random={Random}
          />
          <div className="Console">Console</div>
          <div className="Console-Text">
            <ul className="list">
              {insertionSortConsoleOuput.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      );

    case "Merge Sort":
      return (
        <>
          <SortingMenu
            Add={Add}
            Remove={Remove}
            Clear={Clear}
            updateSpeed={updateSpeed_}
            speed={speed}
            Input={Input}
            updateInput={updateInput_}
            Sort={Sort}
            Random={Random}
          />
          <div className="Console">Console</div>
          <div className="Console-Text">
            <ul className="list">
              {mergeSortConsoleOuput.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      );

    case "Heap Sort":
      return (
        <>
          <SortingMenu
            Add={Add}
            Remove={Remove}
            Clear={Clear}
            updateSpeed={updateSpeed_}
            speed={speed}
            Input={Input}
            updateInput={updateInput_}
            Sort={Sort}
            Random={Random}
          />
          <div className="Console">Console</div>
          <div className="Console-Text">
            <ul className="list">
              {heapSortConsoleOuput.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      );

    case "Breath First Search":
      return (
        <>
          <GraphsMenu
            Clear={Clear}
            updateSpeed={updateSpeed_}
            speed={speed}
            Input={Input}
            updateInput={updateInput_}
            Sort={Sort}
            Random={Random}
          />
          <div className="Console">Console</div>
          <div className="Console-Text">
            <ul className="list">
              {bfsAlgorithmsConsoleOuput.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      );

    case "Depth First Search":
      return (
        <>
          <GraphsMenu
            Clear={Clear}
            updateSpeed={updateSpeed_}
            speed={speed}
            Input={Input}
            updateInput={updateInput_}
            Sort={Sort}
            Random={Random}
          />
          <div className="Console">Console</div>
          <div className="Console-Text">
            <ul className="list">
              {dfsAlgorithmsConsoleOuput.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      );

    case "Dijkstra's Alg":
      return (
        <>
          <GraphsMenu
            Clear={Clear}
            updateSpeed={updateSpeed_}
            speed={speed}
            Input={Input}
            updateInput={updateInput_}
            Sort={Sort}
            Random={Random}
          />
          <div className="Console">Console</div>
          <div className="Console-Text">
            <ul className="list">
              {dijkstrasAlgConsoleOuput.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      );

    case "A* Alg":
      return (
        <>
          <GraphsMenu
            Clear={Clear}
            updateSpeed={updateSpeed_}
            speed={speed}
            Input={Input}
            updateInput={updateInput_}
            Sort={Sort}
            Random={Random}
          />
          <div className="Console">Console</div>
          <div className="Console-Text">
            <ul className="list">
              {aStarAlgConsoleOuput.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      );

    default:
      return (
        <>
          <DefaultMenuScreen />
        </>
      );
  }
}
export default ControleMenu;
ControleMenu.prototype = {
  toggle: PropTypes.func.isRequired,
};
