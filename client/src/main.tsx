// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Your global styles (including Tailwind)
// Example: src/main.tsx or a new file like src/fontawesome.ts
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faShoppingCart,
  faTrashAlt,
  faUndoAlt,
  faCheckCircle,
  faUser,
  faSearch,
  faBars,
  faPizzaSlice // Add more icons as needed
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faInstagram,
  faTwitter // Add brand icons
} from '@fortawesome/free-brands-svg-icons';

library.add(
  faShoppingCart,
  faTrashAlt,
  faUndoAlt,
  faCheckCircle,
  faUser,
  faSearch,
  faBars,
  faPizzaSlice,
  faFacebookF,
  faInstagram,
  faTwitter
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);