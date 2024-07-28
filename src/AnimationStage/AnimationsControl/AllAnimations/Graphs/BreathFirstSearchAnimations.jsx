import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import cytoscape from "cytoscape";

const BreathFirstSearchAnimations = ({
  speed,
  height,
  Random,
  Clear,
  Input,
  menuWidth,
  Log,
  Search,
}) => {
  const canvasRef = useRef(null);
  const isMounted = useRef(false);
  const maxArrsize = 20;
  const [isAnimating, setisAnimating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [graph, setGraph] = useState([
    [],
    new Array(maxArrsize).fill().map(() => []),
  ]);

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
  }

  //the class that represents the vertex
  class Edge {
    constructor(data) {
      this.data = data;
      this.searched == false;
    }
    Searched() {
      this.searched = true;
    }
    UnSearched() {
      this.searched = false;
    }
    getData() {
      return this.data;
    }
    getColor() {
      return this.searched ? "green" : edgeNormColor;
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
          },
        });
      }
    }

    return elements;
  };

  function has(array, char) {
    return array.some((obj) => obj.data === char);
  }

  function hasEdge(array, data) {
    for (const edge of array) {
      if (edge.data == data) {
        return true;
      }
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
      edges[node1].push(new Edge(vertices[node2].data));
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

    //turn it into a proper adjacency list
    for (let i = 0; i < maxArrsize; i++) {
      const nodeData = vertices[i].data; //gets the node we are lokking for

      for (let j = 0; j < maxArrsize; j++) {
        //goes through the whole list
        if (i != j && hasEdge(edges[j], nodeData)) {
          //if the array contains node
          edges[i].push(new Edge(vertices[j].data)); //add the node that has the selected node in its list to the list for the selected node
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

      tempGraph[0].push(copy);
    }
    tempGraph[1] = graph[1];
    return tempGraph;
  }

  function bfs(startNode) {
    const visited = new Set(); // To track visited nodes
    const queue = [startNode]; // Initialize the queue with the start node index
    const result = []; // To store the order of traversal
    const traversedEdges = []; // To store the traversed edges

    function hasPair(arr) {
      for (const pairs of traversedEdges) {
        if (pairs[0] == arr[0] && pairs[1] == arr[1]) {
          return true;
        }
      }
      return false;
    }

    while (queue.length > 0) {
      const node = queue.shift(); // Dequeue a node

      if (!visited.has(node)) {
        visited.add(node); // Mark the node as visited
        result.push(node); // Add the node to the result

        // Enqueue all adjacent nodes that haven't been visited
        for (const neighbor of graph[1][node]) {
          const index = get(graph[0], neighbor.data); //gets the index of the neighbor
          if (!visited.has(index)) {
            queue.push(index);
            if (!hasPair([node, index])) {
              traversedEdges.push([node, index]); // Add the edge to the traversed edges
            }
          }
        }
      }
    }

    return [result, traversedEdges];
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
        } else {
          i--;
        }
      }

      tempGraph[1] = generateRandomSpanningTree(tempGraph[0]);

      //givies a random adjacency list
      // for (let i = 0; i < maxArrsize; i++) {
      //   const randNumOfAdjacentNodes = getRandomNum(1, maxArrsize - 1);

      //   for (let j = 0; j < randNumOfAdjacentNodes; j++) {
      //     const char = tempGraph[0][getRandomNum(0, maxArrsize - 1)].data;
      //     if (!has(tempGraph[1][i], char) && char != tempGraph[0][i].data) {
      //       tempGraph[1][i].push(new Edge(char));
      //     } else {
      //       j--;
      //     }
      //   }
      // }.

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
        }
        for (const list of graph[1]) {
          for (const edges of list) {
            edges.UnSearched();
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

      const rootNode = 0;

      const bfsTraversalList = bfs(rootNode)[0];
      const bfsEdgeTraversalList = bfs(rootNode)[1];
      console.log(bfs(rootNode));

      //set visited helper function
      function setVisited(index, edge) {
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
      function colorEdge(set) {
        return new Promise((resolve) => {
          let i = get(graph[1][set[0]], graph[0][set[1]].data);
          graph[1][set[0]][i].Searched();
          setGraph(copyGraph(graph));
          i = get(graph[1][set[1]], graph[0][set[0]].data);
          graph[1][set[1]][i].Searched();
          setGraph(copyGraph(graph));
          resolve();
        });
      }

      // Function that processes each element in the array with a delay
      async function processArrayWithDelay() {
        await setVisited(bfsTraversalList[0]); //visit the node
        for (let i = 1; i < bfsTraversalList.length; i++) {
          await setVisited(bfsTraversalList[i]); //visit the node
          await colorEdge(bfsEdgeTraversalList[i - 1]);
        }

        Log("Searchd!");
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
              "background-color": "data(color)",
              width: "30",
              height: "30",
              label: "data(id)",
            },
          },
          {
            selector: "edge",
            style: {
              width: 3,
              "line-color": "data(color)", // use the color defined in the data attribute
              "target-arrow-color": "data(color)", // use the color defined in the data attribute
              "target-arrow-shape": "triangle",
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
      className="StacksAnimationCanvas"
      ref={canvasRef}
      style={{ width: windowWidth - menuWidth, height: height - 3 }}
    />
  );
};
export default BreathFirstSearchAnimations;
BreathFirstSearchAnimations.prototype = {
  toggle: PropTypes.func.isRequired,
};
