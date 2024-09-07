import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

const BubbleSortAnimations = ({
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [arr, setArr] = useState([]);
  const [animationQueue, setAnimationQueue] = useState([]);
  const minBoxHight = 0.1; //the minimum box hight (as a percentage of tecanvas hight)
  const maxBoxHight = 0.8; //the Max box hight (as a percentage of the canvas hight)
  const maxArrsize = 15;
  const boxWidth = 45;
  const maxInt = 99;
  const minInt = -99;
  const maxFrames = 55;
  const normalColor = "#484848";
  const hilightedColor = "#800000";
  const sortedColor = "#228B22";

  //the class that represents the box's'
  class Box {
    constructor(value, x, y) {
      if (arguments.length == 1) {
        this.value = value;
        this.color = normalColor;
      } else {
        this.value = value;
        this.color = normalColor;
        this.x = x;
        this.y = y;
      }
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
    setColors: (i, j) => {
      arr[i].setColor(hilightedColor);
      arr[j].setColor(hilightedColor);
    },
    setSortedAll: () => {
      setSortedAll();
    },
    animateSwap: async (i, j) => {
      await animateSwap(arr[i], arr[j]);
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

  //helper function that sorts all the box's in the arr
  function setSortedAll() {
    for (let i = 0; i < arr.length; i++) {
      arr[i].setSorted();
    }
  }

  //sends a copy of the array
  function copyArr() {
    const temp = [];
    for (let i = 0; i < arr.length; i++) {
      temp.push(new Box(arr[i].value, arr[i].x, arr[i].y));
      temp[i].setColor(arr[i].color);
    }
    return temp;
  }

  //finds the indexof a box in the arr
  function indexArr(box) {
    for (let i = 0; i < arr.length; i++) {
      if (box.equals(arr[i])) return i;
    }
  }

  //sets isAnimating useeffect and ref
  function changeIsAnimating(bool) {
    setisAnimating(bool);
    isAnimatingRef.current = bool;
  }

  //Animate the Swap
  function animateSwap(box1, box2) {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const context = canvasRef.current.getContext("2d");
      const distanceApart = Math.abs(box1.x - box2.x);
      const incramentValue = distanceApart / (maxFrames - speed / 2);
      const isBox1RightofBox2 = box1.x > box2.x;
      const j = indexArr(box1);
      const i = indexArr(box2);
      let frameCounter = 0;
      arr[i].setColor(hilightedColor);
      arr[j].setColor(hilightedColor);
      draw();

      function drawFrame() {
        //clean the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        //incrament
        if (isBox1RightofBox2) {
          //move box1 left and box2 right
          box1.moveX(-incramentValue);
          box2.moveX(incramentValue);
        } else {
          //move box2 left and box1 right
          box1.moveX(incramentValue);
          box2.moveX(-incramentValue);
        }

        //display the array
        for (const box of arr) {
          box.draw(canvas, context);
        }

        //incrament the frame counter
        frameCounter++;

        // Check if the max frames limit is reached
        if (frameCounter < maxFrames - speed / 2) {
          // Request the next frame
          requestAnimationFrame(drawFrame);
          //console.log("next frame");
        } else {
          swap(arr, j, i);
          resolve();
        }
      }
      drawFrame();
    });
  }

  //goes through the animation queue on where ever it left off
  async function sort() {
    await new Promise((resolve) => setTimeout(resolve, 10));
    //while paused hasnt been pressed (isAnimating) go through the animation queue
    while (animationQueue.length && isAnimatingRef.current) {
      clear(true);
      const func = animationQueue.shift();
      const args = func.splice(1);

      //console.log(func);
      functionMap[func](...args);
      draw();
      if (animationQueue.length >= 2) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1500 - 14.5 * speed),
        );
      } else {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }
  }

  function swap(arr, j, i) {
    let tmpArr = arr;
    let temp = tmpArr[j];
    tmpArr[j] = tmpArr[i];
    tmpArr[i] = temp;
    setArr(tmpArr);
    setArr(copyArr());
  }

  //sets the animation queue for the spesific arr
  function setAnimations() {
    return new Promise((resolve) => {
      clear(false);
      const tempArr = copyArr();

      let n = tempArr.length;
      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
          //play the animation that compare
          animationQueue.push(["setColors", j, j + 1]);

          //await animateCompare(tempArr[j], tempArr[j + 1]);
          if (tempArr[j].value > tempArr[j + 1].value) {
            //play the swap animation and swap elements

            animationQueue.push(["animateSwap", j, j + 1]);

            //swap
            let temp = tempArr[j];
            tempArr[j] = tempArr[j + 1];
            tempArr[j + 1] = temp;

            swapped = true;
          }
        }
        // If no two elements were swapped in the inner loop, then the array is sorted
        if (!swapped) break;
      }

      animationQueue.push(["setSortedAll", null]);
      animationQueue.push(["Log", "sorted"]);
      //animation is done
      animationQueue.push(["setisAnimating", false]);

      resolve();
    });
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
    if (isMounted.current && !animationQueue.length) {
      //checks if the input is valid
      if (Input == "") {
        Log("Input empty");
      } else if (arr.length >= maxArrsize) {
        //checks if aray is full
        Log("Max Array size reached");
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
    if (isMounted.current && !animationQueue.length) {
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
    if (isMounted.current && !animationQueue.length) {
      var array = [];
      const ranNum = Math.floor(Math.random() * maxArrsize) + 2;
      for (var i = 0; i < ranNum; i++) {
        array.push(
          new Box(Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt),
        );
      }
      setArr(array);
      Log("Set to a Random array ");
    }
  }, [Random]);

  //Handles when clear is pressed (The array is cleard)
  useEffect(() => {
    if (isMounted.current && !animationQueue.length) {
      setArr([]);
      Log("Cleard!");
    }
  }, [Clear]);

  //Handels when pause button is pressed
  useEffect(() => {
    if (isMounted.current && isAnimating) {
      //Makes shure multiple clickes wont be registed at once

      Log("Paused");
      //console.log("Paused");
      changeIsAnimating(false);
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
        if (!animationQueue.length) {
          (async () => {
            await setAnimations();
            //console.log(animationQueue);
          })();
          sort();
        } else {
          //if the animation queue isnt full then it should continue runing through the queue
          Log("Resumed");
          sort();
        }
      } else {
        Log("Error: Cannot Sort an Empty Array");
      }
    }
  }, [Sort]);

  //pauses the animation if teh windown is changed when animating
  useEffect(() => {
    if (isMounted.current && isAnimating) {
      Log("Paused");

      changeIsAnimating(false);
    }
  }, [menuWidth, windowWidth]);

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
      draw();
    }
  }, [height, windowWidth, menuWidth, arr, isAnimating]);

  return <canvas className="Canvas-Animation" ref={canvasRef} />;
};
export default BubbleSortAnimations;
BubbleSortAnimations.prototype = {
  toggle: PropTypes.func.isRequired,
};
