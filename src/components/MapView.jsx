import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Node } from '../types/nodeTypes';

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN_HERE';

const MapView = ({ nodes }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });

    // Add navigation control (zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl());
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    const existingMarkers = document.getElementsByClassName('mapboxgl-marker');
    while(existingMarkers[0]) {
      existingMarkers[0].parentNode.removeChild(existingMarkers[0]);
    }

    // Add markers for nodes with latitude and longitude
    nodes.forEach((node) => {
      if (node.latitude && node.longitude) {
        new mapboxgl.Marker()
          .setLngLat([node.longitude, node.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${node.title}</h3><p>${node.description}</p>`))
          .addTo(map.current);
      }
    });
  }, [nodes]);

  return (
    <div className="min-h-[calc(100vh-120px)]">
      <div ref={mapContainer} className="h-full" />
    </div>
  );
};

export default MapView;