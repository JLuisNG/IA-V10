// Enhanced SignaturePad.jsx
import React, { useRef, useState, useEffect } from 'react';
import '../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/SignaturePad.scss';

const SignaturePad = ({ 
  label = 'SIGN', 
  onSignatureChange, 
  initialSignature = null,
  disabled = false 
}) => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [hasSignature, setHasSignature] = useState(!!initialSignature);
  const [useUpload, setUseUpload] = useState(false);
  const [fileName, setFileName] = useState('');
  const [canvasLoaded, setCanvasLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize the canvas
  useEffect(() => {
    if (useUpload) return; // Skip canvas initialization if in upload mode

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    const canvasWidth = canvas.parentElement.clientWidth;
    const canvasHeight = 150;

    // Handle pixel ratio for high-DPI screens
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * pixelRatio;
    canvas.height = canvasHeight * pixelRatio;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    // Set up canvas context
    const ctx = canvas.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#334155';
    setContext(ctx);
    setCanvasLoaded(true);

    // Load initial signature if provided
    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        // Scale the image to fit the canvas while maintaining aspect ratio
        const aspectRatio = img.width / img.height;
        let drawWidth = canvasWidth;
        let drawHeight = canvasHeight;
        if (aspectRatio > canvasWidth / canvasHeight) {
          drawHeight = canvasWidth / aspectRatio;
        } else {
          drawWidth = canvasHeight * aspectRatio;
        }
        
        // Clear the canvas first
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Load the image with a fade-in animation
        setIsAnimating(true);
        setTimeout(() => {
          ctx.globalAlpha = 1;
          ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
          setHasSignature(true);
          setIsAnimating(false);
        }, 300);
      };
      img.src = initialSignature;
    }

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [initialSignature, useUpload]);

  // Handle mouse down to start drawing
  const handleMouseDown = (e) => {
    if (disabled || useUpload) return;

    const canvas = canvasRef.current;
    if (!canvas || !context) return;

    setIsDrawing(true);

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width / (window.devicePixelRatio || 1));
    const y = (e.clientY - rect.top) * (canvas.height / rect.height / (window.devicePixelRatio || 1));

    context.beginPath();
    context.moveTo(x, y);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Handle mouse move to draw
  const handleMouseMove = (e) => {
    if (!isDrawing || !context) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width / (window.devicePixelRatio || 1));
    const y = (e.clientY - rect.top) * (canvas.height / rect.height / (window.devicePixelRatio || 1));

    context.lineTo(x, y);
    context.stroke();
  };

  // Handle mouse up to stop drawing
  const handleMouseUp = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    setHasSignature(true);
    saveSignature();

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  // Handle touch start to start drawing
  const handleTouchStart = (e) => {
    if (disabled || useUpload) return;

    const canvas = canvasRef.current;
    if (!canvas || !context) return;

    e.preventDefault();
    setIsDrawing(true);

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) * (canvas.width / rect.width / (window.devicePixelRatio || 1));
    const y = (touch.clientY - rect.top) * (canvas.height / rect.height / (window.devicePixelRatio || 1));

    context.beginPath();
    context.moveTo(x, y);

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  };

  // Handle touch move to draw
  const handleTouchMove = (e) => {
    if (!isDrawing || !context) return;

    e.preventDefault();

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) * (canvas.width / rect.width / (window.devicePixelRatio || 1));
    const y = (touch.clientY - rect.top) * (canvas.height / rect.height / (window.devicePixelRatio || 1));

    context.lineTo(x, y);
    context.stroke();
  };

  // Handle touch end to stop drawing
  const handleTouchEnd = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    setHasSignature(true);
    saveSignature();

    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  };

  // Clear the signature with animation
  const clearSignature = () => {
    if (disabled) return;

    // If in drawing mode, clear the canvas with animation
    if (!useUpload) {
      const canvas = canvasRef.current;
      if (canvas && context) {
        setIsAnimating(true);
        
        // Fade out animation
        let opacity = 1;
        const fadeOut = () => {
          opacity -= 0.1;
          context.clearRect(0, 0, canvas.width, canvas.height);
          
          if (opacity <= 0) {
            setIsAnimating(false);
            setHasSignature(false);
            if (onSignatureChange) {
              onSignatureChange(null);
            }
            return;
          }
          
          requestAnimationFrame(fadeOut);
        };
        
        fadeOut();
      }
    } else {
      // If in upload mode, just clear the data
      setHasSignature(false);
      setUseUpload(false);
      setFileName('');

      if (onSignatureChange) {
        onSignatureChange(null);
      }
    }
  };

  // Save the signature as a data URL
  const saveSignature = () => {
    if (useUpload) return; // Skip saving canvas data if in upload mode

    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL('image/png');
    if (onSignatureChange) {
      onSignatureChange(signatureData);
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    // Check if the file is an image
    const isImage = file.type.startsWith('image/');
    
    if (isImage) {
      // If it's an image, render it on the canvas
      const reader = new FileReader();
      reader.onload = (event) => {
        // Temporarily switch to drawing mode to render the image on the canvas
        setUseUpload(false);
        setTimeout(() => {
          const canvas = canvasRef.current;
          if (!canvas || !context) return;

          const img = new Image();
          img.onload = () => {
            const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
            const canvasHeight = canvas.height / (window.devicePixelRatio || 1);
            const aspectRatio = img.width / img.height;
            let drawWidth = canvasWidth;
            let drawHeight = canvasHeight;
            if (aspectRatio > canvasWidth / canvasHeight) {
              drawHeight = canvasWidth / aspectRatio;
            } else {
              drawWidth = canvasHeight * aspectRatio;
            }
            
            // Clear the canvas first
            context.clearRect(0, 0, canvasWidth, canvasHeight);
            
            // Fade in the image
            setIsAnimating(true);
            let opacity = 0;
            const fadeIn = () => {
              opacity += 0.1;
              context.clearRect(0, 0, canvasWidth, canvasHeight);
              context.globalAlpha = opacity;
              context.drawImage(img, 0, 0, drawWidth, drawHeight);
              
              if (opacity >= 1) {
                setIsAnimating(false);
                setHasSignature(true);
                saveSignature();
                // Switch back to upload mode after rendering
                setUseUpload(true);
                return;
              }
              
              requestAnimationFrame(fadeIn);
            };
            
            fadeIn();
          };
          img.src = event.target.result;
        }, 0);
      };
      reader.readAsDataURL(file);
    } else {
      // If it's not an image, store the file data as a signature reference
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target.result;
        if (onSignatureChange) {
          onSignatureChange(fileData);
        }
        setHasSignature(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    if (disabled) return;
    fileInputRef.current.click();
  };

  return (
    <div className={`signature-pad ${disabled ? 'disabled' : ''} ${hasSignature ? 'has-content' : ''}`}>
      <div className="signature-header">
        <h3 className="signature-title">
          <i className="fas fa-signature"></i>
          Signature
        </h3>
        <div className="signature-options">
          <label className="upload-toggle">
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={useUpload}
                onChange={(e) => {
                  setUseUpload(e.target.checked);
                  if (!e.target.checked) {
                    clearSignature();
                  }
                }}
                disabled={disabled}
              />
              <span className="toggle-slider"></span>
            </div>
            <span className="toggle-label">Captured signature outside of system</span>
          </label>
        </div>
      </div>

      <div className={`signature-area ${isAnimating ? 'animating' : ''}`}>
        {useUpload ? (
          <div className="upload-area">
            {fileName ? (
              <div className="file-preview">
                <i className="fas fa-file-signature"></i>
                <div className="file-info">
                  <span className="file-name">{fileName}</span>
                  <span className="file-status">File uploaded successfully</span>
                </div>
                <button className="change-file-btn" onClick={handleUploadClick} disabled={disabled}>
                  <i className="fas fa-exchange-alt"></i>
                </button>
              </div>
            ) : (
              <>
                <div className="upload-icon">
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
                <div className="upload-text">
                  <h4>Upload Signature File</h4>
                  <p>Drag and drop a file here or click to browse</p>
                </div>
                <button
                  className="upload-btn"
                  onClick={handleUploadClick}
                  disabled={disabled}
                >
                  <i className="fas fa-file-upload"></i>
                  Browse Files
                </button>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              accept="image/*,.pdf"
            />
          </div>
        ) : (
          <>
            <div className="canvas-container">
              <canvas
                ref={canvasRef}
                className={`signature-canvas ${hasSignature ? 'has-signature' : ''} ${isDrawing ? 'is-drawing' : ''}`}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              />
              {!hasSignature && canvasLoaded && (
                <div className="canvas-placeholder">
                  <i className="fas fa-pen"></i>
                  <span>Draw your signature here</span>
                </div>
              )}
            </div>
            <div className="signature-guidelines">
              <div className="guideline-item">
                <i className="fas fa-mouse-pointer"></i>
                <span>Click and drag to sign</span>
              </div>
              <div className="guideline-item">
                <i className="fas fa-mobile-alt"></i>
                <span>Touch and move to sign on mobile</span>
              </div>
            </div>
          </>
        )}
        <div className="signature-line">
          <span className="signature-label">{label}</span>
        </div>
      </div>

      <div className="signature-actions">
        <button 
          className={`clear-btn ${(!hasSignature || disabled) ? 'disabled' : ''}`}
          onClick={clearSignature}
          disabled={disabled || !hasSignature}
        >
          <i className="fas fa-trash-alt"></i>
          Clear Signature
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;