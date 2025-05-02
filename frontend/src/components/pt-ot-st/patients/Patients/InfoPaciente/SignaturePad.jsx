import React, { useState, useRef, useEffect } from 'react';
import '../../../../../styles/developer/Patients/InfoPaciente/SignaturePad.scss';

const SignaturePad = ({ label, onSignatureChange, initialSignature, disabled }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [isEmpty, setIsEmpty] = useState(true);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas dimensions to match container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const context = canvas.getContext('2d');
    setCtx(context);
    
    // Set default styles
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#333';
    
    // If there's an initial signature, draw it
    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);
        setIsEmpty(false);
      };
      img.src = initialSignature;
    }
    
    // Clean up
    return () => {
      // No specific cleanup needed for canvas
    };
  }, [initialSignature]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !ctx) return;
      
      // Save current signature
      const dataURL = canvas.toDataURL();
      
      // Resize canvas
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Restore signature
      if (!isEmpty) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = dataURL;
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ctx, isEmpty]);

  // Start drawing
  const startDrawing = (e) => {
    if (disabled) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  // Continue drawing
  const draw = (e) => {
    if (!isDrawing || disabled) return;
    
    const { offsetX, offsetY } = getCoordinates(e);
    
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  // Stop drawing
  const stopDrawing = () => {
    if (!isDrawing) return;
    
    ctx.closePath();
    setIsDrawing(false);
    
    // Send signature data to parent component
    if (canvasRef.current && onSignatureChange) {
      onSignatureChange(canvasRef.current.toDataURL());
    }
  };

  // Get coordinates for both mouse and touch events
  const getCoordinates = (e) => {
    if (e.nativeEvent.offsetX !== undefined) {
      // Mouse event
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY
      };
    } else {
      // Touch event
      const rect = canvasRef.current.getBoundingClientRect();
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
      };
    }
  };

  // Clear the signature
  const clearSignature = () => {
    if (!ctx || disabled) return;
    
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setIsEmpty(true);
    
    // Notify parent that signature was cleared
    if (onSignatureChange) {
      onSignatureChange(null);
    }
  };

  return (
    <div className={`signature-pad ${disabled ? 'disabled' : ''}`}>
      <div className="signature-label">{label}</div>
      <div className="signature-container">
        <canvas
          ref={canvasRef}
          className="signature-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {isEmpty && !disabled && (
          <div className="signature-placeholder">
            Sign here
          </div>
        )}
        {disabled && (
          <div className="signature-disabled-overlay">
            <i className="fas fa-lock"></i>
            <span>Signature capture disabled</span>
          </div>
        )}
      </div>
      {!disabled && (
        <button
          className="clear-signature-btn"
          onClick={clearSignature}
          disabled={isEmpty}
          type="button"
        >
          <i className="fas fa-eraser"></i> Clear
        </button>
      )}
    </div>
  );
};

export default SignaturePad;