const fs = require("fs").promises;
const { dijkstra } = require("./distanceCalculation");

class BusLine {
  pointsLine = [];
  finalResult = [];
  tilePoints = {};
  tileSize = 256;
  zoom = 18;
  map = null;

  constructor(location, destination) {
    this.location = location;
    this.destination = destination;
  }

  _getTile(tilePoints, tileX, tileY, range = 1) {
    const neighbors = [];

    // Iterate over the grid of neighboring tiles based on the range
    for (let dx = -range; dx <= range; dx++) {
      for (let dy = -range; dy <= range; dy++) {
        const neighborKey = `${tileX + dx},${tileY + dy}`;
        //   console.log("neighborKey", neighborKey);
        if (tilePoints[neighborKey]) {
          neighbors.push(...tilePoints[neighborKey]);
        }
      }
    }

    // If no points found, extend the range and search again
    if (neighbors.length === 0) {
      if (range < 3) {
        return this._getTile(tilePoints, tileX, tileY, range + 1);
      }
      // Limit the range to avoid excessive searching
      return [];
    }

    return neighbors;
  }

  // This method is intended to process the graph data for the bus line.
  _processGraph(pointsRelation) {
    let graph = {};

    for (const pointLocation of this.neighborPointsLocation) {
      for (const pointDestination of this.neighborPointsDestination) {
        const startNode = pointLocation.name;
        const endNode = pointDestination.name;
        const result = dijkstra(pointsRelation, startNode, endNode);
        console.log("pointLocation", pointLocation);
        console.log("pointDestination", pointDestination);
        console.log(result);
        console.log("==========================");
      }
    }
  }
  _preparingResult() {
    // This method is intended to prepare the final result after processing the graph.
    // Implement the logic to format or process the data as needed.
  }

  async loadData(fileName) {
    const fileContent = await fs.readFile(fileName, "utf8");
    const data = JSON.parse(fileContent);

    return data;
  }

  projectLatLng(lat, lng, tileSize = 256, zoom = 19) {
    const scale = tileSize * Math.pow(2, zoom); // e.g. 256, 512, 1024, etc.

    const x = ((lng + 180) / 360) * scale;

    const latRad = (lat * Math.PI) / 180;
    const y =
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      scale;

    return { x, y };
  }

  async initializeData() {
    // Load the tile points from the file
    const tilePoints = await this.loadData("storage/tiles-group.json");

    // Get points in neighboring tiles from location & destination
    const pointLocation = this.projectLatLng(
      this.location.lat,
      this.location.lng,
      this.tileSize,
      this.zoom
    );
    const tileXLocation = Math.floor(pointLocation.x / this.tileSize);
    const tileYLocation = Math.floor(pointLocation.y / this.tileSize);

    this.neighborPointsLocation = this._getTile(
      tilePoints,
      tileXLocation,
      tileYLocation
    );

    //  console.log("neighborPointsLocation", this.neighborPointsLocation);
    if (this.neighborPointsLocation.length === 0) {
      throw new Error("Location not found");
    }

    const pointDestination = this.projectLatLng(
      this.destination.lat,
      this.destination.lng,
      this.tileSize,
      this.zoom
    );
    const tileXDestination = Math.floor(pointDestination.x / this.tileSize);
    const tileYDestination = Math.floor(pointDestination.y / this.tileSize);

    this.neighborPointsDestination = this._getTile(
      tilePoints,
      tileXDestination,
      tileYDestination
    );
    //  console.log("neighborPointsDestination", this.neighborPointsDestination);
    if (this.neighborPointsDestination.length === 0) {
      throw new Error("Destination not found");
    }

    // Process the graph
    const pointsRelation = await this.loadData(
      "storage/relations_with_dis-and-fee.json"
    );
    //  console.log("pointsRelation", pointsRelation);
    this._processGraph(pointsRelation);

    // Prepare the result
    this._preparingResult();
  }
}
