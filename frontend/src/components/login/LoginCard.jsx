import React, { useState, useEffect } from 'react';
import Login from './Login';
import PasswordRecovery from './PasswordRecovery';
import '../../styles/Login/Login.scss';
import '../../styles/Login/AuthLoadingModal.scss';
import '../../styles/Login/PremiumLoadingModal.scss'; 
import backgroundImg from '../../assets/mountain-7704584_1920.jpg';

const LoginCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeCard, setActiveCard] = useState('login'); // 'login', 'recovery'
  const currentYear = new Date().getFullYear();

  const handleForgotPassword = (e) => {
    if (e) {
      e.preventDefault();
    }
    setActiveCard('recovery');
    setIsFlipped(true);
  };

  const handleBackToLogin = (e) => {
    if (e) {
      e.preventDefault();
    }
    // Iniciar la animación de volteo
    setIsFlipped(false);
    
    // Después de que termine la animación, actualizamos la tarjeta activa
    setTimeout(() => {
      setActiveCard('login');
    }, 500);
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
          className={`login-card ${isFlipped ? 'flipped' : ''} ${activeCard === 'recovery' ? 'flipped-recovery' : ''}`} 
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
          
          {/* Parte trasera (recuperación de contraseña) */}
          <div 
            className="login-card__back password-recovery" 
            id="passwordRecoveryCard" 
            style={{ display: activeCard === 'recovery' ? 'block' : 'none' }}
          >
            <PasswordRecovery onBackToLogin={handleBackToLogin} />
            
            {/* Footer para la pantalla de recuperación */}
            <div className="terms-footer">
              <p>© {currentYear} Motive Homecare. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;