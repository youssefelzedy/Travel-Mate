// Extracted getNeighboringPoints function to resolve circular dependency
function getNeighboringPoints(lat, lng, tilePoints, step = 1, depth = 7, tileSize = 256, zoom = 18) {
  const pointLocation = projectLatLng(lat, lng, tileSize, zoom);
  const tileX = Math.floor(pointLocation.x / tileSize);
  const tileY = Math.floor(pointLocation.y / tileSize);

  const neighborPoints = _getTile(tilePoints, tileX, tileY, step, depth);

  if (neighborPoints.length === 0) {
    throw new Error("Location not found");
  }

  return neighborPoints;
}

function _getTile(tilePoints, tileX, tileY, step = 4, depth = 10, start = 0, end = 1, visited = new Set()) {
  const neighbors = [];
  const directions = [
    [0, -1], // Up
    [-1, 0], // Left
    [0, 1],  // Down
    [1, 0],  // Right
    [-1, -1], // Top-left corner
    [-1, 1],  // Bottom-left corner
    [1, -1],  // Top-right corner
    [1, 1],   // Bottom-right corner
  ];

  for (let r = start; r <= end; r++) {
    for (const [dx, dy] of directions) {
      const nx = tileX + dx * r;
      const ny = tileY + dy * r;
      const neighborKey = `${nx},${ny}`;

      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        if (tilePoints[neighborKey]) {
          neighbors.push(...tilePoints[neighborKey]);
        }
      }
    }
  }

  if (neighbors.length === 0) {
    if (range < depth) {
      start = end + 1;
      end += step;
      return _getTile(tilePoints, tileX, tileY, step, depth, start, end, visited);
    }
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





module.exports = { getNeighboringPoints, projectLatLng };