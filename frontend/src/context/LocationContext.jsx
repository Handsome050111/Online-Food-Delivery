import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [city, setCity] = useState(() => {
        return localStorage.getItem('userCity') || 'Islamabad';
    });

    const [isDetecting, setIsDetecting] = useState(false);
    const [locationError, setLocationError] = useState(null);

    useEffect(() => {
        localStorage.setItem('userCity', city);
    }, [city]);

    const detectLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                const err = "Geolocation is not supported by your browser";
                setLocationError(err);
                reject(err);
                return;
            }

            setIsDetecting(true);
            setLocationError(null);

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                        const data = await response.json();
                        
                        let detectedCity = 'Islamabad'; // Default fallback

                        if (data) {
                            detectedCity = data.city || data.locality || data.principalSubdivision || 'Islamabad';
                        }
                        
                        setCity(detectedCity);
                        setIsDetecting(false);
                        resolve(detectedCity);
                    } catch (error) {
                        console.error("Error reverse geocoding:", error);
                        const err = "Failed to identify your city";
                        setLocationError(err);
                        setIsDetecting(false);
                        reject(err);
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    let err = "Location access denied";
                    if (error.code === error.TIMEOUT) err = "Location detection timed out";
                    setLocationError(err);
                    setIsDetecting(false);
                    reject(err);
                },
                { timeout: 10000 }
            );
        });
    };

    return (
        <LocationContext.Provider value={{ city, setCity, detectLocation, locationError, isDetecting }}>
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
