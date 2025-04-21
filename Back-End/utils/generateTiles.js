
    // Init map
    const map = L.map('map').setView([31.2451848376, 32.2908782328], 19); // High zoom = small tiles

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let tilePoints = {}; // Dictionary to store points by tile

    function assignPointsToTiles(data) {
      const tileSize = 256;
      const zoom = map.getZoom();

      // Clear previous tile points
      tilePoints = {};

      for (let stopKey in data) {
        const stop = data[stopKey];
        const point = map.project([stop.lat, stop.lng], zoom);
        console.log('Point:', point); // Debugging output
        const tileX = Math.floor(point.x / tileSize);
        const tileY = Math.floor(point.y / tileSize);
        const tileKey = `${tileX},${tileY}`;

        if (!tilePoints[tileKey]) {
          tilePoints[tileKey] = [];
        }

        tilePoints[tileKey].push(stop);
      }
    }

    // Load JSON data for bus stops and assign them to tiles
    fetch('storage/roads-locations.json')
      .then(res => res.json())
      .then(data => {
        for (let stopKey in data) {
          const stop = data[stopKey];
          L.marker([stop.lat, stop.lng])
            .addTo(map)
            .bindPopup(`<b>${stop.name}</b><br>Bus: ${stop.busName}`);
        }
        assignPointsToTiles(data);
      });

    map.on('zoomend', () => {
      fetch('data.json')
        .then(res => res.json())
        .then(data => assignPointsToTiles(data));
    });


    // Highlight visible tiles at current zoom
    let tileRects = [];

    function drawTileGrid() {
      // Clear old tiles
      tileRects.forEach(rect => map.removeLayer(rect));
      tileRects = [];

      const tileSize = 256;
      const zoom = map.getZoom();
      const bounds = map.getBounds();

      const nw = map.project(bounds.getNorthWest(), zoom);
      const se = map.project(bounds.getSouthEast(), zoom);

      const tileBounds = {
        xMin: Math.floor(nw.x / tileSize),
        yMin: Math.floor(nw.y / tileSize),
        xMax: Math.floor(se.x / tileSize),
        yMax: Math.floor(se.y / tileSize),
      };

      for (let x = tileBounds.xMin; x <= tileBounds.xMax; x++) {
        for (let y = tileBounds.yMin; y <= tileBounds.yMax; y++) {
          const topLeft = L.point(x * tileSize, y * tileSize);
          const bottomRight = L.point((x + 1) * tileSize, (y + 1) * tileSize);
          const bounds = L.latLngBounds(
            map.unproject(topLeft, zoom),
            map.unproject(bottomRight, zoom)
          );
          const rect = L.rectangle(bounds, {
            color: 'red',
            weight: 1,
            fillOpacity: 0.1,
          }).addTo(map);
          tileRects.push(rect);
        }
      }
    }

    map.on('moveend zoomend', drawTileGrid);
    drawTileGrid(); // Draw on load

    function getPointsInNeighboringTiles(tileX, tileY, range = 1) {
      const neighbors = [];

      // Iterate over the grid of neighboring tiles based on the range
      for (let dx = -range; dx <= range; dx++) {
        for (let dy = -range; dy <= range; dy++) {
          const neighborKey = `${tileX + dx},${tileY + dy}`;
          if (tilePoints[neighborKey]) {
            neighbors.push(...tilePoints[neighborKey]);
          }
        }
      }

      // If no points found, extend the range and search again
      if (neighbors.length === 0 && range < 3) { // Limit the range to avoid excessive searching
        return getPointsInNeighboringTiles(tileX, tileY, range + 1);
      }

      return neighbors;
    }

    // Example usage: Fetch points in neighboring tiles of a specific tile
    map.on('click', (e) => {
      const zoom = map.getZoom();
      const tileSize = 256;
      const point = map.project(e.latlng, zoom);

      const tileX = Math.floor(point.x / tileSize);
      const tileY = Math.floor(point.y / tileSize);

      const neighbors = getPointsInNeighboringTiles(tileX, tileY);
      console.log('Points in neighboring tiles:', neighbors);
    });
