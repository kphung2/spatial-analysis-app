mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-122.3321, 47.6062], // Seattle coordinates
  zoom: 12
});

// Adding controls to the map
map.addControl(new mapboxgl.NavigationControl());

// Sample data points
const points = turf.featureCollection([
  turf.point([-122.3321, 47.6062], { name: 'Point 1' }),
  turf.point([-122.3421, 47.6162], { name: 'Point 2' }),
  turf.point([-122.3521, 47.6262], { name: 'Point 3' })
]);

map.on('load', () => {
  // Add points to the map
  map.addSource('points', { type: 'geojson', data: points });
  map.addLayer({
    id: 'points',
    type: 'circle',
    source: 'points',
    paint: {
      'circle-radius': 6,
      'circle-color': '#B42222'
    }
  });

  // Distance measurement
  const from = points.features[0];
  const to = points.features[1];
  const distance = turf.distance(from, to, { units: 'miles' });
  console.log(`Distance: ${distance} miles`);

  // Nearest neighbor analysis
  const nearest = turf.nearestPoint(from, points);
  console.log(`Nearest point to ${from.properties.name}: ${nearest.properties.name}`);

  // Buffering
  const buffered = turf.buffer(from, 0.5, { units: 'miles' });
  map.addSource('buffered', { type: 'geojson', data: buffered });
  map.addLayer({
    id: 'buffered',
    type: 'fill',
    source: 'buffered',
    paint: {
      'fill-color': '#B4D455',
      'fill-opacity': 0.5
    }
  });
});
