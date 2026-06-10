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
import EditDealPage from './pages/EditDealPage.jsx';
import Contact from './pages/Contact.jsx';
import Profil from './pages/Profil.jsx';

import Alert from './components/Alert.jsx';
import { DealsProvider } from './context/DealsContext.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

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
        path: 'home',
        element: <Home />,
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
        path: 'contact',
        element: <Contact/>,
      },
      {
        path: 'deals/:dealId', 
        element: <DealDetail />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'profil',
            element: <Profil />,
          },
          {
            path: 'edit-deal/:dealId', 
            element: <EditDealPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      }

    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Envelopper toute l'app avec le contexte d'authentification */}
    <AuthProvider>
        <DealsProvider>
            < AlertProvider>
                <RouterProvider router={router} />
            </AlertProvider >
        </DealsProvider>
    </AuthProvider>
  </StrictMode>,
)
