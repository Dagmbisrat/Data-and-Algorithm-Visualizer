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
import DepthFirstSearchAnimations from "./AllAnimations/Graphs/DepthFirstSearchAnimations.jsx";
import DijkstrasAlgAnimations from "./AllAnimations/Graphs/dijkstrasAlgAnimations.jsx";
import AStarAlgAniamtions from "./AllAnimations/Graphs/AStarAlgAnimations.jsx";
import DefaultScreen from "./AllAnimations/Default/DefaultAnimations.jsx";
import LinearSearchAnimations from "./AllAnimations/Searching/LinearSearchAnimations.jsx";
import BinarySearchAnimations from "./AllAnimations/Searching/BinarySearchAnimations.jsx";
import TestAnimations from "../../../test.jsx";

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
  Pause,
  setAnimating,
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

    case "Linear Search":
      return (
        <LinearSearchAnimations
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
          Pause={Pause}
          setAnimating={setAnimating}
        />
      );

    case "Binary Search":
      return (
        <BinarySearchAnimations
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
          Pause={Pause}
          setAnimating={setAnimating}
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
          Pause={Pause}
          setAnimating={setAnimating}
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
          Pause={Pause}
          setAnimating={setAnimating}
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
          Pause={Pause}
          setAnimating={setAnimating}
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
          Pause={Pause}
          setAnimating={setAnimating}
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
          Pause={Pause}
          setAnimating={setAnimating}
        />
      );
    case "Depth First Search":
      return (
        <DepthFirstSearchAnimations
          speed={speed}
          height={height}
          Random={Random}
          Clear={Clear}
          Input={Input}
          menuWidth={menuWidth}
          Log={Log}
          Search={Sort}
          Pause={Pause}
          setAnimating={setAnimating}
        />
      );
    case "Dijkstra's Alg":
      return (
        <DijkstrasAlgAnimations
          speed={speed}
          height={height}
          Random={Random}
          Clear={Clear}
          Input={Input}
          menuWidth={menuWidth}
          Log={Log}
          Search={Sort}
          Pause={Pause}
          setAnimating={setAnimating}
        />
      );

    case "A* Alg":
      return (
        <AStarAlgAniamtions
          speed={speed}
          height={height}
          Random={Random}
          Clear={Clear}
          Input={Input}
          menuWidth={menuWidth}
          Log={Log}
          Search={Sort}
          Pause={Pause}
          setAnimating={setAnimating}
        />
      );

    default:
      return <DefaultScreen />;
  }
};
export default Animations;
Animations.prototype = {
  toggle: PropTypes.func.isRequired,
};
