const LocationInfo = require('./location_info'); // Make sure the path is correct

// --- Configuration ---
// Example coordinates (Port Said, Egypt) - Reuse or adjust as needed
const startLocationCoords = { lat: 31.266447, lon: 32.259548 };
const endLocationCoords = { lat: 31.259727, lon: 32.310763 };

// OSRM options for the nearest service (optional)
const nearestOptions = {
    number: 1 // Get the single nearest point
    // Add other OSRM 'nearest' options if needed
};
// --- End Configuration ---

async function testSingleLocation(coords, label) {
    console.log(`\n--- Testing LocationInfo for ${label} (${JSON.stringify(coords)}) ---`);
    try {
        // 1. Create an instance
        const location = new LocationInfo(coords); // You can pass a profile like 'foot' if needed
        console.log(`LocationInfo instance created for ${label}.`);

        // 2. Fetch the nearest info
        console.log(`Fetching nearest info for ${label}...`);
        const nearestInfo = await location.fetchNearestInfo(nearestOptions);

        // 3. Check fetch results
        if (nearestInfo) {
            console.log(`\n--- Nearest Info Fetch Successful for ${label} ---`);

            const name = location.getName();
            const snappedCoords = location.getSnappedCoordinates(); // [lon, lat]
            const distanceToStreet = location.getDistanceToStreet();

            console.log(`  Nearest Street/Name: ${name || 'N/A'}`);
            console.log(`  Snapped Coordinates (lon, lat): ${snappedCoords ? JSON.stringify(snappedCoords) : 'N/A'}`);
            console.log(`  Distance to Street: ${distanceToStreet !== null ? distanceToStreet.toFixed(2) + ' meters' : 'N/A'}`);
            // console.log(`  Full Waypoint Data:`, location.getFullWaypointData()); // Uncomment for full details

        } else {
            console.log(`\n--- Nearest Info Fetch Failed for ${label} ---`);
            const error = location.getError();
            console.error(`  Error: ${error ? (error.message || 'Unknown error') : 'Unknown error'}`);
            if (error && error.response?.data) {
                 console.error(`  OSRM Response: ${JSON.stringify(error.response.data)}`);
            }
        }

    } catch (error) {
        console.error(`\n--- An Error Occurred During Test for ${label} ---`);
        // Check if it's the constructor error
        if (error.message.startsWith("Invalid location provided")) {
             console.error(`Error creating LocationInfo instance for ${label}:`, error.message);
        } else {
            console.error(error.message);
            if (error.stack) {
                console.error(error.stack);
            }
        }
    }
}

async function runAllTests() {
    console.log("Starting LocationInfo tests...");
    await testSingleLocation(startLocationCoords, 'Start Location');
    await testSingleLocation(endLocationCoords, 'End Location');
    console.log("\nLocationInfo tests finished.");
}

// Run the test functions
runAllTests();