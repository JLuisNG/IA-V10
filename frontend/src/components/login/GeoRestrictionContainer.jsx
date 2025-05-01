// components/geo/GeoRestrictionContainer.jsx
import React, { useState, useEffect } from 'react';
import GeoRestrictionModal from './GeoRestrictionModal';
import GeolocationService from '../../services/GeolocationService';

const GeoRestrictionContainer = () => {
  const [geoState, setGeoState] = useState({
    isOpen: false,
    isChecking: true,
    locationData: null
  });
  
  // Función para verificar la geolocalización
  const checkGeolocation = async () => {
    try {
      setGeoState(prev => ({
        ...prev,
        isChecking: true
      }));
      
      // Verificar ubicación
      const geoResult = await GeolocationService.verifyLocationAccess();
      
      if (!geoResult.allowed) {
        // Si no está permitido, mostrar modal
        setGeoState({
          isOpen: true,
          isChecking: false,
          locationData: geoResult.location
        });
        
        // Opcional: Redirigir a una página específica o mostrar un mensaje
        // window.location.href = '/geo-restricted';
      } else {
        // Si está permitido, cerrar modal si estaba abierto
        setGeoState({
          isOpen: false,
          isChecking: false,
          locationData: geoResult.location
        });
      }
    } catch (error) {
      console.error('Error checking geolocation:', error);
      // En caso de error, denegar por precaución
      setGeoState({
        isOpen: true,
        isChecking: false,
        locationData: null,
        error: error.message
      });
    }
  };
  
  // Verificar geolocalización al cargar el componente
  useEffect(() => {
    checkGeolocation();
  }, []);
  
  // Función para reintentar la verificación
  const handleRetry = () => {
    checkGeolocation();
  };
  
  // Función para cerrar el modal
  const handleClose = () => {
    setGeoState(prev => ({
      ...prev,
      isOpen: false
    }));
  };
  
  return (
    <GeoRestrictionModal
      isOpen={geoState.isOpen}
      locationData={geoState.locationData}
      onRetry={handleRetry}
      onClose={handleClose}
    />
  );
};

export default GeoRestrictionContainer;