const axios = require('axios');

// OSRM API endpoint (using the public demo server)
const OSRM_BASE_URL = 'http://router.project-osrm.org';

class TaxiLine {
    constructor(location, destination) {
        // Assuming location and destination are objects with lat and lon properties
        // e.g., { lat: 31.2357, lon: 32.2841 }
        if (!location || !location.lat || !location.lon || !destination || !destination.lat || !destination.lon) {
            throw new Error("Invalid location or destination provided. Both must have 'lat' and 'lon' properties.");
        }
        this.location = location;
        this.destination = destination;
        this.routeData = null; // To store the result from OSRM
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
     * @param {object} options - Optional OSRM parameters (e.g., { overview: 'full', geometries: 'geojson' })
     * @returns {Promise<object|null>} The route data from OSRM or null if an error occurs.
     */
    async calculateRoute(options = {}) {
        const coordinates = this._formatCoordinates();
        const url = `${OSRM_BASE_URL}/route/v1/driving/${coordinates}`;

        try {
            const response = await axios.get(url, { params: options });

            if (response.data && response.data.code === 'Ok' && response.data.routes && response.data.routes.length > 0) {
                this.routeData = response.data;
                console.log('Route calculated successfully.');
                return this.routeData;
            } else {
                console.error('Error calculating route: OSRM response not OK or no routes found.', response.data ? response.data.code : 'No response data');
                this.routeData = null;
                return null;
            }
        } catch (error) {
            console.error('Error fetching route from OSRM:', error.response ? error.response.data : error.message);
            this.routeData = null;
            return null;
        }
    }

    /**
     * Gets the distance of the calculated route.
     * Requires calculateRoute to be called successfully first.
     * @returns {number|null} The distance in meters, or null if route data is not available.
     */
    getDistance() {
        if (this.routeData && this.routeData.routes && this.routeData.routes.length > 0) {
            // Distance is typically in meters
            return this.routeData.routes[0].distance;
        } else {
            console.warn('Route data not available. Call calculateRoute first.');
            return null;
        }
    }

     /**
     * Gets the duration of the calculated route.
     * Requires calculateRoute to be called successfully first.
     * @returns {number|null} The duration in seconds, or null if route data is not available.
     */
    getDuration() {
        if (this.routeData && this.routeData.routes && this.routeData.routes.length > 0) {
             // Duration is typically in seconds
            return this.routeData.routes[0].duration;
        } else {
            console.warn('Route data not available. Call calculateRoute first.');
            return null;
        }
    }

    /**
     * Gets the geometry of the calculated route.
     * Requires calculateRoute to be called successfully first.
     * Requires 'geometries' option in calculateRoute (e.g., 'geojson').
     * @returns {object|string|null} The route geometry (format depends on OSRM options), or null.
     */
    getGeometry() {
        if (this.routeData && this.routeData.routes && this.routeData.routes.length > 0) {
            return this.routeData.routes[0].geometry;
        } else {
            console.warn('Route data not available. Call calculateRoute first.');
            return null;
        }
    }
}

module.exports = TaxiLine;