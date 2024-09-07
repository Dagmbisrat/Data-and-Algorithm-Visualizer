import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

const StackslinkedListAnimations = ({
  height,
  Push,
  Pop,
  Clear,
  Input,
  menuWidth,
  Log,
}) => {
  const canvasRef = useRef(null);
  const isMounted = useRef(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [stack, setStack] = useState([]);
  const boxWidth = 50;
  const boxHeight = 50;
  const boxesPerRow = 10;
  const gap = 35;
  const textOffsetX = 20;
  const textOffsetY = 70;
  const dataOffsetX = 20;
  const dataOffsetY = 30;

  class Obj {
    constructor(position) {
      this.postion = position;
    }

    draw(context) {
      context.beginPath();
      context.arc(this.postion.x, this.postion.y, 50, 0, 2 * Math.PI);
      context.fillStyle = "red";
      context.fill();
      context.stroke();
    }

    moveDown(num) {
      this.postion.y = this.postion.y + num;
    }
    moveRight(num) {
      this.postion.x = this.postion.x + num;
    }
  }

  //pushes an element to the stack
  const pushElement = (element) => {
    if (stack.length >= 20) {
      //console.error("Stack overflow: Max 20");
      Log("Stack overflow: Max is 20");
      return;
    }
    setStack([...stack, element]);
    Log("Pushed " + Input);
  };

  //pop's the stack
  const popElement = () => {
    if (stack.length === 0) {
      // console.error("Stack is empty!");
      Log("Stack underflow:  Empty Stack!");
      return false;
    }

    const newStack = stack.slice(0, -1);
    setStack(newStack);
    Log("Poped");
    return true;
  };

  //clears the stack
  const clearStack = () => {
    setStack([]);
    Log("Cleared");
  };

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

  // Draw the empty array
  const drawArray = (canvas, context) => {
    const startX = canvas.width / 2 - 415; // make the array in the middle of the canvas
    const startY = canvas.height / 2 - 65;

    for (let i = 0; i < stack.length; i++) {
      const x = startX + (i % boxesPerRow) * (boxWidth + gap);
      const y = startY + Math.floor(i / boxesPerRow) * (boxHeight + gap + 30);

      const nextboxX = startX + ((i + 1) % boxesPerRow) * (boxWidth + gap);
      const nextboxY =
        startY + Math.floor((i + 1) / boxesPerRow) * (boxHeight + gap + 30);

      // Draw the box
      context.strokeStyle = "white"; // Use the boxColor prop
      context.strokeRect(x, y, boxWidth, boxHeight);
      context.strokeRect(x, y, boxWidth + 10, boxHeight);

      context.strokeStyle = "#FFF"; // Arrow color
      context.fillStyle = "black"; // Arrow head color

      //draw the pointers
      if (stack.length > 1 && i != stack.length - 1) {
        //the end of the arrow should point to the top next box
        if (i == boxesPerRow - 1) {
          drawArrow(context, x + 55, y + 50, nextboxX + 25, nextboxY);
        } else {
          drawArrow(context, x + 55, y + 25, nextboxX, nextboxY + 25);
        }
      }

      //draw NUll at the end of the stack
      if (i == stack.length - 1) {
        context.strokeStyle = "white"; // Use the boxColor prop
        context.beginPath(); // Start a new path
        context.moveTo(x + 50, y); // Move the pen to (fromX, fromY)
        context.lineTo(x + 60, y + 50); // Draw a line to (toX, toY)
        context.stroke(); // Render the path
      }

      //draw whats in the stack
      context.fillStyle = "white";
      context.font = "12px Arial";
      if (stack[i] == null) {
        context.fillText("", x + dataOffsetX, y + dataOffsetY);
      } else {
        context.fillText(stack[i], x + dataOffsetX, y + dataOffsetY);
      }
    }
  };
  const drawTopBox = (canvas, context) => {
    // const startx = canvas.width / 2 - 350; // make the array in the middle of the canvas
    // const starty = canvas.height / 2 - 200;

    const startx = canvas.width - canvas.width * 0.9; // make the array in the middle of the canvas
    const starty = canvas.height - canvas.height * 0.9;

    // Draw the box
    context.strokeStyle = "white"; // Use the boxColor prop
    context.strokeRect(startx, starty, boxWidth, boxHeight);

    // Draw the index number
    context.fillStyle = "white";
    context.font = "16px Arial";
    context.fillText("Top", startx + 11, starty + textOffsetY + -80);

    context.strokeStyle = "#FFF"; // Arrow color
    context.fillStyle = "black"; // Arrow head color

    //Draw the arrow from top pointer to the
    if (stack.length > 0) {
      drawArrow(
        context,
        startx + 25,
        starty + 25,
        canvas.width / 2 - 415 + 25,
        canvas.height / 2 -
          65 +
          Math.floor(0 / boxesPerRow) * (boxHeight + gap + 30),
      );
    } else {
      //draw the top pointer to show null
      context.beginPath(); // Start a new path
      context.moveTo(startx, starty); // Move the pen to (fromX, fromY)
      context.lineTo(startx + 50, starty + 50); // Draw a line to (toX, toY)
      context.stroke(); // Render the path
    }
  };

  function drawArrow(context, fromX, fromY, toX, toY) {
    const headLength = 10; // Length of the arrow head
    const angle = Math.atan2(toY - fromY, toX - fromX);

    // Draw the line
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();

    // Draw the arrow head
    context.beginPath();
    context.moveTo(toX, toY);
    context.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6),
    );
    context.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6),
    );
    context.lineTo(toX, toY);
    context.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6),
    );
    context.stroke();
    context.fill();
  }

  //when Push is pressed
  useEffect(() => {
    if (isMounted.current) {
      Input == "" ? Log("Input empty") : pushElement(Input);
    }
  }, [Push]);

  // when Pop is clicked
  useEffect(() => {
    if (isMounted.current) {
      popElement();
    }
  }, [Pop]);

  // when Clear is clicked
  useEffect(() => {
    if (isMounted.current) {
      clearStack();
    }
  }, [Clear]);

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
      drawArray(canvas, context);
      drawTopBox(canvas, context);
    }
  }, [height, windowWidth, menuWidth, stack]);
  return <canvas className="Canvas-Animation" ref={canvasRef} />;
};
export default StackslinkedListAnimations;
StackslinkedListAnimations.prototype = {
  toggle: PropTypes.func.isRequired,
};
