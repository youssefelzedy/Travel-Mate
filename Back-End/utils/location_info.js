const axios = require('axios');

// OSRM API endpoint (using the public demo server)
const OSRM_BASE_URL = 'http://router.project-osrm.org';

/**
 * A class to fetch information about a specific location using OSRM's nearest service.
 */
class LocationInfo {
    /**
     * Creates an instance of LocationInfo.
     * @param {object} location - The location coordinates { lat, lon }.
     * @param {string} [profile='driving'] - OSRM routing profile (used by nearest service).
     */
    constructor(location, profile = 'driving') {
        if (!location || typeof location.lat !== 'number' || typeof location.lon !== 'number') {
            throw new Error("Invalid location provided. Must be an object with numeric 'lat' and 'lon' properties.");
        }
        this.location = location;
        this.profile = profile;
        this.osrmBaseUrl = OSRM_BASE_URL; // Use the constant defined above

        this.nearestData = null; // Stores the main waypoint object from OSRM
        this.error = null;       // Stores any error encountered during fetch
    }

    /**
     * Formats coordinates for the OSRM nearest API request.
     * @returns {string} Formatted coordinate string "lon,lat"
     * @private
     */
    _formatCoordinates() {
        return `${this.location.lon},${this.location.lat}`;
    }

    /**
     * Fetches the nearest street information from the OSRM API.
     * Stores the result in this.nearestData.
     * @param {object} [options={}] - Additional OSRM options for the nearest service (e.g., { number: 1 }).
     * @returns {Promise<object|null>} The primary waypoint object from OSRM response, or null if fetching failed.
     */
    async fetchNearestInfo(options = {}) {
        this.nearestData = null; // Reset previous data
        this.error = null;     // Reset previous error

        const coordinates = this._formatCoordinates();
        const service = 'nearest';
        const version = 'v1';

        const url = `${this.osrmBaseUrl}/${service}/${version}/${this.profile}/${coordinates}`;

        try {
            // console.log(`Fetching nearest info from OSRM: ${url}`); // Uncomment for debugging
            const response = await axios.get(url, { params: options });

            if (response.data && response.data.code === 'Ok' && response.data.waypoints && response.data.waypoints.length > 0) {
                // Store the first waypoint (usually the most relevant one)
                this.nearestData = response.data.waypoints[0];
                console.log('Nearest info fetched successfully.');
                return this.nearestData;
            } else {
                const errorMsg = `OSRM API response not OK or no waypoints found. Code: ${response.data?.code || 'N/A'}`;
                console.error('Error fetching nearest info:', errorMsg);
                this.error = new Error(errorMsg);
                return null;
            }
        } catch (err) {
            const errorMsg = err.response ? JSON.stringify(err.response.data) : err.message;
            console.error('Error fetching nearest info from OSRM:', errorMsg);
            this.error = err; // Store the original axios error object
            return null; // Indicate failure
        }
    }

    /**
     * Gets the name of the nearest street/waypoint.
     * Requires fetchNearestInfo to be called successfully first.
     * @returns {string|null} - The name, or null if not fetched or unavailable.
     */
    getName() {
        if (this.nearestData?.name !== undefined) {
            return this.nearestData.name;
        } else {
            if (!this.nearestData) console.warn('Nearest data not available. Call fetchNearestInfo first.');
            return null;
        }
    }

    /**
     * Gets the snapped coordinates on the nearest street.
     * Requires fetchNearestInfo to be called successfully first.
     * OSRM returns coordinates as [longitude, latitude].
     * @returns {Array<number>|null} - The [lon, lat] array, or null if not fetched or unavailable.
     */
    getSnappedCoordinates() {
        if (this.nearestData?.location !== undefined) {
            return this.nearestData.location; // Note: OSRM format [lon, lat]
        } else {
            if (!this.nearestData) console.warn('Nearest data not available. Call fetchNearestInfo first.');
            return null;
        }
    }

    /**
     * Gets the distance between the input location and the snapped point on the street.
     * Requires fetchNearestInfo to be called successfully first.
     * @returns {number|null} - Distance in meters, or null if not fetched or unavailable.
     */
    getDistanceToStreet() {
        if (this.nearestData?.distance !== undefined) {
            return this.nearestData.distance;
        } else {
            if (!this.nearestData) console.warn('Nearest data not available. Call fetchNearestInfo first.');
            return null;
        }
    }

    /**
     * Gets the full waypoint data object received from OSRM.
     * Requires fetchNearestInfo to be called successfully first.
     * @returns {object|null} - The full waypoint object, or null if not fetched.
     */
    getFullWaypointData() {
        return this.nearestData;
    }

    /**
     * Gets any error that occurred during the last fetch attempt.
     * @returns {Error|null} - The error object, or null if no error occurred.
     */
    getError() {
        return this.error;
    }
}

module.exports = LocationInfo;