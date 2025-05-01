const fs = require("fs").promises;
const aStar = require(`${__dirname}/distanceCalculation`);
const { getNeighboringPoints, projectLatLng } = require(`${__dirname}/geoUtils`); // Importing from geoUtils

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

  getNeighboringPoints(lat, lng, tilePoints = this.tilePoints) {
    return getNeighboringPoints(lat, lng, tilePoints);
  }

  projectLatLng(lat, lng, tileSize = 256, zoom = 19) {
    return projectLatLng(lat, lng, tileSize, zoom);
  }

  // This method is intended to process the graph data for the bus line.
  _processGraph(pointsLocation, tilePoints) {

    // Implement the logic to process the graph data.
    // This may involve creating nodes, edges, and calculating distances.
    // You can use the aStar function for pathfinding.
    // Example:
    const startNode = this.neighborPointsLocation;
    const endNode = this.neighborPointsDestination;

    const result = aStar(pointsLocation, tilePoints, startNode, endNode, this.location, this.destination);
    console.log("Result:", result);
    this.finalResult = result;
    
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

  async initializeData() {
    // Load the tile points from the file
    this.tilePoints = await this.loadData("storage/tiles-group.json");

    // Get points in neighboring tiles from location & destination
    this.neighborPointsLocation = this.getNeighboringPoints(
      this.location.lat,
      this.location.lng,
      this.tilePoints
    );

    if (this.neighborPointsLocation.length === 0) {
      throw new Error("Location not found");
    }

    this.neighborPointsDestination = this.getNeighboringPoints(
      this.destination.lat,
      this.destination.lng,
      this.tilePoints
    );


    if (this.neighborPointsDestination.length === 0) {
      throw new Error("Destination not found");
    }



    const pointsLocation = await this.loadData(
      "storage/roads-locations.json"
    );
    this._processGraph(pointsLocation, this.tilePoints);

    // Prepare the result
    this._preparingResult();
  }
}

module.exports = BusLine;