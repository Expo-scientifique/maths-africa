import React from 'react';
import '../styles/Timeline.css';

const Timeline = ({ events, onSelectEvent, selectedEvent }) => {
  return (
    <div className="timeline-container">
      <div className="timeline">
        <div className="timeline-continuous-line"></div>
        
        {events.map((event, index) => (
          <div 
            key={event.id} 
            className="timeline-step"
            style={{left: `${(index / (events.length - 1)) * 100}%`}}
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