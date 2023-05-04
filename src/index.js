import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { initI18n } from './locale/i18n';
import App from './App';
import reportWebVitals from './reportWebVitals';

initI18n();

//NOTE: react 18 new root
const container = document.getElementById('root');

// Create a root
const root = ReactDOM.createRoot(container);

// Initial render
root.render(
    //<React.StrictMode>
    <App />
    //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
