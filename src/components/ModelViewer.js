import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import '../styles/ModelViewer.css';
import { useModelLoader } from '../hooks/useModelLoader';

const ModelViewer = ({ selectedEvent }) => {
  const containerRef = useRef(null);
  const { model, isLoading, error } = useModelLoader(selectedEvent?.modelPath);

  useEffect(() => {
    if (!containerRef.current || !model) return;

    // Configuration de base de Three.js
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfaf7);
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    
    // Nettoyage de l'ancien canvas si existant
    if (containerRef.current.querySelector('canvas')) {
      containerRef.current.querySelector('canvas').remove();
    }
    
    containerRef.current.appendChild(renderer.domElement);
    
    // Éclairage
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Ajouter le modèle à la scène
    scene.add(model);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (model) {
        // Rotation adaptée selon le type de modèle
        if (selectedEvent?.id === 5) {
          model.rotation.y += 0.005;
        } else if (selectedEvent?.id === 2) {
          model.rotation.z += 0.01;
        } else {
          model.rotation.y += 0.01;
        }
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Gestion du redimensionnement
    const handleResize = () => {
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      
      renderer.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [model, selectedEvent]);

  return (
    <div className="model-container">
      <h3 className="model-title">Modèle 3D</h3>
      <div className="model-display" ref={containerRef}>
        {!selectedEvent && (
          <div className="placeholder">
            <img 
              src="/assets/images/placeholders/model_placeholder.jpg" 
              alt="Placeholder" 
              className="placeholder-image"
            />
            <p>Sélectionnez un événement pour afficher le modèle 3D</p>
          </div>
        )}
        {isLoading && selectedEvent && (
          <div className="loading">
            <p>Chargement du modèle en cours...</p>
          </div>
        )}
        {error && (
          <div className="error">
            <p>Erreur lors du chargement: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelViewer;