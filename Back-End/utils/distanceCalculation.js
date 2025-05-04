// A* Algorithm Implementation for Latitude and Longitude Coordinates
const { FibonacciHeap } = require('@tyriar/fibonacci-heap');
const { getNeighboringPoints, heuristic, assignPointsToTiles } = require(`${__dirname}/geoUtils`); // Importing from geoUtils


class Node {
  constructor(lat, lng, name, type = "bus", gScore = Infinity, hScore = Infinity, distance = 0, previous = null, next = null) {
    this.id = `${lat},${lng}`; // Unique identifier for the node
    this.name = name; // Bus name
    this.type = type; // Type of the node
    this.lat = lat; // Latitude
    this.lng = lng; // Longitude
    this.gScore = gScore; // Cost from start node to this node
    this.hScore = hScore; // Heuristic cost from this node to the end node
    this.fScore = gScore + hScore; // Total cost
    this.distance = distance // Distance to the node
    this.closed = false; // Flag to indicate if the node is closed
    this.neighbors = []; // Neighbors of the node
    this.previous = previous; // Previous node in the path
    this.next = next; // Next node in the path
  }
}

function pathReconstruction(endNode, startNode, busFee) {
  const segments = [];

  let segment = {
    type: endNode.type,
    name: endNode.name,
    coordinates: [[endNode.lat, endNode.lng]],
  };

  let tempNode = endNode;

  while (true) {
    tempNode = tempNode.previous;

    // Check if we're changing type (e.g., from walk to bus) or bus line
    const typeChanged = tempNode.type !== segment.type;
    console.log("Current segment:", segment.type, tempNode.type, tempNode.lat, tempNode.lng);

    if (typeChanged) {
      // Push current segment and start a new one
      segment.coordinates.push([tempNode.lat, tempNode.lng]);
      segments.push(segment);
      segment = {
        type: tempNode.type,
        name: tempNode.name,
        coordinates: [],
      };
    }

    segment.coordinates.push([tempNode.lat, tempNode.lng]);
    if (tempNode.id === startNode.id) {
      segment.type = startNode.type; // Set the type to start for the start node
      segment.name = startNode.name; // Set the name to start for the start node
      break; // Reached the start node
    }
  }

  // Push the final segment
  segments.push(segment);
  
  // Reverse all coordinate arrays and the segment list to get start-to-end order
  const totalPath = segments.reverse().map(seg => ({
    ...seg,
    coordinates: seg.coordinates.reverse(),
  }));

  const busCount = totalPath.filter(segment => segment.type === "bus").length;

  return {
    totalPath,
    distance: endNode.distance,
    totalFee: busCount * busFee,
  };
}


function processNextNode(currentNode, nextNode, end, nodeHandles, pq, walkingWeight, busChangeWeight) {

  if (nextNode.closed) return;

  const distance = heuristic(currentNode, nextNode);
  let tentativeGScore;

  if (walkingWeight) {
    tentativeGScore = currentNode.gScore + distance * walkingWeight + busChangeWeight;
  } else {
    tentativeGScore = currentNode.gScore + distance;
  }

  if (nextNode.closed || tentativeGScore >= nextNode.gScore) return;

  nextNode.distance = currentNode.distance + distance;
  nextNode.gScore = tentativeGScore;
  nextNode.hScore = nextNode.id === end.id ? 0 : heuristic(nextNode, end);
  nextNode.fScore = nextNode.gScore + nextNode.hScore;
  nextNode.type = walkingWeight ? "walk" : "bus";
  nextNode.previous = currentNode;

  if (!nodeHandles[nextNode.id]) {
    nodeHandles[nextNode.id] = pq.insert(nextNode.fScore, nextNode);
  } else {
    pq.decreaseKey(nodeHandles[nextNode.id], nextNode.fScore);
  }
}

function aStar(pointsLocation, tilePoints, location, destination, busFee = 5, walkingWeight = 10, busChangeWeight = 2) {
  try {
    const pq = new FibonacciHeap(); // Fibonacci heap for open set
    const nodeHandles = new Map(); // To store handles for updating priorities
    const nodes = {}; // To store nodes

    const start = new Node(location.lat, location.lng, "start", "walk", 0);
    const end = new Node(destination.lat, destination.lng, "end", "walk");

    nodes[start.id] = start;
    nodes[end.id] = end;

    // Assign end point to the tile
    assignPointsToTiles(tilePoints, end);
    // Initialize each node in the graph
    pointsLocation.forEach(road => {
      let previousNode = null;
      road.path.forEach((point) => {
        const { lat, lng } = point;
        const id = `${lat},${lng}`;
        if (!nodes[id]) {
          nodes[id] = new Node(lat, lng, road.name, road.type);
        }
        if (previousNode) {
          nodes[previousNode.id].next = nodes[id];
          nodes[id].previous = nodes[previousNode.id];
        }
        previousNode = nodes[id];
      });
    });


    // Initialize the start node
    start.hScore = heuristic(start, end);
    start.fScore = start.gScore + start.hScore;
    nodeHandles[start.id] = pq.insert(start.fScore, start);

    // Start the search
    while (!pq.isEmpty()) {
      const { value: currentNode } = pq.extractMinimum();

      if (currentNode.closed) {
        continue;
      }
      currentNode.closed = true;

      if (currentNode.id === end.id) {
        const path = pathReconstruction(currentNode, start, busFee);
        if (path) {
          return path;
        }
        throw new Error("No path found from the start node to the end node.");
      }


      currentNode.neighbors = getNeighboringPoints(currentNode.lat, currentNode.lng, tilePoints, 3);

      // Iterate over the neighbors of the current node
      for (const point of currentNode.neighbors) {
        const neighbor = nodes[`${point.lat},${point.lng}`];

        if (neighbor.name === currentNode.name) continue;

        processNextNode(currentNode, neighbor, end, nodeHandles, pq, walkingWeight, busChangeWeight);

      }

      // Iterate over the next nodes in the path (added to the queue and remmove the previous node)
      if (currentNode.next) {
        processNextNode(currentNode, currentNode.next, end, nodeHandles, pq, 0, 0);
      }
    }

    throw new Error("No path found from the start node to the end node.");
  } catch (error) {
    throw error;
  }
}

module.exports = aStar;
