import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './tailwind.css';
import "leaflet/dist/leaflet.css";



import { BrowserRouter } from 'react-router-dom'; // 👈 Importa BrowserRouter

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter> {/* 👈 Envuelve tu App aquí */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


