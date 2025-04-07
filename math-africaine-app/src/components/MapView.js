import React, { useState, useEffect, useRef } from 'react';
import '../styles/MapView.css';

const MapView = ({ selectedEvent, onSelectEvent }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const mapContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // Points sur la carte pour chaque événement
  const mapPoints = [
    { id: 1, left: '53%', top: '65%', title: 'Os d\'Ishango (RDC)', region: { x: 53, y: 65 } },
    { id: 2, left: '54%', top: '50%', title: 'Pyramide de Kéops (Égypte)', region: { x: 54, y: 50 } },
    { id: 3, left: '55%', top: '53%', title: 'Papyrus de Rhind (Égypte)', region: { x: 55, y: 53 } },
    { id: 4, left: '50%', top: '61%', title: 'Village Bali (Cameroun)', region: { x: 50, y: 61 } },
    { id: 5, left: '46%', top: '55%', title: 'Manuscrits de Tombouctou (Mali)', region: { x: 46, y: 55 } }
  ];
  
  // Détection du type d'appareil
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 992);
    };
    
    const checkTouchDevice = () => {
      const isTouch = (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
      setIsTouchDevice(isTouch);
      
      if (isTouch && mapContainerRef.current) {
        mapContainerRef.current.classList.add('touch-device');
      }
    };
    
    checkDeviceType();
    checkTouchDevice();
    
    window.addEventListener('resize', checkDeviceType);
    
    return () => {
      window.removeEventListener('resize', checkDeviceType);
    };
  }, []);

  // Fonction pour zoomer sur une région avec niveau adapté à la taille d'écran
  const zoomToRegion = (point) => {
    setZoomPosition({ x: point.region.x, y: point.region.y });
    
    // Zoom adaptatif selon le type d'appareil
    if (isMobile) {
      // Zoom plus limité sur mobile
      const smallMobile = window.innerWidth <= 480;
      setZoomLevel(smallMobile ? 1.3 : 1.5);
    } else if (isTablet) {
      // Zoom intermédiaire sur tablette
      setZoomLevel(1.6);
    } else {
      // Zoom plus fort sur desktop
      setZoomLevel(1.8);
    }
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

  // Gérer le pincement pour zoomer sur appareils tactiles
  useEffect(() => {
    if (!isTouchDevice || !mapContainerRef.current) return;
    
    let initialDistance = 0;
    let initialZoom = 1;
    
    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialZoom = zoomLevel;
      }
    };
    
    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        
        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        
        if (initialDistance > 0) {
          const newZoom = Math.min(Math.max(initialZoom * (currentDistance / initialDistance), 1), 4);
          setZoomLevel(newZoom);
        }
      }
    };
    
    const mapElement = mapContainerRef.current;
    mapElement.addEventListener('touchstart', handleTouchStart);
    mapElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      mapElement.removeEventListener('touchstart', handleTouchStart);
      mapElement.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isTouchDevice, zoomLevel]);

  // Effet pour ajuster le zoom quand un nouvel événement est sélectionné
  useEffect(() => {
    if (selectedEvent) {
      const point = mapPoints.find(p => p.id === selectedEvent.id);
      if (point) {
        zoomToRegion(point);
      }
    }
  }, [selectedEvent?.id, isMobile, isTablet]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="map-container" ref={mapContainerRef}>
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
              loading="eager" // Priorité de chargement pour l'image principale
            />
            
            {mapPoints.map(point => (
              <div 
                key={point.id}
                className={`map-point ${selectedEvent?.id === point.id ? 'active' : ''}`}
                style={{ left: point.left, top: point.top }}
                onClick={() => handlePointClick(point.id)}
                role="button"
                aria-label={`Sélectionner ${point.title}`}
                tabIndex="0"
              >
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
          <button 
            className="zoom-control zoom-in" 
            onClick={() => setZoomLevel(prev => Math.min(prev + (isMobile ? 0.3 : 0.5), 4))}
            aria-label="Zoom in"
          >+</button>
          <button 
            className="zoom-control zoom-out" 
            onClick={() => setZoomLevel(prev => Math.max(prev - (isMobile ? 0.3 : 0.5), 1))}
            aria-label="Zoom out"
          >−</button>
          <button 
            className="zoom-control reset-zoom" 
            onClick={resetZoom}
            aria-label="Reset zoom"
          >↺</button>
        </div>
      </div>
    </div>
  );
};

export default MapView;