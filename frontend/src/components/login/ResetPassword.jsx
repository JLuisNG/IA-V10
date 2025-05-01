import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PasswordRecoveryService from './PasswordRecoveryService';
import logoImg from '../../assets/LogoMHC.jpeg';
import AuthLoadingModal from './AuthLoadingModal';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extraer token de los parámetros de URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [formState, setFormState] = useState({
    isValidToken: false,
    isTokenChecking: true,
    tokenError: '',
    email: '',
    errors: {
      password: '',
      confirmPassword: '',
      general: ''
    },
    passwordStrength: {
      value: 0, // 0-100
      label: 'Weak'
    },
    showPassword: false
  });
  
  // Estado para el modal de carga
  const [loadingModal, setLoadingModal] = useState({
    isOpen: false,
    status: 'loading',
    message: ''
  });
  
  // Verificar token al cargar el componente
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setFormState(prev => ({
          ...prev,
          isTokenChecking: false,
          isValidToken: false,
          tokenError: 'Missing reset token'
        }));
        return;
      }
      
      try {
        const verification = await PasswordRecoveryService.verifyRecoveryToken(token);
        
        if (verification.valid) {
          setFormState(prev => ({
            ...prev,
            isTokenChecking: false,
            isValidToken: true,
            email: verification.email
          }));
        } else {
          setFormState(prev => ({
            ...prev,
            isTokenChecking: false,
            isValidToken: false,
            tokenError: verification.error || 'Invalid reset token'
          }));
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setFormState(prev => ({
          ...prev,
          isTokenChecking: false,
          isValidToken: false,
          tokenError: 'An error occurred while verifying your reset token'
        }));
      }
    };
    
    verifyToken();
  }, [token]);
  
  // Manejar cambios en los campos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores
    setFormState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [name]: '',
        general: ''
      }
    }));
    
    // Calcular fuerza de contraseña si es el campo de contraseña
    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setFormState(prev => ({
        ...prev,
        passwordStrength: strength
      }));
    }
  };
  
  // Calcular fuerza de contraseña
  const calculatePasswordStrength = (password) => {
    if (!password) {
      return { value: 0, label: 'Weak' };
    }
    
    let strength = 0;
    
    // Longitud
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    
    // Complejidad
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[a-z]/.test(password)) strength += 10;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    // Determinar etiqueta
    let label = 'Weak';
    if (strength >= 80) label = 'Very Strong';
    else if (strength >= 60) label = 'Strong';
    else if (strength >= 40) label = 'Medium';
    else if (strength >= 20) label = 'Weak';
    
    return { value: strength, label };
  };
  
  // Validar formulario
  const validateForm = () => {
    const errors = {
      password: '',
      confirmPassword: '',
      general: ''
    };
    let isValid = true;
    
    // Validar contraseña
    if (!formData.password) {
        errors.password = 'Password is required';
        isValid = false;
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
        isValid = false;
      } else if (!/[A-Z]/.test(formData.password)) {
        errors.password = 'Password must contain at least one uppercase letter';
        isValid = false;
      } else if (!/[0-9]/.test(formData.password)) {
        errors.password = 'Password must contain at least one number';
        isValid = false;
      }
      
      // Validar confirmación de contraseña
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
        isValid = false;
      } else if (formData.confirmPassword !== formData.password) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
      
      setFormState(prev => ({
        ...prev,
        errors
      }));
      
      return isValid;
    };
    
    // Manejar envío del formulario
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validar formulario
      if (!validateForm()) {
        return;
      }
      
      // Mostrar modal de carga
      setLoadingModal({
        isOpen: true,
        status: 'loading',
        message: 'Resetting your password...'
      });
      
      try {
        // Iniciar proceso de restablecimiento
        const resetResult = await PasswordRecoveryService.resetPassword(
          token,
          formData.password
        );
        
        if (resetResult.success) {
          // Actualizar modal a éxito
          setLoadingModal({
            isOpen: true,
            status: 'success',
            message: 'Your password has been reset successfully! You can now log in with your new password.'
          });
          
          // Redirigir al login después de un tiempo
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          // Mostrar error
          setLoadingModal({
            isOpen: false
          });
          
          setFormState(prev => ({
            ...prev,
            errors: {
              ...prev.errors,
              general: resetResult.error || 'Failed to reset password'
            }
          }));
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        
        // Cerrar modal y mostrar error
        setLoadingModal({
          isOpen: false
        });
        
        setFormState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            general: 'An unexpected error occurred. Please try again.'
          }
        }));
      }
    };
    
    // Alternar visibilidad de contraseña
    const togglePasswordVisibility = () => {
      setFormState(prev => ({
        ...prev,
        showPassword: !prev.showPassword
      }));
    };
    
    // Redirigir al login
    const handleBackToLogin = () => {
      navigate('/');
    };
    
    // Si aún está verificando el token
    if (formState.isTokenChecking) {
      return (
        <div className="reset-password__loading">
          <div className="login__logo">
            <img src={logoImg} alt="Motive Homecare Logo" className="login__logo-img" />
          </div>
          
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p>Verifying your reset link...</p>
        </div>
      );
    }
    
    // Si el token no es válido
    if (!formState.isValidToken) {
      return (
        <div className="reset-password__invalid">
          <div className="login__logo">
            <img src={logoImg} alt="Motive Homecare Logo" className="login__logo-img" />
          </div>
          
          <div className="invalid-token-container">
            <div className="invalid-token-icon">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <h2>Invalid Reset Link</h2>
            <p>{formState.tokenError || 'The password reset link is invalid or has expired.'}</p>
            <p>Please request a new password reset link.</p>
            
            <button 
              className="reset-password__button" 
              onClick={handleBackToLogin}
            >
              Back to Login
            </button>
          </div>
        </div>
      );
    }
    
    // Formulario principal de restablecimiento
    return (
      <>
        <div className="login__logo">
          <img src={logoImg} alt="Motive Homecare Logo" className="login__logo-img" />
        </div>
        
        <h2 className="login__title">Reset Your Password</h2>
        
        <div className="reset-password__info">
          <p>Creating a new password for: <strong>{formState.email}</strong></p>
        </div>
        
        {formState.errors.general && (
          <div className="reset-password__error-message">
            <i className="fas fa-exclamation-circle"></i>
            {formState.errors.general}
          </div>
        )}
        
        <form id="resetPasswordForm" className="login__form" onSubmit={handleSubmit}>
          <div className={`login__form-group ${formState.errors.password ? 'error' : ''}`}>
            <label htmlFor="password" className="login__label">
              <i className="fas fa-lock"></i>
              New Password
            </label>
            <div className="login__input-wrapper password-input-wrapper">
              <input 
                type={formState.showPassword ? "text" : "password"} 
                id="password" 
                name="password" 
                className="login__input" 
                placeholder="Enter new password" 
                value={formData.password}
                onChange={handleInputChange}
                required 
              />
              <button 
                type="button" 
                className="password-toggle-button" 
                onClick={togglePasswordVisibility}
              >
                <i className={`fas ${formState.showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar-container">
                  <div 
                    className={`strength-bar strength-${formState.passwordStrength.label.toLowerCase().replace(' ', '-')}`}
                    style={{ width: `${formState.passwordStrength.value}%` }}
                  ></div>
                </div>
                <div className="strength-text">
                  {formState.passwordStrength.label}
                </div>
              </div>
            )}
            
            <div className="login__error-message">
              {formState.errors.password || "Choose a strong password with at least 8 characters"}
            </div>
            
            <div className="password-requirements">
              <div className={`requirement ${formData.password && formData.password.length >= 8 ? 'met' : ''}`}>
                <i className={`fas ${formData.password && formData.password.length >= 8 ? 'fa-check-circle' : 'fa-circle'}`}></i>
                <span>At least 8 characters</span>
              </div>
              <div className={`requirement ${/[A-Z]/.test(formData.password) ? 'met' : ''}`}>
                <i className={`fas ${/[A-Z]/.test(formData.password) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                <span>One uppercase letter</span>
              </div>
              <div className={`requirement ${/[0-9]/.test(formData.password) ? 'met' : ''}`}>
                <i className={`fas ${/[0-9]/.test(formData.password) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                <span>One number</span>
              </div>
            </div>
          </div>
          
          <div className={`login__form-group ${formState.errors.confirmPassword ? 'error' : ''}`}>
            <label htmlFor="confirmPassword" className="login__label">
              <i className="fas fa-lock"></i>
              Confirm Password
            </label>
            <div className="login__input-wrapper">
              <input 
                type={formState.showPassword ? "text" : "password"} 
                id="confirmPassword" 
                name="confirmPassword" 
                className="login__input" 
                placeholder="Confirm your password" 
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="login__error-message">
              {formState.errors.confirmPassword || "Re-enter your password to confirm"}
            </div>
          </div>
          
          <button 
            type="submit" 
            className="login__button"
          >
            RESET PASSWORD
          </button>
        </form>
        
        <div className="login__extra-links">
          <button className="login__link" onClick={handleBackToLogin}>
            <i className="fas fa-arrow-left"></i> Back to Login
          </button>
        </div>
        
        {/* Modal de carga */}
        <AuthLoadingModal 
          isOpen={loadingModal.isOpen}
          status={loadingModal.status}
          message={loadingModal.message}
          onClose={() => setLoadingModal({ isOpen: false })}
        />
      </>
    );
  };
  
  export default ResetPassword;