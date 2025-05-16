import React, { useState, useEffect } from 'react';
import Login from './Login';
// Removed PasswordRecovery import
import '../../styles/Login/Login.scss';
import '../../styles/Login/AuthLoadingModal.scss';
import '../../styles/Login/PremiumLoadingModal.scss'; 
import backgroundImg from '../../assets/mountain-7704584_1920.jpg';

const LoginCard = () => {
  // We keep isFlipped and activeCard for backward compatibility
  // but we won't use the flipping functionality
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeCard, setActiveCard] = useState('login');
  const currentYear = new Date().getFullYear();

  const handleForgotPassword = (e) => {
    if (e) {
      e.preventDefault();
    }
    // Show an alert instead of flipping to the recovery card
    alert("Password recovery feature is currently disabled. Please contact your administrator for assistance.");
  };

  useEffect(() => {
    // Efecto de entrada suave al cargar
    const timeout = setTimeout(() => {
      document.getElementById('username')?.focus();
    }, 1800);

    return () => clearTimeout(timeout);
  }, []);
  
  // Efecto para manejar focus en inputs para efecto neón
  useEffect(() => {
    const handleFocus = (e) => {
      const group = e.target.closest('.login__form-group');
      if (group) group.classList.add('form-focus');
    };
    
    const handleBlur = (e) => {
      const group = e.target.closest('.login__form-group');
      if (group) group.classList.remove('form-focus');
    };
    
    // Aplicar a todos los inputs en ambas tarjetas
    const inputs = document.querySelectorAll('.login__input');
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });
    
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    };
  }, [activeCard, isFlipped]);

  return (
    <div className="page">
      <div className="page__background">
        <img src={backgroundImg} alt="Background" />
      </div>
      
      {/* Partículas decorativas */}
      <div className="particles-container">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>
      
      <div className="login-container">
        <div 
          className="login-card" 
          id="loginCard"
        >
          {/* Parte frontal (login) */}
          <div className="login-card__front login">
            <Login 
              onForgotPassword={handleForgotPassword}
            />
            
            {/* Footer con términos y condiciones */}
            <div className="terms-footer">
              <p>© {currentYear} Motive Homecare. All rights reserved.</p>
              <p>
                By logging in, you agree to our{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>{' '}
                and{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;