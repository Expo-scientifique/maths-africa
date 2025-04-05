import React, { useState } from 'react';
import './styles/App.css';
import Header from './components/Header';
import Timeline from './components/Timeline';
import MapView from './components/MapView';
import ModelViewer from './components/ModelViewer';
import { events } from './data/events';

function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);

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