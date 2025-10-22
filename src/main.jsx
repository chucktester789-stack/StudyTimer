import { StrictMode } from 'react' // Aktiviert zusätzliche Entwicklungswarnungen
import { createRoot } from 'react-dom/client' // Moderne Root-API für React-Apps
import { BrowserRouter } from 'react-router-dom' // Clientseitiges Routing ohne Seitenreloads
import './index.css' // Globale Basis-Styles aus dem Template
import App from './App.jsx' // Hauptkomponente der Anwendung

createRoot(document.getElementById('root')).render( // Mountet die App in das Root-Element
  <StrictMode> {/* Schaltet React-Strict-Checks ein */}
    <BrowserRouter> {/* Aktiviert die Router-Navigation */}
      <App /> {/* Rendert die App-Komponente mit allen Routen */}
    </BrowserRouter>
  </StrictMode>,
)
