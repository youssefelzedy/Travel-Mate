// Extracted getNeighboringPoints function to resolve circular dependency
function getNeighboringPoints(lat, lng, tilePoints, tileSize = 256, zoom = 18) {
  const pointLocation = projectLatLng(lat, lng, tileSize, zoom);
  const tileX = Math.floor(pointLocation.x / tileSize);
  const tileY = Math.floor(pointLocation.y / tileSize);

  const neighborPoints = _getTile(tilePoints, tileX, tileY);

  if (neighborPoints.length === 0) {
    throw new Error("Location not found");
  }

  return neighborPoints;
}

function _getTile(tilePoints, tileX, tileY, range = 1, depth = 3) {
  const neighbors = [];

  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      const neighborKey = `${tileX + dx},${tileY + dy}`;
      if (tilePoints[neighborKey]) {
        neighbors.push(...tilePoints[neighborKey]);
      }
    }
  }

  if (neighbors.length === 0) {
    if (range < depth) {
      return _getTile(tilePoints, tileX, tileY, range + 1);
    }
    return [];
  }

  return neighbors;
}

function projectLatLng(lat, lng, tileSize = 256, zoom = 19) {
  const scale = tileSize * Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * scale;
  const latRad = (lat * Math.PI) / 180;
  const y =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
    scale;

  return { x, y };
}

module.exports = { getNeighboringPoints, projectLatLng };