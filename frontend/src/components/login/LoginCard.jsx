import React, { useState, useEffect } from 'react';
import Login from './Login';
import PasswordRecovery from './PasswordRecovery';
import '../../styles/Login/Login.scss';
import '../../styles/Login/AuthLoadingModal.scss';
import '../../styles/Login/PremiumLoadingModal.scss'; 
import '../../styles/Login/PasswordRecovery.scss';
import backgroundImg from '../../assets/mountain-7704584_1920.jpg';

const LoginCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeCard, setActiveCard] = useState('login');
  const currentYear = new Date().getFullYear();
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState(null);

  // Detectar tamaño de pantalla y orientación
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 576);
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleForgotPassword = (e) => {
    if (e) {
      e.preventDefault();
    }
    setIsFlipped(true);
    setActiveCard('password-recovery');
  };
  
  const handleBackToLogin = () => {
    setIsFlipped(false);
    setActiveCard('login');
  };

  useEffect(() => {
    // Efecto de entrada suave al cargar
    const timeout = setTimeout(() => {
      if (!isFlipped) {
        document.getElementById('username')?.focus();
      }
    }, 1800);

    return () => clearTimeout(timeout);
  }, [isFlipped]);
  
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
    <div className={`page ${orientation === 'landscape' && isMobile ? 'landscape-mode' : ''}`}>
      <div className="page__background">
        <img src={backgroundImg} alt="Background" />
      </div>
      
      <div className="login-container">
        <div 
          className={`login-card ${isFlipped ? 'flipped' : ''}`} 
          id="loginCard"
        >
          {/* Parte frontal (login) */}
          <div className="login-card__front login">
            <Login 
              onForgotPassword={handleForgotPassword}
            />
            
            {/* Footer con términos y condiciones - simplificado en móviles */}
            <div className="terms-footer">
              <p>© {currentYear} Motive Homecare. All rights reserved.</p>
              {!isMobile && (
                <p>
                  By logging in, you agree to our{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                </p>
              )}
            </div>
          </div>
          
          {/* Parte trasera (recuperación) */}
          <div className={`login-card__back ${activeCard === 'password-recovery' ? 'password-recovery' : ''}`}>
            <div className="login">
              <PasswordRecovery onBackToLogin={handleBackToLogin} />
              
              {/* Footer con términos y condiciones - simplificado en móviles */}
              <div className="terms-footer">
                <p>© {currentYear} Motive Homecare. All rights reserved.</p>
                {!isMobile && (
                  <p>
                    By proceeding, you agree to our{' '}
                    <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>{' '}
                    and{' '}
                    <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;