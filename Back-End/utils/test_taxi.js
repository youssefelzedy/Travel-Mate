const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');
const TaxiLine = require('./taxi');

// --- Configuration ---
// Example coordinates (Port Said, Egypt) - Ensure these are relevant to your GeoJSON
const startLocation = { lat: 31.243843, lon: 32.318923 }; // Example: Near Port Fouad Ferry
const endDestination = { lat: 31.263347, lon: 32.308769 }; // Example: Near El Gomrok

// OSRM options (MUST include geometries: 'geojson')
const routeOptions = {
    overview: 'full',
    geometries: 'geojson', // Required for Turf intersection
    // steps: true,
    // alternatives: true
};elganoub, elshark, portfuad
// --- End Configuration ---

// --- Load Neighborhoods ---
let neighborhoodFeatures = [];
const geojsonPath = path.join(__dirname, 'portsaid.geojson');

try {
    if (fs.existsSync(geojsonPath)) {
        const rawData = fs.readFileSync(geojsonPath);
        const neighborhoodsGeoJSON = JSON.parse(rawData);
        if (neighborhoodsGeoJSON && neighborhoodsGeoJSON.type === 'FeatureCollection' && Array.isArray(neighborhoodsGeoJSON.features)) {
            neighborhoodFeatures = neighborhoodsGeoJSON.features.filter(f => f.geometry && (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon')); // Ensure features have valid geometry
            console.log(`Loaded ${neighborhoodFeatures.length} valid neighborhood features from ${geojsonPath}`);
        } else {
            console.error(`Error: ${geojsonPath} is not a valid GeoJSON FeatureCollection.`);
        }
    } else {
         console.error(`Error: Neighborhood file not found at ${geojsonPath}`);
    }
} catch (err) {
    console.error(`Error loading or parsing ${geojsonPath}:`, err);
}
// --- End Load Neighborhoods ---
elganoub, elshark, portfuad

async function runTest() {
    console.log(`\nTesting TaxiLine from ${JSON.stringify(startLocation)} to ${JSON.stringify(endDestination)}`);

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

            const distance = taxiRoute.getDistance();
            const duration = taxiRoute.getDuration();
            const geometry = taxiRoute.getGeometry(); // Should be GeoJSON LineString object

            console.log(`Distance: ${distance !== null ? (distance / 1000).toFixed(2) + ' km' : 'N/A'}`);
            console.log(`Duration: ${duration !== null ? (duration / 60).toFixed(1) + ' minutes' : 'N/A'}`);

            // 4. Perform Neighborhood Intersection Check
            let intersectedCount = 0;
            const intersectedNeighborhoods = [];

            if (geometry && geometry.type === 'LineString' && neighborhoodFeatures.length > 0) {
                console.log('Checking route intersection with neighborhoods...');
                try {
                    const routeLineString = turf.lineString(geometry.coordinates); // Create Turf LineString

                    for (const neighborhoodFeature of neighborhoodFeatures) {
                         // Use turf.booleanIntersects for the check
                         // It checks if any part of the line touches or crosses the polygon boundary or interior
                        const intersects = turf.booleanIntersects(routeLineString, neighborhoodFeature);

                        if (intersects) {
                            intersectedCount++;
                            intersectedNeighborhoods.push(neighborhoodFeature.properties?.name || `Unnamed Feature ${neighborhoodFeature.id || ''}`);
                        }
                    }
                     console.log(`\n--- Neighborhood Intersection Results ---`);
                     console.log(`Route intersects with ${intersectedCount} neighborhoods.`);
                     if (intersectedCount > 0) {
                         console.log(`Intersected Neighborhoods: ${intersectedNeighborhoods.join(', ')}`);
                     }

                } catch (turfError) {
                     console.error("Error during Turf.js intersection check:", turfError);
                }

            } else if (neighborhoodFeatures.length === 0) {
                 console.warn('Neighborhood data not loaded or empty. Skipping intersection check.');
            } else {
                console.warn('Route geometry is not available or not a LineString. Cannot perform intersection check.');
                console.warn('Ensure routeOptions included { geometries: "geojson" }');
            }

        } else {
            console.log('\n--- Route Calculation Failed ---');
            console.log('OSRM did not return a valid route. Check console errors above.');
        }

    } catch (error) {
        console.error('\n--- An Error Occurred During Test ---');
        console.error(error.message);
        if (error.stack) {
            console.error(error.stack);
        }
    }
}

// Run the test function
runTest();