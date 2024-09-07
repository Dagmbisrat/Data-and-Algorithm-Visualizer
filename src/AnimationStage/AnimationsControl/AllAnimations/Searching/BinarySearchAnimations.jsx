import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

const BinarySearchAnimations = ({
  speed,
  height,
  Add,
  Remove,
  Random,
  Clear,
  Input,
  menuWidth,
  Log,
  Sort,
  Pause,
  setAnimating,
}) => {
  const canvasRef = useRef(null);
  const isMounted = useRef(false);
  const [isAnimating, setisAnimating] = useState(false);
  const isAnimatingRef = useRef(isAnimating);
  const [animationQueue, setAnimationQueue] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [arr, setArr] = useState([]);
  const minBoxHight = 0.1; //the minimum box hight (as a percentage of tecanvas hight)
  const maxBoxHight = 0.8; //the Max box hight (as a percentage of the canvas hight)
  const maxArrsize = 15;
  const boxWidth = 45;
  const maxInt = 99;
  const minInt = -99;
  const normalColor = "#484848";
  const hilightedColor = "#800000";
  const sortedColor = "#228B22";

  //the class that represents the box's'
  class Box {
    constructor(value) {
      this.value = value;
      this.color = normalColor;
    }
    setX(x) {
      this.x = x;
    }
    setY(y) {
      this.y = y;
    }
    setColor(color) {
      this.color = color;
    }
    moveX(value) {
      this.x += value;
    }
    setSorted() {
      this.sorted = true;
    }
    setUnSorted() {
      this.sorted = false;
    }
    equals(box) {
      return this.value == box.value && this.x == box.x && this.y == box.y;
    }

    draw(canvas, context) {
      //draw the box
      context.fillStyle = this.sorted ? sortedColor : this.color;
      context.fillRect(this.x, this.y, boxWidth, canvas.height - this.y);
      context.strokeStyle = "white"; // Use the boxColor prop
      context.strokeRect(this.x, this.y, boxWidth, canvas.height - this.y);
      //Draw the index number
      context.fillStyle = "white";
      context.font = "14px Arial";
      context.fillText(this.value, this.x + 16, this.y + 20);
    }
  }

  const functionMap = {
    setColor: (i) => {
      arr[i].setColor(hilightedColor);
    },
    setSorted: (i) => {
      arr[i].setSorted();
    },
    Log: (str) => {
      Log(str);
    },
    setisAnimating: (bool) => {
      setisAnimating(bool);
    },
  };

  //sends if its animiting
  const sendisAnimating = () => {
    setAnimating(isAnimating);
  };

  function clear(ignoreSort) {
    return new Promise((resolve) => {
      for (const box of arr) {
        if (!ignoreSort) box.setUnSorted();
        box.setColor(normalColor);
      }
      resolve(setArr(arr));
    });
  }

  //helper function that just draws then arr
  function draw() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const box of arr) {
      box.draw(canvas, context);
    }
  }

  //sets isANimating useeffect and ref
  function changeIsAnimating(bool) {
    setisAnimating(bool);
    isAnimatingRef.current = bool;
  }

  function setAnimations() {
    return new Promise((resolve) => {
      clear();
      let left = 0;
      let right = arr.length - 1;
      let mid;
      const target = parseInt(Input, 10);

      Log("searching for " + target);

      while (left <= right) {
        mid = Math.floor((left + right) / 2);

        //animate the cheack
        animationQueue.push(["setColor", mid]); //clear the array of colors first
        if (arr[mid].value === target) break;
        else if (arr[mid].value < target) {
          left = mid + 1; // Search in the right half
        } else {
          right = mid - 1; // Search in the left half
        }
      }

      //if it finds the input its lokking for
      if (arr[mid].value === target) {
        animationQueue.push(["setSorted", mid]);
        animationQueue.push(["Log", `Found ${target} on index ${mid}`]);
      } else {
        //it dosent find the input
        animationQueue.push(["Log", `${target} dosent exisit in the array`]);
      }

      //animation is done
      animationQueue.push(["setisAnimating", false]);

      resolve();
    });
  }

  //goes through the animation queue on where ever it left off
  async function search() {
    //console.log(animationQueue);
    //while paused hasnt been pressed (isAnimating) go through the animation queue
    while (animationQueue.length && isAnimatingRef.current) {
      clear(true);
      const func = animationQueue.shift();
      const args = func.splice(1);

      //console.log(func);
      functionMap[func](...args);
      draw();
      if (animationQueue.length > 2) {
        await new Promise((resolve) => setTimeout(resolve, 1500 - 7 * speed));
      }
    }
  }

  //function that maps a value
  function mapNumber(value, inMin, inMax, outMin, outMax) {
    if (inMin === inMax) {
      // When inMin and inMax are the same, return the midpoint of the output range or outMin
      return outMax;
    }
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  //updates all the x and y values of each box in the array for proper displaying
  const updateAll = () => {
    //everything should happen if the array isnt empty
    if (arr.length > 0) {
      //find the largest value in the array
      const max = arr.reduce((max, current) => {
        return current.value > max.value ? current : max;
      }, arr[0]).value;

      //find the smallest value in the array
      const min = arr.reduce((min, current) => {
        return current.value < min.value ? current : min;
      }, arr[0]).value;

      //Finds the starting x value postion for the array
      var start =
        (windowWidth - menuWidth) / 2 - (arr.length * (boxWidth + 2)) / 2;

      //loop's through the array and updates all the x and y variables for each box
      for (const box of arr) {
        //change x value
        box.setX(start);
        // gets the respective height of each box where the max hight os 80% the canvas height and the smallest 10% of the canvas height
        const h =
          mapNumber(box.value, min, max, minBoxHight, maxBoxHight) *
          (height - 3);

        //change y value
        box.setY(height - 3 - h);

        //move where the x is displayed a box width and a bit to the right
        start = start + boxWidth + 3;
      }
    }
  };

  //A use effect that adds a box to the array when add is pressed
  useEffect(() => {
    //checks if the canvas has alredy mounted so that the use effect dosent run on mount
    //And also makes shure there isnt any annimations going on
    if (isMounted.current && animationQueue.length == 0) {
      //checks if the input is valid
      if (Input == "") {
        Log("Input empty");
      } else if (arr.length >= maxArrsize) {
        //checks if aray is full
        Log("Max Array size reached");
      } else if (parseInt(Input, 10) <= arr[arr.length - 1].value) {
        //makes shure the nex inputed value is larger than the las value in the array
        Log(
          "Input invalid : must be larger than " +
            arr[arr.length - 1].value +
            " to keep its sorted nature",
        );
      } else {
        setArr([...arr, new Box(parseInt(Input, 10))]); //need to parseInt since the bare Input is a string and this causes problems when finding the max and min value in arr
        Log("Added " + Input);
      }
    }
  }, [Add]);

  //Removes the last index in the array wehn remove button is pressed
  useEffect(() => {
    //checks if the canvas has alredy mounted so that the use effect dosent run on mount
    //And also makes sure there isnt any annimations going on
    if (isMounted.current && animationQueue.length == 0) {
      //checks if arr is empty
      if (arr.length < 1) {
        Log("Cannot remove: Array is Empty");
      } else {
        //else remove the last element
        const removedValue = arr[arr.length - 1].value;
        const newArr = arr.slice(0, -1);
        setArr(newArr);
        Log("Remove " + removedValue);
      }
    }
  }, [Remove]);

  //Sets a Random set of arrays for arr
  useEffect(() => {
    if (isMounted.current && animationQueue.length == 0) {
      let array = [];
      array.push(
        new Box(
          Math.floor(Math.random() * (maxInt - maxArrsize - minInt + 1)) +
            minInt,
        ),
      );
      for (let i = 1; i < maxArrsize; i++) {
        const add = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
        array.push(new Box(array[i - 1].value + add));
      }
      setArr(array);
      Log("Set to a Random array ");
    }
  }, [Random]);

  //Handles when clear is pressed (The array is cleard)
  useEffect(() => {
    if (isMounted.current && animationQueue.length == 0) {
      setArr([]);
      Log("Cleard!");
    }
  }, [Clear]);

  useEffect(() => {
    if (isMounted.current && isAnimating) {
      //console.log("pressed pause");
      Log("Paused");
      changeIsAnimating(false);
      //console.log(isAnimating);
    }
  }, [Pause]);

  //handels any sorting
  useEffect(() => {
    //make shure it dosent run on start
    // check if its alredy animation
    if (isMounted.current && !isAnimating) {
      if (arr.length > 0) {
        //set the animation to true
        changeIsAnimating(true);
        //if animationqueue is empty it should set the queue then run through the queue
        if (animationQueue.length == 0) {
          (async () => {
            await setAnimations();
          })();
          search();
        } else {
          //if the animation queue isnt full then it should continue runing through the queue
          Log("Resumed");
          search();
        }
      } else {
        Log("Error: Cannot Search an Empty Array");
      }
    }
  }, [Sort]);

  // chages the windowWidth when window width changes
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      // console.log("resized");
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //Updates Is mounted when after compleation of mountings
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  //handles the resize of the cavas when there is a change in the height
  useEffect(() => {
    sendisAnimating();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (canvas) {
      canvas.height = height - 3;
      canvas.width = windowWidth - menuWidth;
      context.clearRect(0, 0, canvas.width, canvas.height);
      //updates the x and y values then redraws them
      updateAll();
      for (const box of arr) {
        box.draw(canvas, context);
      }
    }
  }, [height, windowWidth, menuWidth, arr, isAnimating]);

  return <canvas className="Canvas-Animation" ref={canvasRef} />;
};
export default BinarySearchAnimations;
BinarySearchAnimations.prototype = {
  toggle: PropTypes.func.isRequired,
};
