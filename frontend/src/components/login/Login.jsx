// components/login/Login.jsx (dentro de Login.jsx o el componente que maneje el login)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLoadingModal from './AuthLoadingModal';
import AccountLockoutModal from './AccountLockoutModal'; // Nuevo componente
import logoImg from '../../assets/LogoMHC.jpeg';
import { useAuth } from './AuthContext';
import AccountLockoutService from './AccountLockoutService'; // Nuevo servicio

const Login = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Usar el contexto de autenticación
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    username: false,
    password: false,
    message: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  
  // Estado para el modal de carga
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    status: 'loading',
    message: ''
  });
  
  // Estado para el modal de bloqueo de cuenta
  const [lockoutModal, setLockoutModal] = useState({
    isOpen: false,
    username: '',
    remainingTime: 0
  });

  // Lista de credenciales válidas con datos completos (solo en el código, no en la UI)
  const validCredentials = [
    { 
      username: "JLuis09", 
      password: "Kariokito12",
      fullname: "Luis Nava",
      email: "jluis@example.com",
      role: "Developer",
      contact_number: "555-123-4567",
      documents: "ID-12345",
      zip_code: "90210",
      birth_date: "1990-05-15"
    },
    { 
      username: "Javi1", 
      password: "JavierVargas12",
      fullname: "Javier Vargas",
      email: "javier@example.com",
      role: "Administrator",
      contact_number: "555-987-6543",
      documents: "ID-54321",
      zip_code: "90211",
      birth_date: "1985-10-20"
    },
    { 
      username: "AlexM1", 
      password: "AlexMar09",
      fullname: "Alex Martinez",
      email: "Alex@example.com",
      role: "PT",
      contact_number: "555-987-6543",
      documents: "ID-54321",
      zip_code: "90211",
      birth_date: "1985-10-20"
    },
    {
      username: "Justin1", 
      password: "Justin12",
      fullname: "Justin Shimane",
      email: "Justin@example.com",
      role: "OT",
      contact_number: "555-987-6543",
      documents: "ID-54321",
      zip_code: "90211",
      birth_date: "1985-10-20"
    },
    {
      username: "Arya1", 
      password: "Arya12",
      fullname: "Arya Pedoiem",
      email: "arya@example.com",
      role: "ST",
      contact_number: "555-987-6543",
      documents: "ID-54321",
      zip_code: "90211",
      birth_date: "1985-10-20"
    },
    {
      username: "Cohen1", 
      password: "Cohen12*",
      fullname: "Cohen N",
      email: "Cohen@example.com",
      role: "Administrator",
      contact_number: "555-987-6543",
      documents: "ID-54321",
      zip_code: "90211",
      birth_date: "1985-10-20"
    
    },
    {
      username: "Carlo1", 
      password: "Carlo12*",
      fullname: "Carlo Gianzon",
      email: "Carlo@example.com",
      role: "PTA",
      contact_number: "555-987-6543",
      documents: "ID-54321",
      zip_code: "90211",
      birth_date: "1985-10-20"
    },
    {
      username: "Supportive1*",
      password: "Supportive1",
      fullname: "Supportive Home Health",
      email: "agency@example.com",
      role: "Agency",
      contact_number: "555-456-7890",
      documents: "ID-67890",
      zip_code: "90212",
      birth_date: "1980-01-01"
    }
  ];

  // Comprobar el localStorage al cargar
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setFormData(prev => ({
        ...prev,
        username: savedUsername
      }));
      setRememberMe(true);
    }
    
    // Verificar si hay un bloqueo activo para el usuario guardado
    if (savedUsername) {
      const lockStatus = AccountLockoutService.checkAccountLocked(savedUsername);
      if (lockStatus.isLocked) {
        setLockoutModal({
          isOpen: true,
          username: savedUsername,
          remainingTime: lockStatus.remainingTime
        });
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: false
      });
    }
    
    // Si el usuario cambia el nombre de usuario, verificar bloqueos
    if (name === 'username' && value) {
      const lockStatus = AccountLockoutService.checkAccountLocked(value);
      if (lockStatus.isLocked) {
        setLockoutModal({
          isOpen: true,
          username: value,
          remainingTime: lockStatus.remainingTime
        });
      }
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const showError = (field, message) => {
    setErrors({
      ...errors,
      [field]: true,
      message: message
    });
    
    // Efecto de pulsación
    const element = document.getElementById(`${field}Group`);
    if (element) {
      element.classList.add("form-pulse");
      setTimeout(() => {
        element.classList.remove("form-pulse");
      }, 500);
    }
  };

  const showSuccess = (field) => {
    const element = document.getElementById(`${field}Group`);
    if (element) {
      element.classList.remove("error");
      element.classList.add("success");
    }
  };

  const validateForm = () => {
    let isValid = true;
    
    if (formData.username.trim() === "") {
      showError('username', "Username cannot be empty");
      isValid = false;
    }
    
    if (formData.password === "") {
      showError('password', "Password cannot be empty");
      isValid = false;
    }
    
    return isValid; 
  };
  
  // Función para cerrar el modal
  const closeAuthModal = () => {
    setAuthModal({
      ...authModal,
      isOpen: false
    });
  };
  
  // Función para cerrar el modal de bloqueo
  const closeLockoutModal = () => {
    setLockoutModal({
      ...lockoutModal,
      isOpen: false
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar el formulario
    if (!validateForm()) {
      return;
    }
    
    // Verificar si la cuenta está bloqueada
    const lockStatus = AccountLockoutService.checkAccountLocked(formData.username);
    if (lockStatus.isLocked) {
      setLockoutModal({
        isOpen: true,
        username: formData.username,
        remainingTime: lockStatus.remainingTime
      });
      return;
    }
    
    // Verificar credenciales
    const user = validCredentials.find(
      cred => cred.username === formData.username && cred.password === formData.password
    );
    
    // Si las credenciales no son válidas, mostrar error
    if (!user) {
      // Registrar intento fallido
      const lockoutStatus = AccountLockoutService.recordFailedAttempt(formData.username);
      
      // Mostrar mensaje de error con intentos restantes
      const errorMessage = lockoutStatus.isLocked 
        ? "Account locked due to too many failed attempts" 
        : `Invalid username or password. ${lockoutStatus.attemptsRemaining} attempts remaining before lockout.`;
      
      showError('username', errorMessage);
      showError('password', errorMessage);
      
      // Efecto visual para errores
      document.querySelectorAll(".login__input").forEach(input => {
        input.classList.add("shake-error");
        setTimeout(() => {
          input.classList.remove("shake-error");
        }, 500);
      });
      
      // Si la cuenta ha sido bloqueada, mostrar el modal de bloqueo
      if (lockoutStatus.isLocked) {
        setLockoutModal({
          isOpen: true,
          username: formData.username,
          remainingTime: lockoutStatus.remainingTime
        });
      }
      
      return;
    }
    
    // Credenciales correctas: registrar inicio de sesión exitoso
    AccountLockoutService.recordSuccessfulLogin(formData.username);
    
    // Manejar "Remember Me"
    if (rememberMe) {
      localStorage.setItem('rememberedUsername', formData.username);
    } else {
      localStorage.removeItem('rememberedUsername');
    }
    
    // Si las credenciales son válidas, mostrar el modal de carga
    setAuthModal({
      isOpen: true,
      status: 'loading',
      message: 'Verifying credentials...'
    });
    
    // Simulación del proceso de autenticación exitoso
    setTimeout(() => {
      // Construir un objeto de usuario con todos los datos del usuario
      const userData = {
        id: Math.floor(Math.random() * 1000) + 1, // ID simulado
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        contact_number: user.contact_number,
        documents: user.documents,
        zip_code: user.zip_code,
        birth_date: user.birth_date,
        last_login: new Date().toISOString()
      };
      
      // Guardar datos en el contexto de autenticación
      login({
        success: true,
        token: "simulated_token_" + Date.now(),
        user: userData
      });
      
      // Actualizar modal a éxito
      setAuthModal({
        isOpen: true,
        status: 'success',
        message: 'Authentication successful! Redirecting...'
      });
      
      // Mostrar efecto de éxito en los campos
      showSuccess('username');
      showSuccess('password');
      
      // Extraer el rol base y dirigir al usuario a su interfaz específica
      const baseRole = user.role.split(' - ')[0].toLowerCase();
      
      // Redirigir después de mostrar el mensaje de éxito
      setTimeout(() => {
        navigate(`/${baseRole}/homePage`);
      }, 2000);
    }, 2500);
  };

  return (
    <>
      <div className="login__logo">
        <img src={logoImg} alt="Motive Homecare Logo" className="login__logo-img" />
      </div>
      
      <h2 className="login__title">Login</h2>
      
      <form id="loginForm" className="login__form" onSubmit={handleSubmit}>
        <div className={`login__form-group ${errors.username ? 'error' : ''}`} id="usernameGroup">
          <label htmlFor="username" className="login__label">
            <i className="fas fa-user"></i>
            Username
          </label>
          <div className="login__input-wrapper">
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
          </div>
          <div className="login__error-message">
            {errors.username ? errors.message : "Please enter a valid username"}
          </div>
        </div>
        
        <div className={`login__form-group ${errors.password ? 'error' : ''}`} id="passwordGroup">
          <label htmlFor="password" className="login__label">
            <i className="fas fa-lock"></i>
            Password
          </label>
          <div className="login__input-wrapper">
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
          </div>
          <div className="login__error-message">
            {errors.password ? errors.message : "Please enter a valid password"}
          </div>
        </div>
        
        {/* Checkbox clickeable mejorado */}
        <div className="login__checkbox-group">
          <label className="custom-checkbox">
            <input 
              type="checkbox" 
              id="rememberMe"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            <span className="checkmark"></span>
            <span>Remember me</span>
          </label>
        </div>
        
        <button type="submit" className="login__button">LOG IN</button>
      </form>
      
      {/* Enlace de forgot password mejorado */}
      <div className="login__extra-links">
        <a href="#" className="forgot-password-link" onClick={(e) => {
          e.preventDefault();
          onForgotPassword(e);
        }}>
          Forgot your password?
        </a>
      </div>
      
      {/* Modal de carga para autenticación */}
      <AuthLoadingModal 
        isOpen={authModal.isOpen}
        status={authModal.status}
        message={authModal.message}
        onClose={closeAuthModal}
      />
      
      {/* Modal de bloqueo de cuenta */}
      <AccountLockoutModal
        isOpen={lockoutModal.isOpen}
        username={lockoutModal.username}
        remainingTime={lockoutModal.remainingTime}
        onClose={closeLockoutModal}
      />
    </>
  );
};

export default Login;