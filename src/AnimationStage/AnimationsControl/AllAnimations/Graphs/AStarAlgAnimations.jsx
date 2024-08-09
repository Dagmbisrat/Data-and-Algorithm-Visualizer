import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import cytoscape from "cytoscape";
import { constant, endsWith, template } from "lodash";

const AStarAlgAniamtions = ({
  speed,
  height,
  Random,
  Clear,
  menuWidth,
  Log,
  Search,
}) => {
  const canvasRef = useRef(null);
  const isMounted = useRef(false);
  const maxArrsize = 6;
  const rootNode = 0;
  const targetNode = maxArrsize - 1;
  const [isAnimating, setisAnimating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [graph, setGraph] = useState([
    [],
    new Array(maxArrsize).fill().map(() => []),
  ]);
  const maxEdgeWeight = 50;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
  const normalColor = "gray";
  const edgeNormColor = "white";

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
    }
    Searched() {
      this.searched = true;
    }
    UnSearched() {
      this.searched = false;
    }
    getColor() {
      return this.searched ? "green" : normalColor;
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

  function generateRandomSpanningTree(vertices) {
    let nodes = [...Array(vertices.length).keys()]; //array of all the nodes
    let visited = nodes.splice(getRandomNum(0, maxArrsize - 1), 1); //array of all the visited nodes
    let edges = new Array(maxArrsize).fill().map(() => []);

    function addEdge(node1, node2) {
      // console.log(node1);
      // console.log(node2);
      edges[node1].push(
        new Edge(
          vertices[node2].data,
          getRandomNum(-maxEdgeWeight, maxEdgeWeight),
        ),
      );
      // console.log(edges);
    }

    while (nodes.length) {
      // console.log(nodes);
      // console.log(visited);
      let node1 = nodes.splice(getRandomNum(0, nodes.length - 1), 1)[0]; //get a random node from the unvisited
      let node2 = visited[getRandomNum(0, visited.length - 1)]; //get a random node from the visited
      visited.push(node1); //add to the visited

      addEdge(node1, node2);
    }

    function getWeight(array, data) {
      for (const edge of array) {
        if (edge.data == data) {
          return edge.weight;
        }
      }

      return 0;
    }

    //turn it into a proper adjacency list
    for (let i = 0; i < maxArrsize; i++) {
      const nodeData = vertices[i].data; //gets the node we are lokking for

      for (let j = 0; j < maxArrsize; j++) {
        //goes through the whole list
        if (i != j && has(edges[j], nodeData)) {
          //if the array contains node
          edges[i].push(
            new Edge(vertices[j].data, getWeight(edges[j], nodeData)),
          ); //add the node that has the selected node in its list to the list for the selected node
        }
      }
    }

    return edges;
  }

  function getRandomCharacter() {
    return characters.charAt(Math.floor(Math.random() * characters.length));
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

      tempGraph[0].push(copy);
    }
    tempGraph[1] = graph[1];
    return tempGraph;
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
    return Math.ceil(result / 10);
  }

  function reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom[current]) {
      current = cameFrom[current];
      path.push(current);
    }
    return path.reverse();
  }

  async function dijkstra(start, goal) {
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
      await setNodeDistances(gScore, fScore);

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

        // Check each neighbor of the current node
        for (const neighbor of graph[1][current]) {
          const neighborNode = get(graph[0], neighbor.data);
          const { weight } = neighbor;
          const tentativeGScore = gScore[current] + weight;

          //color the neighbor edge since the path is
          await colorEdge([current, neighborNode], "red", false);

          if (tentativeGScore < gScore[neighborNode]) {
            cameFrom[neighborNode] = current;
            gScore[neighborNode] = tentativeGScore;
            fScore[neighborNode] =
              gScore[neighborNode] + heuristic(neighborNode, goal);

            //set the nodes distnaces
            await setNodeDistances(gScore, fScore);

            openSet.enqueue(fScore[neighborNode], neighborNode);
          }
        }
      }
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

  //Sets a Random set of arrays for arr
  useEffect(() => {
    if (isMounted.current && !isAnimating) {
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

      console.log(tempGraph);
      setGraph(tempGraph);
      Log("Set to a Random Graph ");
    }
  }, [Random]);

  //Handles when clear is pressed (The array is cleard)
  useEffect(() => {
    if (isMounted.current && !isAnimating) {
      if (graph[0].length) {
        for (const nodes of graph[0]) {
          nodes.UnSearched();
          nodes.label = "";
          nodes.Heuristic = "";
        }
        for (const list of graph[1]) {
          for (const edges of list) {
            edges.setColor(edgeNormColor);
          }
        }
        setGraph(copyGraph(graph));
        Log("Cleard!");
      } else {
        Log("Cannot unserch empty graph!");
      }
    }
  }, [Clear]);

  //handels any sorting
  useEffect(() => {
    if (isMounted.current && !isAnimating) {
      setisAnimating(true);

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

      // Function that processes each element in the array with a delay
      async function processArrayWithDelay() {
        Log(
          "Fiding path from " +
            graph[0][rootNode].data +
            " to " +
            graph[0][targetNode].data,
        );

        const answerArr = await dijkstra(rootNode, targetNode);

        console.log(graph[0]);
        console.log(answerArr);
        const traversalList = answerArr[0];
        const edgeTraversalList = answerArr[1];

        await setVisited(traversalList[0]); //visit the node
        for (let i = 1; i < traversalList.length; i++) {
          await setVisited(traversalList[i]); //visit the node
          await colorEdge(edgeTraversalList[i - 1], "green", true);
        }

        Log(
          "Path Found with the length of " + graph[0][targetNode].label + "!",
        );
        setisAnimating(false);
      }

      processArrayWithDelay();
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
              "text-wrap": "wrap",
              "text-max-width": "60px",
              "text-valign": "top",
              "text-margin-y": "20px", // Adjust this value to position the label
              "font-size": "12px",
              "font-weight": "bold",
              label: function (ele) {
                return ele.data("label") + "\n\n" + ele.data("id");
              },
            },
          },
          {
            selector: 'node[Heuristic != "" ]',
            style: {
              "text-wrap": "wrap",
              "text-max-width": "60px",
              "text-valign": "top",
              "text-margin-y": "45px", // Adjust this value to position the label
              "font-size": "12px",
              "font-weight": "bold",
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
    <>
      <div
        className="StacksAnimationCanvas"
        ref={canvasRef}
        style={{
          width: windowWidth - menuWidth,
          height: height - 22,
        }}
      />
      <div
        style={{
          fontSize: "10px",
        }}
      >
        *The Heuristic function (the number at the bottom of a vertex)
        represents distance to the target node (the Hexagon)
      </div>
    </>
  );
};
export default AStarAlgAniamtions;
AStarAlgAniamtions.prototype = {
  toggle: PropTypes.func.isRequired,
};
