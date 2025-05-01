// components/geo/GeoRestrictionProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import GeolocationService from './GeolocationService';
import GeoRestrictionModal from './GeoRestrictionModal';

// Crear contexto
const GeoRestrictionContext = createContext();

// Hook personalizado para usar el contexto
export const useGeoRestriction = () => useContext(GeoRestrictionContext);

export const GeoRestrictionProvider = ({ children }) => {
  const [geoState, setGeoState] = useState({
    isRestricted: false,
    isChecking: true,
    locationData: null,
    error: null
  });
  
  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    locationData: null
  });
  
  // Verificar geolocalización
  const checkGeolocation = async () => {
    try {
      setGeoState(prev => ({
        ...prev,
        isChecking: true,
        error: null
      }));
      
      // Verificar ubicación
      const geoResult = await GeolocationService.verifyLocationAccess();
      
      // Actualizar estado
      setGeoState({
        isRestricted: !geoResult.allowed,
        isChecking: false,
        locationData: geoResult.location,
        error: null
      });
      
      // Si está restringido, mostrar modal
      if (!geoResult.allowed) {
        setModalState({
          isOpen: true,
          locationData: geoResult.location
        });
        
        // Opcional: redirigir o mostrar página específica
        // window.location.href = '/geo-restricted';
      }
      
      return geoResult;
    } catch (error) {
      console.error('Error checking geolocation:', error);
      
      // Actualizar estado con error
      setGeoState({
        isRestricted: true, // Por precaución, restringir en caso de error
        isChecking: false,
        locationData: null,
        error: error.message
      });
      
      // Mostrar modal de error
      setModalState({
        isOpen: true,
        locationData: null,
        error: error.message
      });
      
      return {
        allowed: false,
        reason: 'Error verifying location',
        error: error.message
      };
    }
  };
  
  // Verificar geolocalización al cargar
  useEffect(() => {
    checkGeolocation();
  }, []);
  
  // Manejar reintento
  const handleRetry = () => {
    checkGeolocation();
  };
  
  // Manejar cierre
  const handleClose = () => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  };
  
  return (
    <GeoRestrictionContext.Provider 
      value={{
        isRestricted: geoState.isRestricted,
        isChecking: geoState.isChecking,
        locationData: geoState.locationData,
        error: geoState.error,
        checkGeolocation
      }}
    >
      {children}
      
      <GeoRestrictionModal
        isOpen={modalState.isOpen}
        locationData={modalState.locationData}
        error={geoState.error}
        onRetry={handleRetry}
        onClose={handleClose}
      />
    </GeoRestrictionContext.Provider>
  );
};

export default GeoRestrictionProvider;