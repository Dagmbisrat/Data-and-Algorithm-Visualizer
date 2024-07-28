import { useRef, useEffect, useState } from "react";
import "./AnimationsControl.css";
import PropTypes from "prop-types";
import StacksAnimations from "./AllAnimations/SimpleDataTypes/StacksAnimation.jsx";
import QueuesAnimation from "./AllAnimations/SimpleDataTypes/QueuesAnimation.jsx";
import StackslinkedListAnimations from "./AllAnimations/SimpleDataTypes/Stacks-linkedListAnimation.jsx";
import QueueslinkedListAnimations from "./AllAnimations/SimpleDataTypes/Queues-linkedListAnimation.jsx";
import BubbleSortAnimations from "./AllAnimations/Sorting/BubbleSortAnimations.jsx";
import InsertionSortAnimations from "./AllAnimations/Sorting/InsertionSortAnimations.jsx";
import MergeSortAnimations from "./AllAnimations/Sorting/MergeSortAnimations.jsx";
import HeapSortAnimations from "./AllAnimations/Sorting/HeapSortAnimations.jsx";
import BreathFirstSearchAnimations from "./AllAnimations/Graphs/BreathFirstSearchAnimations.jsx";

const Animations = ({
  Animation_name,
  speed,
  height,
  Add,
  Remove,
  Clear,
  Input,
  menuWidth,
  Log,
  Random,
  Sort,
}) => {
  const canvasRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.height = height - 10;
      canvas.width = windowWidth - menuWidth;
    }
  }, [height, windowWidth, menuWidth]);

  switch (Animation_name) {
    case "Stacks":
      return (
        <StacksAnimations
          speed={speed}
          height={height}
          Push={Add}
          Pop={Remove}
          Clear={Clear}
          Input={Input}
          menuWidth={menuWidth}
          Log={Log}
        />
      );

    case "Stacks-linkedList":
      return (
        <StackslinkedListAnimations
          speed={speed}
          height={height}
          Push={Add}
          Pop={Remove}
          Clear={Clear}
          Input={Input}
          menuWidth={menuWidth}
          Log={Log}
        />
      );

    case "Queues":
      return (
        <QueuesAnimation
          speed={speed}
          height={height}
          Queue={Add}
          UnQueue={Remove}
          Clear={Clear}
          Input={Input}
          menuWidth={menuWidth}
          Log={Log}
        />
      );

    case "Queues-linkedList":
      return (
        <QueueslinkedListAnimations
          speed={speed}
          height={height}
          Queue={Add}
          UnQueue={Remove}
          Clear={Clear}
          Input={Input}
          menuWidth={menuWidth}
          Log={Log}
        />
      );

    case "Bubble Sort":
      return (
        <BubbleSortAnimations
          speed={speed}
          height={height}
          Add={Add}
          Remove={Remove}
          Random={Random}
          Clear={Clear}
          Input={Input}
          menuWidth={menuWidth}
          Log={Log}
          Sort={Sort}
        />
      );

    case "Insertion Sort":
      return (
        <InsertionSortAnimations
          speed={speed}
          height={height}
          Add={Add}
          Remove={Remove}
          Random={Random}
          Clear={Clear}
          Input={Input}
          menuWidth={menuWidth}
          Log={Log}
          Sort={Sort}
        />
      );

    case "Merge Sort":
      return (
        <MergeSortAnimations
          speed={speed}
          height={height}
          Add={Add}
          Remove={Remove}
          Random={Random}
          Clear={Clear}
          Input={Input}
          menuWidth={menuWidth}
          Log={Log}
          Sort={Sort}
        />
      );

    case "Heap Sort":
      return (
        <HeapSortAnimations
          speed={speed}
          height={height}
          Add={Add}
          Remove={Remove}
          Random={Random}
          Clear={Clear}
          Input={Input}
          menuWidth={menuWidth}
          Log={Log}
          Sort={Sort}
        />
      );
    case "Breath First Search":
      return (
        <BreathFirstSearchAnimations
          speed={speed}
          height={height}
          Random={Random}
          Clear={Clear}
          Input={Input}
          menuWidth={menuWidth}
          Log={Log}
          Search={Sort}
        />
      );

    default:
      return <canvas className="DefaultCanvas" ref={canvasRef} />;
  }
};
export default Animations;
Animations.prototype = {
  toggle: PropTypes.func.isRequired,
};
