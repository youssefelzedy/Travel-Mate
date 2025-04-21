// A* Algorithm Implementation for Latitude and Longitude Coordinates
const { FibonacciHeap } = require('@tyriar/fibonacci-heap');
const { getNeighboringPoints } = require(`${__dirname}/geoUtils`); // Importing from geoUtils

// Removed unused 'cost' function


function heuristic(NodeA, NodeB) {
  // Haversine formula to calculate the distance between two points on the Earth
  const { lat: lat1, lng: lng1 } = NodeA;
  const { lat: lat2, lng: lng2 } = NodeB;
  const R = 6371; // Radius of Earth in km
  const toRad = x => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

class Node {
  constructor(name, lat, lng, busName, gScore = Infinity, hScore = Infinity, previous = null) {
    this.name = name;
    this.busName = busName; // Bus name
    this.type = "bus"; // Type of the node
    this.lat = lat; // Latitude
    this.lng = lng; // Longitude
    this.gScore = gScore; // Cost from start node to this node
    this.hScore = hScore; // Heuristic cost from this node to the end node
    this.fScore = gScore + hScore; // Total cost
    this.visited = false; // Flag to check if the node has been visited
    this.neighbors = []; // Neighbors of the node
    this.distance = 0; // Distance to the previous node
    this.previous = previous; // Previous node in the path
    }
  }

function findNearestNodes(nodes, current) {
  return nodes.reduce((acc, node) => {
    const distanceToCurrent = heuristic(current, node);

    if (!acc[node.busName] || distanceToCurrent < acc[node.busName].distance) {
      acc[node.busName] = { node, distance: distanceToCurrent };
    }

    return acc;
  }, {});
}


function aStar(pointsRelation, pointsLocation, tilePoints, current, startNodes, endNodes, walkingWeight = 1) {
  const pq = new FibonacciHeap(); // Fibonacci heap for open set
  const nodeHandles = {}; // To store handles for updating priorities
  const nodes = {}; // To store nodes

  // Create nodes for the graph  
  for (const [key, value] of Object.entries(pointsLocation)) {
    const { lat, lng, busName } = value;
    nodes[key] = new Node(key, lat, lng, busName);
  }

  // StartNode have more than one potential start
  // Find the Start nearest to the current location
  // StartNode have more than one potential start
  // Find the Start nearest to the current location
  const nearestStarts = findNearestNodes(startNodes, current);
  const nearestEnds = findNearestNodes(endNodes, current);
  const startNode = Object.values(nearestStarts).map(entry => entry.node);
  const endNode = Object.values(nearestEnds).map(entry => entry.node);



  if (startNodes.length === 0) {
    throw new Error("No valid start nodes found near the current location.");
  }

  for (const start of startNode) {
    nodes[start.name].gScore = heuristic(current, start);
    
    nodes[start.name].hScore = Math.min(
      ...Object.values(nearestEnds).map(entry => heuristic(start, entry.node))
    );
    nodes[start.name].fScore = nodes[start.name].gScore + nodes[start.name].hScore;
    nodeHandles[start.name] = pq.insert(nodes[start.name].fScore, nodes[start.name]);
  }

  while (!pq.isEmpty()) {
    const { value: currentNode } = pq.extractMinimum();
    // Skip if the node has already been visited
    if (currentNode.visited) continue;
    currentNode.visited = true; // Mark the node as visited

    // If the current node is the endNode, build the path and return it
    if (endNode.some(end => end.name === currentNode.name)) {
      const totalPath = [];
      let tempNode = currentNode;
      let coordinates = []
      while (tempNode !== null) {
      coordinates.unshift([tempNode.lat, tempNode.lng]);
      tempNode = tempNode.previous;
      }

      totalPath.push({
        type: currentNode.type,
        coordinates,
      });
      return {
      totalPath,
      distance: currentNode.gScore,
      totalFee: currentNode.gScore,
      };
    }

    for (const neighborName in pointsRelation[currentNode.name]) {
      const { distance } = pointsRelation[currentNode.name][neighborName];
      currentNode.distance = distance;
      
      const pointsInNearTiles = getNeighboringPoints(currentNode.lat, currentNode.lng, tilePoints);

      // Check for points in neighboring tiles
      for (const point of pointsInNearTiles) {
        if (nodes[point.name].visited)
          continue;
        if (nodes[point.busName !== currentNode.busName]) {
          const walkingDistnace = heuristic(currentNode, point);
          nodes[point.name].gScore = currentNode.gScore + walkingDistnace;
          nodes[point.name].hScore = Math.min(
            ...Object.values(nearestEnds).map(entry => heuristic(point, entry.node))
          );
          // Add walkingWeight to the fScore
          nodes[point.name].fScore = (
            nodes[point.name].gScore + nodes[point.name].hScore 
          );
          nodes[point.name].type = "walk";
          nodeHandles[point.name] = pq.insert(nodes[point.name].fScore, nodes[point.name]);
        }
      }
      console.log("PQQ:", pq);
      const estimatedGScore = currentNode.gScore + distance;

      if (estimatedGScore < nodes[neighborName].gScore) {
        nodes[neighborName].gScore = estimatedGScore;
        nodes[neighborName].fScore = estimatedGScore + Math.min(
          ...endNode.map(end => heuristic(nodes[neighborName], end))
        );
        nodes[neighborName].previous = currentNode;
        nodes[neighborName].previous = currentNode;


        if (nodeHandles[neighborName] && pq.contains(nodeHandles[neighborName])) {
          pq.decreaseKey(nodeHandles[neighborName], nodes[neighborName].fScore);
        } else {
          nodeHandles[neighborName] = pq.insert(nodes[neighborName].fScore, nodes[neighborName]);
        }
      }
    }
  }
  // If we exit the loop without finding the endNode
  throw new Error("No path found from the start node to the end node.");
}


module.exports = aStar;