import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import dotenv from "dotenv";

require('dotenv');
let result = dotenv.config();
console.log(result);
console.log(process.env.REACT_APP_BACK_ADDR);
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

