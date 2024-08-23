const { Client } = require("@googlemaps/google-maps-services-js");
const axios = require('axios');
const polyline = require('@mapbox/polyline');

class GoogleMapsRouteSimulator {
    constructor(location, destination, apiKey) {
        this.location = location;
        this.destination = destination;
        this.apiKey = apiKey;
        this.finalResult = {};
        this.districtMapping = {
            "El Sharq": "قسم الشروق",
            "Al Arab": "قسم العرب",
            "El Manakh": "قسم المناخ",
            "Al Zohour": "قسم الزهور",
            "قسم الشرق": "قسم الشروق",
            "قسم الشروق": "الشروق",
            "قسم الشروق": "الشرق",
            "قسم المناخ": "المناخ",
            "قسم الزهور": "الزهور",
            "قسم العرب": "العرب"
        };
        this.client = new Client({});
    }

    async initialize(travelMode = 'DRIVING') {
        this.finalResult['location'] = this.location;
        this.finalResult['destination'] = this.destination;
        await this.calculateAndDisplayRoute(this.location, this.destination, travelMode);
    }

    async calculateAndDisplayRoute(location, destination, travelMode = 'DRIVING') {
        if (!location || !destination) return;

        try {
            const response = await this.client.directions({
                params: {
                    origin: location,
                    destination: destination,
                    mode: travelMode.toLowerCase(),
                    key: this.apiKey
                }
            });

            const result = response.data;
            if (result.status === 'OK') {
                this.routePath = polyline.decode(result.routes[0].overview_polyline.points);
                await this.getDistrictsAlongRoute(this.routePath);
            } else {
                console.log('Error calculating route:', result.status);
            }
        } catch (error) {
            console.error('Error calculating route:', error);
        }
    }

    normalizeDistrict(district) {
        for (let key in this.districtMapping) {
            if (district === key || district === this.districtMapping[key]) {
                return this.districtMapping[key];
            }
        }
        return null;
    }

    async getDistrictFromLatLng(lat, lng) {
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    latlng: `${lat},${lng}`,
                    key: this.apiKey
                }
            });

            if (response.data.results.length > 0) {
                const addressComponents = response.data.results[0].address_components;
                const districtComponent = addressComponents.find(component => 
                    component.types.includes('locality') || 
                    component.types.includes('sublocality') ||
                    component.types.includes('administrative_area_level_2')
                );

                if (districtComponent) {
                    let dis = this.normalizeDistrict(districtComponent.long_name);
                    if (dis) {
                        return dis;
                    } else {
                        return 'Unknown District';
                    }
                } else {
                    return 'Unknown District';
                }
            } else {
                throw new Error('No results found for the given location');
            }
        } catch (error) {
            console.error('Error fetching district information:', error.message);
            return 'Unknown District';
        }
    }

    async getDistrictsAlongRoute(route) {
        const districts = new Set();
        for (let i = 0; i < route.length; i += Math.floor(route.length / 10)) {
            let [lat, lng] = route[i];
            const district = await this.getDistrictFromLatLng(lat, lng);
            if (district && district !== 'Unknown District') {
                districts.add(district);
            }
        }

        const districtList = Array.from(districts);
        const totalDistricts = districts.size;
        this.finalResult['districtList'] = districtList;

        if (totalDistricts === 1) {
            this.finalResult['price'] = 12;
        } else if (totalDistricts === 2 || totalDistricts === 3) {
            this.finalResult['price'] = 16;
        } else if (totalDistricts >= 4) {
            this.finalResult['price'] = 22.5;
        }
    }
}

const location = { lat: 31.260435, lng: 32.310060};
const destination = { lat: 31.269257, lng: 32.254662};
const apiKey = 'AIzaSyDiMJ_mpywf-0DeJYRcWO8H4W3EA-59TUs';

let test = new GoogleMapsRouteSimulator(location, destination, apiKey);
test.initialize().then(() => {
  console.log(test.finalResult);
});
