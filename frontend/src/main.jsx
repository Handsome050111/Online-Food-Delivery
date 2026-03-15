import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { LocationProvider } from './context/LocationContext';
import { SocketProvider } from './context/SocketContext';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <LocationProvider>
        <SocketProvider>
            <App />
        </SocketProvider>
    </LocationProvider>
)
