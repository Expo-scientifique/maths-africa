import React from 'react';
import '../styles/Timeline.css';

const Timeline = ({ events, onSelectEvent, selectedEvent }) => {
  // Distribution des points sur la timeline (de 5% à 95%)
  const getPosition = (index, total) => {
    // Assurer une répartition uniforme avec une marge aux extrémités
    const margin = 5; // 5% de marge de chaque côté
    const availableSpace = 100 - (2 * margin);
    
    // Si un seul événement, le centrer
    if (total === 1) return 50;
    
    // Calcul de la position en pourcentage
    const position = margin + (index / (total - 1)) * availableSpace;
    return position;
  };

  return (
    <div className="timeline-container">
      <div className="timeline">
        <div className="timeline-continuous-line"></div>
        
        {events.map((event, index) => (
          <div 
            key={event.id} 
            className="timeline-step"
            style={{
              left: `${getPosition(index, events.length)}%`
            }}
          >
            <div className="timeline-text">
              <div className="timeline-title">{event.title}</div>
              <div className="timeline-date">{event.date}</div>
            </div>
            
            <div 
              className={`timeline-marker ${selectedEvent?.id === event.id ? 'active' : ''}`}
              onClick={() => onSelectEvent(event.id)}
            ></div>
            
            <div className="timeline-location">
              {event.location}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;