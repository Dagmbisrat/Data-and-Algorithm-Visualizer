import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

const HeapSortAnimations = ({
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
  const maxBoxHight = 0.9; //the Max box hight (as a percentage of the canvas hight)
  const maxArrsize = 15;
  const boxWidth = 45;
  const radius = 20;
  const space = 20;
  const yValue = height - 3 - (height - 3) * maxBoxHight;
  const treeStarty = yValue + boxWidth + radius + space;
  const maxInt = 99;
  const minInt = -99;
  const maxFrames = 60;
  const xspaceBetween = 70;
  const normalColor = "#484848";
  const hilightedColor = "#800000";
  const sortedColor = "#228B22";

  //the class that represents the box's'
  class Box {
    constructor(value) {
      this.value = value;
      this.display = true;
      this.sorted = false;

      this.setUnSorted();
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
    setDisplay(value) {
      this.display = value;
    }
    equals(box) {
      return this.value == box.value && this.x == box.x && this.y == box.y;
    }

    draw(context, color) {
      if (this.display) {
        //draw the box
        context.fillStyle = this.sorted ? sortedColor : color;
        context.fillRect(this.x, this.y, boxWidth, boxWidth);
        context.strokeStyle = "white"; // Use the boxColor prop
        context.strokeRect(this.x, this.y, boxWidth, boxWidth);
        //Draw the index number
        context.fillStyle = "white";
        context.font = "14px Arial";
        context.fillText(
          this.value,
          this.x + boxWidth / 2 - 9,
          this.y + boxWidth / 2 + 5,
        );
      }
    }

    drawinHeap(context, color) {
      if (this.display) {
        //draw the full circle
        context.fillStyle = this.sorted ? sortedColor : color;
        context.beginPath();
        context.arc(this.x, this.y, radius, 0, 2 * Math.PI);
        context.fill();

        //draw the circle outline
        context.strokeStyle = "white"; // Use the boxColor prop
        context.beginPath();
        context.arc(this.x, this.y, radius, 0, 2 * Math.PI);
        context.stroke();

        //Draw the index number
        context.fillStyle = "white";
        context.font = "14px Arial";
        context.fillText(this.value, this.x - 7, this.y + 4);
      }
    }
  }

  //sets isAnimating useeffect and ref
  function changeIsAnimating(bool) {
    setisAnimating(bool);
    isAnimatingRef.current = bool;
  }

  const functionMap = {
    animateCompare: async (side, largest, arry) => {
      await animateCompare(side, largest, arr);
    },
    animateSwap: async (i, largest, arry) => {
      await animateSwap(i, largest, arr);
    },
    set: (arr, i) => {
      if (i) arr[i].setSorted();
      setArr(arr);
      updateAll();
    },
    end: (arr) => {
      arr[0].setSorted();

      setArr(arr);
      updateAll();

      setisAnimating(false);
      Log("sorted");
    },
  };
  //sends if its animiting
  const sendisAnimating = () => {
    setAnimating(isAnimating);
  };

  //clear the green
  function clear() {
    return new Promise((resolve) => {
      for (const box of arr) {
        box.setUnSorted();
      }
      resolve(setArr(arr));
    });
  }

  //helper function that returns an array of copied box's
  function copyArray(array) {
    let tempArr = [];

    for (const box of array) {
      let boxCopy = new Box(box.value);
      boxCopy.setX(box.x);
      boxCopy.setY(box.y);
      if (box.sorted) {
        boxCopy.setSorted(box.sorted);
      }

      tempArr.push(boxCopy);
    }
    return tempArr;
  }

  function drawHeap(
    context,
    arr,
    index1 = null,
    index2 = null,
    turnoff = false,
    connect = null,
  ) {
    let arrTree = copyArray(arr);
    for (let i = 0; i < arrTree.length; i++) {
      //update there new x and y values
      arrTree[i].setX(findX(i));
      arrTree[i].setY(findY(i));

      //draw the lines
      const x1 = connect ? arrTree[i].x : findX(i);
      const y1 = connect ? arrTree[i].y : findY(i);
      const leftchild = 2 * i + 1;
      const rightchild = 2 * i + 2;

      //if left child exists
      if (leftchild < arrTree.length) {
        const x2 = connect ? arrTree[leftchild].x : findX(leftchild);
        const y2 = connect ? arrTree[leftchild].y : findY(leftchild);
        drawLine(context, x1, y1, x2, y2);
      }

      //if right child exists
      if (rightchild < arrTree.length) {
        const x2 = connect ? arrTree[rightchild].x : findX(rightchild);
        const y2 = connect ? arrTree[rightchild].y : findY(rightchild);
        drawLine(context, x1, y1, x2, y2);
      }

      if (index1 == i) {
        if (!turnoff) arrTree[i].drawinHeap(context, hilightedColor);
      } else if (index2 == i) {
        if (!turnoff) arrTree[i].drawinHeap(context, hilightedColor);
      } else {
        arrTree[i].drawinHeap(context, normalColor);
      }
    }
  }

  // Function to draw a line
  function drawLine(context, x1, y1, x2, y2) {
    context.strokeStyle = "white"; // Set the stroke color to red
    context.beginPath(); // Begin a new path
    context.moveTo(x1, y1); // Move the pen to (x1, y1)
    context.lineTo(x2, y2); // Draw a line to (x2, y2)
    context.stroke(); // Render the line
  }

  //Animate the Swap
  function animateSwap(parentIndex, childIndex, arr) {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const context = canvasRef.current.getContext("2d");

      //create new circiles to draw over
      let parentInHeap = new Box(arr[parentIndex].value);
      parentInHeap.setX(findX(parentIndex));
      parentInHeap.setY(findY(parentIndex));

      let childInHeap = new Box(arr[childIndex].value);
      childInHeap.setX(findX(childIndex));
      childInHeap.setY(findY(childIndex));

      let parent = new Box(arr[parentIndex].value);
      parent.setX(arr[parentIndex].x);
      parent.setY(arr[parentIndex].y);

      let child = new Box(arr[childIndex].value);
      child.setX(arr[childIndex].x);
      child.setY(arr[childIndex].y);

      const numOfFrames = maxFrames - speed / 2;

      //find x and y displacements for the heap that are swaping
      const inHeapdisplacementX = childInHeap.x - parentInHeap.x;
      const inHeapdisplacementy = childInHeap.y - parentInHeap.y;

      //x displacement for the array that is switching
      const displacementx = arr[childIndex].x - arr[parentIndex].x;

      const incramentx = displacementx / numOfFrames;
      const inHeapIncramentx = inHeapdisplacementX / numOfFrames;
      const inHeapIncramenty = inHeapdisplacementy / numOfFrames;

      //wont display the real parant and child that are switching
      //as its animating the switch
      const off = true;

      let frameCounter = 0;

      function drawFrame() {
        //clean the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        //incrament
        parent.moveX(incramentx);
        child.moveX(-incramentx);

        parentInHeap.moveX(inHeapIncramentx);
        parentInHeap.moveY(inHeapIncramenty);
        childInHeap.moveX(-inHeapIncramentx);
        childInHeap.moveY(-inHeapIncramenty);

        //draw array
        for (let i = 0; i < arr.length; i++) {
          if (i != parentIndex && i != childIndex) {
            arr[i].draw(context, normalColor);
          }
        }
        parent.draw(context, hilightedColor);
        child.draw(context, hilightedColor);

        //draw heap
        drawHeap(context, arr, parentIndex, childIndex, off);
        parentInHeap.drawinHeap(context, hilightedColor);
        childInHeap.drawinHeap(context, hilightedColor);

        //incrament the frame counter
        frameCounter++;

        // Check if the max frames limit is reached
        if (frameCounter < numOfFrames) {
          // Request the next frame
          requestAnimationFrame(drawFrame);
        } else {
          [arr[parentIndex].value, arr[childIndex].value] = [
            arr[childIndex].value,
            arr[parentIndex].value,
          ];
          if (arr[parentIndex].value < arr[childIndex].value)
            arr[childIndex].setSorted();

          // Recursively heapify the affected sub-tree
          setArr(arr);
          updateAll();
          resolve();
        }
      }

      drawFrame();
    });
  }

  //Animates comparing two box's
  function animateCompare(childIndex, parentIndex, arr) {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const context = canvasRef.current.getContext("2d");
      let frameCounter = 0;
      const numOfFrames = maxFrames - speed / 2;

      //draw the array logic
      function drawFrame() {
        //clean the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        //draw array
        for (let i = 0; i < arr.length; i++) {
          if (i != parentIndex && i != childIndex) {
            arr[i].draw(context, normalColor);
          } else {
            arr[i].draw(context, hilightedColor);
          }
        }

        //draw heap
        drawHeap(context, arr, parentIndex, childIndex);

        //incrament the frame counter
        frameCounter++;

        // Check if the max frames limit is reached
        if (frameCounter < numOfFrames) {
          // Request the next frame
          requestAnimationFrame(drawFrame);
        } else {
          resolve();
        }
      }

      drawFrame();
    });
  }

  async function heapify(arr, n, i) {
    return new Promise(async (resolve) => {
      let largest = i; // Initialize largest as root
      let left = 2 * i + 1; // left child index
      let right = 2 * i + 2; // right child index

      let temp = copyArray(arr);

      //animate compareing the left to the largest
      animationQueue.push(["animateCompare", left, largest, copyArray(arr)]);

      // If left child is larger than root
      if (left < n && arr[left].value > arr[largest].value) {
        //console;
        largest = left;
      }

      //animate compareing the left to the largest
      animationQueue.push(["animateCompare", right, largest, copyArray(arr)]);

      // If right child is larger than largest so far
      if (right < n && arr[right].value > arr[largest].value) {
        largest = right;
      }

      // If largest is not root
      if (largest !== i) {
        //animate Swap

        animationQueue.push(["animateSwap", i, largest, copyArray(arr)]);

        // Move current root to end
        [temp[largest].value, temp[i].value] = [
          temp[i].value,
          temp[largest].value,
        ];

        // Recursively heapify the affected sub-tree
        setArr(temp);
        updateAll();

        temp = await heapify(temp, n, largest);
      }

      resolve(temp);
    });
  }

  function setAnimations() {
    return new Promise(async (resolve) => {
      //clear all green before starting
      clear();

      //Build a max heap
      let n = arr.length;
      let temp = copyArray(arr);
      for (const box of temp) {
        box.sorted = false;
      }

      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        temp = await heapify(temp, n, i);

        animationQueue.push(["set", copyArray(temp)]);
      }

      // Extract elements from heap one by one
      for (let i = n - 1; i > 0; i--) {
        //animate the swap
        animationQueue.push(["animateSwap", 0, i, copyArray(temp)]);

        // Move current root to end
        [temp[0].value, temp[i].value] = [temp[i].value, temp[0].value];

        temp[i].setSorted();
        animationQueue.push(["set", copyArray(temp), i]);

        // Call max heapify on the reduced heap
        temp = await heapify(temp, i, 0);
        animationQueue.push(["set", copyArray(temp)]);
      }

      animationQueue.push(["end", temp]);
      resolve();
    });
  }

  //goes through the animation queue on where ever it left off
  async function sort() {
    await new Promise((resolve) => setTimeout(resolve, 10));

    //while paused hasnt been pressed (isAnimating) go through the animation queue
    while (animationQueue.length && isAnimatingRef.current) {
      const func = animationQueue.shift();
      const args = func.splice(1);

      //console.log(func);
      await functionMap[func](...args);

      //console.log("done");
    }
  }

  //finds the x value for displaying the tree
  function findX(index) {
    if (index == 0) {
      const middle = Math.floor(arr.length / 2);
      return arr[middle].x + boxWidth / 2;
    }

    const parantIndex = Math.floor((index - 1) / 2);
    const parentStartX = findX(parantIndex);

    const hight = Math.floor(Math.log2(index + 1));
    const maxHight = Math.floor(Math.log2(maxArrsize)) + 1;
    let a = hight == 1 ? 5 : maxHight - hight;

    if (index % 2 == 1) {
      //if its a left child
      return parentStartX - (xspaceBetween * a) / 2;
    } else {
      //else if its the right child
      return parentStartX + (xspaceBetween * a) / 2;
    }
  }

  function findY(index) {
    return (treeStarty - 55) * Math.floor(Math.log2(index + 1)) + treeStarty;
  }

  //updates all the x and y values of each box in the array for proper displaying
  function updateAll() {
    //everything should happen if the array isnt empty
    if (arr.length > 0) {
      //Finds the starting x value postion for the array
      let xstart =
        (windowWidth - menuWidth) / 2 - (arr.length * (boxWidth + 3)) / 2;

      //loop's through the array and updates all the x and y variables for each box
      for (let i = 0; i < arr.length; i++) {
        //change x value
        arr[i].setX(xstart);

        //change y value
        arr[i].setY(yValue);

        //move where the x is displayed a box width and a bit to the right
        xstart = xstart + boxWidth + 3;
      }
    }
  }

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
      const ranNum = Math.floor(Math.random() * maxArrsize) + 1;
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
      Log("Paused");

      changeIsAnimating(false);
    }
  }, [Pause]);

  //handels any sorting
  useEffect(() => {
    //makes shure the componet is alredy monted
    //also makes sure it isn't alredy animating
    if (isMounted.current && !isAnimating) {
      if (arr.length > 0) {
        changeIsAnimating(true);
        if (!animationQueue.length) {
          (async () => {
            await setAnimations();
            //console.log(animationQueue);
          })();
          sort();
        } else {
          Log("Resumed");
          sort();
        }
        // play();
      } else {
        Log("Error: Cannot Sort an Empty Array");
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

  //pauses the animation if teh windown is changed when animating
  useEffect(() => {
    if (isMounted.current && isAnimating) {
      Log("Paused");

      changeIsAnimating(false);
    }
  }, [menuWidth, windowWidth]);

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
      //updates the values then draws them only when its not sorting
      updateAll();
      for (const box of arr) {
        box.draw(context, normalColor);
      }
      drawHeap(context, arr);
    }
  }, [height, windowWidth, menuWidth, arr, isAnimating]);

  return <canvas className="Canvas-Animation" ref={canvasRef} />;
};

export default HeapSortAnimations;
HeapSortAnimations.prototype = {
  toggle: PropTypes.func.isRequired,
};
