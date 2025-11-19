import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { AuthProvider } from './context/AuthContext.jsx';
import { AlertProvider } from './context/AlertContext.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Mes composants
import App from './App.jsx'
import Accueil from './pages/Accueil.jsx';
import APropos from './pages/APropos.jsx';
import Auth from './pages/Auth.jsx';
import Home from './pages/Home.jsx';
import DealDetail from './pages/DealDetail.jsx';

import Alert from './components/Alert.jsx';

//definition des routes
const router = createBrowserRouter([
  {
    path: '/',        // L'URL de base
    element: <App />, // Charge le gabarit (App.jsx)
    children: [       // Et charge ces "enfants" dans l' <Outlet />
      {
        path: '/',
        element: <Accueil />,
      },
      {
        path: 'a-propos', 
        element: <APropos />,
      },
      {
        path: 'connexion',
        element: <Auth />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'deals/:dealId', 
        element: <DealDetail />,
      }

    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Envelopper toute l'app avec le contexte d'authentification */}
    <AuthProvider>
        < AlertProvider>
          <RouterProvider router={router} />
        </AlertProvider >
    </AuthProvider>
  </StrictMode>,
)
