import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

const InsertionSortAnimations = ({
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
  setAnimating,
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
  const keyBoxLengthAndWidth = 50;
  const space = 20;
  const maxInt = 99;
  const minInt = -99;
  const maxFrames = 60;
  const normalColor = "gray";
  const hilightedColor = "red";

  //the class that represents the box's'
  class Box {
    constructor(value) {
      this.value = value;
      this.sorted = false;
    }
    setX(x) {
      this.x = x;
    }
    setY(y) {
      this.y = y;
    }
    moveX(value) {
      this.x = this.x + value;
    }
    moveY(value) {
      this.y += value;
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

    draw(canvas, context, color) {
      //draw the box
      context.fillStyle = this.sorted ? "green" : color;
      context.fillRect(this.x, this.y, boxWidth, canvas.height - this.y);
      context.strokeStyle = "white"; // Use the boxColor prop
      context.strokeRect(this.x, this.y, boxWidth, canvas.height - this.y);
      //Draw the index number
      context.fillStyle = "white";
      context.font = "14px Arial";
      context.fillText(this.value, this.x + 16, this.y + 20);
    }

    drawAsKey(canvas, context, color) {
      const x = canvas.width - (keyBoxLengthAndWidth + space);
      const y = space;
      //draw the box filled
      context.fillStyle = color;
      context.fillRect(x, y, keyBoxLengthAndWidth, keyBoxLengthAndWidth);

      //draw the outline
      context.strokeStyle = "white"; // Use the boxColor prop
      context.strokeRect(x, y, keyBoxLengthAndWidth, keyBoxLengthAndWidth);

      //Draw the index number
      context.fillStyle = "white";
      context.font = "14px Arial";
      context.fillText(this.value, x + 13, y + 30);

      //Draw the Key tag
      context.fillStyle = "white";
      context.font = "16px Arial";
      context.fillText("Key", x + 9, y + (keyBoxLengthAndWidth + space));
    }
  }

  //sends if its animiting
  const sendisAnimating = () => {
    setAnimating(isAnimating);
  };

  function clear() {
    return new Promise((resolve) => {
      for (const box of arr) {
        box.setUnSorted();
      }
      resolve(setArr(arr));
    });
  }

  //Animates comparing two box's
  function wait(key) {
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
          //cheak if the box is the key
          if (box.equals(key)) {
            box.drawAsKey(canvas, context, hilightedColor);
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
        } else {
          // Reset the frame counter and stop the animation
          for (const box of arr) {
            box.draw(canvas, context, normalColor);
          }

          resolve();
        }
      }

      drawFrame();
    });
  }

  //Animate the Swap
  function animateSwap(box1, box2, key) {
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
          //first check if its the key
          //if yes then draw as key only
          if (box.equals(key)) {
            box.drawAsKey(canvas, context, hilightedColor);
          } else {
            //if not check if its box1 or box2
            //if then draw with highlited colors
            if (box.equals(box1) || box.equals(box2)) {
              box.draw(canvas, context, hilightedColor);
            } else {
              //if not then just draw normally
              box.draw(canvas, context, normalColor);
            }
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
            if (box.equals(key)) {
              box.drawAsKey(canvas, context, hilightedColor);
            } else {
              box.draw(canvas, context, normalColor);
            }
          }

          resolve();
        }
      }
      drawFrame();
    });
  }

  //animates the key selection
  function animateStoreKey(key) {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const context = canvasRef.current.getContext("2d");
      const totalFrames = maxFrames - speed / 2;
      const startX = key.x + 20;
      const startY = key.y + 20;
      const endX = canvas.width - keyBoxLengthAndWidth;
      const endY = 20 + 30;
      const xdiffrance = Math.abs(endX - startX);
      const ydiffrance = Math.abs(endY - startY);
      const xIncrament = xdiffrance / totalFrames;
      const yIncrament = ydiffrance / totalFrames;
      let x = startX;
      let y = startY;
      let frameCounter = 0;

      function drawFrame() {
        //clean the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        //incrament
        x = x + xIncrament;
        y = y - yIncrament;

        //draw the boxes
        for (const box of arr) {
          if (box.equals(key)) {
            box.draw(canvas, context, hilightedColor);
          } else {
            box.draw(canvas, context, normalColor);
          }
        }

        //Draw the index number
        context.fillStyle = "white";
        context.font = "14px Arial";
        context.fillText(key.value, x, y);

        // Draw the box
        context.strokeStyle = "white"; // Use the boxColor prop
        context.strokeRect(canvas.width - 70, 20, 50, 50);

        // Draw the key
        context.fillStyle = "white";
        context.font = "16px Arial";
        context.fillText("Key", canvas.width - 70 + 9, 20 + 70);

        //incrament the frame counter
        frameCounter++;

        // Check if the max frames limit is reached
        if (frameCounter < totalFrames) {
          // Request the next frame
          requestAnimationFrame(drawFrame);
        } else {
          //end the animation
          for (const box of arr) {
            if (box.equals(key)) {
              box.drawAsKey(canvas, context, hilightedColor);
            } else {
              box.draw(canvas, context, normalColor);
            }
          }
          resolve();
        }
      }

      drawFrame();
    });
  }

  //animates puttin the key to the correct postion
  function animatePlaceKey(box, key) {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const context = canvasRef.current.getContext("2d");
      const totalFrames = maxFrames - speed / 2;
      const startX = canvas.width - keyBoxLengthAndWidth;
      const startY = 20 + 30;
      const endX = box.x + 20;
      const endY = box.y + 20;
      const xdiffrance = Math.abs(endX - startX);
      const ydiffrance = Math.abs(endY - startY);
      const xIncrament = xdiffrance / totalFrames;
      const yIncrament = ydiffrance / totalFrames;
      let x = startX;
      let y = startY;
      let frameCounter = 0;

      function drawFrame() {
        //clean the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        //incrament
        x = x - xIncrament;
        y = y + yIncrament;

        //draw the boxes
        for (const box of arr) {
          if (!box.equals(key)) {
            box.draw(canvas, context, normalColor);
          }
        }

        //Draw the index number
        context.fillStyle = "white";
        context.font = "14px Arial";
        context.fillText(key.value, x, y);

        // Draw the box
        context.strokeStyle = "white"; // Use the boxColor prop
        context.strokeRect(canvas.width - 70, 20, 50, 50);

        // Draw the key
        context.fillStyle = "white";
        context.font = "16px Arial";
        context.fillText("Key", canvas.width - 70 + 9, 20 + 70);

        //incrament the frame counter
        frameCounter++;

        // Check if the max frames limit is reached
        if (frameCounter < totalFrames) {
          // Request the next frame
          requestAnimationFrame(drawFrame);
        } else {
          //end the animation
          context.clearRect(0, 0, canvas.width, canvas.height);
          for (const box of arr) {
            box.draw(canvas, context, normalColor);
          }
          resolve();
        }
      }

      drawFrame();
    });
  }

  async function play() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    await clear();

    setisAnimating(true); //first set animating to true

    let tempArr = arr;
    tempArr[0].setSorted();
    setArr(tempArr);

    for (let i = 1; i < arr.length; i++) {
      // Store the key
      // Animate the storing of the key
      let key = arr[i];

      await animateStoreKey(key);

      // wait a few frames
      await wait(key);

      // Start comparing with the previous elements
      let j = i - 1;

      // Move elements that are greater than key
      // to one position ahead of their current position
      while (j >= 0 && arr[j].value > key.value) {
        //animate the switch
        await animateSwap(arr[j + 1], arr[j], key);
        let tempArr = arr;
        const tempBox = tempArr[j + 1];
        tempArr[j + 1] = tempArr[j];
        tempArr[j] = tempBox;
        setArr(tempArr);
        j--;
      }

      //set it to be part of the sorted array
      tempArr = arr;
      tempArr[j + 1].setSorted();
      setArr(tempArr);

      // wait a few frames
      await wait(key);

      // Animate Placeing key in its correct position
      await animatePlaceKey(arr[j + 1], key);
    }
    for (let i = 0; i < arr.length; i++) {
      arr[i].setSorted();
      arr[i].draw(canvas, context, normalColor);
    }
    setisAnimating(false);
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
    //makes shure the componet is alredy monted
    //also makes sure it isn't alredy animating
    if (isMounted.current && !isAnimating) {
      if (arr.length > 0) {
        play();
      } else {
        Log("Error: Cannot Sort an Empty Array");
      }
    }
  }, [Sort]);

  // chages the windowWidth when window width changes
  useEffect(() => {
    sendisAnimating();
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
    sendisAnimating();
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
      //console.log(isAnimating);
      canvas.height = height - 3;
      canvas.width = windowWidth - menuWidth;
      context.clearRect(0, 0, canvas.width, canvas.height);
      //updates the values then draws them only when its not sorting
      updateAll();
      for (const box of arr) {
        box.draw(canvas, context, normalColor);
      }
    }
  }, [height, windowWidth, menuWidth, arr, isAnimating]);

  return <canvas className="StacksAnimationCanvas" ref={canvasRef} />;
};
export default InsertionSortAnimations;
InsertionSortAnimations.prototype = {
  toggle: PropTypes.func.isRequired,
};
