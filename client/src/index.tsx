import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from '../components/AlertTemplate';
import { Provider as StoreProvider } from '../hooks/useStore';

import Index from '../pages';
import NotFound from '../pages/404';
import Panel from '../pages/panel';

import 'modern-normalize/modern-normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// const SOCKET_URL = 'http://localhost:3000';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AlertProvider
        template={AlertTemplate}
        position={positions.TOP_CENTER}
        timeout={5000}
        transition={transitions.FADE}
      >
        <StoreProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="panel" element={<Panel />} />
            <Route
              path="*"
              element={NotFound}
            />
          </Routes>
        </StoreProvider>
      </AlertProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
