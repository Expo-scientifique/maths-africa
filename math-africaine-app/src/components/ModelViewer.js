import React, { useState, useEffect } from 'react';
import '../styles/ModelViewer.css';

const ModelViewer = ({ selectedEvent }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détection des appareils mobiles
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Vérification initiale
    checkIfMobile();
    
    // Surveiller les changements de taille d'écran
    window.addEventListener('resize', checkIfMobile);
    
    // Nettoyage
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Fonction pour afficher/masquer le popup
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Chemin de l'image en fonction de l'événement sélectionné
  const getImagePath = (eventId) => {
    switch (eventId) {
      case 1: return '/assets/images/ishango_bone.png';
      case 2: return '/assets/images/pyramid.jpg';
      case 3: return '/assets/images/papyrus.png';
      case 4: return '/assets/images/bali_village.jpg';
      case 5: return '/assets/images/timbuktu_manuscript.jpg';
      default: return '/assets/images/placeholders/model_placeholder.jpg';
    }
  };

  // Contenu explicatif adaptatif pour l'os d'Ishango
  const getIshangoContent = () => {
    return (
      <div className="ishango-description">
        <h4>Os d'Ishango</h4>
        <p>{isMobile 
          ? "Os gravé (20 000 ans) du Congo. Premier témoignage mathématique africain." 
          : "Os gravé (20 000 ans) découvert au Congo en 1950. Premier témoignage de calcul mathématique en Afrique."
        }</p>
        <button className="details-button" onClick={toggleDetails}>
          {isMobile ? "Détails" : "Plus d'infos"}
        </button>
      </div>
    );
  };

  return (
    <div className="model-container">
      <h3 className="model-title">Vue de l'Objet</h3>
      
      {/* Zone d'affichage principale adaptative */}
      <div className="model-content">
        {!selectedEvent ? (
          <div className="placeholder">
            <img 
              src="/assets/images/placeholders/model_placeholder.jpg" 
              alt="Placeholder" 
              className="placeholder-image"
            />
            <p>Sélectionnez un événement</p>
          </div>
        ) : (
          <div className="content-wrapper">
            {/* Image à gauche (ou en haut sur mobile) */}
            <div className="image-container">
              <div className="image-wrapper">
                <img 
                  src={getImagePath(selectedEvent.id)} 
                  alt={selectedEvent.title}
                  className="static-image"
                />
              </div>
            </div>
            
            {/* Description à droite (ou en bas sur mobile) */}
            <div className="description-container">
              {selectedEvent.id === 1 ? (
                getIshangoContent()
              ) : (
                <div className="default-description">
                  <h4>{selectedEvent.title}</h4>
                  <p>{isMobile 
                    ? selectedEvent.description.split('.')[0] + '.' // Première phrase seulement
                    : selectedEvent.description
                  }</p>
                  <button className="details-button" onClick={toggleDetails}>
                    {isMobile ? "Détails" : "Plus d'infos"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Popup de détails adaptatif */}
      {showDetails && selectedEvent && (
        <div className="details-popup">
          <button className="close-popup" onClick={toggleDetails}>×</button>
          <div className={`popup-content ${isMobile ? 'mobile-popup' : ''}`}>
            <h3>{selectedEvent.title}</h3>
            <p className="popup-date">{selectedEvent.date}</p>
            
            {/* Image dans le popup */}
            <div className="popup-image-container">
              <img 
                src={getImagePath(selectedEvent.id)} 
                alt={selectedEvent.title}
                className="popup-image"
              />
            </div>
            
            <div className="popup-details">
              <p><strong>Lieu:</strong> {selectedEvent.location}</p>
              <p>{selectedEvent.description}</p>
              
              {/* Contenu spécifique à chaque événement - conservé mais adapté si nécessaire */}
              {selectedEvent.id === 1 && (
                <div className="extra-info">
                  <h4>Détails supplémentaires sur l'os d'Ishango</h4>
                  <p><strong>Découverte:</strong> 1950 par Jean de Heinzelin</p>
                  <p><strong>Âge:</strong> Environ 20 000 ans avant notre ère</p>
                  <p><strong>Conservation:</strong> Musée royal de l'Afrique centrale, Belgique</p>
                  
                  <h5>Importance mathématique</h5>
                  <p>L'os présente trois colonnes d'entailles organisées qui pourraient représenter:</p>
                  <ul>
                    <li>Une connaissance des nombres premiers (11, 13, 17, 19)</li>
                    <li>Un système de comptage en base 10</li>
                    <li>Un calendrier lunaire ou un outil de calcul</li>
                  </ul>
                  
                  <p>Cette découverte suggère que des concepts mathématiques complexes existaient en Afrique centrale bien avant l'apparition des premières civilisations urbaines.</p>
                </div>
              )}
              
              {/* Autres événements - conservés tels quels */}
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

              {/* Manuscrits de Tombouctou */}
              {selectedEvent.id === 5 && (
                <div className="extra-info">
                  <h4>Détails supplémentaires</h4>
                  <p><strong>Période:</strong> 14ème-16ème siècles</p>
                  <p><strong>Conservation:</strong> Bibliothèques privées et Institut Ahmed Baba à Tombouctou</p>
                  <p><strong>Importance:</strong> Avancées mathématiques et astronomiques</p>
                  <p>Les manuscrits de Tombouctou constituent une vaste collection de textes scientifiques qui témoignent de l'excellence académique de l'Afrique de l'Ouest médiévale. Ces documents contiennent:</p>
                  <ul>
                    <li>Des traités d'astronomie avec des calculs précis des positions célestes</li>
                    <li>Des textes mathématiques explorant des concepts algébriques avancés</li>
                    <li>Des méthodes de résolution d'équations et de calculs géométriques</li>
                    <li>Des applications pratiques des mathématiques au commerce et à l'architecture</li>
                  </ul>
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