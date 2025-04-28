const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');
const TaxiLine = require('./taxi'); // Make sure the path is correct

// --- Configuration ---
// Example coordinates (Port Said, Egypt) - Adjust as needed
const startLocation = { lat: 31.266447, lon: 32.259548 }; // 31.266447, 32.259548
const endDestination = { lat: 31.259727, lon: 32.310763 }; // 31.259727, 32.310763

// Example crossing Port Fouad
// const startLocation = { lat: 31.255, lon: 32.300 }; // El Arab
// const endDestination = { lat: 31.255, lon: 32.330 }; // Port Fouad

// OSRM options (geometries: 'geojson' is handled internally by calculateRoute)
const routeOptions = {
    overview: 'full',
    // steps: true,
    // alternatives: true
};
// --- End Configuration ---

// Note: Neighborhood loading is now handled inside the TaxiLine module itself.

async function runTest() {
    console.log(`\nTesting TaxiLine from ${JSON.stringify(startLocation)} to ${JSON.stringify(endDestination)}`);

    try {
        // 1. Create an instance
        const taxiRoute = new TaxiLine(startLocation, endDestination);
        console.log('TaxiLine instance created.');

        // 2. Calculate the route (this also triggers internal intersection calculation)
        console.log('Calculating route...');
        const routeData = await taxiRoute.calculateRoute(routeOptions);

        // 3. Check route calculation results
        if (routeData) {
            console.log('\n--- Route Calculation Successful ---');

            const distance = taxiRoute.getDistance();
            const duration = taxiRoute.getDuration();
            // const geometry = taxiRoute.getGeometry(); // Can still get geometry if needed

            console.log(`Distance: ${distance !== null ? (distance / 1000).toFixed(2) + ' km' : 'N/A'}`);
            console.log(`Duration: ${duration !== null ? (duration / 60).toFixed(1) + ' minutes' : 'N/A'}`);

            // 4. Get Intersection Results (from the class method)
            console.log('\n--- Neighborhood Intersection Results (from class) ---');
            const intersectionData = taxiRoute.getIntersectingNeighborhoods(); // Gets cached data

            if (intersectionData) {
                console.log(`Route intersects with ${intersectionData.count} neighborhoods.`);
                if (intersectionData.count > 0) {
                    console.log(`Intersected Neighborhoods: ${intersectionData.names.join(', ')}`);
                }
            } else {
                 console.log("Could not retrieve intersection data from the class.");
            }

            // 5. Get Price (from the class method)
            console.log('\n--- Route Price Calculation (from class) ---');
            const price = taxiRoute.getRoutePrice();

            if (price !== null) {
                console.log(`Calculated Price: ${price} EGP`);
            } else {
                console.log("Could not calculate the price.");
            }

        } else {
            console.log('\n--- Route Calculation Failed ---');
            console.log('OSRM did not return a valid route or an error occurred.');
        }

    } catch (error) {
        console.error('\n--- An Error Occurred During Test ---');
        // Check if it's the constructor error
        if (error.message.startsWith("Invalid location or destination")) {
             console.error("Error creating TaxiLine instance:", error.message);
        } else {
            console.error(error.message);
            if (error.stack) {
                console.error(error.stack);
            }
        }
    }
}

// Run the test function
runTest();