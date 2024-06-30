import { useRef, useEffect, useState } from "react";
import "./Queues-linkedListAnimation.css";
import PropTypes from "prop-types";

const QueueslinkedListAnimations = ({
  speed,
  height,
  Queue,
  UnQueue,
  Clear,
  Input,
  menuWidth,
  Log,
}) => {
  const canvasRef = useRef(null);
  const isMounted = useRef(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [queue, setQueue] = useState([]);
  const boxWidth = 50;
  const boxHeight = 50;
  const boxesPerRow = 10;
  const gap = 35;
  const textOffsetX = 20;
  const textOffsetY = 70;
  const dataOffsetX = 20;
  const dataOffsetY = 30;

  //for any annimation needs
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

  //EnQueue an element to the queue
  const queueElement = (element) => {
    //Check's if Queueing an elament will result in a ovverride
    if (queue.length >= 20) {
      Log("Queue overflow: Max 20");
      return;
    }

    setQueue([...queue, element]);
    Log("EnQueued " + Input);
  };

  //deQueue the queue
  const deQueue = () => {
    //Checks if the Head will overtake the Tail
    if (queue.lengh == 0) {
      Log("Queue underflow: Empty Queue!");
      return;
    }
    setQueue(queue.slice(1));
    Log("deQueued");
  };

  //clears the queue
  const clear = () => {
    //resets array, Head, and Tail
    setQueue([]);
    Log("Cleared!");
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

  // Draw the queue
  const drawArray = (canvas, context) => {
    const startX = canvas.width / 2 - 415; // make the array in the middle of the canvas
    const startY = canvas.height / 2 - 65;

    for (let i = 0; i < queue.length; i++) {
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
      if (queue.length > 1 && i != queue.length - 1) {
        //the end of the arrow should point to the top next box
        if (i == boxesPerRow - 1) {
          drawArrow(context, x + 55, y + 50, nextboxX + 25, nextboxY);
        } else {
          drawArrow(context, x + 55, y + 25, nextboxX, nextboxY + 25);
        }
      }

      //draw NUll at the end of the stack
      if (i == queue.length - 1) {
        drawArrow(
          context,
          x + 55,
          y + 25,
          canvas.width * 0.85 + 25,
          canvas.height * 0.75 + 25,
        );
      }

      //draw whats in the queue
      context.fillStyle = "white";
      context.font = "12px Arial";
      //wont allow null to be shown
      queue[i] == "null"
        ? context.fillText("", x + dataOffsetX, y + dataOffsetY)
        : context.fillText(queue[i], x + dataOffsetX, y + dataOffsetY);
    }
  };

  const drawTailandHead = (canvas, context) => {
    const headx = canvas.width - canvas.width * 0.9; // make the array in the middle of the canvas
    const heady = canvas.height - canvas.height * 0.9;

    const tailx = canvas.width * 0.85; // make the array in the middle of the canvas
    const taily = canvas.height * 0.75;

    // Draw the Head box
    context.strokeStyle = "white"; // Use the boxColor prop
    context.strokeRect(headx, heady, boxWidth, boxHeight);

    //Draw Tail
    context.strokeRect(tailx, taily, boxWidth, boxHeight);

    // Draw the "Head" and "Tail"
    context.fillStyle = "white";
    context.font = "16px Arial";
    context.fillText("Head", headx + 6, heady + textOffsetY + -80);
    context.fillText("Tail", tailx + 11, taily + textOffsetY + -80);

    context.strokeStyle = "#FFF"; // Arrow color
    context.fillStyle = "black"; // Arrow head color

    //Draw the arrow from top pointer to the
    if (queue.length > 0) {
      drawArrow(
        context,
        headx + 25,
        heady + 25,
        canvas.width / 2 - 415 + 25,
        canvas.height / 2 -
          65 +
          Math.floor(0 / boxesPerRow) * (boxHeight + gap + 30),
      );
    } else {
      //draw the top pointer to show null
      context.beginPath(); // Start a new path
      context.moveTo(headx, heady); // Move the pen to (fromX, fromY)
      context.lineTo(headx + 50, heady + 50); // Draw a line to (toX, toY)
      context.stroke(); // Render the path
      //draw the top pointer to show null
      context.beginPath(); // Start a new path
      context.moveTo(tailx, taily); // Move the pen to (fromX, fromY)
      context.lineTo(tailx + 50, taily + 50); // Draw a line to (toX, toY)
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
      Input == "" ? Log("Input empty") : queueElement(Input);
    }
  }, [Queue]);

  // when Pop is clicked
  useEffect(() => {
    if (isMounted.current) {
      deQueue();
    }
  }, [UnQueue]);

  // when Clear is clicked
  useEffect(() => {
    if (isMounted.current) {
      clear();
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
      drawTailandHead(canvas, context);
    }
  }, [height, windowWidth, menuWidth, queue]);
  return <canvas className="StacksAnimationCanvas" ref={canvasRef} />;
};
export default QueueslinkedListAnimations;
QueueslinkedListAnimations.prototype = {
  toggle: PropTypes.func.isRequired,
};
