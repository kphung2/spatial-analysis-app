mapboxgl.accessToken = 'pk.eyJ1Ijoia3BodW5nMiIsImEiOiJjbHluZzZ4MDkwNjg3MmlwdGJrYWxhZnRzIn0.b_qPlfO696VgcHoOgRnWfg';
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

  // Draw a line between the points
  const line = turf.lineString([from.geometry.coordinates, to.geometry.coordinates]);
  console.log('Line coordinates:', line.geometry.coordinates);
  map.addSource('line', { type: 'geojson', data: line });
  map.addLayer({
    id: 'line',
    type: 'line',
    source: 'line',
    layout: {},
    paint: {
      'line-color': '#888',
      'line-width': 2
    }
  });

  // Add a label for the distance
  const midpoint = turf.midpoint(from, to);
  console.log('Midpoint coordinates:', midpoint.geometry.coordinates);
  const label = {
    type: 'Feature',
    geometry: midpoint.geometry,
    properties: {
      title: `${distance.toFixed(2)} miles`
    }
  };
  map.addSource('label', { type: 'geojson', data: label });
  map.addLayer({
    id: 'label',
    type: 'symbol',
    source: 'label',
    layout: {
      'text-field': ['get', 'title'],
      'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
      'text-size': 14,
      'text-offset': [0, 1.5],
      'text-anchor': 'top'
    },
    paint: {
      'text-color': '#000'
    }
  });

  // Nearest neighbor analysis
  const nearest = turf.nearestPoint(from, points);
  console.log(`Nearest point to ${from.properties.name}: ${nearest.properties.name}`);

  // Buffering
  const buffered = turf.buffer(from, 0.5, { units: 'miles' });
  console.log('Buffered area:', buffered);
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
