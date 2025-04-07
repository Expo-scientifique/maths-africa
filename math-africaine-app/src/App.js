import React, { useState, useEffect } from 'react';
import './styles/App.css';
import './styles/chrome-fix.css';
import Header from './components/Header';
import Timeline from './components/Timeline';
import MapView from './components/MapView';
import ModelViewer from './components/ModelViewer';
import { events } from './data/events';

function App() {
  // Initialiser selectedEvent avec l'os d'Ishango (id 1) au lieu de null
  const [selectedEvent, setSelectedEvent] = useState(events.find(e => e.id === 1));

  const handleEventSelect = (eventId) => {
    const event = events.find(e => e.id === eventId);
    setSelectedEvent(event);
  };

  return (
    <div className="app">
      <Header />
      <Timeline events={events} onSelectEvent={handleEventSelect} selectedEvent={selectedEvent} />
      <div className="display-area">
        <MapView selectedEvent={selectedEvent} onSelectEvent={handleEventSelect} />
        <ModelViewer selectedEvent={selectedEvent} />
      </div>
    </div>
  );
}

export default App;