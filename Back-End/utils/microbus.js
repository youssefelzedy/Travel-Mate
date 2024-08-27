const geolib = require("geolib");
const fs = require("fs").promises;
const path = require('path');
const graph = require("./graph");

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

function dijkstra(graph, startNode, endNode) {
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
      return { path, distance: distances[endNode], totalFee: fees[endNode] };
    }

    // If the distance to the currentNode is Infinity, it means endNode is unreachable
    if (distances[currentNode] === Infinity) {
      console.log("No path found from the start node to the end node.");
      return { path: [], distance: Infinity, totalFee: 0 };
    }

    for (const neighbor in graph[currentNode]) {
      const { distance, fee } = graph[currentNode][neighbor];
      const compositeCost = cost(distance, fee);
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
function cost(distance, fee, distanceWeight = 0.5, feeWeight = 0.5) {
  return distance * distanceWeight + fee * feeWeight;
}

class BusLine {
    pointsLine = {};
    finalResult = {};
    constructor(location, destination) {
      this.location = location;
      this.destination = destination;
    }
  
    _putClosestBusStops(location, type) {
      Object.values(this.pointsLine).forEach((point) => {
        const distance = geolib.getDistance(
          { latitude: location.lat, longitude: location.lng },
          { latitude: point.lat, longitude: point.lng }
        );
        if (type === "location") point.disWalkFromPos = distance;
        else point.disWalkFromDis = distance;
      });
    }
  
    _getClosestBusStops(stopsArray, type) {
      // Sort the array based on the 'disWalkFromDis' property
      if (type === "location")
        stopsArray.sort((a, b) => a.disWalkFromPos - b.disWalkFromPos);
      else stopsArray.sort((a, b) => a.disWalkFromDis - b.disWalkFromDis);
  
      // Get the first 10 elements (the stops with the lowest 'disWalkFromDis' values)
      const lowest10Stops = stopsArray.slice(0, 10);
  
      const lowest10StopNames = lowest10Stops.map((stop) => stop.name);
  
      return lowest10StopNames;
    }
  
    _countBusStop(destination) {
      let count = 0;
  
      Object.entries(this.pointsLine).forEach(([name, point]) => {

        const path = dijkstra(this.graph, name, destination.name);
        point.nmStops = path.length - 1;
      });
    }
  
    async initializeData() {
      try {
        const pth = path.resolve('./storage/roads-locations.json')
        const data = await fs.readFile(`${pth}`, "utf8");
        this.pointsLine = JSON.parse(data);
  
        this._putClosestBusStops(this.location, "location");
        this._putClosestBusStops(this.destination, "destination");
  
        this.graph = graph(this.pointsLine);
  
        this.closestPostion = this._getClosestBusStops(
          Object.values(this.pointsLine),
          "location"
        );
        this.closestDestination = this._getClosestBusStops(
          Object.values(this.pointsLine),
          "destination"
        );
  
        this.processGraph();
        this.calcDistance();
        this.preparingResult();
  
        // try {
        //   fs.writeFile(
        //     `dijkstra_result.json`,
        //     JSON.stringify(this.finalResult, null, 2),
        //     "utf8"
        //   );
        // } catch (error) {
        //   console.error("Error Writing JSON file:", error);
        // }
      } catch (error) {
        console.error("Error reading JSON file:", error);
      }
      return this.finalResult;
    }
    async processGraph() {
      this.ans_of_dijkstra = {};
      for (let i = 1; i <= 10; i++) {
        let StopDis = this.closestDestination[i - 1];
        for (let j = 1; j <= 10; j++) {
          let StopPos = this.closestPostion[j - 1];
          const path = dijkstra(this.graph, StopPos, StopDis);
          this.ans_of_dijkstra[`${i} ${j}`] = path;
          // console.log(
          //   `from ${this.closestPostion[j - 1]} to ${
          //     this.closestDestination[i - 1]
          //   } taked by ${path.path.length}  Stops with ${path.totalFee + 3.5} EGP`
          // );
        }
      }
    }
  
    calcDistance() {
      for (let key in this.ans_of_dijkstra) {
        if (this.ans_of_dijkstra.hasOwnProperty(key)) {
          // Add the new key with the length of the path
          let nameLastStop =
            this.ans_of_dijkstra[key].path[
              this.ans_of_dijkstra[key].path.length - 1
            ];
          this.ans_of_dijkstra[key].pathLength =
            this.pointsLine[nameLastStop].disWalkFromDis;
        }
      }
      this.sortedRoutes = Object.entries(this.ans_of_dijkstra).sort((a, b) => {
        const feeDifference = a[1].totalFee - b[1].totalFee;
        if (feeDifference !== 0) {
          return feeDifference;
        }
        return a[1].pathLength - b[1].pathLength;
      });
    }
  
    preparingResult() {
      const theLine = this.sortedRoutes[0][1];
      let d = 1;
      this.finalResult[`Walk1`] = {
        position: this.location,
        destination: {
          lat: this.pointsLine[theLine.path[0]].lat,
          lng: this.pointsLine[theLine.path[0]].lng,
        },
      };
  
      this.finalResult[`Bus${d}`] = {
        position: [],
      };
      for (let i = 0; i < theLine.path.length - 1; i++) {
        this.finalResult[`Bus${d}`].position.push({
          lat: this.pointsLine[theLine.path[i]].lat,
          lng: this.pointsLine[theLine.path[i]].lng,
        });
  
        // Check if a new bus route should start (based on fee)
        if (
          i < theLine.path.length - 1 &&
          this.graph[theLine.path[i]][theLine.path[i + 1]].fee === 3.5
        ) {
          d++; // Increment Bus index
          this.finalResult[`Bus${d}`] = { position: [] }; // Initialize a new Bus entry
        }
      }
  
      this.finalResult[`Bus${d}`].position.push({
        lat: this.pointsLine[theLine.path[theLine.path.length - 1]].lat,
        lng: this.pointsLine[theLine.path[theLine.path.length - 1]].lng,
      });
  
      this.finalResult[`Walk2`] = {
        position: {
          lat: this.pointsLine[theLine.path[theLine.path.length - 1]].lat,
          lng: this.pointsLine[theLine.path[theLine.path.length - 1]].lng,
        },
        destination: this.destination,
      };
  
      this.finalResult.totalFee = theLine.totalFee + 3.5;
    }
  }

// const location = { lat: 31.2587584192, lng: 32.2931440543 };
// const destination = { lat: 31.2607126949, lng: 32.3071995724 };
// let test = new BusLine(location, destination);
// test.initializeData().then(() => {
//   console.log(test.finalResult);
// });

module.exports = BusLine;
