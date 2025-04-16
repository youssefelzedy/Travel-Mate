const graph = require("./graph");

console.log(graph);

class BusLine {
    pointsLine = {};
    finalResult = {};
    constructor(location, destination) {
      this.location = location;
      this.destination = destination;
    }

    async initializeData() {
        
}