import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; // Assurez-vous que ce fichier existe
import App from './App';


const rootElement = document.getElementById('root');
try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  rootElement.innerHTML = `
    <div style="color: red; padding: 20px;">
      <h2>Erreur au démarrage :</h2>
      <pre>${error.message}</pre>
      <p>Consultez la console pour plus de détails.</p>
    </div>
  `;
  console.error('Erreur fatale au démarrage :', error);
}