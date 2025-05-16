// services/GeolocationService.js

const ALLOWED_COUNTRIES = ['US', 'USA', 'United States']; // Códigos de país permitidos
const GEO_API_URL = 'https://ipapi.co/json/'; // API gratuita para geolocalización por IP

// Dejamos DEV_MODE en false para que verifique la restricción geográfica
const DEV_MODE = false; 

/**
 * Verificar si la ubicación del usuario está permitida
 * @returns {Promise<Object>} Resultado de la verificación
 */
export const checkGeolocation = async () => {
  console.log('Checking geolocation...');
  
  if (DEV_MODE) {
    console.log('Dev mode enabled, bypassing geolocation check');
    return {
      allowed: true,
      reason: 'Development mode bypass',
      location: {
        country: 'United States',
        countryCode: 'US',
        region: 'Development',
        city: 'Development',
        ip: '127.0.0.1'
      }
    };
  }

  try {
    // Intentar obtener la ubicación mediante la API de geolocalización
    const locationData = await getLocationData();
    console.log('Location data received:', locationData);
    
    // Si no se pudo obtener la ubicación, denegar por precaución
    if (!locationData || !locationData.country_code) {
      console.warn('Could not determine location, denying access');
      return {
        allowed: false,
        reason: 'Unable to verify location',
        location: null
      };
    }
    
    // Verificar si el país está en la lista de permitidos
    const isAllowed = ALLOWED_COUNTRIES.includes(locationData.country_code) ||
                     ALLOWED_COUNTRIES.includes(locationData.country_name);
    
    console.log('Location allowed:', isAllowed, 'Country:', locationData.country_name);
    
    return {
      allowed: isAllowed,
      reason: isAllowed ? 'Location allowed' : 'Geographic restriction',
      location: {
        country: locationData.country_name,
        countryCode: locationData.country_code,
        region: locationData.region,
        city: locationData.city,
        ip: locationData.ip
      }
    };
  } catch (error) {
    console.error('Error checking geolocation:', error);
    
    // En caso de error, denegar acceso por seguridad
    return {
      allowed: false,
      reason: 'Error verifying location, access denied',
      error: error.message
    };
  }
};

/**
 * Obtener datos de ubicación del usuario
 * @returns {Promise<Object>} Datos de ubicación
 */
const getLocationData = async () => {
  // Para pruebas: puedes simular estar en un país no permitido
  // Descomentar esta línea para simular estar en otro país
  // return { country_code: 'MX', country_name: 'Mexico', region: 'Ciudad de Mexico', city: 'Mexico City', ip: '123.456.789.0' };
  
  try {
    // Hacer solicitud a la API de geolocalización
    console.log('Fetching location data from:', GEO_API_URL);
    const response = await fetch(GEO_API_URL);
    
    if (!response.ok) {
      throw new Error(`Geolocation API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Geolocation API response:', data);
    return data;
  } catch (error) {
    console.error('Error getting location data:', error);
    return null;
  }
};

/**
 * Servicio completo de geolocalización
 */
class GeolocationService {
  /**
   * Verificar acceso por ubicación
   * @returns {Promise<Object>} Resultado de la verificación
   */
  static async verifyLocationAccess() {
    return await checkGeolocation();
  }
  
  /**
   * Obtener información detallada de la ubicación
   * @returns {Promise<Object>} Información de ubicación
   */
  static async getDetailedLocation() {
    try {
      const locationData = await getLocationData();
      return locationData;
    } catch (error) {
      console.error('Error getting detailed location:', error);
      return null;
    }
  }
  
  /**
   * Comprobar si el país del usuario está permitido
   * @param {string} countryCode - Código de país a verificar
   * @returns {boolean} True si está permitido
   */
  static isCountryAllowed(countryCode) {
    if (DEV_MODE) return true;
    
    if (!countryCode) return false;
    return ALLOWED_COUNTRIES.includes(countryCode.toUpperCase());
  }
  
  /**
   * Función auxiliar para simular una ubicación diferente (solo para pruebas)
   * @param {string} countryCode - Código de país a simular
   */
  static simulateLocation(countryCode, countryName) {
    // Esta función es solo para pruebas
    localStorage.setItem('simulated_country_code', countryCode);
    localStorage.setItem('simulated_country_name', countryName);
    console.log('Simulating location:', countryCode, countryName);
  }
}

export default GeolocationService;