import React, { useEffect, useState } from 'react';

const GeoRestrictionModal = ({ isOpen, locationData, onRetry, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  
  // Efecto para animar la entrada
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setShowModal(true);
      }, 100);
    } else {
      setShowModal(false);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className={`geo-restriction-overlay ${showModal ? 'show' : ''}`}>
      <div className="geo-restriction-modal">
        <div className="geo-icon">
          <i className="fas fa-globe-americas"></i>
          <div className="geo-lock">
            <i className="fas fa-lock"></i>
          </div>
        </div>
        
        <h2 className="geo-title">Geographic Restriction</h2>
        
        <div className="geo-message">
          <p>
            Access to this application is currently restricted to users located in the 
            United States only.
          </p>
          
          {locationData && (
            <div className="location-info">
              <div className="location-detail">
                <span className="label">Detected Location:</span>
                <span className="value">
                  {locationData.country || 'Unknown Country'}
                  {locationData.region && `, ${locationData.region}`}
                </span>
              </div>
              {locationData.city && (
                <div className="location-detail">
                  <span className="label">City:</span>
                  <span className="value">{locationData.city}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="restriction-note">
            <i className="fas fa-exclamation-circle"></i>
            <p>
              If you believe this is an error or are using a VPN, please disable any VPN 
              or proxy service and try again.
            </p>
          </div>
        </div>
        
        <div className="geo-actions">
          <button className="geo-button primary" onClick={onRetry}>
            <i className="fas fa-sync-alt"></i>
            Try Again
          </button>
          
          <button className="geo-button secondary" onClick={onClose}>
            <i className="fas fa-times"></i>
            Close
          </button>
        </div>
        
        <div className="geo-footer">
          <p>
            For assistance or questions about access restrictions, 
            please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeoRestrictionModal;