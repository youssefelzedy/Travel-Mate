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

function findNearestNodes(nodes, location, nodesMap) {
  const nearstNodes = nodes.reduce((acc, node) => {
    const distanceToCurrent = heuristic(location, node);

      acc[node.name] = { node, distance: distanceToCurrent };

    return acc;
  }, {});

  return Object.values(nearstNodes).map(entry => nodesMap[`${entry.node.lat},${entry.node.lng}`]);

}


function aStar(pointsLocation, tilePoints, startNodes, endNodes, location, destination, busFee = 5, walkingWeight = -10, busChangeWeight = 100) {
  try {
    const pq = new FibonacciHeap(); // Fibonacci heap for open set
    const nodeHandles = {}; // To store handles for updating priorities
    const nodes = {}; // To store nodes


    pointsLocation.forEach(road => {
      let previousNode = null;
      road.path.forEach((point) => {
        const { lat, lng, type } = point;
        const id = `${lat},${lng}`;
        if (!nodes[id]) {
          nodes[id] = new Node(lat, lng, road.name, type);
        }
        if (previousNode) {
          nodes[previousNode.id].next = nodes[id];
          nodes[id].previous = nodes[previousNode.id];
        }
        previousNode = nodes[id];
      });
    });

    const startNode = findNearestNodes(startNodes, location, nodes);
    const endNode = findNearestNodes(endNodes, location, nodes);

    if (startNodes.length === 0) {
      throw new Error("No valid start nodes found near the current location.");
    }

    for (const start of startNode) {
      const id = `${start.lat},${start.lng}`;
      if (!nodes[id]) {
        throw new Error(`Node ${start.lat},${start.lng} not found in the graph.`);
      }
      nodes[id].gScore = heuristic(location, start);
      nodes[id].hScore = Math.min(
        ...endNode.map(end => heuristic(start, end))
      );
      nodes[id].fScore = nodes[id].gScore + nodes[id].hScore;
      nodeHandles[id] = pq.insert(nodes[id].fScore, nodes[id]);
    }

    while (!pq.isEmpty()) {
      const { value: currentNode } = pq.extractMinimum();

      if (currentNode.closed) {
        continue;
      }
      currentNode.closed = true;
      console.log(`Current node: ${currentNode.id}, fScore: ${currentNode.fScore}`);


      if (endNode.some(end => end.id === currentNode.id)) {
        const totalPath = [];
        let tempNode = currentNode;
        let coordinates = [];
        totalPath.push({
          type: "walk",
          coordinates: [
            [currentNode.lat, currentNode.lng],
            [destination.lat, destination.lng]
          ],
        });
        while (true) {
          if (tempNode.previous && tempNode.type === "walk") {
            coordinates.unshift([tempNode.lat, tempNode.lng]);
            totalPath.push({
              type: "bus",
              name: tempNode.name,
              coordinates,
            });
            coordinates = [];
            coordinates.unshift([tempNode.lat, tempNode.lng]);
            tempNode = tempNode.previous;
            coordinates.unshift([tempNode.lat, tempNode.lng]);
            totalPath.push({
              type: "walk",
              coordinates,
            });
            coordinates = [];
          }
          coordinates.unshift([tempNode.lat, tempNode.lng]);


          if (startNode.some(start => start.id === tempNode.id)) {
            totalPath.push({
              type: "bus",
              name: tempNode.name,
              coordinates,
            });
            break;
          }
          tempNode = tempNode.previous;
        }

        totalPath.push({
          type: "walk",
          coordinates: [
            [location.lat, location.lng],
            [tempNode.lat, tempNode.lng]
          ],
        });
        console.log("Path found successfully.");
        const busCount = totalPath.filter(segment => segment.type === "bus").length;
        return {
          totalPath,
          distance: currentNode.gScore,
          totalFee: busCount * busFee,
        };
      }

      // See if it's walkable from you point
      for (const point of startNode) {
        if (point.closed) {
          continue;
        }
        const tentativeGScore = currentNode.gScore + heuristic(currentNode, point) * walkingWeight;


        if (!nodeHandles[point.id]) {
          nodeHandles[point.id] = pq.insert(nodes[point.id].fScore, nodes[point.id]);
        } else if (nodes[point.id].gScore < tentativeGScore) {
          continue; // this path is not better
        }
        nodes[point.id].gScore = tentativeGScore;
        nodes[point.id].hScore = Math.min(
          ...endNode.map(end => heuristic(nodes[neighborId], end))
        );
        nodes[point.id].fScore = nodes[point.id].gScore + nodes[point.id].hScore;
        nodes[point.id].type = "walk";
        nodes[point.id].previous = currentNode;
        pq.decreaseKey(nodeHandles[point.id], nodes[point.id].fScore);
      }



      currentNode.neighbors = getNeighboringPoints(currentNode.lat, currentNode.lng, tilePoints);

      // Iterate over the neighbors of the current node
      for (const point of currentNode.neighbors) {
        const neighborId = `${point.lat},${point.lng}`;



        if (nodes[neighborId].closed || nodes[neighborId].name === currentNode.name) {
          continue;
        }
        const tentativeGScore = currentNode.gScore + heuristic(currentNode, point) * walkingWeight + busChangeWeight;


        if (!nodeHandles[neighborId]) {
          nodeHandles[neighborId] = pq.insert(nodes[neighborId].fScore, nodes[neighborId]);
        } else if (nodes[neighborId].gScore < tentativeGScore) {
          continue; // this path is not better
        }
        nodes[neighborId].gScore = tentativeGScore;
        nodes[neighborId].hScore = Math.min(
          ...endNode.map(end => heuristic(nodes[neighborId], end))
        );
        nodes[neighborId].fScore = nodes[neighborId].gScore + nodes[neighborId].hScore;
        nodes[neighborId].type = "walk";
        nodes[neighborId].previous = currentNode;
        pq.decreaseKey(nodeHandles[neighborId], nodes[neighborId].fScore);
      }


      // Iterate over the next nodes in the path (added to the queue and remmove the previous node)
      if (currentNode.next) {
        const nextNode = currentNode.next;
        if (currentNode.next.closed) continue;

        const distance = heuristic(currentNode, nextNode);
        const tentativeGScore = currentNode.gScore + distance;


        if (!nodeHandles[nextNode.id]) {
          nodeHandles[nextNode.id] = pq.insert(nodes[nextNode.id].fScore, nodes[nextNode.id]);
        } else if (nodes[nextNode.id].gScore < tentativeGScore) {
          continue; // this path is not better
        }
        nodes[nextNode.id].distance = currentNode.distance + distance;
        nodes[nextNode.id].gScore = currentNode.gScore + distance;
        nodes[nextNode.id].hScore = Math.min(
          ...endNode.map(entry => heuristic(nextNode, entry))
        );
        nodes[nextNode.id].fScore = (
          nodes[nextNode.id].gScore + nodes[nextNode.id].hScore
        );

        pq.decreaseKey(nodeHandles[nextNode.id], nodes[nextNode.id].fScore);
      }

    }

    throw new Error("No path found from the start node to the end node.");
  } catch (error) {
    throw error;
  }
}

module.exports = aStar;
