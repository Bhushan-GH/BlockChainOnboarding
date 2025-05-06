import { StrictMode } from 'react'
import React from 'react';

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import {store} from './redux/store'; // Import your store

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>  {/* Pass the store here */}  <StrictMode>
    <App />
  </StrictMode>
  </Provider>
)
