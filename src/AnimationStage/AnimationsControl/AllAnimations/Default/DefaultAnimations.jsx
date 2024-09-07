import "./DefaultAnimations.css";

function DefaultScreen() {
  return (
    <>
      <body class="page-body">
        <header class="page-header">
          <h1 className="Header-Txt">
            Algorithms and Data Structures Visualizer
          </h1>
        </header>

        <main class="page-main">
          <section id="stacks">
            <h2>Stacks</h2>
            <p>
              Stacks are linear data structures that follow the Last In, First
              Out (LIFO) principle. The last element added is the first one to
              be removed.
            </p>
          </section>

          <section id="queues">
            <h2>Queues</h2>
            <p>
              Queues are linear data structures that follow the First In, First
              Out (FIFO) principle. The first element added is the first one to
              be removed.
            </p>
          </section>

          <section id="stacks-linkedlist">
            <h2>Stacks (LinkedList)</h2>
            <p>
              Stacks can also be implemented using linked lists, where elements
              are added or removed from one end.
            </p>
          </section>

          <section id="queues-linkedlist">
            <h2>Queues (LinkedList)</h2>
            <p>
              Queues can be implemented using linked lists, where elements are
              added at the end and removed from the front.
            </p>
          </section>

          <section id="bst">
            <h2>Binary Search Trees</h2>
            <p>
              A binary search tree is a tree data structure in which each node
              has at most two children, and each node's left subtree contains
              only nodes with values less than the node's key.
            </p>
            <p>
              <strong>Time Complexity:</strong> Big O: O(log n), Big Omega:
              Ω(1), Big Theta: Θ(log n)
            </p>
          </section>

          <section id="hashmaps">
            <h2>Hash Maps</h2>
            <p>
              Hash Maps are data structures that map keys to values using a hash
              function to compute an index into an array of buckets or slots.
            </p>
          </section>

          <section id="linear-search">
            <h2>Linear Search</h2>
            <p>
              Linear search is an algorithm that checks each element of a list
              sequentially until the target value is found or the list ends.
            </p>
            <p>
              <strong>Time Complexity:</strong> Big O: O(n), Big Omega: Ω(1),
              Big Theta: Θ(n)
            </p>
          </section>

          <section id="binary-search">
            <h2>Binary Search</h2>
            <p>
              Binary search is an efficient algorithm that finds the position of
              a target value within a sorted array by repeatedly dividing the
              search interval in half.
            </p>
            <p>
              <strong>Time Complexity:</strong> Big O: O(log n), Big Omega:
              Ω(1), Big Theta: Θ(log n)
            </p>
          </section>

          <section id="bubble-sort">
            <h2>Bubble Sort</h2>
            <p>
              Bubble Sort is a simple comparison-based algorithm that repeatedly
              steps through the list, comparing adjacent elements and swapping
              them if they are in the wrong order. This process continues until
              the list is sorted, with the largest elements "bubbling" up to
              their correct position. Despite its simplicity, Bubble Sort is
              inefficient for large lists.
            </p>
            <p>
              <strong>Time Complexity:</strong> Big O: O(n^2), Big Omega: Ω(n),
              Big Theta: Θ(n^2)
            </p>
          </section>

          <section id="insertion-sort">
            <h2>Insertion Sort</h2>
            <p>
              Insertion sort builds the final sorted array one item at a time by
              taking each new element and inserting it into its correct position
              among the already sorted elements. It efficiently sorts small
              arrays or lists that are already partially sorted but just like
              Bubble sort it lacks scalability as n increases.
            </p>
            <p>
              <strong>Time Complexity:</strong> Big O: O(n^2), Big Omega: Ω(n),
              Big Theta: Θ(n^2)
            </p>
          </section>

          <section id="merge-sort">
            <h2>Merge Sort</h2>
            <p>
              Merge Sort is a divide-and-conquer algorithm that divides the list
              into halves, recursively sorts each half, and then merges the
              sorted halves. This approach ensures a much better time complexity
              than the the simpler sorting algorithms.
            </p>
            <p>
              <strong>Time Complexity:</strong> Big O: O(n log n), Big Omega:
              Ω(n log n), Big Theta: Θ(n log n)
            </p>
          </section>

          <section id="heap-sort">
            <h2>Heap Sort</h2>
            <p>
              Heap Sort transforms the list into a binary heap, a complete
              binary tree where each parent node is greater (in a max-heap) or
              smaller (in a min-heap) than its children. It repeatedly removes
              the root of the heap (the largest or smallest element) and
              rebuilds the heap. This allows Heap Sort to have the same time
              complexity as mearge sort.
            </p>
            <p>
              <strong>Time Complexity:</strong> Big O: O(n log n), Big Omega:
              Ω(n log n), Big Theta: Θ(n log n)
            </p>
          </section>

          <section id="quick-sort">
            <h2>Quick Sort</h2>
            <p>
              Quick Sort selects a pivot element and partitions the list into
              elements less than and greater than the pivot. It recursively
              sorts the partitions.
            </p>
            <p>
              <strong>Time Complexity:</strong> Big O: O(n^2), Big Omega: Ω(n
              log n), Big Theta: Θ(n log n)
            </p>
          </section>

          <section id="selection-sort">
            <h2>Selection Sort</h2>
            <p>
              Selection Sort repeatedly finds the minimum element from the
              unsorted portion of the list and swaps it with the first unsorted
              element. This process continues until the list is sorted. Although
              simple, Selection Sort is inefficient for large lists.
            </p>
            <p>
              <strong>Time Complexity:</strong> Big O: O(n^2), Big Omega:
              Ω(n^2), Big Theta: Θ(n^2)
            </p>
          </section>

          <section id="bfs">
            <h2>Breadth First Search (BFS)</h2>
            <p>
              Breadth-First Search (BFS) is a graph traversal algorithm that
              explores nodes level by level. Starting from the root or an
              arbitrary node, it explores all neighbor nodes at the current
              depth before moving to nodes at the next depth level. BFS uses a
              queue to manage nodes and is useful for finding the shortest path
              in unweighted graphs.
            </p>
            <p>
              <strong>Time Complexity:</strong> Big O: O(V + E), Big Omega:
              Ω(V), Big Theta: Θ(V + E)
            </p>
          </section>

          <section id="dfs">
            <h2>Depth First Search (DFS)</h2>
            <p>
              Depth-First Search (DFS) explores a graph by going as deep as
              possible along each branch before backtracking. It uses a stack to
              keep track of nodes to explore and is effective for exploring all
              paths or finding components in a graph. DFS can be implemented
              using recursion or an explicit stack.
            </p>
            <p>
              <strong>Time Complexity:</strong> Big O: O(V + E), Big Omega:
              Ω(V), Big Theta: Θ(V + E)
            </p>
          </section>

          <section id="dijkstra">
            <h2>Dijkstra's Algorithm</h2>
            <p>
              Dijkstra's Algorithm finds the shortest paths from a starting node
              to all other nodes in a weighted graph. It maintains a set of
              nodes with known shortest paths and iteratively expands this set,
              using a priority queue to explore the node with the smallest known
              distance. It is efficient for graphs with non-negative weights.
            </p>
            <p>
              <strong>Time Complexity:</strong> Big O: O(V^2), Big Omega: Ω(V
              log V), Big Theta: Θ(V^2)
            </p>
          </section>

          <section id="a-star">
            <h2>A* Algorithm</h2>
            <p>
              A* Algorithm combines the features of Dijkstra's Algorithm and
              Greedy Best-First Search. It uses a heuristic to estimate the cost
              from the current node to the goal, combining this with the cost
              from the start node to determine the next node to explore. A* is
              highly effective for pathfinding problems where the goal is known,
              offering a balance between exploration and efficiency. The
              Heuristic function (the number at the bottom of a vertex)
              represents distance to the target node (the Hexagon)
            </p>
            <p>
              <strong>Time Complexity:</strong> Big O: O(E), Big Omega: Ω(V),
              Big Theta: Θ(E)
            </p>
          </section>
        </main>
      </body>
    </>
  );
}

export default DefaultScreen;
