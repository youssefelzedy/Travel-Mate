const fs = require("fs").promises;
const aStar = require(`${__dirname}/distanceCalculation`);

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

  // This method is intended to process the graph data for the bus line.
  _processGraph(pointsLocation, tilePoints) {

    // Implement the logic to process the graph data.
    // This may involve creating nodes, edges, and calculating distances.
    // You can use the aStar function for pathfinding.

    const result = aStar(pointsLocation, tilePoints, this.location, this.destination);
    this.finalResult = result;
    
  }

  async loadData(fileName) {
    const fileContent = await fs.readFile(fileName, "utf8");
    const data = JSON.parse(fileContent);

    return data;
  }

  async initializeData() {
    // Load the tile points from the file
    this.tilePoints = await this.loadData("storage/tiles-group.json");

    const pointsLocation = await this.loadData(
      "storage/roads-locations.json"
    );
    this._processGraph(pointsLocation, this.tilePoints);

  }
}

module.exports = BusLine;