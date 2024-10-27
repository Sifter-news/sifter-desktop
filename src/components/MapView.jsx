import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import ReportList from './ReportList';

// Use the token from environment variables
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapView = ({ project, nodes, onAddNode, onUpdateNode, onDeleteNode, reports, onAddReport, onUpdateReport }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70);
  const [lat, setLat] = useState(40);
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    if (!mapboxgl.accessToken || mapboxgl.accessToken === 'your_mapbox_token_here') {
      console.error('Please set your Mapbox access token in the .env file');
      return;
    }

    if (map.current) return;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom
      });

      map.current.on('move', () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
      });

      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        onAddNode({
          id: Date.now(),
          type: 'map',
          title: `Location at ${lng.toFixed(2)}, ${lat.toFixed(2)}`,
          content: '',
          longitude: lng,
          latitude: lat,
        });
      });
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
    }
  }, [lng, lat, zoom, onAddNode]);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while(markers[0]) {
      markers[0].parentNode.removeChild(markers[0]);
    }

    // Add markers for each node
    nodes.forEach((node) => {
      if (node.type === 'map' && node.longitude && node.latitude) {
        new mapboxgl.Marker()
          .setLngLat([node.longitude, node.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${node.title}</h3><p>${node.content}</p>`))
          .addTo(map.current);
      }
    });
  }, [nodes]);

  return (
    <div className="h-full relative">
      <div ref={mapContainer} className="h-full" />
      <div className="absolute top-0 left-0 m-4 bg-white p-2 rounded shadow">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div className="fixed bottom-12 right-12 z-50">
        <ReportList
          reports={reports}
          onAddReport={onAddReport}
          onEditReport={onUpdateReport}
        />
      </div>
    </div>
  );
};

export default MapView;