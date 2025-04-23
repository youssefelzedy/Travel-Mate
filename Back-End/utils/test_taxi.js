const TaxiLine = require('./taxi'); // Make sure the path is correct

// --- Configuration ---
// Example coordinates (Port Said, Egypt)
const startLocation = { lat: 31.243843, lon: 32.318923 };
const endDestination = { lat: 31.263347, lon: 32.308769 };

// Example coordinates that might cause an error (e.g., middle of the ocean)
// const startLocation = { lat: 0, lon: 0 };
// const endDestination = { lat: 1, lon: 1 };

// OSRM options (optional)
// See OSRM docs for available options: https://project-osrm.org/docs/v5.24.0/api/#route-service
const routeOptions = {
    overview: 'full',       // 'simplified', 'full', 'false'
    geometries: 'geojson', // 'polyline', 'polyline6', 'geojson'
    // steps: true,         // Include step-by-step instructions
    // alternatives: true   // Try to compute alternative routes
};
// --- End Configuration ---


async function runTest() {
    console.log(`Testing TaxiLine from ${JSON.stringify(startLocation)} to ${JSON.stringify(endDestination)}`);

    try {
        // 1. Create an instance
        const taxiRoute = new TaxiLine(startLocation, endDestination);
        console.log('TaxiLine instance created.');

        // 2. Calculate the route
        console.log('Calculating route...');
        const routeData = await taxiRoute.calculateRoute(routeOptions);

        // 3. Check results
        if (routeData) {
            console.log('\n--- Route Calculation Successful ---');

            // Get specific details using the getter methods
            const distance = taxiRoute.getDistance(); // meters
            const duration = taxiRoute.getDuration(); // seconds
            const geometry = taxiRoute.getGeometry();

            console.log(`Distance: ${distance !== null ? (distance / 1000).toFixed(2) + ' km' : 'N/A'}`);
            console.log(`Duration: ${duration !== null ? (duration / 60).toFixed(1) + ' minutes' : 'N/A'}`);

            // Log geometry (can be large if geojson)
            if (geometry) {
                if (typeof geometry === 'object') {
                     console.log(`Geometry Type: ${geometry.type}`);
                     console.log(`Geometry Coordinates Preview: ${JSON.stringify(geometry.coordinates?.[0])}...`); // Show first coordinate pair
                } else {
                    console.log(`Geometry Preview: ${geometry.substring(0, 50)}...`); // Show start of polyline
                }
            } else {
                 console.log('Geometry: N/A (Check routeOptions)');
            }

            // console.log('\nRaw OSRM Response:');
            // console.log(JSON.stringify(routeData, null, 2)); // Pretty print the full response

        } else {
            console.log('\n--- Route Calculation Failed ---');
            console.log('OSRM did not return a valid route. Check console errors above.');
        }

    } catch (error) {
        console.error('\n--- An Error Occurred ---');
        console.error(error.message);
        if (error.stack) {
            console.error(error.stack);
        }
    }
}

// Run the test function
runTest();