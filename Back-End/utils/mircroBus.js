class BusLine {
  pointsLine = [];
  finalResult = [];
  tilePoints = {};
  tileSize = 256;
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
        if (tilePoints[neighborKey]) {
          neighbors.push(...tilePoints[neighborKey]);
        }
      }
    }

    // If no points found, extend the range and search again
    if (neighbors.length === 0 && range < 3) {
      // Limit the range to avoid excessive searching
      return getPointsInNeighboringTiles(tileX, tileY, range + 1);
    }

    return neighbors;
  }

  _processGraph() {}

  _preparingResult() {}

  async initializeData() {
    // Fetch the tile points from the database
    const tilePoints = await fetch("./Back-End/utils/tilePoints.json").then(
      (res) => res.json()
    );

    // Get points in neighboring tiles from location & destination
    const tileXLocation = Math.floor(this.location.lng / this.tileSize);
    const tileYLocation = Math.floor(this.location.lat / this.tileSize);
    this.neighborpPintsLocation = this._getTile(
      tilePoints,
      tileXLocation,
      tileYLocation
    );

    const tileXDestination = Math.floor(this.destination.lng / this.tileSize);
    const tileYDestination = Math.floor(this.destination.lat / this.tileSize);
    this.neighborpPintsDestination = this._getTile(
      tilePoints,
      tileXDestination,
      tileYDestination
    );

    // Process the graph
    this._processGraph();

    // Prepare the result
    this._preparingResult();
  }
}
