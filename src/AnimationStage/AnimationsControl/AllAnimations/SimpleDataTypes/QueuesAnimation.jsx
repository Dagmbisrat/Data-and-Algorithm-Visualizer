import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

const QueuesAnimation = ({
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
  const [queue, setQueue] = useState(Array(20).fill("null"));
  const [tail, setTail] = useState(0);
  const [head, setHead] = useState(0);
  const boxWidth = 50;
  const boxHeight = 50;
  const boxesPerRow = 10;
  const gap = 5;
  const textOffsetX = 20;
  const textOffsetY = 70;
  const dataOffsetX = 20;
  const dataOffsetY = 30;
  const nextTail = () => {
    if (tail == 19) {
      return 0;
    }
    return tail + 1;
  };
  const nextHead = () => {
    if (head == 19) {
      return 0;
    }
    return head + 1;
  };

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

  //Queue an element to the stack
  const queueElement = (element) => {
    //Cheaks if Queueing an elament will result in a ovverride
    if (nextTail() == head) {
      Log("Queue overflow: Max 20");
      return;
    }
    const newArray = [...queue];

    // Add the specified element to the tail index then update the tail
    newArray[tail] = element;
    setQueue(newArray);
    setTail(nextTail);
    Log("Enqueued " + Input);
  };

  //unQueue the stack
  const unQueue = () => {
    //Checks if the Head will overtake the Tail
    if (nextHead() == nextTail()) {
      Log("Queue underflow: Empty Queue!");
      return;
    }
    const newArray = [...queue];

    // Change the removed element at the head to Null then update the Head index
    newArray[head] = "null";
    setQueue(newArray);
    setHead(nextHead);
    Log("Dequeued");
  };

  //clears the stack
  const clear = () => {
    //resets array, Head, and Tail
    setQueue(Array(20).fill("null"));
    setHead(0);
    setTail(0);
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

  // Draw the empty array
  const drawArray = (canvas, context) => {
    const startX = canvas.width / 2 - 273; // make the array in the middle of the canvas
    const startY = canvas.height / 2 - 65;

    for (let i = 0; i < 20; i++) {
      const x = startX + (i % boxesPerRow) * (boxWidth + gap);
      const y = startY + Math.floor(i / boxesPerRow) * (boxHeight + gap + 30);

      // Draw the box
      context.strokeStyle = "white"; // Use the boxColor prop
      context.strokeRect(x, y, boxWidth, boxHeight);

      // Draw the index number
      context.fillStyle = "white";
      context.font = "16px Arial";
      context.fillText(i, x + textOffsetX, y + textOffsetY);

      //draw whats in the stack
      context.fillStyle = "white";
      context.font = "12px Arial";
      //wont allow null to be shown
      queue[i] == "null"
        ? context.fillText("", x + dataOffsetX, y + dataOffsetY)
        : context.fillText(queue[i], x + dataOffsetX, y + dataOffsetY);
    }
  };

  const drawTailandHead = (canvas, context) => {
    const startx = canvas.width - canvas.width * 0.95; // make the array in the middle of the canvas
    const starty = canvas.height - canvas.height * 0.9;

    for (let i = 0; i < 2; i++) {
      const x = startx + (i % boxesPerRow) * (boxWidth + gap);
      const y = starty + Math.floor(i / boxesPerRow) * (boxHeight + gap + 30);

      // Draw the box
      context.strokeStyle = "white"; // Use the boxColor prop
      context.strokeRect(x, y, boxWidth, boxHeight);

      // Draw the index number
      context.fillStyle = "white";
      context.font = "16px Arial";
      i == 0
        ? context.fillText("Head", x + 7, y + textOffsetY)
        : context.fillText("Tail", x + 12, y + textOffsetY);

      // Draw the index number
      context.fillStyle = "white";
      context.font = "16px Arial";
      i == 0
        ? context.fillText(head, x + dataOffsetX, y + dataOffsetY)
        : context.fillText(tail, x + dataOffsetX, y + dataOffsetY);
    }
  };

  //when Push is pressed
  useEffect(() => {
    if (isMounted.current) {
      Input == "" ? Log("Input empty") : queueElement(Input);
    }
  }, [Queue]);

  // when Pop is clicked
  useEffect(() => {
    if (isMounted.current) {
      unQueue();
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
  return <canvas className="Canvas-Animation" ref={canvasRef} />;
};
export default QueuesAnimation;
QueuesAnimation.prototype = {
  toggle: PropTypes.func.isRequired,
};
