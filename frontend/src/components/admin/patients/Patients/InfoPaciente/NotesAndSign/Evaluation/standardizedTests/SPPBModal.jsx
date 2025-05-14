// Enhanced SPPBModal.jsx
import React, { useState, useEffect } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/standardizedTests/SPPBModal.scss';

const SPPBModal = ({ isOpen, onClose, initialData = null }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    balanceTests: {
      sideByStand: initialData?.balanceTests?.sideByStand || '1 - Held for 10 sec',
      semiTandemStand: initialData?.balanceTests?.semiTandemStand || '1 - Held for 10 sec',
      tandemStand: initialData?.balanceTests?.tandemStand || '2 - Held for 10 sec',
      balanceScore: initialData?.balanceTests?.balanceScore || 4,
    },
    balanceComments: initialData?.balanceComments || '',
    
    gaitSpeedTest: {
      time: initialData?.gaitSpeedTest?.time || '',
      attemptReason: initialData?.gaitSpeedTest?.attemptReason || '',
      aidsForWalk: initialData?.gaitSpeedTest?.aidsForWalk || 'None',
      walkScore: initialData?.gaitSpeedTest?.walkScore || '0 - Unable or more than 5.8s to walk'
    },
    gaitComments: initialData?.gaitComments || '',
    
    chairStandTest: {
      score: initialData?.chairStandTest?.score || '0 - Time is more than 60 sec'
    },
    chairComments: initialData?.chairComments || '',
    
    totalScore: initialData?.totalScore || 0,
    isComplete: initialData?.isComplete || false
  });
  
  // Estado para seguimiento de la sección activa
  const [activeSection, setActiveSection] = useState('balance');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Opciones para los campos de selección
  const balanceOptions = {
    sideByStand: [
      '1 - Held for 10 sec',
      '0 - Not held for 10 sec',
      'WB restrictions or no goals for ambulation'
    ],
    semiTandemStand: [
      '1 - Held for 10 sec',
      '0 - Not held for 10 sec',
      'WB restrictions or no goals for ambulation'
    ],
    tandemStand: [
      '2 - Held for 10 sec',
      '1 - Held for 3 to 9.99 sec',
      '0 - Held for < 3 sec',
      'WB restrictions or no goals for ambulation'
    ]
  };
  
  const gaitSpeedScoreOptions = [
    '0 - Unable or more than 5.8s to walk',
    '1 - Time is more than 4.8 sec',
    '2 - Time is 4.1 to 6.70 sec',
    '3 - Time is 3.2 to 4.0 sec',
    '4 - Time is less than or equal to 3.1 sec'
  ];
  
  const chairStandScoreOptions = [
    '0 - Time is more than 60 sec',
    '1 - Time is 16.7 to 60 sec',
    '2 - Time is 13.7 to 16.65 sec',
    '3 - Time is 11.2 to 13.69 sec',
    '4 - Time is less than 11.19 sec'
  ];
  
  const aidsForWalkOptions = [
    'None',
    'Cane',
    'Walker',
    'Other'
  ];

  // Calcular las puntuaciones
  useEffect(() => {
    let balanceScore = 0;
    
    // Cálculo de balance
    if (formData.balanceTests.sideByStand === '1 - Held for 10 sec') {
      balanceScore += 1;
    }
    
    if (formData.balanceTests.semiTandemStand === '1 - Held for 10 sec') {
      balanceScore += 1;
    }
    
    if (formData.balanceTests.tandemStand === '2 - Held for 10 sec') {
      balanceScore += 2;
    } else if (formData.balanceTests.tandemStand === '1 - Held for 3 to 9.99 sec') {
      balanceScore += 1;
    }
    
    // Actualizar balanceScore
    setFormData(prevData => ({
      ...prevData,
      balanceTests: {
        ...prevData.balanceTests,
        balanceScore: balanceScore
      }
    }));
    
    // Cálculo del total
    const gaitScore = parseInt(formData.gaitSpeedTest.walkScore.charAt(0));
    const chairScore = parseInt(formData.chairStandTest.score.charAt(0));
    
    const totalScore = balanceScore + (isNaN(gaitScore) ? 0 : gaitScore) + (isNaN(chairScore) ? 0 : chairScore);
    
    setFormData(prevData => ({
      ...prevData,
      totalScore: totalScore
    }));
    
  }, [
    formData.balanceTests.sideByStand,
    formData.balanceTests.semiTandemStand,
    formData.balanceTests.tandemStand,
    formData.gaitSpeedTest.walkScore,
    formData.chairStandTest.score
  ]);

  // Evaluar la categoría de rendimiento basada en la puntuación total
  const getPerformanceCategory = () => {
    const score = formData.totalScore;
    
    if (score >= 10) return { category: 'excellent', label: 'Excellent Performance' };
    if (score >= 7) return { category: 'good', label: 'Good Performance' };
    if (score >= 4) return { category: 'moderate', label: 'Moderate Performance' };
    return { category: 'poor', label: 'Poor Performance' };
  };

  // Manejar cambios en los campos de balance
  const handleBalanceChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      balanceTests: {
        ...prevData.balanceTests,
        [field]: value
      }
    }));
  };

  // Manejar cambios en los campos de texto
  const handleTextChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  // Manejar cambios en los campos de gait speed
  const handleGaitSpeedChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      gaitSpeedTest: {
        ...prevData.gaitSpeedTest,
        [field]: value
      }
    }));
  };

  // Manejar cambios en los campos de chair stand
  const handleChairStandChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      chairStandTest: {
        ...prevData.chairStandTest,
        [field]: value
      }
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      onClose({
        ...formData,
        isComplete: true,
        score: formData.totalScore
      });
    }, 500);
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  const performanceInfo = getPerformanceCategory();

  return (
    <div className="sppb-modal-overlay">
      <div className="sppb-modal">
        <div className="modal-header">
          <h2>
            <i className="fas fa-walking"></i>
            Short Physical Performance Battery
          </h2>
          <div className="score-indicator">
            <div className="total-score">
              <span className="score-label">Total Score:</span>
              <span className="score-value">{formData.totalScore}</span>
              <span className="score-max">/12</span>
            </div>
            <div className={`performance-badge ${performanceInfo.category}`}>
              {performanceInfo.label}
            </div>
          </div>
          <button className="close-button" onClick={() => onClose()}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="section-tabs">
          <button 
            className={`tab-button ${activeSection === 'balance' ? 'active' : ''}`}
            onClick={() => setActiveSection('balance')}
          >
            <i className="fas fa-balance-scale"></i>
            <span>Balance Tests</span>
            <div className="tab-score">{formData.balanceTests.balanceScore}/4</div>
          </button>
          <button 
            className={`tab-button ${activeSection === 'gait' ? 'active' : ''}`}
            onClick={() => setActiveSection('gait')}
          >
            <i className="fas fa-running"></i>
            <span>Gait Speed</span>
            <div className="tab-score">{parseInt(formData.gaitSpeedTest.walkScore.charAt(0)) || 0}/4</div>
          </button>
          <button 
            className={`tab-button ${activeSection === 'chair' ? 'active' : ''}`}
            onClick={() => setActiveSection('chair')}
          >
            <i className="fas fa-chair"></i>
            <span>Chair Stand</span>
            <div className="tab-score">{parseInt(formData.chairStandTest.score.charAt(0)) || 0}/4</div>
          </button>
          <button 
            className={`tab-button ${activeSection === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveSection('summary')}
          >
            <i className="fas fa-clipboard-check"></i>
            <span>Summary</span>
            <div className="tab-score">{formData.totalScore}/12</div>
          </button>
        </div>
        
        <div className="modal-content">
          {activeSection === 'balance' && (
            <div className="balance-tests-section">
              <div className="section-header">
                <h3>Balance Tests</h3>
                <div className="section-score">
                  <span className="score-value">{formData.balanceTests.balanceScore}</span>
                  <span className="score-max">/4 points</span>
                </div>
              </div>
              
              <div className="section-note">
                <i className="fas fa-info-circle"></i>
                <p>Test the patient's ability to stand with feet in different positions. Each position must be held for 10 seconds.</p>
              </div>
              
              <div className="balance-test-grid">
                <div className="test-item">
                  <div className="test-header">
                    <div className="test-title">
                      <span className="test-number">1</span>
                      <h4>Side-by-Side Stand</h4>
                    </div>
                    <div className="test-image">
                      <i className="fas fa-male"></i>
                    </div>
                  </div>
                  <div className="test-description">
                    <p>Patient stands with feet side by side for 10 seconds.</p>
                  </div>
                  <div className="test-input">
                    <label>Score:</label>
                    <select
                      value={formData.balanceTests.sideByStand}
                      onChange={(e) => handleBalanceChange('sideByStand', e.target.value)}
                      className="custom-select"
                    >
                      {balanceOptions.sideByStand.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="test-item">
                  <div className="test-header">
                    <div className="test-title">
                      <span className="test-number">2</span>
                      <h4>Semi-Tandem Stand</h4>
                    </div>
                    <div className="test-image">
                      <i className="fas fa-male"></i>
                    </div>
                  </div>
                  <div className="test-description">
                    <p>Patient stands with the side of heel touching big toe of other foot.</p>
                  </div>
                  <div className="test-input">
                    <label>Score:</label>
                    <select
                      value={formData.balanceTests.semiTandemStand}
                      onChange={(e) => handleBalanceChange('semiTandemStand', e.target.value)}
                      className="custom-select"
                    >
                      {balanceOptions.semiTandemStand.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="test-item">
                  <div className="test-header">
                    <div className="test-title">
                      <span className="test-number">3</span>
                      <h4>Tandem Stand</h4>
                    </div>
                    <div className="test-image">
                      <i className="fas fa-male"></i>
                    </div>
                  </div>
                  <div className="test-description">
                    <p>Patient stands with heel of one foot in front of and touching toes of other foot.</p>
                  </div>
                  <div className="test-input">
                    <label>Score:</label>
                    <select
                      value={formData.balanceTests.tandemStand}
                      onChange={(e) => handleBalanceChange('tandemStand', e.target.value)}
                      className="custom-select"
                    >
                      {balanceOptions.tandemStand.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="comments-container">
                <div className="comments-header">
                  <i className="fas fa-comment-alt"></i>
                  <h4>Additional Observations</h4>
                </div>
                <div className="comments-input">
                  <textarea
                    value={formData.balanceComments}
                    onChange={(e) => handleTextChange('balanceComments', e.target.value)}
                    rows={3}
                    placeholder="Enter observations about balance tests (optional)"
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'gait' && (
            <div className="gait-speed-section">
              <div className="section-header">
                <h3>Gait Speed Test</h3>
                <div className="section-score">
                  <span className="score-value">{parseInt(formData.gaitSpeedTest.walkScore.charAt(0)) || 0}</span>
                  <span className="score-max">/4 points</span>
                </div>
              </div>
              
              <div className="section-note">
                <i className="fas fa-info-circle"></i>
                <p>Measure the time it takes the patient to walk four meters (13.12 ft) at their normal pace.</p>
              </div>
              
              <div className="gait-test-form">
                <div className="gait-header">
                  <div className="gait-title">
                    <i className="fas fa-stopwatch"></i>
                    <h4>Walk Test Details</h4>
                  </div>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Time (in seconds):</label>
                    <div className="input-with-unit">
                      <input
                        type="text"
                        value={formData.gaitSpeedTest.time}
                        onChange={(e) => handleGaitSpeedChange('time', e.target.value)}
                        placeholder="0.0"
                      />
                      <span className="unit">sec</span>
                    </div>
                  </div>
                  
                  <div className="form-group full-width">
                    <label>If patient did not attempt or failed:</label>
                    <select
                      value={formData.gaitSpeedTest.attemptReason}
                      onChange={(e) => handleGaitSpeedChange('attemptReason', e.target.value)}
                      className="custom-select"
                    >
                      <option value="">Select reason (if applicable)</option>
                      <option value="Tried but unable">Tried but unable</option>
                      <option value="Participant could not walk unassisted">Participant could not walk unassisted</option>
                      <option value="Not attempted, assessor felt unsafe">Not attempted, assessor felt unsafe</option>
                      <option value="Not attempted, participant felt unsafe">Not attempted, participant felt unsafe</option>
                      <option value="Participant unable to understand instructions">Participant unable to understand instructions</option>
                      <option value="Other">Other</option>
                      <option value="Participant refused">Participant refused</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Assistive devices used:</label>
                    <select
                      value={formData.gaitSpeedTest.aidsForWalk}
                      onChange={(e) => handleGaitSpeedChange('aidsForWalk', e.target.value)}
                      className="custom-select"
                    >
                      {aidsForWalkOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Score:</label>
                    <select
                      value={formData.gaitSpeedTest.walkScore}
                      onChange={(e) => handleGaitSpeedChange('walkScore', e.target.value)}
                      className="custom-select score-select"
                    >
                      {gaitSpeedScoreOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="comments-container">
                  <div className="comments-header">
                    <i className="fas fa-comment-alt"></i>
                    <h4>Additional Observations</h4>
                  </div>
                  <div className="comments-input">
                    <textarea
                      value={formData.gaitComments}
                      onChange={(e) => handleTextChange('gaitComments', e.target.value)}
                      rows={3}
                      placeholder="Enter observations about gait speed test (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'chair' && (
            <div className="chair-stand-section">
              <div className="section-header">
                <h3>Chair Stand Test</h3>
                <div className="section-score">
                  <span className="score-value">{parseInt(formData.chairStandTest.score.charAt(0)) || 0}</span>
                  <span className="score-max">/4 points</span>
                </div>
              </div>
              
              <div className="section-note">
                <i className="fas fa-info-circle"></i>
                <p>Measure the time it takes for the patient to rise from a chair and sit down 5 times with arms folded.</p>
              </div>
              
              <div className="chair-test-form">
                <div className="chair-header">
                  <div className="chair-title">
                    <i className="fas fa-chair"></i>
                    <h4>Chair Stand Details</h4>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Score:</label>
                  <select
                    value={formData.chairStandTest.score}
                    onChange={(e) => handleChairStandChange('score', e.target.value)}
                    className="custom-select score-select"
                  >
                    {chairStandScoreOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div className="chair-guidelines">
                  <div className="guidelines-header">
                    <i className="fas fa-list-ol"></i>
                    <h4>Test Guidelines</h4>
                  </div>
                  <ul className="guidelines-list">
                    <li>Use a straight-backed chair with seat 17 inches from the floor</li>
                    <li>Ask patient to stand up and sit down 5 times as quickly as possible with arms folded</li>
                    <li>Start timing when patient begins to stand up from the first position</li>
                    <li>Stop timing when patient sits after the fifth stand</li>
                    <li>If patient cannot complete 5 stands, record time for completed stands and note reason</li>
                  </ul>
                </div>
                
                <div className="comments-container">
                  <div className="comments-header">
                    <i className="fas fa-comment-alt"></i>
                    <h4>Additional Observations</h4>
                  </div>
                  <div className="comments-input">
                    <textarea
                      value={formData.chairComments}
                      onChange={(e) => handleTextChange('chairComments', e.target.value)}
                      rows={3}
                      placeholder="Enter observations about chair stand test (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'summary' && (
            <div className="summary-section">
              <div className="section-header">
                <h3>Summary of Results</h3>
                <div className="section-score total">
                  <span className="score-value">{formData.totalScore}</span>
                  <span className="score-max">/12 points</span>
                </div>
              </div>
              
              <div className={`performance-indicator ${performanceInfo.category}`}>
                <div className="indicator-icon">
                  {performanceInfo.category === 'excellent' && <i className="fas fa-trophy"></i>}
                  {performanceInfo.category === 'good' && <i className="fas fa-thumbs-up"></i>}
                  {performanceInfo.category === 'moderate' && <i className="fas fa-exclamation-circle"></i>}
                  {performanceInfo.category === 'poor' && <i className="fas fa-exclamation-triangle"></i>}
                </div>
                <div className="indicator-text">
                  <h4>{performanceInfo.label}</h4>
                  <p>
                    {performanceInfo.category === 'excellent' && 'Patient demonstrates excellent lower extremity function.'}
                    {performanceInfo.category === 'good' && 'Patient demonstrates good lower extremity function with minor limitations.'}
                    {performanceInfo.category === 'moderate' && 'Patient demonstrates moderate limitations in lower extremity function.'}
                    {performanceInfo.category === 'poor' && 'Patient demonstrates significant limitations in lower extremity function.'}
                  </p>
                </div>
              </div>
              
              <div className="scores-grid">
                <div className="score-card">
                  <div className="score-card-header">
                    <i className="fas fa-balance-scale"></i>
                    <h4>Balance Tests</h4>
                  </div>
                  <div className="score-card-content">
                    <div className="score-display">
                      <div className="score-number">{formData.balanceTests.balanceScore}</div>
                      <div className="score-denominator">/4</div>
                    </div>
                    <div className="score-details">
                      <div className="score-item">
                        <span className="score-item-label">Side-by-Side:</span>
                        <span className="score-item-value">{formData.balanceTests.sideByStand.charAt(0)}/1</span>
                      </div>
                      <div className="score-item">
                        <span className="score-item-label">Semi-Tandem:</span>
                        <span className="score-item-value">{formData.balanceTests.semiTandemStand.charAt(0)}/1</span>
                      </div>
                      <div className="score-item">
                        <span className="score-item-label">Tandem:</span>
                        <span className="score-item-value">{formData.balanceTests.tandemStand.charAt(0)}/2</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="score-card">
                  <div className="score-card-header">
                    <i className="fas fa-running"></i>
                    <h4>Gait Speed</h4>
                  </div>
                  <div className="score-card-content">
                    <div className="score-display">
                      <div className="score-number">{parseInt(formData.gaitSpeedTest.walkScore.charAt(0)) || 0}</div>
                      <div className="score-denominator">/4</div>
                    </div>
                    <div className="score-details">
                      <div className="score-item full-width">
                        <span className="score-item-label">Selected Score:</span>
                        <span className="score-item-value">{formData.gaitSpeedTest.walkScore}</span>
                      </div>
                      {formData.gaitSpeedTest.time && (
                        <div className="score-item full-width">
                          <span className="score-item-label">Time:</span>
                          <span className="score-item-value">{formData.gaitSpeedTest.time} seconds</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="score-card">
                  <div className="score-card-header">
                    <i className="fas fa-chair"></i>
                    <h4>Chair Stand</h4>
                  </div>
                  <div className="score-card-content">
                    <div className="score-display">
                      <div className="score-number">{parseInt(formData.chairStandTest.score.charAt(0)) || 0}</div>
                      <div className="score-denominator">/4</div>
                    </div>
                    <div className="score-details">
                      <div className="score-item full-width">
                        <span className="score-item-label">Selected Score:</span>
                        <span className="score-item-value">{formData.chairStandTest.score}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="interpretation-guide">
                <div className="guide-header">
                  <i className="fas fa-list-alt"></i>
                  <h4>Interpretation Guide</h4>
                </div>
                <div className="guide-content">
                  <div className="guide-item">
                    <div className={`guide-marker excellent ${formData.totalScore >= 10 ? 'active' : ''}`}>
                      <span>10-12</span>
                    </div>
                    <div className="guide-description">
                      <strong>Excellent Performance</strong>
                      <p>Minimal risk of ADL disability or mobility limitations</p>
                    </div>
                  </div>
                  
                  <div className="guide-item">
                    <div className={`guide-marker good ${formData.totalScore >= 7 && formData.totalScore <= 9 ? 'active' : ''}`}>
                      <span>7-9</span>
                    </div>
                    <div className="guide-description">
                      <strong>Good Performance</strong>
                      <p>Low risk of ADL disability, may have some mobility limitations</p>
                    </div>
                  </div>
                  
                  <div className="guide-item">
                    <div className={`guide-marker moderate ${formData.totalScore >= 4 && formData.totalScore <= 6 ? 'active' : ''}`}>
                      <span>4-6</span>
                    </div>
                    <div className="guide-description">
                      <strong>Moderate Performance</strong>
                      <p>Increased risk of ADL disability and mobility limitations</p>
                    </div>
                  </div>
                  
                  <div className="guide-item">
                    <div className={`guide-marker poor ${formData.totalScore <= 3 ? 'active' : ''}`}>
                      <span>0-3</span>
                    </div>
                    <div className="guide-description">
                      <strong>Poor Performance</strong>
                      <p>High risk of ADL disability and significant mobility limitations</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="clinical-recommendations">
                <div className="recommendations-header">
                  <i className="fas fa-clipboard-list"></i>
                  <h4>Recommended Interventions</h4>
                </div>
                <div className="recommendations-content">
                  {formData.totalScore >= 10 ? (
                    <div className="recommendation-item">
                      <div className="recommendation-icon excellent">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <div className="recommendation-text">
                        <strong>Maintenance Program</strong>
                        <p>Continue with current exercise routine to maintain function. Consider community-based exercise programs.</p>
                      </div>
                    </div>
                  ) : formData.totalScore >= 7 ? (
                    <div className="recommendation-item">
                      <div className="recommendation-icon good">
                        <i className="fas fa-thumbs-up"></i>
                      </div>
                      <div className="recommendation-text">
                        <strong>Light Intervention</strong>
                        <p>Implement targeted exercises to maintain/improve mobility. Focus on any specific deficits identified.</p>
                      </div>
                    </div>
                  ) : formData.totalScore >= 4 ? (
                    <div className="recommendation-item">
                      <div className="recommendation-icon moderate">
                        <i className="fas fa-exclamation-circle"></i>
                      </div>
                      <div className="recommendation-text">
                        <strong>Moderate Intervention</strong>
                        <p>Structured exercise program focusing on strength, balance, and gait training. Consider fall prevention strategies.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="recommendation-item">
                      <div className="recommendation-icon poor">
                        <i className="fas fa-exclamation-triangle"></i>
                      </div>
                      <div className="recommendation-text">
                        <strong>Intensive Intervention</strong>
                        <p>Comprehensive rehabilitation program with close monitoring. Address functional limitations with graduated exercise program.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <div className="footer-navigation">
            {activeSection !== 'balance' && (
              <button 
                className="prev-btn" 
                onClick={() => {
                  if (activeSection === 'gait') setActiveSection('balance');
                  if (activeSection === 'chair') setActiveSection('gait');
                  if (activeSection === 'summary') setActiveSection('chair');
                }}
              >
                <i className="fas fa-arrow-left"></i>
                <span>Previous</span>
              </button>
            )}
            
            {activeSection !== 'summary' && (
              <button 
                className="next-btn" 
                onClick={() => {
                  if (activeSection === 'balance') setActiveSection('gait');
                  if (activeSection === 'gait') setActiveSection('chair');
                  if (activeSection === 'chair') setActiveSection('summary');
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

export default SPPBModal;