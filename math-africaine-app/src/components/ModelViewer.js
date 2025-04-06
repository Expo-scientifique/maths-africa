import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import '../styles/ModelViewer.css';

const ModelViewer = ({ selectedEvent }) => {
  const containerRef = useRef(null);
  const popupModelRef = useRef(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Variables pour le contrôle de rotation par la souris
  const [isDragging, setIsDragging] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  
  // Effet pour afficher l'image rotative dans le conteneur principal
  useEffect(() => {
    if (!containerRef.current || !selectedEvent) return;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfaf7);
    
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 4; // Position plus proche pour un effet plus grand
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio); // Pour une meilleure qualité
    
    // Nettoyer l'ancien canvas si existant
    if (containerRef.current.querySelector('canvas')) {
      containerRef.current.querySelector('canvas').remove();
    }
    
    containerRef.current.appendChild(renderer.domElement);
    
    // Ajouter un éclairage pour plus de réalisme
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Créer le plan pour l'image
    let imagePlane;
    
    // Fonction pour créer un plan avec l'image
    const createImagePlane = (eventId) => {
      let imageUrl;
      
      // Sélectionner l'image en fonction de l'événement
      switch(eventId) {
        case 1: // Os d'Ishango
          imageUrl = '/assets/images/ishango_bone.jpg';
          break;
        case 2: // Pyramide
          imageUrl = '/assets/images/pyramid.jpg';
          break;
        case 3: // Papyrus
          imageUrl = '/assets/images/papyrus.jpg';
          break;
        case 4: // Village Bali
          imageUrl = '/assets/images/bali_village.jpg';
          break;
        default:
          imageUrl = '/assets/images/placeholders/model_placeholder.jpg';
      }
      
      // Créer une texture à partir de l'image
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(imageUrl);
      
      // Améliorer la qualité de la texture
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      
      // Créer un matériau avec la texture
      const material = new THREE.MeshStandardMaterial({ 
        map: texture,
        side: THREE.DoubleSide,
      });
      
      // Définir les dimensions du plan
      // Pour l'os d'Ishango, on veut un rectangle adapté
      const aspectRatio = eventId === 1 ? 0.3 : 1.5; // Plus haut pour l'os d'Ishango
      const planeGeometry = new THREE.PlaneGeometry(3 * aspectRatio, 3); // Plus grand
      
      // Créer le mesh
      return new THREE.Mesh(planeGeometry, material);
    };
    
    // Créer le plan avec l'image
    imagePlane = createImagePlane(selectedEvent.id);
    scene.add(imagePlane);
    
    // Fonctions de gestion des événements souris
    const onMouseDown = (event) => {
      setIsDragging(true);
      setAutoRotate(false);
      
      // Stocker la position de la souris
      setPreviousMousePosition({
        x: event.clientX,
        y: event.clientY
      });
    };
    
    const onMouseMove = (event) => {
      if (isDragging && imagePlane) {
        // Calculer le déplacement de la souris
        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y
        };
        
        // Mettre à jour la rotation du plan
        const newRotation = {
          y: imagePlane.rotation.y + deltaMove.x * 0.01,
          x: imagePlane.rotation.x + deltaMove.y * 0.01
        };
        
        imagePlane.rotation.y = newRotation.y;
        imagePlane.rotation.x = newRotation.x;
        setRotation(newRotation);
        
        // Mettre à jour la position précédente
        setPreviousMousePosition({
          x: event.clientX,
          y: event.clientY
        });
      }
    };
    
    const onMouseUp = () => {
      setIsDragging(false);
      // Réactiver la rotation automatique après un délai
      setTimeout(() => setAutoRotate(true), 3000);
    };
    
    // Ajouter les écouteurs d'événements
    containerRef.current.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (imagePlane) {
        // Rotation automatique si activée
        if (autoRotate) {
          imagePlane.rotation.y += 0.005;
        }
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Gestion du redimensionnement
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Nettoyage
    return () => {
      containerRef.current?.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (renderer) renderer.dispose();
    };
  }, [selectedEvent, isDragging, previousMousePosition, autoRotate]);

  // Effet pour le modèle dans le popup
  useEffect(() => {
    if (!showDetails || !popupModelRef.current || !selectedEvent) return;
    
    // Code similaire, mais avec des dimensions plus grandes
    const width = popupModelRef.current.clientWidth;
    const height = 400; // Plus grand
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f8);
    
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 4;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    if (popupModelRef.current.querySelector('canvas')) {
      popupModelRef.current.querySelector('canvas').remove();
    }
    
    popupModelRef.current.appendChild(renderer.domElement);
    
    // Ajouter un éclairage pour plus de réalisme
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Fonction pour créer un plan avec l'image
    const createImagePlane = (eventId) => {
      let imageUrl;
      
      // Sélectionner l'image en fonction de l'événement
      switch(eventId) {
        case 1: // Os d'Ishango
          imageUrl = '/assets/images/ishango_bone.jpg';
          break;
        case 2: // Pyramide
          imageUrl = '/assets/images/pyramid.jpg';
          break;
        case 3: // Papyrus
          imageUrl = '/assets/images/papyrus.jpg';
          break;
        case 4: // Village Bali
          imageUrl = '/assets/images/bali_village.jpg';
          break;
        default:
          imageUrl = '/assets/images/placeholders/model_placeholder.jpg';
      }
      
      // Créer une texture à partir de l'image
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(imageUrl);
      
      // Améliorer la qualité de la texture
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      
      // Créer un matériau avec la texture
      const material = new THREE.MeshStandardMaterial({ 
        map: texture,
        side: THREE.DoubleSide,
      });
      
      // Définir les dimensions du plan
      // Pour l'os d'Ishango, on veut un rectangle adapté
      const aspectRatio = eventId === 1 ? 0.3 : 1.5; // Plus haut pour l'os d'Ishango
      const planeGeometry = new THREE.PlaneGeometry(3 * aspectRatio, 3); // Plus grand
      
      // Créer le mesh
      return new THREE.Mesh(planeGeometry, material);
    };
    
    // Créer le plan avec l'image pour le popup
    const popupImagePlane = createImagePlane(selectedEvent.id);
    scene.add(popupImagePlane);
    
    // Animation
    const animate = () => {
      if (!showDetails) return;
      
      requestAnimationFrame(animate);
      
      if (popupImagePlane) {
        popupImagePlane.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    return () => {
      if (renderer) renderer.dispose();
    };
  }, [showDetails, selectedEvent]);

  // Réinitialiser le popup lorsqu'un nouvel événement est sélectionné
  useEffect(() => {
    setShowDetails(false);
  }, [selectedEvent]);

  // Fonction pour afficher/masquer le popup
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="model-container">
      <h3 className="model-title">Vue 3D</h3>
      <div className="model-wrapper">
        <div className="model-display" ref={containerRef}>
          {!selectedEvent && (
            <div className="placeholder">
              <img 
                src="/assets/images/placeholders/model_placeholder.jpg" 
                alt="Placeholder" 
                className="placeholder-image"
              />
              <p>Sélectionnez un événement pour afficher la vue 3D</p>
            </div>
          )}
        </div>
        
        {/* Panneau d'information simplifié sous le modèle 3D */}
        {selectedEvent && (
          <div className="model-info-panel">
            <div className="model-info-basic">
              <h4>{selectedEvent.title} ({selectedEvent.date})</h4>
              <p><strong>Lieu:</strong> {selectedEvent.location}</p>
            </div>
            <button className="details-button" onClick={toggleDetails}>
              Voir plus de détails
            </button>
          </div>
        )}
      </div>
      
      {/* Popup avec modèle 3D et détails supplémentaires */}
      {showDetails && selectedEvent && (
        <div className="details-popup">
          <div className="popup-content">
            <button className="close-popup" onClick={toggleDetails}>×</button>
            <h3>{selectedEvent.title}</h3>
            <p className="popup-date">{selectedEvent.date}</p>
            
            {/* Modèle 3D dans le popup */}
            <div className="popup-model-container" ref={popupModelRef}></div>
            
            <div className="popup-details">
              <p><strong>Lieu:</strong> {selectedEvent.location}</p>
              <p>{selectedEvent.description}</p>
              
              {/* Informations spécifiques à chaque événement */}
              {selectedEvent.id === 1 && (
                <div className="extra-info">
                  <h4>Détails supplémentaires</h4>
                  <p><strong>Découverte:</strong> 1950 par Jean de Heinzelin</p>
                  <p><strong>Importance:</strong> Premier témoignage de calcul mathématique en Afrique</p>
                  <p>L'os d'Ishango représente l'une des plus anciennes preuves d'un système de calcul préhistorique. Les entailles organisées suggèrent une connaissance des nombres premiers et des opérations arithmétiques de base.</p>
                </div>
              )}
              
              {selectedEvent.id === 2 && (
                <div className="extra-info">
                  <h4>Détails supplémentaires</h4>
                  <p><strong>Construction:</strong> Vers 2560 av. J.-C.</p>
                  <p><strong>Importance:</strong> Maîtrise avancée de la géométrie</p>
                  <p>La Grande Pyramide de Gizeh démontre une connaissance remarquable des mathématiques appliquées. Ses proportions, son alignement et sa précision témoignent d'une compréhension sophistiquée de la géométrie et de l'astronomie.</p>
                </div>
              )}
              
              {selectedEvent.id === 3 && (
                <div className="extra-info">
                  <h4>Détails supplémentaires</h4>
                  <p><strong>Auteur:</strong> Scribe Ahmès</p>
                  <p><strong>Importance:</strong> 84 problèmes mathématiques avec solutions</p>
                  <p>Ce papyrus contient des problèmes arithmétiques, algébriques et géométriques, ainsi que des méthodes de calcul des fractions et des surfaces. Il représente l'un des plus anciens textes mathématiques connus.</p>
                </div>
              )}
              
              {selectedEvent.id === 4 && (
                <div className="extra-info">
                  <h4>Détails supplémentaires</h4>
                  <p><strong>Culture:</strong> Bamiléké</p>
                  <p><strong>Importance:</strong> Architecture incorporant des motifs fractals</p>
                  <p>L'architecture du village Bali au Cameroun présente des motifs fractals récursifs dans ses structures, démontrant une compréhension intuitive de concepts mathématiques complexes bien avant leur formalisation par la mathématique occidentale.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelViewer;