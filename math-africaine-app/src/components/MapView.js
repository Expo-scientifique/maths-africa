import React, { useState, useEffect } from 'react';
import '../styles/MapView.css';

const MapView = ({ selectedEvent, onSelectEvent }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  
  // Points sur la carte pour chaque événement avec les coordonnées mises à jour
  const mapPoints = [
    { id: 1, left: '53%', top: '65%', title: 'Os d\'Ishango (RDC)', region: { x: 53, y: 65 } },
    { id: 2, left: '54%', top: '50%', title: 'Pyramide de Kéops (Égypte)', region: { x: 54, y: 50 } },
    { id: 3, left: '55%', top: '53%', title: 'Papyrus de Rhind (Égypte)', region: { x: 55, y: 53 } },
    { id: 4, left: '50%', top: '61%', title: 'Village Bali (Cameroun)', region: { x: 50, y: 61 } },
    { id: 5, left: '46%', top: '55%', title: 'Manuscrits de Tombouctou (Mali)', region: { x: 46, y: 55 } }
  ];

  // Fonction pour zoomer sur une région
  const zoomToRegion = (point) => {
    setZoomPosition({ x: point.region.x, y: point.region.y });
    setZoomLevel(2.5); // Niveau de zoom
  };
  
  // Fonction pour revenir à la vue globale
  const resetZoom = () => {
    setZoomLevel(1);
    setZoomPosition({ x: 50, y: 50 });
  };

  // Gérer le clic sur un point
  const handlePointClick = (pointId) => {
    const point = mapPoints.find(p => p.id === pointId);
    onSelectEvent(pointId);
    zoomToRegion(point);
  };

  // Effet pour ajuster le zoom quand un nouvel événement est sélectionné
  useEffect(() => {
    if (selectedEvent) {
      const point = mapPoints.find(p => p.id === selectedEvent.id);
      if (point) {
        zoomToRegion(point);
      }
    }
  }, [selectedEvent?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="map-container">
      <h3 className="map-title">Localisation</h3>
      <div className="map-display">
        <div className="map-viewport">
          <div className="map-zoom-container" style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
          }}>
            <img 
              src="/assets/images/world_map.jpg" 
              alt="Carte du monde" 
              className="map-image"
            />
            
            {/* Points sur la carte avec infobulles conservées */}
            {mapPoints.map(point => (
              <div 
                key={point.id}
                className={`map-point ${selectedEvent?.id === point.id ? 'active' : ''}`}
                style={{ left: point.left, top: point.top }}
                onClick={() => handlePointClick(point.id)}
              >
                {/* Info-bulle au survol - conservée */}
                <div className="map-point-tooltip">
                  <h5>{point.title}</h5>
                  <p>Cliquez pour voir le modèle 3D</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Contrôles de zoom */}
        <div className="map-controls">
          <button className="zoom-control zoom-in" onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 4))}>+</button>
          <button className="zoom-control zoom-out" onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 1))}>−</button>
          <button className="zoom-control reset-zoom" onClick={resetZoom}>↺</button>
        </div>
      </div>
    </div>
  );
};

export default MapView;