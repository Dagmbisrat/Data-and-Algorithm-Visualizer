import { useRef, useEffect, useState } from "react";
import "./BubbleSortAnimations.css";
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
}) => {
  const canvasRef = useRef(null);
  const isMounted = useRef(false);
  const [isAnimating, setisAnimating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [arr, setArr] = useState([]);
  const minBoxHight = 0.1; //the minimum box hight (as a percentage of tecanvas hight)
  const maxBoxHight = 0.8; //the Max box hight (as a percentage of the canvas hight)
  const maxArrsize = 15;
  const boxWidth = 45;
  const maxInt = 99;
  const minInt = -99;
  const maxFrames = 55;
  const normalColor = "gray";
  const hilightedColor = "red";

  //the class that represents the box's'
  class Box {
    constructor(value) {
      this.value = value;
    }
    setX(x) {
      this.x = x;
    }
    setY(y) {
      this.y = y;
    }
    moveX(value) {
      this.x += value;
    }

    setSorted() {
      this.sorted = true;
    }

    equals(box) {
      return this.value == box.value && this.x == box.x && this.y == box.y;
    }

    draw(canvas, context, color) {
      //draw the box
      context.fillStyle = this.sorted ? "green" : color;
      context.fillRect(this.x, this.y, boxWidth, canvas.height - this.y);
      context.strokeStyle = "white"; // Use the boxColor prop
      context.strokeRect(this.x, this.y, boxWidth, canvas.height - this.y);
      //Draw the index number
      context.fillStyle = "white";
      context.font = "14px Arial";
      context.fillText(this.value, this.x + 20, this.y + 20);
    }
  }

  //Animates comparing two box's
  function animateCompare(box1, box2) {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const context = canvasRef.current.getContext("2d");
      let frameCounter = 0;

      //draw the array logic
      function drawFrame() {
        //clean the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        //display the array
        for (const box of arr) {
          //cheak if the box your at is either box 1 or box 2 then display it with a diffrent color
          if (box.equals(box1) || box.equals(box2)) {
            box.draw(canvas, context, hilightedColor);
          } else {
            box.draw(canvas, context, normalColor);
          }
        }

        //incrament the frame counter
        frameCounter++;

        // Check if the max frames limit is reached
        if (frameCounter < maxFrames - speed / 2) {
          // Request the next frame
          requestAnimationFrame(drawFrame);
          //console.log("frame played");
        } else {
          // Reset the frame counter and stop the animation
          for (const box of arr) {
            box.draw(canvas, context, normalColor);
          }
          //console.log("Animation complete");
          resolve();
        }
      }

      drawFrame();
    });
  }
  //Animate the Swap
  function animateSwap(box1, box2) {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const context = canvasRef.current.getContext("2d");
      const distanceApart = Math.abs(box1.x - box2.x);
      const incramentValue = distanceApart / (maxFrames - speed / 2);
      const isBox1RightofBox2 = box1.x > box2.x;
      let frameCounter = 0;

      //console.log(speed);

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
          //cheak if the box your at is either box 1 or box 2 then display it with a diffrent color
          box.draw(canvas, context, normalColor);
        }
        box1.draw(canvas, context, hilightedColor);
        box2.draw(canvas, context, hilightedColor);

        //incrament the frame counter
        frameCounter++;

        // Check if the max frames limit is reached
        if (frameCounter < maxFrames - speed / 2) {
          // Request the next frame
          requestAnimationFrame(drawFrame);
          //console.log("frame played");
        } else {
          // Reset the frame counter and stop the animation
          for (const box of arr) {
            box.draw(canvas, context, normalColor);
          }
          //console.log("swap complete");
          resolve();
        }
      }
      drawFrame();
    });
  }

  async function play() {
    setisAnimating(true); //first set animating to true
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - 1 - i; j++) {
        //play the animation that compare
        await animateCompare(arr[j], arr[j + 1]);
        if (arr[j].value > arr[j + 1].value) {
          //play the swap animation and swap elements
          await animateSwap(arr[j], arr[j + 1]);
          let tmpArr = arr;
          let temp = tmpArr[j];
          tmpArr[j] = tmpArr[j + 1];
          tmpArr[j + 1] = temp;
          setArr(tmpArr);
          swapped = true;
        }
      }
      // If no two elements were swapped in the inner loop, then the array is sorted
      if (!swapped) break;
    }

    const canvas = canvasRef.current;
    const context = canvasRef.current.getContext("2d");

    for (let i = 0; i < arr.length; i++) {
      arr[i].setSorted();
      arr[i].draw(canvas, context, normalColor);
    }
    setisAnimating(false); //first set animating to true
    Log("sorted");
  }

  //function that maps a value
  function mapNumber(value, inMin, inMax, outMin, outMax) {
    if (inMin === inMax) {
      // When inMin and inMax are the same, return the midpoint of the output range or outMin
      return outMax;
    }
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  //updates the Y values
  const updateY = () => {
    if (arr.length > 0) {
      //find the largest value in the array
      const max = arr.reduce((max, current) => {
        return current.value > max.value ? current : max;
      }, arr[0]).value;

      //find the smallest value in the array
      const min = arr.reduce((min, current) => {
        return current.value < min.value ? current : min;
      }, arr[0]).value;

      for (const box of arr) {
        // gets the respective height of each box where the max hight os 80% the canvas height and the smallest 10% of the canvas height
        const h =
          mapNumber(box.value, min, max, minBoxHight, maxBoxHight) *
          (height - 3);

        //change y value
        box.setY(height - 3 - h);
      }
    }
  };

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
    if (isMounted.current && !isAnimating) {
      //checks if the input is valid
      if (Input == "") {
        Log("Input empty");
      } else if (arr.length >= maxArrsize) {
        //checks if aray is full
        Log("Max Array size reached");
      } else {
        setArr([...arr, new Box(parseInt(Input, 10))]); //need to parseInt since the bare Input is a string and this causes problems when finding the max and min value in arr
        Log("Added " + Input);
        console.log(arr);
      }
    }
  }, [Add]);

  //Removes the last index in the array wehn remove button is pressed
  useEffect(() => {
    //checks if the canvas has alredy mounted so that the use effect dosent run on mount
    //And also makes sure there isnt any annimations going on
    if (isMounted.current && !isAnimating) {
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
    if (isMounted.current && !isAnimating) {
      var array = [];
      for (var i = 0; i < maxArrsize; i++) {
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
    if (isMounted.current && !isAnimating) {
      setArr([]);
      Log("Cleard!");
    }
  }, [Clear]);

  //handels any sorting
  useEffect(() => {
    //make shure it dosent run on start
    // check if its alredy animation
    if (isMounted.current && !isAnimating) {
      play();
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
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (canvas) {
      canvas.height = height - 3;
      canvas.width = windowWidth - menuWidth;
      context.clearRect(0, 0, canvas.width, canvas.height);
      //updates the x and y values then redraws them
      // console.log(isAnimating);
      updateAll();
      for (const box of arr) {
        box.draw(canvas, context, normalColor);
      }
    }
  }, [height, windowWidth, menuWidth, arr, isAnimating]);

  return <canvas className="StacksAnimationCanvas" ref={canvasRef} />;
};
export default BubbleSortAnimations;
BubbleSortAnimations.prototype = {
  toggle: PropTypes.func.isRequired,
};
