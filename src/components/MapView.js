import React from 'react';
import '../styles/MapView.css';

const MapView = ({ selectedEvent, onSelectEvent }) => {
  // Points sur la carte pour chaque événement, ajustés pour l'Afrique
  const mapPoints = [
    { id: 1, left: '52%', top: '45%', title: 'Os d\'Ishango (RDC)' }, // RDC (Congo)
    { id: 2, left: '54%', top: '34%', title: 'Pyramide de Kéops (Égypte)' }, // Égypte (Gizeh)
    { id: 3, left: '54%', top: '36%', title: 'Papyrus de Rhind (Égypte)' }, // Égypte
    { id: 4, left: '47%', top: '44%', title: 'Village Bali (Cameroun)' } // Cameroun
  ];

  return (
    <div className="map-container">
      <h3 className="map-title">Localisation</h3>
      <div className="map-display">
        <img 
          src="/assets/images/world_map.png" 
          alt="Carte du monde" 
          className="map-image"
        />
        
        {/* Points sur la carte */}
        {mapPoints.map(point => (
          <div 
            key={point.id}
            className={`map-point ${selectedEvent?.id === point.id ? 'active' : ''}`}
            style={{ left: point.left, top: point.top }}
            onClick={() => onSelectEvent(point.id)}
            title={point.title}
          />
        ))}
      </div>
    </div>
  );
};

export default MapView;