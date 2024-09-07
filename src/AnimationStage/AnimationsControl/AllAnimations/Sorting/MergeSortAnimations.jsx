import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

const MergeSortAnimations = ({
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
  const [arrayStack, setarrayStack] = useState([[]]); //hold's the arrays as a bianary tree wehn displaying the recursion call;
  const maxBoxHight = 0.9; //the Max box hight (as a percentage of the canvas hight)
  const yValue = height - 3 - (height - 3) * maxBoxHight;
  const maxArrsize = 10;
  const boxWidth = 45;
  const maxInt = 99;
  const minInt = -99;
  const maxFrames = 70;
  const normalColor = "#484848";
  const hilightedColor = "#800000";
  const sortedColor = "#228B22";
  const spaceBetweenArrays = 70;
  const spaceBetweenArraysY = 40;

  //the class that represents the box's'
  class Box {
    constructor(value) {
      this.value = value;
      this.display = true;
      this.setUnSorted();
      this.id = generateUniqueId(Math.abs());
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
    moveY(value) {
      this.y += value;
    }
    setDisplay(value) {
      this.display = value;
    }

    setSorted() {
      this.sorted = true;
    }

    setUnSorted() {
      this.sorted = false;
    }

    equals(box) {
      return this.id == box.id;
    }

    draw(context, color) {
      if (this.display) {
        //draw the box
        context.fillStyle =
          color == hilightedColor ? color : this.sorted ? sortedColor : color;
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
  }

  function generateUniqueId() {
    const num = Math.floor(Math.random() * (36 - 2 + 1)) + 2;
    return `id-${Date.now()}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(num)}`;
  }

  const functionMap = {
    animateSplit: async (side, parentIndex, middle, num) => {
      await animateSplit(side, parentIndex, arrayStack, middle, num);
    },
    animateCompare: async (sideArrayIndex, lIndex, rIndex) => {
      await animateCompare(sideArrayIndex, lIndex, rIndex, arrayStack);
    },
    setDisplay: async (pIndex, sideIndex, bool) => {
      arrayStack[pIndex][sideIndex].setDisplay(bool);
    },
    meargeAnimation: async (
      sideArrayIndex,
      sideIndex,
      parantArrIndex,
      //arrayStack,
    ) => {
      const index = Math.floor((sideArrayIndex - 1) / 2);
      await meargeAnimation(
        sideArrayIndex,
        sideIndex,
        parantArrIndex,
        arrayStack,
      );
      arrayStack[index][parantArrIndex].setSorted();
    },
    set: (parantIndex, parantArrIndex, leftValue) => {
      arrayStack[parantIndex][parantArrIndex].value = leftValue;
    },
    setSorted: (parantIndex, parantArrIndex) => {
      arrayStack[parantIndex][parantArrIndex].setSorted();
    },
    slice: (left, right, num) => {
      arrayStack.slice(left, num);
      arrayStack.slice(right, num);
      setarrayStack(copyArrayStack(arrayStack));
    },
    setarrayStack: (arrayStack) => {
      setarrayStack(arrayStack);
    },
    arrStackSet: (parentIndex, num, arr) => {
      arrayStack[getChildIndex(parentIndex, num)] = arr;
    },
    setisAnimating: (bool) => {
      setisAnimating(bool);
    },
    Log: (str) => {
      Log(str);
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

  //help function that draws the arrayStack
  const drawArray = (arrayStack, context) => {
    for (const array of arrayStack) {
      if (array != null) {
        for (const box of array) {
          box.draw(context, normalColor);
        }
      }
    }
  };

  //helper function that returns an array of copied box's
  function copyArray(array) {
    let tempArr = [];
    if (!array) {
      return [];
    }
    for (const box of array) {
      let boxCopy = new Box(box.value);
      boxCopy.setX(box.x);
      boxCopy.setY(box.y);
      boxCopy.id = box.id;
      boxCopy.display = box.display;
      boxCopy.sorted = box.sorted;
      tempArr.push(boxCopy);
    }
    return tempArr;
  }

  //sets isAnimating useeffect and ref
  function changeIsAnimating(bool) {
    setisAnimating(bool);
    isAnimatingRef.current = bool;
  }

  function isEqualArrayOfBoxs(arr, arr2) {
    if (arr && arr2 && arr.length == arr2.length) {
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i].equals(arr2[i])) return false;
      }
    } else {
      return false;
    }
    return true;
  }

  function index(arrayStack, arr) {
    for (let i = 0; i < arrayStack.length; i++) {
      if (isEqualArrayOfBoxs(arrayStack[i], arr)) return i;
    }
    return -1;
  }

  function copyArrayStack(arraystack) {
    const temp = [];
    //console.log(arraystack);
    for (const arr of arraystack) {
      temp.push(copyArray(arr));
    }
    return temp;
  }

  //function to get the child array from the parantindex givin the side(left = 1 or right = 2)
  function getChildIndex(parentIndex, side) {
    return 2 * parentIndex + side;
  }

  //Animates comparing two box's
  function animateCompare(leftArrayIndex, leftIndex, rightIndex, arrayStack) {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const context = canvasRef.current.getContext("2d");
      let frameCounter = 0;

      //draw the array logic
      function drawFrame() {
        //clean the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        //display the array
        drawArray(arrayStack, context);
        arrayStack[leftArrayIndex][leftIndex].draw(context, hilightedColor);
        arrayStack[leftArrayIndex + 1][rightIndex].draw(
          context,
          hilightedColor,
        );

        //incrament the frame counter
        frameCounter++;

        // Check if the max frames limit is reached
        if (frameCounter < maxFrames - speed / 2) {
          // Request the next frame
          requestAnimationFrame(drawFrame);
        } else {
          // Reset the frame counter and stop the animation
          resolve();
        }
      }

      drawFrame();
    });
  }

  //animates the moving the sorted array when, merging
  function meargeAnimation(childArrayindex, index, parentIndex, arrayStack) {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const context = canvasRef.current.getContext("2d");

      const parentArrIndex = Math.floor((childArrayindex - 1) / 2);

      const startx = arrayStack[childArrayindex][index].x;
      const starty = arrayStack[childArrayindex][index].y;

      const endx = arrayStack[parentArrIndex][parentIndex].x;
      const endy = arrayStack[parentArrIndex][parentIndex].y;

      const xDisplacement = endx - startx;
      const yDisplacement = endy - starty;

      const numOfFrames = maxFrames - speed / 2;

      const xIncrement = xDisplacement / numOfFrames;
      const yIncrement = yDisplacement / numOfFrames;

      let frameCounter = 0;

      const copyedBox = new Box(arrayStack[childArrayindex][index].value);
      copyedBox.setX(startx);
      copyedBox.setY(starty);

      function drawFrame() {
        //clean the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        //incrament
        copyedBox.moveX(xIncrement);
        copyedBox.moveY(yIncrement);

        //display the arrayStack
        drawArray(arrayStack, context);

        //display the moving box
        copyedBox.draw(context, hilightedColor);

        //incrament the frame counter
        frameCounter++;

        // Check if the max frames limit is reached
        if (frameCounter < numOfFrames) {
          // Request the next frame
          requestAnimationFrame(drawFrame);
        } else {
          arrayStack[parentArrIndex][parentIndex].value = copyedBox.value;
          arrayStack[parentArrIndex][parentIndex].setSorted();
          arrayStack[childArrayindex][index].setDisplay(false);
          arrayStack[parentArrIndex][parentIndex].setSorted();
          setarrayStack(copyArrayStack(arrayStack));
          // Reset the frame counter and stop the animation
          context.clearRect(0, 0, canvas.width, canvas.height);
          drawArray(arrayStack, context);
          //copyedBox.draw(context, normalColor);
          resolve();
        }
      }

      drawFrame();
    });
  }

  //Animate splitting the array
  //from the parant
  //to the left or right
  function animateSplit(array, parentIndex, arrayStack, middle, side) {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const context = canvasRef.current.getContext("2d");
      let frameCounter = 0;

      //const parentIndex = arrayStack.indexOf(parantArray);
      const childIndex = getChildIndex(parentIndex, side);

      //find the start x and y from the parant index
      //check if its a left child or right chiled then find the start x accordingly
      //console.log("finding start for parant");
      const parantxStart = findStart(
        parentIndex,
        arrayStack[parentIndex].length,
        arrayStack,
      );

      const xstart =
        childIndex % 2 == 1 ? parantxStart : arrayStack[parentIndex][middle].x;

      const ystart =
        yValue +
        (spaceBetweenArraysY + boxWidth) *
          Math.floor(Math.log2(parentIndex + 1));

      //find the end x and y for the chiled index
      const xend = findStart(childIndex, array.length, arrayStack);
      const yend =
        yValue +
        (spaceBetweenArraysY + boxWidth) *
          Math.floor(Math.log2(childIndex + 1));

      const xDispplacement = xend - xstart;
      const yDispplacement = yend - ystart;

      const xIncrament = xDispplacement / (maxFrames - speed / 2);
      const yIncrament = yDispplacement / (maxFrames - speed / 2);

      const tree = copyArrayStack(arrayStack);
      if (side == 1) {
        //left side
        array = copyArray(tree[parentIndex].splice(0, middle));
      }
      if (side == 2) {
        //right side
        array = copyArray(
          tree[parentIndex].splice(middle, tree[parentIndex].length),
        );
      }

      function drawFrame() {
        //clean the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        //incrament
        for (const box of array) {
          box.moveX(xIncrament);
          box.moveY(yIncrament);
        }

        //display the arrayStack
        drawArray(arrayStack, context);

        //then dispaly the array being split

        for (const box of copyArray(array)) {
          box.draw(context, hilightedColor);
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
          arrayStack[getChildIndex(parentIndex, side)] = array;
          setarrayStack(copyArrayStack(arrayStack));
          // context.clearRect(0, 0, canvas.width, canvas.height);
          // drawArray(arrayStack, context);
          resolve();
        }
      }

      drawFrame();
    });
  }

  //sorts arr and displays the mergeing useing the arrayStack
  async function mergeSort(array, arraystack) {
    return new Promise(async (resolve) => {
      const arr = copyArray(array);
      const arrayStack = copyArrayStack(arraystack);
      // Base case: if the array has 1 or fewer elements, it's already sorted
      if (arr.length < 2) {
        resolve(arr);
        return;
      }

      //find the middle
      const middle = Math.floor(arr.length / 2);

      async function processBothSides(arrayStack, arr, middle) {
        const parentIndex = index(arrayStack, arr);

        // Process left side
        const left = copyArray(arr.slice(0, middle));

        //await animateSplit(left, parentIndex, arrayStack, middle, 1);
        animationQueue.push([
          "animateSplit",
          copyArray(left),
          parentIndex,
          //copyArrayStack(arrayStack),
          middle,
          1,
        ]);
        arrayStack[getChildIndex(parentIndex, 1)] = left;
        //animationQueue.push(["arrStackSet", parentIndex, 1, left]);

        // Process right side
        const right = copyArray(arr.slice(middle));

        //await animateSplit(right, parentIndex, arrayStack, middle, 2);
        animationQueue.push([
          "animateSplit",
          copyArray(right),
          parentIndex,
          //copyArrayStack(arrayStack),
          middle,
          2,
        ]);
        arrayStack[getChildIndex(parentIndex, 2)] = right;
        //animationQueue.push(["arrStackSet", parentIndex, 2, right]);

        //set left and rigth array
        // const arrnew = copyArray(arrayStack[parentIndex]);
        // const l = arrnew.slice(0, middle);
        // const r = arrnew.slice(middle);
        const sortedLeft = await mergeSort(left, arrayStack);
        const sortedRight = await mergeSort(right, arrayStack);

        // Recursively sort both halves
        const newArr = await merge(sortedLeft, sortedRight, arrayStack);
        return newArr;
      }

      resolve(processBothSides(arrayStack, arr, middle));
      return;
    });
  }

  //merges two child arrays to the parant array and displays this
  async function merge(left, right, arrayStack) {
    return new Promise(async (resolve) => {
      //find where the parant array is
      const leftArrayindex = index(arrayStack, left);
      const rigthArrayIndex = leftArrayindex + 1;

      const parantIndex = Math.floor((leftArrayindex - 1) / 2);

      let leftIndex = 0,
        rightIndex = 0,
        parantArrIndex = 0;

      // Concatenate values into the resultArray in order
      while (leftIndex < left.length && rightIndex < right.length) {
        //animate them compareing each Box's
        //await animateCompare(leftArrayindex, leftIndex, rightIndex, arrayStack);
        animationQueue.push([
          "animateCompare",
          leftArrayindex,
          leftIndex,
          rightIndex,
          //copyArrayStack(arrayStack),
        ]);
        const rightValue = right[rightIndex].value;
        const leftValue = left[leftIndex].value;

        if (leftValue < rightValue) {
          // set the display property of the value from the child to false
          //arrayStack[leftArrayindex][leftIndex].setDisplay(false);
          animationQueue.push(["setDisplay", leftArrayindex, leftIndex, false]);

          //animate pushing it to the parent array
          // await meargeAnimation(
          //   leftArrayindex,
          //   leftIndex,
          //   parantArrIndex,
          //   arrayStack,
          // );
          animationQueue.push([
            "meargeAnimation",
            leftArrayindex,
            leftIndex,
            parantArrIndex,
            //copyArrayStack(arrayStack),
          ]);

          //Then add it to the parant array and set the value as sorted
          arrayStack[parantIndex][parantArrIndex].value = leftValue;
          //animationQueue.push(["set", parantIndex, parantArrIndex, leftValue]);
          //arrayStack[parantIndex][parantArrIndex].setSorted();
          //animationQueue.push(["setSorted", parantIndex, parantArrIndex]);

          leftIndex++; // move left array cursor
        } else {
          //set the display property of the added value from the child to false
          //arrayStack[rigthArrayIndex][rightIndex].setDisplay(false);
          animationQueue.push([
            "setDisplay",
            rigthArrayIndex,
            rightIndex,
            false,
          ]);

          //animate pushing it to the parent array
          // await meargeAnimation(
          //   rigthArrayIndex,
          //   rightIndex,
          //   parantArrIndex,
          //   arrayStack,
          // );
          animationQueue.push([
            "meargeAnimation",
            rigthArrayIndex,
            rightIndex,
            parantArrIndex,
            //copyArrayStack(arrayStack),
          ]);

          //Then add it to the parant array and set the value as sorted
          arrayStack[parantIndex][parantArrIndex].value = rightValue;
          //animationQueue.push(["set", parantIndex, parantArrIndex, rightValue]);
          //arrayStack[parantIndex][parantArrIndex].setSorted();
          //animationQueue.push(["setSorted", parantIndex, parantArrIndex]);

          rightIndex++; // move right array cursor
        }
        parantArrIndex++;
      }

      // We need to concat here because there will be atleast one element remaining
      // from either left OR the right
      while (leftIndex < left.length) {
        //Then set the display property of the added value from the child to false
        //left[leftIndex].setDisplay(false);
        animationQueue.push(["setDisplay", leftArrayindex, leftIndex, false]);

        //animate pushing it to the parent array
        // await meargeAnimation(
        //   leftArrayindex,
        //   leftIndex,
        //   parantArrIndex,
        //   arrayStack,
        // );
        animationQueue.push([
          "meargeAnimation",
          leftArrayindex,
          leftIndex,
          parantArrIndex,
          //copyArrayStack(arrayStack),
        ]);

        //Then add it to the parant array and set the value as sorted
        arrayStack[parantIndex][parantArrIndex].value = left[leftIndex].value;
        // animationQueue.push([
        //   "set",
        //   parantIndex,
        //   parantArrIndex,
        //   left[leftIndex].value,
        // ]);
        //arrayStack[parantIndex][parantArrIndex].setSorted();
        // animationQueue.push(["setSorted", parantIndex, parantArrIndex]);

        leftIndex++; // move left array cursor
        parantArrIndex++;
      }

      while (rightIndex < right.length) {
        //Then set the display property of the added value from the child to false
        //right[rightIndex].setDisplay(false);
        animationQueue.push(["setDisplay", rigthArrayIndex, rightIndex, false]);
        //animate pushing it to the parent array
        // await meargeAnimation(
        //   rigthArrayIndex,
        //   rightIndex,
        //   parantArrIndex,
        //   arrayStack,
        // );
        animationQueue.push([
          "meargeAnimation",
          rigthArrayIndex,
          rightIndex,
          parantArrIndex,
          //copyArrayStack(arrayStack),
        ]);

        //Then add it to the parant array and set the value as sorted
        arrayStack[parantIndex][parantArrIndex].value = right[rightIndex].value;
        // animationQueue.push([
        //   "set",
        //   parantIndex,
        //   parantArrIndex,
        //   right[rightIndex].value,
        // ]);
        //arrayStack[parantIndex][parantArrIndex].setSorted();
        // animationQueue.push(["setSorted", parantIndex, parantArrIndex]);

        rightIndex++; // move right array cursor
        parantArrIndex++;
      }

      //once its all mearged delete the two arrays from arrayStack
      arrayStack.slice(leftArrayindex, 1);
      arrayStack.slice(rigthArrayIndex, 1);
      animationQueue.push(["slice", leftArrayindex, rigthArrayIndex, 1]);
      //animationQueue.push(["slice", rigthArrayIndex, 1]);

      //setarrayStack(arrayStack);
      //animationQueue.push(["setarrayStack", copyArrayStack(arrayStack)]);

      resolve(copyArray(arrayStack[parantIndex]));
    });
  }

  function setAnimations(arr, arrayStack) {
    return new Promise(async (resolve) => {
      //set to not green
      clear();

      await mergeSort(copyArray(arr), copyArrayStack(arrayStack));
      animationQueue.push(["setisAnimating", false]);
      animationQueue.push(["Log", "sorted"]);
      resolve();
    });
  }

  //goes through the animation queue on where ever it left off
  async function sort() {
    await new Promise((resolve) => setTimeout(resolve, 10));
    //while paused hasnt been pressed (isAnimating) go through the animation queue
    while (animationQueue.length && isAnimatingRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const func = animationQueue.shift();
      const args = func.splice(1);

      //console.log(func);
      await functionMap[func](...args);
      //console.log("done");
      drawArray(arrayStack, context);
    }
  }

  //Finds the starting x value postion for the array in the arrayStack
  function findStart(stackIndex, lengthOfarray, arrayStack) {
    //if the array is the first one
    if (stackIndex == 0) {
      return (windowWidth - menuWidth) / 2 - (arr.length * (boxWidth + 3)) / 2;
    } else {
      //find the parant array and then useing recursion finds where parant starts
      //then find where the array ends
      //find the half size of the parant array
      //then add it with the startX value to find the halfway point (with respect to the canvas)
      const parantArrayindex = Math.floor((stackIndex - 1) / 2);
      const parantArray = arrayStack[parantArrayindex];
      const startx = findStart(
        parantArrayindex,
        arrayStack[parantArrayindex].length,
        arrayStack,
      );

      const endx = parantArray[parantArray.length - 1].x + boxWidth + 3;
      const halfWay = startx + (endx - startx) / 2;
      const hight = Math.floor(Math.log2(stackIndex));
      const maxHight = Math.floor(Math.log2(maxArrsize)) + 1;
      let a = hight == 4 ? 1 : maxHight - hight;
      if (stackIndex % 2 == 1) {
        //if its a left child
        return (
          halfWay -
          (spaceBetweenArrays * a) / 2 -
          lengthOfarray * (boxWidth + 3)
        );
      } else {
        //else if its the right child
        return halfWay + (spaceBetweenArrays * a) / 2;
      }
    }
  }

  //updates all the x and y values of each box in the array for proper displaying
  const updateAll = () => {
    //everything should happen if the array isnt empty
    if (arr.length > 0) {
      let stackIndex = 0;
      //loop's through the arrayStack and updates all the x and y variables for each box
      for (const array of arrayStack) {
        if (array.length) {
          //find the start for the array
          const length = arrayStack[stackIndex].length;
          console.log();
          let start = findStart(stackIndex, length, arrayStack);

          for (const box of array) {
            //change x value depending on the which array it is on the stack
            box.setX(start);

            //change y value
            //it sets the y depending on the floor of the log2 of the Stack index
            //This is for when it animates, so that it knows how far high each array in the stack should be shown
            box.setY(
              yValue +
                (spaceBetweenArraysY + boxWidth) *
                  Math.floor(Math.log2(stackIndex + 1)),
            );

            //move where the x is displayed a box width and a bit to the right
            start = start + boxWidth + 3;
          }
        }
        stackIndex++;
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
        console.log(arr);
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
      Log("Paused");
      //console.log(animationQueue);

      changeIsAnimating(false);
    }
  }, [Pause]);

  //handels any sorting
  useEffect(() => {
    //make shure it dosent run on mount
    // check if its alredy animation
    if (isMounted.current && !isAnimating) {
      if (arr.length > 0) {
        changeIsAnimating(true);
        if (!animationQueue.length) {
          (async () => {
            await setAnimations(arr, arrayStack);
          })();
          sort();
        } else {
          Log("Resumed");
          sort();
        }
      }
      if (arr.length == 1) {
        arr[0].setSorted();
      } else if (!arr.length) {
        Log("Error: Cannot Sort an Empty Array");
      }
    }
  }, [Sort]);

  //sets the arrayStack wehn changed
  useEffect(() => {
    //make shure it dosent run on start
    // check if its alredy animation
    if (isMounted.current && !isAnimating) {
      setarrayStack([arr]);
    }
  }, [arr]);

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
    //console.log(animationQueue);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (canvas) {
      canvas.height = height - 3;
      canvas.width = windowWidth - menuWidth;
      context.clearRect(0, 0, canvas.width, canvas.height);
      //Update the X and Y Values of the all the Array Stack;
      //console.log(arrayStack);
      updateAll();
      drawArray(arrayStack, context);
    }
  }, [height, windowWidth, menuWidth, arr, isAnimating, arrayStack]);

  return <canvas className="Canvas-Animation" ref={canvasRef} />;
};
export default MergeSortAnimations;
MergeSortAnimations.prototype = {
  toggle: PropTypes.func.isRequired,
};
