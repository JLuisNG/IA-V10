// Enhanced WoundAssessmentModal.jsx
import React, { useState, useEffect } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/standardizedTests/WoundAssessmentModal.scss';

const WoundAssessmentModal = ({ isOpen, onClose, initialData = null }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    objective: initialData?.objective || '',
    border: initialData?.border || 'Irregular',
    colorOfWoundBed: initialData?.colorOfWoundBed || 'Irregular',
    odor: initialData?.odor || 'Purulent',
    
    drainage: {
      type: initialData?.drainage?.type || '',
      quantity: initialData?.drainage?.quantity || ''
    },
    
    measurements: {
      length: initialData?.measurements?.length || '',
      width: initialData?.measurements?.width || '',
      depth: initialData?.measurements?.depth || '',
      tunneling: initialData?.measurements?.tunneling || ''
    },
    
    granulationTissue: initialData?.granulationTissue || '',
    treatmentPerformed: initialData?.treatmentPerformed || '',
    
    planOfCare: {
      preventInfection: initialData?.planOfCare?.preventInfection || false,
      woundClosureBy: initialData?.planOfCare?.woundClosureBy || '',
      increaseGranulationBy: initialData?.planOfCare?.increaseGranulationBy || ''
    },
    
    additionalInformation: initialData?.additionalInformation || '',
    isComplete: initialData?.isComplete || false
  });

  const [activeSection, setActiveSection] = useState('wound-characteristics');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [woundArea, setWoundArea] = useState('0');

  // Opciones para los selectores
  const borderOptions = ['Irregular', 'Red', 'White', 'Necrotic', 'Tunneling', 'Other (Explain)'];
  const colorOptions = ['Irregular', 'Red', 'White', 'Necrotic', 'Tunneling', 'Other (Explain)'];
  const odorOptions = ['Purulent', 'Pseudomonas', 'None'];

  // Calcular el área de la herida cuando las dimensiones cambian
  useEffect(() => {
    const length = parseFloat(formData.measurements.length) || 0;
    const width = parseFloat(formData.measurements.width) || 0;
    
    if (length > 0 && width > 0) {
      const area = (length * width).toFixed(1);
      setWoundArea(area);
    } else {
      setWoundArea('0');
    }
  }, [formData.measurements.length, formData.measurements.width]);

  // Manejar cambios en los campos de texto
  const handleTextChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  // Manejar cambios en los selectores
  const handleSelectChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  // Manejar cambios en campos anidados
  const handleNestedChange = (parentField, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [parentField]: {
        ...prevData[parentField],
        [field]: value
      }
    }));
  };

  // Manejar cambio en checkbox
  const handleCheckboxChange = (parentField, field) => {
    setFormData(prevData => ({
      ...prevData,
      [parentField]: {
        ...prevData[parentField],
        [field]: !prevData[parentField][field]
      }
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      onClose({
        ...formData,
        isComplete: true
      });
    }, 500);
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="wound-assessment-modal-overlay">
      <div className="wound-assessment-modal">
        <div className="modal-header">
          <h2>
            <i className="fas fa-band-aid"></i>
            Wound Assessment
          </h2>
          <button className="close-button" onClick={() => onClose()}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="section-tabs">
          <button 
            className={`tab-button ${activeSection === 'wound-characteristics' ? 'active' : ''}`}
            onClick={() => setActiveSection('wound-characteristics')}
          >
            <i className="fas fa-search"></i>
            <span>Wound Characteristics</span>
          </button>
          <button 
            className={`tab-button ${activeSection === 'measurements' ? 'active' : ''}`}
            onClick={() => setActiveSection('measurements')}
          >
            <i className="fas fa-ruler-combined"></i>
            <span>Measurements</span>
          </button>
          <button 
            className={`tab-button ${activeSection === 'treatment' ? 'active' : ''}`}
            onClick={() => setActiveSection('treatment')}
          >
            <i className="fas fa-first-aid"></i>
            <span>Treatment</span>
          </button>
          <button 
            className={`tab-button ${activeSection === 'plan' ? 'active' : ''}`}
            onClick={() => setActiveSection('plan')}
          >
            <i className="fas fa-clipboard-list"></i>
            <span>Plan of Care</span>
          </button>
        </div>
        
        <div className="modal-content">
          {activeSection === 'wound-characteristics' && (
            <div className="wound-characteristics-section">
              <div className="section-header">
                <h3>Wound Characteristics</h3>
              </div>
              
              <div className="form-card">
                <div className="form-group">
                  <label>
                    <i className="fas fa-edit"></i>
                    Objective Assessment
                  </label>
                  <textarea
                    value={formData.objective}
                    onChange={(e) => handleTextChange('objective', e.target.value)}
                    placeholder="Enter detailed objective assessment of the wound"
                    rows={5}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-border-style"></i>
                      Border
                    </label>
                    <select
                      value={formData.border}
                      onChange={(e) => handleSelectChange('border', e.target.value)}
                      className="custom-select"
                    >
                      {borderOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <i className="fas fa-palette"></i>
                      Color of Wound Bed
                    </label>
                    <select
                      value={formData.colorOfWoundBed}
                      onChange={(e) => handleSelectChange('colorOfWoundBed', e.target.value)}
                      className="custom-select"
                    >
                      {colorOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-wind"></i>
                      Odor
                    </label>
                    <select
                      value={formData.odor}
                      onChange={(e) => handleSelectChange('odor', e.target.value)}
                      className="custom-select"
                    >
                      {odorOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <i className="fas fa-seedling"></i>
                      Granulation Tissue Present
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="text"
                        value={formData.granulationTissue}
                        onChange={(e) => handleTextChange('granulationTissue', e.target.value)}
                        placeholder="0"
                      />
                      <span className="unit">%</span>
                    </div>
                  </div>
                </div>
                
                <div className="drainage-section">
                  <div className="section-subheader">
                    <i className="fas fa-tint"></i>
                    <h4>Drainage</h4>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Type</label>
                      <input
                        type="text"
                        value={formData.drainage.type}
                        onChange={(e) => handleNestedChange('drainage', 'type', e.target.value)}
                        placeholder="Enter drainage type"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Quantity</label>
                      <input
                        type="text"
                        value={formData.drainage.quantity}
                        onChange={(e) => handleNestedChange('drainage', 'quantity', e.target.value)}
                        placeholder="Enter quantity"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'measurements' && (
            <div className="measurements-section">
              <div className="section-header">
                <h3>Wound Measurements</h3>
              </div>
              
              <div className="form-card">
                <div className="wound-diagram">
                  <div className="diagram-header">
                    <i className="fas fa-ruler"></i>
                    <h4>Measurement Guide</h4>
                  </div>
                  <div className="diagram-content">
                    <div className="wound-illustration">
                      <div className="illustration-container">
                        <div className="wound-shape">
                          <div className="dimension length">Length</div>
                          <div className="dimension width">Width</div>
                          <div className="dimension depth">Depth</div>
                        </div>
                      </div>
                      <div className="illustration-note">
                        <p><strong>Note:</strong> Measure the longest length (head-to-toe) and the widest width (side-to-side) using a disposable measuring device. Depth should be measured at the deepest point.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="measurements-grid">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-arrows-alt-v"></i>
                      Length
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="text"
                        value={formData.measurements.length}
                        onChange={(e) => handleNestedChange('measurements', 'length', e.target.value)}
                        placeholder="0"
                      />
                      <span className="unit">cm</span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <i className="fas fa-arrows-alt-h"></i>
                      Width
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="text"
                        value={formData.measurements.width}
                        onChange={(e) => handleNestedChange('measurements', 'width', e.target.value)}
                        placeholder="0"
                      />
                      <span className="unit">cm</span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <i className="fas fa-level-down-alt"></i>
                      Depth
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="text"
                        value={formData.measurements.depth}
                        onChange={(e) => handleNestedChange('measurements', 'depth', e.target.value)}
                        placeholder="0"
                      />
                      <span className="unit">cm</span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <i className="fas fa-bezier-curve"></i>
                      Tunneling
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="text"
                        value={formData.measurements.tunneling}
                        onChange={(e) => handleNestedChange('measurements', 'tunneling', e.target.value)}
                        placeholder="0"
                      />
                      <span className="unit">cm</span>
                    </div>
                  </div>
                </div>
                
                <div className="calculated-results">
                  <div className="result-item">
                    <span className="result-label">Estimated Wound Area:</span>
                    <span className="result-value">{woundArea} cm²</span>
                  </div>
                  <div className="result-note">
                    <p>Calculated as length × width. Actual area may vary based on wound shape.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'treatment' && (
            <div className="treatment-section">
              <div className="section-header">
                <h3>Treatment Information</h3>
              </div>
              
              <div className="form-card">
                <div className="form-group">
                  <label>
                    <i className="fas fa-first-aid"></i>
                    Treatment Performed Today
                  </label>
                  <textarea
                    value={formData.treatmentPerformed}
                    onChange={(e) => handleTextChange('treatmentPerformed', e.target.value)}
                    placeholder="Describe treatment performed"
                    rows={6}
                  />
                </div>
                
                <div className="treatment-tips">
                  <div className="tips-header">
                    <i className="fas fa-lightbulb"></i>
                    <h4>Treatment Documentation Guidelines</h4>
                  </div>
                  <ul className="tips-list">
                    <li>Include cleansing method and solution used</li>
                    <li>Document any debridement performed</li>
                    <li>List all dressings applied (primary and secondary)</li>
                    <li>Note any topical medications applied</li>
                    <li>Include information about patient education provided</li>
                    <li>Document any discomfort or pain management during procedure</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'plan' && (
            <div className="plan-section">
              <div className="section-header">
                <h3>Plan of Care</h3>
              </div>
              
              <div className="form-card">
                <div className="checkbox-section">
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.planOfCare.preventInfection}
                        onChange={() => handleCheckboxChange('planOfCare', 'preventInfection')}
                      />
                      <div className="checkbox-text">
                        <span className="checkbox-title">Prevent Infection</span>
                        <span className="checkbox-description">Monitor for signs of infection and implement infection control measures</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-compress-arrows-alt"></i>
                      Wound Closure By
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="text"
                        value={formData.planOfCare.woundClosureBy}
                        onChange={(e) => handleNestedChange('planOfCare', 'woundClosureBy', e.target.value)}
                        placeholder="0"
                      />
                      <span className="unit">%</span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <i className="fas fa-chart-line"></i>
                      Increase Granulation By
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="text"
                        value={formData.planOfCare.increaseGranulationBy}
                        onChange={(e) => handleNestedChange('planOfCare', 'increaseGranulationBy', e.target.value)}
                        placeholder="0"
                      />
                      <span className="unit">%</span>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>
                    <i className="fas fa-clipboard-list"></i>
                    Additional Wound POC Information
                  </label>
                  <textarea
                    value={formData.additionalInformation}
                    onChange={(e) => handleTextChange('additionalInformation', e.target.value)}
                    placeholder="Enter additional information for wound plan of care"
                    rows={5}
                  />
                </div>
                
                <div className="healing-progress">
                  <div className="progress-header">
                    <i className="fas fa-heartbeat"></i>
                    <h4>Wound Healing Phases</h4>
                  </div>
                  <div className="progress-stages">
                    <div className="stage">
                      <div className="stage-indicator">1</div>
                      <div className="stage-details">
                        <h5>Hemostasis</h5>
                        <p>Blood clotting and vascular constriction</p>
                      </div>
                    </div>
                    <div className="stage">
                      <div className="stage-indicator">2</div>
                      <div className="stage-details">
                        <h5>Inflammation</h5>
                        <p>Increased blood flow, cleaning of debris</p>
                      </div>
                    </div>
                    <div className="stage">
                      <div className="stage-indicator">3</div>
                      <div className="stage-details">
                        <h5>Proliferation</h5>
                        <p>Granulation tissue formation, epithelialization</p>
                      </div>
                    </div>
                    <div className="stage">
                      <div className="stage-indicator">4</div>
                      <div className="stage-details">
                        <h5>Maturation</h5>
                        <p>Remodeling and strengthening of new tissue</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <div className="footer-navigation">
            {activeSection !== 'wound-characteristics' && (
              <button 
                className="prev-btn" 
                onClick={() => {
                  if (activeSection === 'measurements') setActiveSection('wound-characteristics');
                  if (activeSection === 'treatment') setActiveSection('measurements');
                  if (activeSection === 'plan') setActiveSection('treatment');
                }}
              >
                <i className="fas fa-arrow-left"></i>
                <span>Previous</span>
              </button>
            )}
            
            {activeSection !== 'plan' && (
              <button 
                className="next-btn" 
                onClick={() => {
                  if (activeSection === 'wound-characteristics') setActiveSection('measurements');
                  if (activeSection === 'measurements') setActiveSection('treatment');
                  if (activeSection === 'treatment') setActiveSection('plan');
                }}
              >
                <span>Next</span>
                <i className="fas fa-arrow-right"></i>
              </button>
            )}
          </div>
          
          <div className="footer-actions">
            <button className="cancel-btn" onClick={() => onClose()}>
              <i className="fas fa-times"></i>
              <span>Cancel</span>
            </button>
            <button 
              className={`submit-btn ${isSubmitting ? 'submitting' : ''}`} 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i>
                  <span>Submit</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WoundAssessmentModal;