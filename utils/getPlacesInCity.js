const axios = require('axios');

const apiKey = process.env.GOOGLE_API_KEY;

const fetchPlaces = async (location, radius = 10000, types = [ 'hospital']) => {
  const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${types.join('|')}&key=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    const places = await response.data.results;
    const results = [];

    for (const place of places) {
      const placeData = {
          name: place.name,
          address: place.vicinity,
          location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
          },
          placeId: place.place_id,
          open_now: place.opening_hours ,
          rating: place.rating || 'N/A',
          price_level: place.price_level || 'N/A',
          user_ratings_total: place.user_ratings_total || 'N/A',
          photos: place.photos ? place.photos.map(photo => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`) : [],
      };

       results.push(placeData);
    }

    return results;
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
};

module.exports = fetchPlaces;
