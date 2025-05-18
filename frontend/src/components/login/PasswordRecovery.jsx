import React, { useState, useEffect } from 'react';
import AuthLoadingModal from './AuthLoadingModal';

const PasswordRecovery = ({ onBackToLogin }) => {
  const [recoveryMethod, setRecoveryMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalStatus, setAuthModalStatus] = useState('loading');
  const [authModalMessage, setAuthModalMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  // Validación de fortaleza de contraseña
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  
  // Detectar tamaño de pantalla para ajustes responsive
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 576);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
  // Efectos para animar entre pasos
  useEffect(() => {
    // Reiniciar foco cuando cambia el paso
    if (step === 1) {
      const input = recoveryMethod === 'email' ? 
        document.getElementById('recovery-email') : 
        document.getElementById('recovery-phone');
      
      setTimeout(() => {
        input?.focus();
      }, 300);
    } else if (step === 2) {
      setTimeout(() => {
        document.getElementById('verification-code')?.focus();
      }, 300);
    } else if (step === 3) {
      setTimeout(() => {
        document.getElementById('new-password')?.focus();
      }, 300);
    }
  }, [step, recoveryMethod]);
  
  // Evaluar fortaleza de la contraseña
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      setPasswordFeedback('');
      return;
    }
    
    let strength = 0;
    let feedback = '';
    
    // Longitud
    if (newPassword.length >= 8) strength += 1;
    if (newPassword.length >= 12) strength += 1;
    
    // Complejidad
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[a-z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    
    // Feedback basado en la puntuación
    if (strength <= 2) {
      feedback = 'Weak - Try adding numbers and special characters';
    } else if (strength <= 4) {
      feedback = 'Moderate - Consider using a longer password';
    } else {
      feedback = 'Strong - Excellent password choice';
    }
    
    setPasswordStrength(Math.min(strength, 6));
    setPasswordFeedback(feedback);
  }, [newPassword]);
  
  const handleMethodChange = (method) => {
    setRecoveryMethod(method);
    setErrors({});
  };
  
  const validateStep1 = () => {
    const newErrors = {};
    
    if (recoveryMethod === 'email') {
      if (!email) {
        newErrors.email = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      if (!phoneNumber) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\+?[1-9]\d{9,14}$/.test(phoneNumber.replace(/\s+/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!verificationCode) {
      newErrors.code = 'Verification code is required';
    } else if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
      newErrors.code = 'Please enter a valid 6-digit code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep3 = () => {
    const newErrors = {};
    
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    
    if (validateStep1()) {
      setIsLoading(true);
      
      // Mostrar modal de carga premium
      setShowAuthModal(true);
      setAuthModalStatus('loading');
      setAuthModalMessage(`Verifying ${recoveryMethod === 'email' ? 'email address' : 'phone number'}...`);
      
      // Simular proceso de envío con pasos más elaborados
      setTimeout(() => {
        setAuthModalMessage(`Generating secure recovery token...`);
        
        setTimeout(() => {
          setAuthModalMessage(`Sending verification code...`);
          
          setTimeout(() => {
            setShowAuthModal(false);
            setIsLoading(false);
            setStep(2);
          }, 1500);
        }, 1500);
      }, 1500);
    }
  };
  
  const handleSubmitStep2 = (e) => {
    e.preventDefault();
    
    if (validateStep2()) {
      setIsLoading(true);
      
      // Mostrar modal de carga premium
      setShowAuthModal(true);
      setAuthModalStatus('loading');
      setAuthModalMessage(`Validating verification code...`);
      
      setTimeout(() => {
        setAuthModalMessage(`Authenticating recovery request...`);
        
        setTimeout(() => {
          setAuthModalMessage(`Preparing secure password reset...`);
          
          setTimeout(() => {
            setShowAuthModal(false);
            setIsLoading(false);
            setStep(3);
          }, 1500);
        }, 1500);
      }, 1500);
    }
  };
  
  const handleSubmitStep3 = (e) => {
    e.preventDefault();
    
    if (validateStep3()) {
      setIsLoading(true);
      
      // Mostrar modal de carga premium
      setShowAuthModal(true);
      setAuthModalStatus('loading');
      setAuthModalMessage(`Encrypting new password...`);
      
      setTimeout(() => {
        setAuthModalMessage(`Updating secure credentials...`);
        
        setTimeout(() => {
          setAuthModalMessage(`Finalizing account recovery...`);
          
          setTimeout(() => {
            setAuthModalStatus('success');
            setAuthModalMessage(`Password has been reset successfully!`);
            
            setTimeout(() => {
              setShowAuthModal(false);
              setIsLoading(false);
              onBackToLogin();
            }, 2000);
          }, 1500);
        }, 1500);
      }, 1500);
    }
  };
  
  const renderPasswordStrength = () => {
    const maxStrength = 6;
    const percent = (passwordStrength / maxStrength) * 100;
    
    let barClass = 'password-strength-bar';
    if (percent >= 80) barClass += ' strong';
    else if (percent >= 50) barClass += ' medium';
    else if (percent > 0) barClass += ' weak';
    
    return (
      <div className="password-strength">
        <div className="password-strength-meter">
          <div className={barClass} style={{ width: `${percent}%` }}></div>
        </div>
        {passwordFeedback && (
          <div className="password-feedback">{passwordFeedback}</div>
        )}
      </div>
    );
  };
  
  const renderStep1 = () => (
    <form className="recovery-form" onSubmit={handleSubmitStep1}>
      <div className="recovery-methods">
        <div 
          className={`recovery-method ${recoveryMethod === 'email' ? 'active' : ''}`}
          onClick={() => handleMethodChange('email')}
        >
          <i className="fas fa-envelope"></i>
          <span>{isMobile ? 'Email' : 'Email Recovery'}</span>
        </div>
        <div 
          className={`recovery-method ${recoveryMethod === 'phone' ? 'active' : ''}`}
          onClick={() => handleMethodChange('phone')}
        >
          <i className="fas fa-mobile-alt"></i>
          <span>{isMobile ? 'Phone' : 'Phone Recovery'}</span>
        </div>
      </div>
      
      <div className="recovery-info">
        <i className="fas fa-info-circle"></i>
        <p>
          We'll send a verification code to your {recoveryMethod === 'email' ? 'email address' : 'phone number'}.
          {!isMobile && ' Use this code to verify your identity and reset your password.'}
        </p>
      </div>
      
      {recoveryMethod === 'email' ? (
        <div className={`login__form-group ${errors.email ? 'error' : ''}`}>
          <label htmlFor="recovery-email" className="login__label">
            <i className="fas fa-envelope"></i> Email Address
          </label>
          <input
            type="email"
            id="recovery-email"
            className="login__input"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <div className="login__error-message">{errors.email}</div>}
        </div>
      ) : (
        <div className={`login__form-group ${errors.phone ? 'error' : ''}`}>
          <label htmlFor="recovery-phone" className="login__label">
            <i className="fas fa-mobile-alt"></i> Phone Number
          </label>
          <input
            type="text"
            id="recovery-phone"
            className="login__input"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phone && <div className="login__error-message">{errors.phone}</div>}
        </div>
      )}
      
      <button type="submit" className="login__button" disabled={isLoading}>
        <span>{isLoading ? 'Processing...' : 'Send Verification Code'}</span>
        <i className="fas fa-arrow-right login-arrow"></i>
      </button>
    </form>
  );
  
  const renderStep2 = () => (
    <form className="recovery-form" onSubmit={handleSubmitStep2}>
      <div className="recovery-info">
        <i className="fas fa-info-circle"></i>
        <p>
          We've sent a verification code to your {recoveryMethod === 'email' ? 'email address' : 'phone number'}.
          Please {isMobile ? 'enter' : 'check and enter'} the 6-digit code below.
        </p>
      </div>
      
      <div className={`login__form-group ${errors.code ? 'error' : ''}`}>
        <label htmlFor="verification-code" className="login__label">
          <i className="fas fa-key"></i> Verification Code
        </label>
        <input
          type="text"
          id="verification-code"
          className="login__input"
          placeholder="Enter 6-digit code"
          maxLength="6"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
        />
        {errors.code && <div className="login__error-message">{errors.code}</div>}
      </div>
      
      <button type="submit" className="login__button" disabled={isLoading}>
        <span>{isLoading ? 'Verifying...' : 'Verify Code'}</span>
        <i className="fas fa-arrow-right login-arrow"></i>
      </button>
      
      <div className="resend-code">
        Didn't receive a code? <a href="#" onClick={(e) => { 
          e.preventDefault(); 
          setShowAuthModal(true);
          setAuthModalStatus('loading');
          setAuthModalMessage('Resending verification code...');
          
          setTimeout(() => {
            setShowAuthModal(false);
            alert('A new code has been sent to your ' + (recoveryMethod === 'email' ? 'email address' : 'phone number'));
          }, 2000);
        }}>Resend code</a>
      </div>
    </form>
  );
  
  const renderStep3 = () => (
    <form className="recovery-form" onSubmit={handleSubmitStep3}>
      <div className="recovery-info success">
        <i className="fas fa-check-circle"></i>
        <p>
          Your identity has been verified successfully. 
          {!isMobile ? ' Please create a new password for your account.' : ''}
        </p>
      </div>
      
      <div className={`login__form-group ${errors.newPassword ? 'error' : ''}`}>
        <label htmlFor="new-password" className="login__label">
          <i className="fas fa-lock"></i> New Password
        </label>
        <input
          type="password"
          id="new-password"
          className="login__input"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {renderPasswordStrength()}
        {errors.newPassword && <div className="login__error-message">{errors.newPassword}</div>}
      </div>
      
      <div className={`login__form-group ${errors.confirmPassword ? 'error' : ''}`}>
        <label htmlFor="confirm-password" className="login__label">
          <i className="fas fa-lock"></i> Confirm Password
        </label>
        <input
          type="password"
          id="confirm-password"
          className="login__input"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && <div className="login__error-message">{errors.confirmPassword}</div>}
      </div>
      
      {/* Mostrar requisitos simplificados en móviles */}
      {isMobile ? (
        <div className="password-requirements">
          <ul>
            <li className={newPassword.length >= 8 ? 'met' : ''}>
              <i className={`fas ${newPassword.length >= 8 ? 'fa-check-circle' : 'fa-circle'}`}></i>
              At least 8 characters
            </li>
            <li className={/[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) ? 'met' : ''}>
              <i className={`fas ${/[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) ? 'fa-check-circle' : 'fa-circle'}`}></i>
              Upper case and number
            </li>
          </ul>
        </div>
      ) : (
        <div className="password-requirements">
          <div className="requirements-title">Password Requirements:</div>
          <ul>
            <li className={newPassword.length >= 8 ? 'met' : ''}>
              <i className={`fas ${newPassword.length >= 8 ? 'fa-check-circle' : 'fa-circle'}`}></i>
              At least 8 characters
            </li>
            <li className={/[A-Z]/.test(newPassword) ? 'met' : ''}>
              <i className={`fas ${/[A-Z]/.test(newPassword) ? 'fa-check-circle' : 'fa-circle'}`}></i>
              One uppercase letter
            </li>
            <li className={/[0-9]/.test(newPassword) ? 'met' : ''}>
              <i className={`fas ${/[0-9]/.test(newPassword) ? 'fa-check-circle' : 'fa-circle'}`}></i>
              One number
            </li>
            <li className={/[^A-Za-z0-9]/.test(newPassword) ? 'met' : ''}>
              <i className={`fas ${/[^A-Za-z0-9]/.test(newPassword) ? 'fa-check-circle' : 'fa-circle'}`}></i>
              One special character
            </li>
          </ul>
        </div>
      )}
      
      <button type="submit" className="login__button" disabled={isLoading}>
        <span>{isLoading ? 'Updating Password...' : 'Reset Password'}</span>
        <i className="fas fa-arrow-right login-arrow"></i>
      </button>
    </form>
  );
  
  return (
    <>
      <div className="login__logo">
        <img src={require('../../assets/LogoMHC.jpeg')} alt="Motive Homecare Logo" className="login__logo-img" />
      </div>
      
      <h2 className="login__title">
        {step === 1 ? (isMobile ? 'Recover Password' : 'Recover Your Password') : 
         step === 2 ? 'Verify Identity' :
         'New Password'}
      </h2>
      
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      
      <div className="login__extra-links">
        <a href="#" onClick={(e) => { e.preventDefault(); onBackToLogin(); }} className="back-to-login-link">
          <i className="fas fa-arrow-left"></i> Back to Login
        </a>
      </div>
      
      {/* Usar nuestro nuevo modal premium de loading */}
      <AuthLoadingModal 
        isOpen={showAuthModal}
        status={authModalStatus}
        message={authModalMessage}
        onClose={() => setShowAuthModal(false)}
        modalType="recovery"
      />
    </>
  );
};

export default PasswordRecovery;