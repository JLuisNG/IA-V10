import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../../styles/developer/Patients/PremiunTabs.scss';

const DevPremiumTabs = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animation when component mounts
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setIsAnimating(true);
      
      // If onTabChange prop exists, use it for in-app navigation without page reload
      if (onTabChange) {
        onTabChange(tab);
        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      } else {
        // Otherwise use traditional navigation
        setTimeout(() => {
          if (tab === 'Staffing') {
            navigate('/staffing');
          } else if (tab === 'Patients') {
            navigate('/patients');
          }
        }, 300);
      }
    }
  };
  
  return (
    <div className={`premium-tabs-container ${isAnimating ? 'animating' : ''}`}>
      <div className="premium-tabs">
        <div className="tabs-background">
          <div className={`tab-highlight ${activeTab === 'Patients' ? 'left' : 'right'}`}></div>
        </div>
        
        <button 
          className={`tab-button ${activeTab === 'Patients' ? 'active' : ''}`}
          onClick={() => handleTabChange('Patients')}
        >
          <span className="tab-icon">
            <i className="fas fa-user-injured"></i>
          </span>
          <span className="tab-text">Patients</span>
          {activeTab === 'Patients' && <div className="active-indicator"></div>}
        </button>
        
        <button 
          className={`tab-button ${activeTab === 'Staffing' ? 'active' : ''}`}
          onClick={() => handleTabChange('Staffing')}
        >
          <span className="tab-icon">
            <i className="fas fa-user-md"></i>
          </span>
          <span className="tab-text">Staffing</span>
          {activeTab === 'Staffing' && <div className="active-indicator"></div>}
        </button>
      </div>
      
      <div className="tabs-glow"></div>
    </div>
  );
};

export default DevPremiumTabs;