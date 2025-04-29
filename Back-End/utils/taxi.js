const axios = require('axios');
const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf'); // Added turf

// OSRM API endpoint (using the public demo server)
const OSRM_BASE_URL = 'http://router.project-osrm.org';

// --- Load Neighborhoods (Loaded once when the module is required) ---
let neighborhoodFeatures = [];
const geojsonPath = path.join(__dirname, 'portsaid.geojson'); // Assumes portsaid.geojson is in the same directory

try {
    if (fs.existsSync(geojsonPath)) {
        const rawData = fs.readFileSync(geojsonPath);
        const neighborhoodsGeoJSON = JSON.parse(rawData);
        if (neighborhoodsGeoJSON && neighborhoodsGeoJSON.type === 'FeatureCollection' && Array.isArray(neighborhoodsGeoJSON.features)) {
            neighborhoodFeatures = neighborhoodsGeoJSON.features.filter(f => f.geometry && (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'));
            console.log(`Loaded ${neighborhoodFeatures.length} valid neighborhood features from ${geojsonPath}`);
        } else {
            console.error(`Error: ${geojsonPath} is not a valid GeoJSON FeatureCollection.`);
        }
    } else {
         console.error(`Error: Neighborhood file not found at ${geojsonPath}`);
    }
} catch (err) {
    console.error(`Error loading or parsing ${geojsonPath}:`, err);
    // Depending on requirements, you might want to throw this error
    // or handle the case where neighborhoodFeatures remains empty.
}
// --- End Load Neighborhoods ---


class TaxiLine {
    constructor(location, destination) {
        // Assuming location and destination are objects with lat and lon properties
        // e.g., { lat: 31.2357, lon: 32.2841 }
        if (!location || typeof location.lat !== 'number' || typeof location.lon !== 'number' ||
            !destination || typeof destination.lat !== 'number' || typeof destination.lon !== 'number') {
            throw new Error("Invalid location or destination provided. Both must be objects with numeric 'lat' and 'lon' properties.");
        }
        this.location = location;
        this.destination = destination;
        this.routeData = null; // To store the result from OSRM
        this.intersectingNeighborhoodsResult = null; // Cache intersection results
    }

    /**
     * Formats coordinates for the OSRM API request.
     * @returns {string} Formatted coordinate string "lon,lat;lon,lat"
     */
    _formatCoordinates() {
        return `${this.location.lon},${this.location.lat};${this.destination.lon},${this.destination.lat}`;
    }

    /**
     * Calculates the route using the OSRM API.
     * Stores the route data in this.routeData.
     * Resets cached neighborhood intersection results.
     * @param {object} options - Optional OSRM parameters (e.g., { overview: 'full', geometries: 'geojson' })
     * @returns {Promise<object|null>} The route data from OSRM or null if an error occurs.
     */
    async calculateRoute(options = {}) {
        // Ensure geometries is set to geojson if neighborhood calculation is needed
        const requiredOptions = { ...options, geometries: 'geojson' };
        const coordinates = this._formatCoordinates();
        const url = `${OSRM_BASE_URL}/route/v1/driving/${coordinates}`;
        this.routeData = null; // Reset previous data
        this.intersectingNeighborhoodsResult = null; // Reset cached intersections

        try {
            const response = await axios.get(url, { params: requiredOptions });

            if (response.data && response.data.code === 'Ok' && response.data.routes && response.data.routes.length > 0) {
                this.routeData = response.data;
                console.log('Route calculated successfully.');
                // Automatically calculate intersections after route calculation
                this.getIntersectingNeighborhoods();
                return this.routeData;
            } else {
                console.error('Error calculating route: OSRM response not OK or no routes found.', response.data ? response.data.code : 'No response data');
                return null;
            }
        } catch (error) {
            console.error('Error fetching route from OSRM:', error.response ? error.response.data : error.message);
            return null;
        }
    }

    /**
     * Gets the distance of the calculated route.
     * Requires calculateRoute to be called successfully first.
     * @returns {number|null} The distance in meters, or null if route data is not available.
     */
    getDistance() {
        if (this.routeData?.routes?.[0]?.distance !== undefined) {
            return this.routeData.routes[0].distance;
        } else {
            if (!this.routeData) console.warn('Route data not available. Call calculateRoute first.');
            return null;
        }
    }

     /**
     * Gets the duration of the calculated route.
     * Requires calculateRoute to be called successfully first.
     * @returns {number|null} The duration in seconds, or null if route data is not available.
     */
    getDuration() {
         if (this.routeData?.routes?.[0]?.duration !== undefined) {
            return this.routeData.routes[0].duration;
        } else {
             if (!this.routeData) console.warn('Route data not available. Call calculateRoute first.');
            return null;
        }
    }

    /**
     * Gets the geometry of the calculated route.
     * Requires calculateRoute to be called successfully first with 'geometries: geojson'.
     * @returns {object|null} The route geometry as a GeoJSON LineString object, or null.
     */
    getGeometry() {
        const geometry = this.routeData?.routes?.[0]?.geometry;
        if (geometry && typeof geometry === 'object' && geometry.type === 'LineString') {
            return geometry;
        } else {
             if (!this.routeData) console.warn('Route data not available. Call calculateRoute first.');
             else if (!geometry) console.warn('Route geometry not found in route data.');
             else console.warn(`Route geometry is not a GeoJSON LineString (type: ${typeof geometry === 'object' ? geometry.type : typeof geometry}). Ensure calculateRoute was called with { geometries: 'geojson' }.`);
            return null;
        }
    }

    /**
     * Calculates and returns the neighborhoods intersected by the route.
     * Requires calculateRoute to be called successfully with 'geometries: geojson'.
     * Caches the result.
     * @returns {{count: number, names: string[]}|null} Object with count and names of intersected neighborhoods, or null if calculation fails.
     */
    getIntersectingNeighborhoods() {
        // Return cached result if available
        if (this.intersectingNeighborhoodsResult) {
            return this.intersectingNeighborhoodsResult;
        }
        // Return null if calculation is not possible
        if (neighborhoodFeatures.length === 0) {
             console.warn('Neighborhood data not loaded or empty. Cannot calculate intersections.');
             return null;
        }

        const routeGeometry = this.getGeometry(); // Use the getter which includes checks

        if (!routeGeometry) {
            console.warn('Route geometry not available or invalid for intersection check.');
            return null;
        }

        let intersectedCount = 0;
        const intersectedNames = [];

        try {
            const routeLineString = turf.lineString(routeGeometry.coordinates);

            for (const neighborhoodFeature of neighborhoodFeatures) {
                const intersects = turf.booleanIntersects(routeLineString, neighborhoodFeature);
                if (intersects) {
                    intersectedCount++;
                    intersectedNames.push(neighborhoodFeature.properties?.name || `Unnamed Feature ${neighborhoodFeature.id || ''}`);
                }
            }

            this.intersectingNeighborhoodsResult = { count: intersectedCount, names: intersectedNames };
            console.log(`Route intersects with ${intersectedCount} neighborhoods: ${intersectedNames.join(', ')}`);
            return this.intersectingNeighborhoodsResult;

        } catch (turfError) {
            console.error("Error during Turf.js intersection check:", turfError);
            return null; // Return null on error
        }
    }

    /**
     * Calculates the price of the taxi ride based on intersected neighborhoods.
     * Requires calculateRoute to be called successfully.
     * Pricing: 1 neighborhood=15, 2=20, 3+=25. +35 if 'portfuad' is intersected.
     * @returns {number|null} The calculated price in EGP, or null if price cannot be determined.
     */
    getRoutePrice() {
        const intersectionData = this.getIntersectingNeighborhoods();

        if (intersectionData === null) {
            console.warn("Cannot calculate price because neighborhood intersection data is unavailable.");
            return null;
        }

        let price = 0;
        const count = intersectionData.count;
        const names = intersectionData.names;

        if (count === 1) {
            price = 15;
        } else if (count === 2) {
            price = 20;
        } else if (count >= 3) {
            price = 25;
        }
        // Price remains 0 if count is 0

        // Check for 'portfuad' (case-insensitive)
        const includesPortFouad = names.some(name => name.toLowerCase() === 'portfuad');

        if (includesPortFouad) {
            if (count === 1) {
                price = 15; // Portfuad is the only neighborhood
            }
            else {
                console.log("Route includes 'portfuad', adding 35 EGP surcharge.");
                price += 30;
                if (count > 3) price += 5; // Additional charge for more than 3 neighborhoods
            }
        }

        console.log(`Calculated route price: ${price} EGP`);
        return price;
    }
}

module.exports = TaxiLine;