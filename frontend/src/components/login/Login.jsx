import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLoadingModal from './AuthLoadingModal';
import logoImg from '../../assets/LogoMHC.jpeg';
import { useAuth } from './AuthContext';

const Login = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: false, password: false, message: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, status: 'loading', message: '' });

  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setFormData(prev => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const showError = (field, message) => {
    setErrors({ ...errors, [field]: true, message });
    const element = document.getElementById(`${field}Group`);
    if (element) {
      element.classList.add('form-pulse');
      setTimeout(() => element.classList.remove('form-pulse'), 500);
    }
  };

  const validateForm = () => {
    let isValid = true;
    if (formData.username.trim() === '') {
      showError('username', 'Username cannot be empty');
      isValid = false;
    }
    if (formData.password === '') {
      showError('password', 'Password cannot be empty');
      isValid = false;
    }
    return isValid;
  };

  const closeAuthModal = () => setAuthModal(prev => ({ ...prev, isOpen: false }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    console.log("🟡 Attempting login with:", formData);
  
    setAuthModal({
      isOpen: true,
      status: 'loading',
      message: 'Verifying credentials...'
    });
  
    try {
      // Paso 1: Login con backend
      const loginRes = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });
  
      const loginText = await loginRes.text();
      console.log("🔵 Login Response:", loginRes.status, loginText);
  
      if (!loginRes.ok) {
        throw new Error(`Login failed: ${loginRes.status} - ${loginText}`);
      }
  
      const loginData = JSON.parse(loginText);
      const token = loginData.access_token;
      console.log("🟢 Token received:", token);
  
      const payload = JSON.parse(atob(token.split('.')[1]));
      const username = payload.sub;
      console.log("🔍 Decoded token username:", username);
  
      // Paso 2: Obtener todos los staff y buscar el actual
      const allStaffRes = await fetch('http://localhost:8000/staff/', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const staffText = await allStaffRes.text();
      console.log("📦 All staff response:", allStaffRes.status, staffText);
  
      if (!allStaffRes.ok) {
        throw new Error(`Failed to fetch staff list: ${allStaffRes.status} - ${staffText}`);
      }
  
      const allStaff = JSON.parse(staffText);
      const userData = allStaff.find(u => u.username === username);
  
      if (!userData) {
        throw new Error("User not found in staff list");
      }
  
      console.log("✅ Matched user from staff list:", userData);
  
      // Guardar token y user
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', formData.username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
  
      // Paso 3: Login dentro del contexto
      const loginResult = await login({
        success: true,
        token,
        user: userData
      });
  
      if (!loginResult.success) {
        throw new Error('Login rejected by context: ' + loginResult.error);
      }
  
      setAuthModal({
        isOpen: true,
        status: 'success',
        message: 'Authentication successful! Redirecting...'
      });
  
      const baseRole = userData.role.split(' - ')[0].toLowerCase();
      setTimeout(() => navigate(`/${baseRole}/homePage`), 2000);
  
    } catch (err) {
      console.error("🔴 Login Error:", err);
      setAuthModal({
        isOpen: true,
        status: 'error',
        message: err.message || 'Login failed'
      });
    }
  };  
  
  return (
    <>
      <div className="login__logo">
        <img src={logoImg} alt="Motive Homecare Logo" className="login__logo-img" />
      </div>

      <h2 className="login__title">Login</h2>

      <form className="login__form" onSubmit={handleSubmit}>
        <div className={`login__form-group ${errors.username ? 'error' : ''}`} id="usernameGroup">
          <label htmlFor="username" className="login__label">
            <i className="fas fa-user"></i> Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="login__input"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          {errors.username && <div className="login__error-message">{errors.message}</div>}
        </div>

        <div className={`login__form-group ${errors.password ? 'error' : ''}`} id="passwordGroup">
          <label htmlFor="password" className="login__label">
            <i className="fas fa-lock"></i> Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="login__input"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {errors.password && <div className="login__error-message">{errors.message}</div>}
        </div>

        <label className="custom-checkbox">
          <input type="checkbox" checked={rememberMe} onChange={handleRememberMeChange} />
          <span className="checkmark"></span> Remember me
        </label>

        <button type="submit" className="login__button">LOG IN</button>
      </form>

      <div className="login__extra-links">
        <a href="#" onClick={(e) => { e.preventDefault(); onForgotPassword(e); }}>
          Forgot your password?
        </a>
      </div>

      <AuthLoadingModal {...authModal} onClose={closeAuthModal} />
    </>
  );
};

export default Login;
