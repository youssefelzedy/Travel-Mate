// Extracted getNeighboringPoints function to resolve circular dependency
function getNeighboringPoints(lat, lng, tilePoints, range = 0, tileSize = 256, zoom = 18) {
  const pointLocation = projectLatLng(lat, lng, tileSize, zoom);
  const tileX = Math.floor(pointLocation.x / tileSize);
  const tileY = Math.floor(pointLocation.y / tileSize);

  const neighborPoints = _getTile(tilePoints, tileX, tileY, range);

  if (neighborPoints.length === 0) {
    throw new Error("Location not found");
  }

  return neighborPoints;
}

function _getTile(tilePoints, tileX, tileY, range) {
  const neighbors = [];

  // Iterate over the grid of neighboring tiles based on the range
  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      const neighborKey = `${tileX + dx},${tileY + dy}`;
      if (tilePoints[neighborKey])
        neighbors.push(...tilePoints[neighborKey]);
    }
  }

  if (neighbors.length === 0) {
    return [];
  }

  return neighbors;
}


function projectLatLng(lat, lng, tileSize = 256, zoom = 18) {
  const R = 6378137; // Earth's radius in meters
  const MAX_LATITUDE = 85.0511287798;

  // Clamp latitude to the Web Mercator bounds
  lat = Math.max(Math.min(MAX_LATITUDE, lat), -MAX_LATITUDE);

  // Convert latitude and longitude to radians
  const latRad = lat * Math.PI / 180;
  const lngRad = lng * Math.PI / 180;


  // Project the coordinates using the Spherical Mercator projection
  const x = R * lngRad;
  const y = R * Math.log(Math.tan(Math.PI / 4 + latRad / 2));

  // Calculate scale factor for the given zoom level
  const scale = tileSize * Math.pow(2, zoom);

  // Define transformation coefficients for EPSG:3857
  const a = 0.5 / (Math.PI * R);
  const b = 0.5;
  const c = -0.5 / (Math.PI * R);
  const d = 0.5;

  // Apply transformation to convert projected coordinates to pixel coordinates
  const pixelX = scale * (a * x + b);
  const pixelY = scale * (c * y + d);


  return { x: pixelX, y: pixelY };
}


function heuristic(NodeA, NodeB) {
  // Haversine formula to calculate the distance between two points on the Earth
  const { lat: lat1, lng: lng1 } = NodeA;
  const { lat: lat2, lng: lng2 } = NodeB;
  const R = 6371; // Radius of Earth in km
  const toRad = x => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  // Return the distance in kilometers
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function assignPointsToTiles(tilePoints, stop) {
  const tileSize = 256;

  const pointLocation = projectLatLng(stop.lat, stop.lng);
  const tileX = Math.floor(pointLocation.x / tileSize);
  const tileY = Math.floor(pointLocation.y / tileSize);
  const tileKey = `${tileX},${tileY}`;

  if (!tilePoints[tileKey]) {
    tilePoints[tileKey] = [];
  }

  tilePoints[tileKey].push({ id: stop.id, lat: stop.lat, lng: stop.lng, name: stop.name, type: stop.type });
}


module.exports = { getNeighboringPoints, projectLatLng, heuristic, assignPointsToTiles };