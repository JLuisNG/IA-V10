import React, { useState, useEffect, useRef } from 'react';
import '../../../styles/developer/support/FloatingSupportButton.scss';
import SupportModal from './SupportModal';
import { useAuth } from '../../login/AuthContext';

const FloatingSupportButton = () => {
  // Estados para controlar las interacciones y animaciones
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: null, y: null });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [animationPhase, setAnimationPhase] = useState('initial');
  const [pulseCount, setPulseCount] = useState(0);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [rippleEffect, setRippleEffect] = useState({ active: false, x: 0, y: 0 });
  const { currentUser } = useAuth();
  
  const buttonRef = useRef(null);
  const dragTimerRef = useRef(null);
  const tooltipTimerRef = useRef(null);
  
  // Obtener el rol del usuario desde el contexto de autenticación
  const userRole = currentUser?.role || 'User';
  const isAdmin = userRole === 'Administrator' || userRole === 'Developer';
  
  // Inicializar la posición del botón desde localStorage o predeterminado
  useEffect(() => {
    const savedPosition = localStorage.getItem('supportButtonPosition');
    
    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition));
      } catch (e) {
        // Fallback a la posición predeterminada
        setPosition({ x: null, y: null });
      }
    }
    
    // Secuencia de animación de entrada
    const entrySequence = async () => {
      // Fase inicial - botón oculto
      setAnimationPhase('initial');
      
      // Fase 1 - Aparecer con efecto de rebote
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnimationPhase('entry');
      
      // Fase 2 - Mostrar pulso
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnimationPhase('pulse');
      
      // Fase 3 - Mostrar tooltip después de un momento
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTooltipVisible(true);
      
      // Fase 4 - Ocultar tooltip después de unos segundos
      await new Promise(resolve => setTimeout(resolve, 5000));
      setTooltipVisible(false);
      
      // Fase 5 - Estado normal con pulso ocasional
      setAnimationPhase('normal');
      
      // Iniciar pulsos ocasionales
      startRandomPulses();
    };
    
    entrySequence();
    
    return () => {
      clearTimeout(tooltipTimerRef.current);
      clearTimeout(dragTimerRef.current);
    };
  }, []);
  
  // Iniciar pulsos aleatorios ocasionales
  const startRandomPulses = () => {
    const scheduleNextPulse = () => {
      const randomDelay = Math.random() * 30000 + 20000; // Entre 20 y 50 segundos
      
      setTimeout(() => {
        if (!isExpanded && !isModalOpen && !isDragging) {
          setPulseCount(prev => prev + 1);
          setAnimationPhase('pulse');
          
          // Volver a normal después del pulso
          setTimeout(() => {
            setAnimationPhase('normal');
            scheduleNextPulse();
          }, 3000);
        } else {
          scheduleNextPulse();
        }
      }, randomDelay);
    };
    
    scheduleNextPulse();
  };
  
  // Manejar movimiento del mouse para arrastrar
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Solo botón izquierdo
    
    const rect = buttonRef.current.getBoundingClientRect();
    const clickThreshold = 5; // Umbral para diferenciar entre clic y arrastre
    
    const initialX = e.clientX;
    const initialY = e.clientY;
    
    // Registrar la posición inicial y offset
    setStartPos({ x: initialX, y: initialY });
    setOffset({
      x: initialX - rect.left,
      y: initialY - rect.top
    });
    
    // Usar un timer para determinar si es un clic o arrastre
    dragTimerRef.current = setTimeout(() => {
      setIsDragging(true);
      document.body.style.cursor = 'grabbing';
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }, 150);
    
    // Registrar eventos para detectar movimiento incluso antes de que se active el timer
    const earlyMoveDetector = (moveEvent) => {
      const diffX = Math.abs(moveEvent.clientX - initialX);
      const diffY = Math.abs(moveEvent.clientY - initialY);
      
      // Si el movimiento supera el umbral, activar inmediatamente el modo de arrastre
      if (diffX > clickThreshold || diffY > clickThreshold) {
        clearTimeout(dragTimerRef.current);
        setIsDragging(true);
        document.body.style.cursor = 'grabbing';
        
        document.removeEventListener('mousemove', earlyMoveDetector);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    };
    
    document.addEventListener('mousemove', earlyMoveDetector);
    
    // Registrar evento de mouse up para limpiar el detector temprano
    const earlyMouseUp = () => {
      document.removeEventListener('mousemove', earlyMoveDetector);
      document.removeEventListener('mouseup', earlyMouseUp);
      
      // Si llegamos aquí sin activar el drag, entonces es un clic
      if (!isDragging) {
        clearTimeout(dragTimerRef.current);
        handleClick(e);
      }
    };
    
    document.addEventListener('mouseup', earlyMouseUp);
    
    e.preventDefault();
  };
  
  // Manejar movimiento del mouse durante el arrastre
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    // Calcular nueva posición
    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;
    
    // Verificar límites de la ventana
    const buttonSize = buttonRef.current.offsetWidth;
    const maxX = window.innerWidth - buttonSize;
    const maxY = window.innerHeight - buttonSize;
    
    // Asegurar que el botón permanezca dentro de la ventana
    const boundedX = Math.max(10, Math.min(maxX - 10, newX));
    const boundedY = Math.max(10, Math.min(maxY - 10, newY));
    
    setPosition({ x: boundedX, y: boundedY });
  };
  
  // Manejar cuando se suelta el botón del mouse
  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    document.body.style.cursor = '';
    
    // Quitar los event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Guardar la posición en localStorage
    if (position.x !== null && position.y !== null) {
      localStorage.setItem('supportButtonPosition', JSON.stringify(position));
    }
    
    // Efecto de "asentamiento" al soltar
    setAnimationPhase('settle');
    setTimeout(() => {
      setAnimationPhase('normal');
    }, 300);
  };
  
  // Manejar eventos táctiles para dispositivos móviles
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const rect = buttonRef.current.getBoundingClientRect();
    
    setStartPos({
      x: touch.clientX,
      y: touch.clientY
    });
    
    setOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    
    // Usar un temporizador para diferenciar tap de arrastre
    dragTimerRef.current = setTimeout(() => {
      setIsDragging(true);
      
      // Efecto visual de "levantamiento"
      setAnimationPhase('lift');
    }, 300);
    
    e.preventDefault();
  };
  
  const handleTouchMove = (e) => {
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    
    // Si aún no estamos en modo arrastre, verificar si el movimiento supera un umbral
    if (!isDragging) {
      const diffX = Math.abs(touch.clientX - startPos.x);
      const diffY = Math.abs(touch.clientY - startPos.y);
      
      // Si supera el umbral, activar modo arrastre
      if (diffX > 10 || diffY > 10) {
        clearTimeout(dragTimerRef.current);
        setIsDragging(true);
      } else {
        return;
      }
    }
    
    // Calcular nueva posición
    const newX = touch.clientX - offset.x;
    const newY = touch.clientY - offset.y;
    
    // Verificar límites de la ventana
    const buttonSize = buttonRef.current.offsetWidth;
    const maxX = window.innerWidth - buttonSize;
    const maxY = window.innerHeight - buttonSize;
    
    // Asegurar que el botón permanezca dentro de la ventana
    const boundedX = Math.max(10, Math.min(maxX - 10, newX));
    const boundedY = Math.max(10, Math.min(maxY - 10, newY));
    
    setPosition({ x: boundedX, y: boundedY });
    e.preventDefault();
  };
  
  const handleTouchEnd = () => {
    // Si no estábamos arrastrando, es un tap
    if (!isDragging) {
      clearTimeout(dragTimerRef.current);
      handleClick();
    } else {
      // Si estábamos arrastrando, finalizar el arrastre
      setIsDragging(false);
      
      // Guardar la posición en localStorage
      if (position.x !== null && position.y !== null) {
        localStorage.setItem('supportButtonPosition', JSON.stringify(position));
      }
      
      // Efecto de "asentamiento" al soltar
      setAnimationPhase('settle');
      setTimeout(() => {
        setAnimationPhase('normal');
      }, 300);
    }
  };
  
  // Manejar clic en el botón
  const handleClick = (e) => {
    if (isDragging) return;
    
    // Crear efecto de ondulación en el punto de clic
    if (e && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setRippleEffect({
        active: true,
        x,
        y
      });
      
      // Resetear el efecto después de la animación
      setTimeout(() => {
        setRippleEffect({ active: false, x: 0, y: 0 });
      }, 800);
    }
    
    // Si está expandido, contraer primero
    if (isExpanded) {
      setIsExpanded(false);
      setTimeout(() => {
        setIsModalOpen(true);
        setHasUnreadNotifications(false);
      }, 300);
    } else {
      setIsModalOpen(true);
      setHasUnreadNotifications(false);
    }
  };
  
  // Manejar mouse enter
  const handleMouseEnter = () => {
    if (isDragging) return;
    
    setIsExpanded(true);
    
    // Mostrar tooltip si no se ha abierto el modal antes
    if (hasUnreadNotifications && !tooltipVisible) {
      tooltipTimerRef.current = setTimeout(() => {
        setTooltipVisible(true);
        
        // Ocultar después de 4 segundos
        setTimeout(() => {
          setTooltipVisible(false);
        }, 4000);
      }, 500);
    }
  };
  
  // Manejar mouse leave
  const handleMouseLeave = () => {
    clearTimeout(tooltipTimerRef.current);
    
    // No contraer inmediatamente para una mejor UX
    setTimeout(() => {
      if (!buttonRef.current?.matches(':hover')) {
        setIsExpanded(false);
        setTooltipVisible(false);
      }
    }, 300);
  };
  
  // Cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  // Calcular posición dinámica del botón
  const buttonStyle = position.x !== null && position.y !== null
    ? { top: `${position.y}px`, left: `${position.x}px` }
    : { bottom: '30px', right: '30px' };
  
  // Determinar clases basadas en el estado
  const buttonClasses = [
    'floating-support-button',
    isExpanded ? 'expanded' : '',
    isDragging ? 'dragging' : '',
    hasUnreadNotifications ? 'has-notifications' : '',
    animationPhase === 'initial' ? 'hidden' : '',
    animationPhase === 'entry' ? 'entry' : '',
    animationPhase === 'pulse' ? 'pulse' : '',
    animationPhase === 'settle' ? 'settle' : '',
    animationPhase === 'lift' ? 'lift' : '',
    isAdmin ? 'admin-mode' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <div 
        ref={buttonRef}
        className={buttonClasses}
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="button-inner">
          <div className="button-icon">
            <i className="fas fa-headset"></i>
          </div>
          
          <div className="button-text">
            <span>Support</span>
            {hasUnreadNotifications && <span className="notification-dot"></span>}
          </div>
          
          {hasUnreadNotifications && (
            <div className="notification-badge">
              <span>1</span>
            </div>
          )}
          
          {rippleEffect.active && (
            <div 
              className="ripple-effect"
              style={{
                left: rippleEffect.x,
                top: rippleEffect.y
              }}
            ></div>
          )}
        </div>
        
        <div className="button-shine"></div>
        
        {/* Indicador de arrastre */}
        <div className="drag-indicator">
          <i className="fas fa-grip-lines"></i>
        </div>
        
        {/* Tooltip emergente */}
        {tooltipVisible && !isModalOpen && (
          <div className="premium-tooltip">
            <div className="tooltip-content">
              <i className="fas fa-info-circle"></i>
              <p>Need assistance? Our support team is ready to help!</p>
            </div>
            <div className="tooltip-arrow"></div>
          </div>
        )}
      </div>
      
      {/* Modal de soporte premium */}
      <SupportModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        userRole={userRole}
      />
    </>
  );
};

export default FloatingSupportButton;