import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import logoImg from '../../assets/LogoMHC.jpeg';

const ResetVerifyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  const [verifyState, setVerifyState] = useState({
    isLoading: true,
    isValid: false,
    error: null
  });
  
  // Efecto para iniciar verificación
  useEffect(() => {
    // Si no hay token en la URL, redirigir al login
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    
    if (!token) {
      setVerifyState({
        isLoading: false,
        isValid: false,
        error: 'Missing reset token'
      });
      
      // Redirigir después de un tiempo
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else {
      // Si hay token, mostrar componente de restablecimiento
      setVerifyState({
        isLoading: false,
        isValid: true,
        error: null
      });
    }
  }, [location, navigate]);
  
  // Renderizar según estado
  if (verifyState.isLoading) {
    return (
      <div className="page">
        <div className="page__background">
          {/* Fondo similar al login */}
        </div>
        
        <div className="login-container">
          <div className="login-card">
            <div className="login-card__front">
              <div className="reset-password__loading">
                <div className="login__logo">
                  <img src={logoImg} alt="Motive Homecare Logo" className="login__logo-img" />
                </div>
                
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
                <p>Verifying reset link...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!verifyState.isValid) {
    return (
      <div className="page">
        <div className="page__background">
          {/* Fondo similar al login */}
        </div>
        
        <div className="login-container">
          <div className="login-card">
            <div className="login-card__front">
              <div className="reset-password__invalid">
                <div className="login__logo">
                  <img src={logoImg} alt="Motive Homecare Logo" className="login__logo-img" />
                </div>
                
                <div className="invalid-token-container">
                  <div className="invalid-token-icon">
                    <i className="fas fa-exclamation-circle"></i>
                  </div>
                  <h2>Invalid Reset Link</h2>
                  <p>{verifyState.error || 'The password reset link is invalid or has expired.'}</p>
                  <p>Redirecting to login page...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Si el token es válido, mostrar formulario de restablecimiento
  return (
    <div className="page">
      <div className="page__background">
        {/* Fondo similar al login */}
      </div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-card__front reset-password">
            <ResetPassword />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetVerifyPage;