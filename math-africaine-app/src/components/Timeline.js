import React from 'react';
import '../styles/Timeline.css';

const Timeline = ({ events, onSelectEvent, selectedEvent }) => {
  // Ajuster légèrement l'espacement des événements pour éviter les chevauchements
  const getAdjustedPosition = (index, totalEvents) => {
    // Utiliser une répartition plus large (10% à 90% au lieu de 0% à 100%)
    // pour éviter que les textes se coupent aux bords
    const minPosition = 10;
    const maxPosition = 90;
    const range = maxPosition - minPosition;
    
    // Si un seul événement, le centrer
    if (totalEvents === 1) return 50;
    
    // Sinon, répartir uniformément
    return minPosition + (index / (totalEvents - 1)) * range;
  };

  return (
    <div className="timeline-container">
      <div className="timeline">
        <div className="timeline-continuous-line"></div>
        
        {events.map((event, index) => (
          <div 
            key={event.id} 
            className="timeline-step"
            style={{left: `${getAdjustedPosition(index, events.length)}%`}}
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