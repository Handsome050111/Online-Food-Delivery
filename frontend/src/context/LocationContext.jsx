import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [city, setCity] = useState(() => {
        return localStorage.getItem('userCity') || 'Islamabad';
    });

    const [locationError, setLocationError] = useState(null);

    useEffect(() => {
        localStorage.setItem('userCity', city);
    }, [city]);

    const detectLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Using a free reverse geocoding API (BigDataCloud) for demonstration
                    // In production, you would use Google Maps or Mapbox
                    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                    const data = await response.json();
                    
                    if (data && data.city) {
                        setCity(data.city);
                    } else if (data && data.locality) {
                        setCity(data.locality);
                    }
                } catch (error) {
                    console.error("Error reverse geocoding:", error);
                    setLocationError("Failed to identify your city");
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocationError("Location access denied");
            }
        );
    };

    return (
        <LocationContext.Provider value={{ city, setCity, detectLocation, locationError }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};
