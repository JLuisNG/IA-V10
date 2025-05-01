import React, { useState } from 'react';
import PremiumEmailAnimation from './PremiumLoadingModal';
import logoImg from '../../assets/LogoMHC.jpeg';
import PasswordRecoveryService from './PasswordRecoveryService';

const PasswordRecovery = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  
  // Estado para el modal de carga de envío de correo
  const [emailModal, setEmailModal] = useState({
    isOpen: false,
    status: 'loading', // 'loading', 'success'
    message: ''
  });

  const validateEmail = (email) => {
    // Expresión regular para validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    
    // Validar email
    if (!email || !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      // Efecto visual para errores
      const input = document.getElementById("recovery-email");
      if (input) {
        input.style.transition = "transform 0.1s ease";
        input.style.transform = "translateX(5px)";
        setTimeout(() => {
          input.style.transform = "translateX(-5px)";
          setTimeout(() => {
            input.style.transform = "translateX(0)";
          }, 100);
        }, 100);
      }
      return;
    }
    
    // Cambiar el estado del botón
    setIsSubmitting(true);
    
    // Abrir el modal con animación premium
    setEmailModal({
      isOpen: true,
      status: 'loading',
      message: 'Processing request...'
    });
    
    try {
      // Iniciar proceso de recuperación
      const recoveryResult = await PasswordRecoveryService.initiatePasswordRecovery(email);
      
      // Simular un tiempo de procesamiento para mostrar la animación
      setTimeout(() => {
        if (recoveryResult.success) {
          // Actualizar modal a éxito
          setEmailModal({
            isOpen: true,
            status: 'success',
            message: recoveryResult.message || `Recovery instructions sent to ${email}`
          });
          
          // Reiniciar estado
          setEmail('');
          setIsSubmitting(false);
          
          // Regresar al login después de mostrar el mensaje de éxito
          setTimeout(() => {
            onBackToLogin();
          }, 6000); // Dar tiempo para ver la animación de éxito completa
        } else {
          // Mostrar error
          setEmailModal({
            isOpen: false
          });
          
          setEmailError(recoveryResult.error || 'Failed to process recovery request');
          setIsSubmitting(false);
        }
      }, 8000); // Tiempo suficiente para ver toda la secuencia de animación
    } catch (error) {
      console.error('Password recovery error:', error);
      
      // Cerrar modal y mostrar error
      setTimeout(() => {
        setEmailModal({
          isOpen: false
        });
        
        setEmailError('An unexpected error occurred. Please try again.');
        setIsSubmitting(false);
      }, 2000);
    }
  };

  return (
    <>
      <div className="login__logo">
        <img src={logoImg} alt="Motive Homecare Logo" className="login__logo-img" />
      </div>
      
      <h2 className="login__title">Password Recovery</h2>
      <p className="password-recovery__text">
        Enter your email address below and we'll send you instructions to reset your password.
      </p>
      
      <form id="passwordRecoveryForm" className="login__form" onSubmit={handleSubmit}>
        <div className={`login__form-group ${emailError ? 'error' : ''}`}>
          <label htmlFor="recovery-email" className="login__label">
            <i className="fas fa-envelope"></i>
            Email Address
          </label>
          <div className="login__input-wrapper">
            <input 
              type="email" 
              id="recovery-email" 
              className="login__input" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="login__error-message">
            {emailError || "Please enter a valid email address"}
          </div>
        </div>
        
        <button 
          type="submit" 
          className="login__button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'SENDING...' : 'SEND RESET LINK'}
        </button>
      </form>
      
      <div className="login__extra-links">
        <button className="login__link" onClick={onBackToLogin}>
          <i className="fas fa-arrow-left"></i> Back to Login
        </button>
      </div>
      
      {/* Modal de animación premium de envío de correo */}
      <PremiumEmailAnimation 
        isOpen={emailModal.isOpen}
        status={emailModal.status}
        message={emailModal.message}
        email={email}
      />
    </>
  );
};

export default PasswordRecovery;