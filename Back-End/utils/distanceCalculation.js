class PriorityQueue {
  constructor() {
    this.items = [];
  }
  enqueue(element, priority) {
    const qElement = { element, priority };
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > qElement.priority) {
        this.items.splice(i, 0, qElement);
        added = true;
        break;
      }
    }
    if (!added) {
      this.items.push(qElement);
    }
  }
  dequeue() {
    return this.items.shift();
  }
  isEmpty() {
    return this.items.length === 0;
  }
}

/// Dijkstra's algorithm implementation
/// startNode: The starting node
/// endNode: The destination node
/// graph: The graph represented as an adjacency list
/// feeWeight: if 0 it will ignore the fee, if for ex. 0.6 it will consider the fee as 60% of the distance
function dijkstra(graph, startNode, endNode, feeWeight = 0.6) {
  const distances = {};
  const pq = new PriorityQueue();
  const previous = {};
  const fees = {};

  Object.keys(graph).forEach((node) => {
    distances[node] = Infinity;
    previous[node] = null;
    fees[node] = 0;
  });

  distances[startNode] = 0;
  pq.enqueue(startNode, 0);

  while (!pq.isEmpty()) {
    const { element: currentNode } = pq.dequeue();

    // If the current node is the endNode, build the path and return it
    if (currentNode === endNode) {
      const path = [];
      let tempNode = endNode;
      while (tempNode !== null) {
        path.unshift(tempNode);
        tempNode = previous[tempNode];
      }
      return {
        path,
        distance: distances[endNode],
        totalFee: fees[endNode] + 4.5,
      };
    }

    // If the distance to the currentNode is Infinity, it means endNode is unreachable
    if (distances[currentNode] === Infinity) {
      console.log("No path found from the start node to the end node.");
      return { path: [], distance: Infinity, totalFee: 0 };
    }

    for (const neighbor in graph[currentNode]) {
      const { distance, fee } = graph[currentNode][neighbor];
      const compositeCost = cost(distance, fee, feeWeight);
      const alt = distances[currentNode] + compositeCost;

      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = currentNode;
        fees[neighbor] = fees[currentNode] + fee;
        pq.enqueue(neighbor, alt);
      }
    }
  }

  // If we exit the loop without finding the endNode
  console.log("No path found from the start node to the end node.");
  return { path: [], distance: Infinity, totalFee: 0 };
}

// Define a cost function
function cost(distance, fee, feeWeight = 0.6, distanceWeight = 0.4) {
  return distance * distanceWeight + fee * feeWeight;
}

module.exports = {
  dijkstra,
};
