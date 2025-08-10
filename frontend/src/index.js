
// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { Auth0Provider } from '@auth0/auth0-react';
// import App from './App';
// import './index.css';
// import * as serviceWorker from './serviceWorker';

// const root = createRoot(document.getElementById('root'));

// root.render(
//   <Auth0Provider
//     domain="dev-v6gkgrfuvuz8gvgd.us.auth0.com"
//     clientId="VyavCbkADjMi0cRQtg0Ab6802BxYae6L"
//     authorizationParams={{
//       redirect_uri: window.location.origin,
//       audience: "https://myapi.example.com",
      
//       scope: "openid profile email"
//     }}
//   >
//     <App />
//   </Auth0Provider>
// );

// serviceWorker.unregister();

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

const root = createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain="dev-v6gkgrfuvuz8gvgd.us.auth0.com"
    clientId="VyavCbkADjMi0cRQtg0Ab6802BxYae6L"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://myapi.example.com",
      scope: "openid profile email"
    }}
  >
    <App />
  </Auth0Provider>
);

serviceWorker.unregister();
