import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export const useModelLoader = (modelPath) => {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!modelPath) {
      setModel(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const loader = new OBJLoader();
    
    loader.load(
      modelPath,
      (object) => {
        // Centrer et mettre à l'échelle le modèle
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.0 / maxDim;
        
        object.scale.set(scale, scale, scale);
        object.position.sub(center.multiplyScalar(scale));
        
        // Appliquer un matériau uniforme
        object.traverse(function(child) {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xd63b1b,
              roughness: 0.5,
              metalness: 0.2,
              transparent: true,
              opacity: 0.85
            });
          }
        });
        
        setModel(object);
        setIsLoading(false);
      },
      (xhr) => {
        // Progression du chargement
        console.log((xhr.loaded / xhr.total * 100) + '% chargé');
      },
      (err) => {
        console.error('Erreur lors du chargement du modèle:', err);
        setError("Impossible de charger le modèle 3D.");
        setIsLoading(false);
        
        // Créer un modèle de secours
        createFallbackModel(modelPath);
      }
    );

    return () => {
      // Nettoyer le modèle si nécessaire
      if (model) {
        // Disposer des géométries et matériaux si nécessaire
        model.traverse((child) => {
          if (child.isMesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
          }
        });
      }
    };
  }, [modelPath]);

  // Fonction pour créer un modèle de secours
  const createFallbackModel = (path) => {
    let geometry;
    const material = new THREE.MeshStandardMaterial({
      color: 0xd63b1b,
      roughness: 0.5,
      metalness: 0.2
    });
    
    // Déterminer quel type de modèle créer en fonction du chemin
    if (path.includes('papyrus')) {
      geometry = new THREE.BoxGeometry(3, 0.1, 4);
    } else if (path.includes('ishango')) {
      geometry = new THREE.CylinderGeometry(0.2, 0.3, 3, 32);
    } else if (path.includes('timbuktu')) {
      const group = new THREE.Group();
      const baseGeometry = new THREE.BoxGeometry(3, 1, 3);
      const base = new THREE.Mesh(baseGeometry, material);
      group.add(base);
      
      const towerGeometry = new THREE.CylinderGeometry(0.5, 0.7, 2, 8);
      const tower = new THREE.Mesh(towerGeometry, material);
      tower.position.y = 1.5;
      group.add(tower);
      
      setModel(group);
      return;
    } else if (path.includes('fractal')) {
      geometry = new THREE.TetrahedronGeometry(2, 2);
    } else if (path.includes('sona')) {
      geometry = new THREE.PlaneGeometry(4, 4);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = Math.PI / 2;
      setModel(mesh);
      return;
    } else if (path.includes('awale')) {
      geometry = new THREE.BoxGeometry(4, 0.5, 2);
    } else {
      // Modèle par défaut
      geometry = new THREE.SphereGeometry(1.5, 32, 32);
    }
    
    const mesh = new THREE.Mesh(geometry, material);
    setModel(mesh);
  };

  return { model, isLoading, error };
};