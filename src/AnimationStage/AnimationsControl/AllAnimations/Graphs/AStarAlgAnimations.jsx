import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import cytoscape from "cytoscape";

const AStarAlgAniamtions = ({
  speed,
  height,
  Random,
  Clear,
  menuWidth,
  Log,
  Search,
  Pause,
  setAnimating,
}) => {
  const canvasRef = useRef(null);
  const isMounted = useRef(false);
  const maxArrsize = 6;
  const rootNode = 0;
  const targetNode = maxArrsize - 1;
  const [isAnimating, setisAnimating] = useState(false);
  const isAnimatingRef = useRef(isAnimating);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [graph, setGraph] = useState([
    [],
    new Array(maxArrsize).fill().map(() => []),
  ]);
  const [animationQueue, setAnimationQueue] = useState([]);
  const maxEdgeWeight = 50;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
  const normalColor = "#484848";
  const sortedColor = "#228B22";
  const edgeNormColor = "#A9A9A9";
  const hilightedColor = "#800000";
  hilightedColor;

  //the class that represents the vertex
  class Nodes {
    constructor(data) {
      this.data = data;
      this.searched == false;
      this.position = {
        x: getRandomNum(0, windowWidth - menuWidth),
        y: getRandomNum(0, height - 3),
      };
      this.label = "";
      this.type = "Normal";
      this.Heuristic = "";
      this.borderColor = "black";
    }
    SearchingThroughNode() {
      this.borderColor = hilightedColor;
    }
    UnSearchingThroughNode() {
      this.borderColor = "black";
    }
    Searched() {
      this.searched = true;
    }
    UnSearched() {
      this.searched = false;
    }
    getColor() {
      return this.searched ? sortedColor : normalColor;
    }
    getShape() {
      if (this.type == "start") return "star";
      if (this.type == "target") return "hexagon";
      return "ellipse";
    }
  }

  //the class that represents the vertex
  class Edge {
    constructor(data, weight) {
      this.data = data;
      this.searched == false;
      this.weight = weight;
      this.Color = edgeNormColor;
    }
    setWeight(weight) {
      this.weight = weight;
    }
    setColor(color) {
      this.Color = color;
    }
    getData() {
      return this.data;
    }
    getColor() {
      return this.Color;
    }
  }

  class PriorityQueue {
    constructor() {
      this.nodes = [];
    }

    enqueue(priority, key) {
      this.nodes.push({ key, priority });
      this.sort();
    }

    dequeue() {
      return this.nodes.shift();
    }

    sort() {
      this.nodes.sort((a, b) => a.priority - b.priority);
    }

    isEmpty() {
      return !this.nodes.length;
    }
  }

  const functionMap = {
    clear: (bool) => {
      clear(bool);
    },
    setNodeDistances: async (gScore, fScore) => {
      await setNodeDistances(gScore, fScore);
    },
    colorEdge: async (set, color, bool) => {
      await colorEdge(set, color, bool);
    },
    setVisited: async (index) => {
      await setVisited(index);
    },
    setBorderColor: (index) => {
      setBorderColor(index);
    },
    Log: (str) => {
      if (str == "end") {
        Log(`Path Found with the Length of ${graph[0][targetNode].label}!`);
      } else {
        Log(str);
      }
    },
    setisAnimating: (bool) => {
      setisAnimating(bool);
    },
  };

  //sends if its animiting
  const sendisAnimating = () => {
    setAnimating(isAnimating);
  };

  //sets isAnimating useeffect and ref
  function changeIsAnimating(bool) {
    setisAnimating(bool);
    isAnimatingRef.current = bool;
  }

  function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Function to convert adjacency matrix to Cytoscape elements
  const matrixToElements = (graph) => {
    const elements = [];

    // Add nodes
    for (let i = 0; i < graph[0].length; i++) {
      elements.push({
        data: {
          id: graph[0][i].data,
          color: graph[0][i].getColor(),
          label: graph[0][i].label,
          Heuristic: graph[0][i].Heuristic,
          shape: graph[0][i].getShape(),
          borderColor: graph[0][i].borderColor,
        },
        position: { x: graph[0][i].position.x, y: graph[0][i].position.y },
      });
    }

    // Add edges
    for (let i = 0; i < graph[0].length; i++) {
      for (let j = 0; j < graph[1][i].length; j++) {
        elements.push({
          data: {
            id: graph[0][i].data + graph[1][i][j].data,
            source: graph[0][i].data,
            target: graph[1][i][j].data,
            color: graph[1][i][j].getColor(),
            weight: graph[1][i][j].weight,
          },
        });
      }
    }

    return elements;
  };

  function has(array, char) {
    return array.some((obj) => obj.data === char);
  }

  //returns true or false if an specific edge exsists in the graph
  function hasEdge(data1, data2, graph) {
    const index1 = get(graph[0], data1);
    const index2 = get(graph[0], data2);

    if (has(graph[1][index1], data2) || has(graph[1][index2], data1)) {
      return true;
    }

    return false;
  }

  function setBorderColor(index) {
    graph[0][index].SearchingThroughNode();

    setGraph(copyGraph(graph));
  }

  function getRandomCharacter() {
    return characters.charAt(Math.floor(Math.random() * characters.length));
  }

  //clears the graph
  function clear(all) {
    if (graph[0].length) {
      for (const nodes of graph[0]) {
        nodes.UnSearched();
        nodes.UnSearchingThroughNode();
        if (all) {
          nodes.label = "";
          nodes.Heuristic = "";
        }
      }
      for (const list of graph[1]) {
        for (const edges of list) {
          edges.setColor(edgeNormColor);
        }
      }
      setGraph(copyGraph(graph));
    } else {
      Log("Cannot clear empty graph!");
    }
  }

  //returns the index of the first found edge or  node with the data that is equal to char
  function get(array, char) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].data == char) {
        return i;
      }
    }
    return console.error("coudn't find " + char);
  }

  function copyGraph(graph) {
    let tempGraph = [[], new Array(maxArrsize).fill().map(() => [])];

    for (const node of graph[0]) {
      let copy = new Nodes(node.data);
      copy.position = node.position;
      copy.searched = node.searched;
      copy.label = node.label;
      copy.type = node.type;
      copy.Heuristic = node.Heuristic;
      copy.borderColor = node.borderColor;

      tempGraph[0].push(copy);
    }
    tempGraph[1] = graph[1];
    return tempGraph;
  }

  //set visited helper function
  function setVisited(index) {
    return new Promise((resolve) => {
      setTimeout(
        () => {
          graph[0][index].Searched();

          setGraph(copyGraph(graph));
          resolve();
        },
        mapNumber(speed, 100, 1, 750, 2000),
      );
    });
  }

  //color the edge helper function
  function colorEdge(set, color, stayChanged) {
    return new Promise((resolve) => {
      let i = get(graph[1][set[0]], graph[0][set[1]].data);
      graph[1][set[0]][i].setColor(color);
      setGraph(copyGraph(graph));
      i = get(graph[1][set[1]], graph[0][set[0]].data);
      graph[1][set[1]][i].setColor(color);
      setGraph(copyGraph(graph));
      setTimeout(
        () => {
          if (!stayChanged) {
            let i = get(graph[1][set[0]], graph[0][set[1]].data);
            graph[1][set[0]][i].setColor("white");
            setGraph(copyGraph(graph));
            i = get(graph[1][set[1]], graph[0][set[0]].data);
            graph[1][set[1]][i].setColor("white");
            setGraph(copyGraph(graph));
          }
          resolve();
        },
        mapNumber(speed, 100, 1, 750, 1500),
      );
    });
  }

  function setNodeDistances(fScore, gScore) {
    return new Promise((resolve) => {
      for (let i = 0; i < graph[0].length; i++) {
        graph[0][i].label = fScore[i];
        if (i != targetNode) graph[0][i].Heuristic = gScore[i];
      }
      setGraph(copyGraph(graph));
      setTimeout(
        () => {
          resolve();
        },
        mapNumber(speed, 100, 1, 750, 2000),
      );
    });
  }

  // Heuristic function (for example, Manhattan distance) takes in the index of the nodes
  function heuristic(node, goal) {
    // heuristic is the distnace between the nodes
    const result = Math.sqrt(
      Math.pow(
        Math.abs(graph[0][node].position.x - graph[0][goal].position.x),
        2,
      ) +
        Math.pow(
          Math.abs(graph[0][node].position.y - graph[0][goal].position.y),
          2,
        ),
    );
    return Math.ceil(result / 60);
  }

  function reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom[current]) {
      current = cameFrom[current];
      path.push(current);
    }
    return path.reverse();
  }

  //returns a deep copy of array of obj's
  function deepCopyArrayOfObjects(arr) {
    return JSON.parse(JSON.stringify(arr));
  }

  async function aStar(start, goal) {
    return new Promise(async (resolve) => {
      // Initialization
      const openSet = new PriorityQueue();
      openSet.enqueue(0, start);

      const cameFrom = {};
      const gScore = {};
      const fScore = {};

      //set each g and f score
      for (let i = 0; i < graph[0].length; i++) {
        gScore[i] = Infinity;
        fScore[i] = Infinity;
      }

      //set the start g and f scores
      gScore[start] = 0;
      fScore[start] = heuristic(start, goal);

      //set the nodes distnaces
      //await setNodeDistances(gScore, fScore);
      animationQueue.push([
        "setNodeDistances",
        deepCopyArrayOfObjects(gScore),
        deepCopyArrayOfObjects(fScore),
      ]);

      // A* Algorithm
      while (!openSet.isEmpty()) {
        const current = openSet.dequeue().key;

        if (current === goal) {
          const path = [start, ...reconstructPath(cameFrom, current)];
          const traversedEdges = [];
          for (let i = 0; i < path.length - 1; i++) {
            traversedEdges.push([path[i], path[i + 1]]);
          }
          return Promise.resolve(resolve([path, traversedEdges]));
        }

        //set the current node border red
        animationQueue.push(["setBorderColor", current]);

        // Check each neighbor of the current node
        for (const neighbor of graph[1][current]) {
          const neighborNode = get(graph[0], neighbor.data);
          if (neighborNode != rootNode) {
            const { weight } = neighbor;
            const tentativeGScore = gScore[current] + weight;

            //color the neighbor edge since the path is
            // await colorEdge([current, neighborNode], hilightedColor, true);
            animationQueue.push([
              "colorEdge",
              [current, neighborNode],
              hilightedColor,
              true,
            ]);

            if (tentativeGScore < gScore[neighborNode]) {
              cameFrom[neighborNode] = current;
              gScore[neighborNode] = tentativeGScore;
              fScore[neighborNode] =
                gScore[neighborNode] + heuristic(neighborNode, goal);

              //set the nodes distnaces
              //await setNodeDistances(gScore, fScore);
              animationQueue.push([
                "setNodeDistances",
                deepCopyArrayOfObjects(gScore),
                deepCopyArrayOfObjects(fScore),
              ]);

              openSet.enqueue(fScore[neighborNode], neighborNode);
            }
          }
        }
        //clear the graph
        //clear(false);
        animationQueue.push(["clear", false]);
      }
    });
  }

  function setAnimations() {
    return new Promise(async (resolve) => {
      //clear the graph
      clear(true);

      Log(
        "Fiding path from " +
          graph[0][rootNode].data +
          " to " +
          graph[0][targetNode].data,
      );

      const answerArr = await aStar(rootNode, targetNode);

      const traversalList = answerArr[0];
      const edgeTraversalList = answerArr[1];

      //visit the node
      animationQueue.push(["setVisited", traversalList[0]]);
      for (let i = 1; i < traversalList.length; i++) {
        //visit the node
        animationQueue.push(["setVisited", traversalList[i]]);
        animationQueue.push([
          "colorEdge",
          edgeTraversalList[i - 1],
          sortedColor,
          true,
        ]);
      }

      animationQueue.push(["Log", "end"]);
      animationQueue.push(["setisAnimating", false]);

      resolve();
    });
  }

  //goes through the animation queue on where ever it left off
  async function sort() {
    await new Promise((resolve) => setTimeout(resolve, 10));
    //while paused hasnt been pressed (isAnimating) go through the animation queue
    while (animationQueue.length && isAnimatingRef.current) {
      //save the instruction string
      const func = animationQueue.shift();
      const args = func.splice(1);

      //console.log(func);
      await functionMap[func](...args);
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

  //Sets a Random set of arrays for arr
  useEffect(() => {
    if (isMounted.current && !animationQueue.length) {
      let tempGraph = [[], new Array(maxArrsize).fill().map(() => [])];

      //creats a list of vertex's
      for (let i = 0; i < maxArrsize; i++) {
        const char = getRandomCharacter();
        if (!has(tempGraph[0], char)) {
          tempGraph[0].push(new Nodes(char));
          if (i == rootNode) tempGraph[0][i].type = "start";
          if (i == targetNode) tempGraph[0][i].type = "target";
        } else {
          i--;
        }
      }

      //givies a random adjacency list
      for (let i = 0; i < maxArrsize; i++) {
        const randNumOfAdjacentNodes = getRandomNum(1, maxArrsize - 1);

        for (let j = 0; j < randNumOfAdjacentNodes; j++) {
          const char = tempGraph[0][getRandomNum(0, maxArrsize - 1)].data;
          const newEdge = new Edge(char, getRandomNum(1, maxEdgeWeight));

          //Makes shure the edge isnt to itself and the edge dosnt exisit
          if (
            char != tempGraph[0][i].data &&
            !hasEdge(char, tempGraph[0][i].data, tempGraph)
          ) {
            tempGraph[1][i].push(newEdge);
          }
        }
      }

      //makes a nice adjancey list
      for (let i = 0; i < maxArrsize; i++) {
        //first goes through the edges and its adjcent list
        const sourceNode = tempGraph[0][i].data; //gets the node we are lokking for
        const sourceNodeIndex = i;
        for (let j = 0; j < tempGraph[1][i].length; j++) {
          const targetNode = tempGraph[1][i][j].data;
          const targetNodeIndex = get(tempGraph[0], targetNode);
          if (!has(tempGraph[1][targetNodeIndex], sourceNode)) {
            const weight = tempGraph[1][sourceNodeIndex][j].weight;
            tempGraph[1][targetNodeIndex].push(new Edge(sourceNode, weight));
          }
        }
      }

      setGraph(tempGraph);
      Log("Set to a Random Graph ");
    }
  }, [Random]);

  //Handles when clear is pressed (The array is cleard)
  useEffect(() => {
    if (isMounted.current && !animationQueue.length) {
      clear(true);
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
    if (isMounted.current && !isAnimating) {
      if (graph[0].length != 0) {
        changeIsAnimating(true);
        if (!animationQueue.length) {
          (async () => {
            await setAnimations();
          })();
          sort();
        } else {
          Log("Resumed");
          sort();
        }
      } else {
        Log("Error: Cannot search empty graph!");
      }
    }
  }, [Search]);

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
    console.log(graph);

    const canvas = canvasRef.current;
    // const context = canvas.getContext("2d");
    if (canvas) {
      canvas.height = height - 3;
      canvas.width = windowWidth - menuWidth;
      // context.clearRect(0, 0, canvas.width, canvas.height);

      const elements_ = matrixToElements(graph);

      // Initialization of Cytoscape
      const cy = cytoscape({
        container: canvasRef.current,

        elements: elements_, // Empty elements initially

        style: [
          // the stylesheet for the graph
          {
            selector: "node",
            style: {
              // Node shape and size
              shape: "data(shape)",
              width: "30",
              height: "30",
              "border-color": "data(borderColor)", // outline
              "background-color": "data(color)",
            },
          },
          {
            selector: "edge",
            style: {
              label: "data(weight)",
              width: 3,
              "line-color": "data(color)", // use the color defined in the data attribute
              "target-arrow-color": "data(color)", // use the color defined in the data attribute
              "target-arrow-shape": "triangle",
              "font-size": "15px",
              "font-weight": "bold",
              "text-background-color": "data(color)", // Optional: Background color of the text
              "text-background-opacity": 1, // Optional: Make the background color visible
            },
          },
          {
            selector: 'node[Heuristic = "" ]',
            style: {
              color: "white",
              "text-wrap": "wrap",
              "text-max-width": "60px",
              "text-valign": "top",
              "text-margin-y": "20px", // Adjust this value to position the label
              "font-size": "12px",
              "font-weight": "bold",
              "border-color": "data(borderColor)", // outline
              "border-width": "1px", // thickness of the outline
              "border-style": "solid", // style of the outline
              label: function (ele) {
                return ele.data("label") + "\n\n" + ele.data("id");
              },
            },
          },
          {
            selector: 'node[Heuristic != "" ]',
            style: {
              color: "white",
              "text-wrap": "wrap",
              "text-max-width": "60px",
              "text-valign": "top",
              "text-margin-y": "45px", // Adjust this value to position the label
              "font-size": "12px",
              "font-weight": "bold",
              "border-color": "data(borderColor)", // outline
              "border-width": "1px", // thickness of the outline
              "border-style": "solid", // style of the outline
              label: function (ele) {
                return (
                  ele.data("label") +
                  "\n\n" +
                  ele.data("id") +
                  "\n\n" +
                  ele.data("Heuristic")
                );
              },
            },
          },
        ],
        layout: {
          name: "preset",
        },
      });

      // Update positions on node move
      cy.on("drag", "node", (event) => {
        const node = event.target;

        const position = node.position();

        let tempGraph = graph;
        tempGraph[0][get(tempGraph[0], node.id())].position = position;
        setGraph(tempGraph);
        setGraph(tempGraph);
      });

      return () => cy.destroy();
    }
  }, [height, windowWidth, menuWidth, graph, isAnimating]);

  return (
    <div
      className="Canvas-Animation"
      ref={canvasRef}
      style={{ width: windowWidth - menuWidth, height: height - 3 }}
    />
  );
};
export default AStarAlgAniamtions;
AStarAlgAniamtions.prototype = {
  toggle: PropTypes.func.isRequired,
};
