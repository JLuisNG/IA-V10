// Enhanced FallRiskModal.jsx
import React, { useState, useEffect } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/standardizedTests/FallRiskModal.scss';

const FallRiskModal = ({ isOpen, onClose, initialData = null }) => {
  const [formData, setFormData] = useState({
    patientFactors: initialData?.patientFactors || {
      historyOfFalls: false,
      sensoryDeficit: false,
      ageOver65: false,
      multipleCoexistingDiagnoses: false,
      confusion: false,
      impairedJudgment: false,
      decreasedCooperation: false,
      increasedAnxiety: false,
      painAffectingFunction: false,
      unableToAmbulate: false,
      gaitBalanceProblems: false,
      incontinence: false,
      cardiovascularRespiratory: false,
      posturalHypotension: false,
      alcoholUse: false,
      medicationsAffecting: false
    },
    environmentalFactors: initialData?.environmentalFactors || {
      homeSafetyIssues: false,
      lackOfHomeModifications: false
    },
    organizationalGuidelines: initialData?.organizationalGuidelines || {
      educateOnFallPrevention: false,
      referToTherapy: false,
      monitorRiskAreas: false,
      reassessPatient: false
    },
    additionalInformation: initialData?.additionalInformation || '',
    totalScore: initialData?.totalScore || 0,
    isComplete: initialData?.isComplete || false
  });

  // Calcular puntuación total al cambiar los factores
  useEffect(() => {
    const patientFactorCount = Object.values(formData.patientFactors).filter(value => value).length;
    const environmentalFactorCount = Object.values(formData.environmentalFactors).filter(value => value).length;
    
    // Cada factor vale 5 puntos
    const total = (patientFactorCount + environmentalFactorCount) * 5;
    
    setFormData(prevData => ({
      ...prevData,
      totalScore: total
    }));
  }, [formData.patientFactors, formData.environmentalFactors]);

  // Determinar el nivel de riesgo basado en la puntuación total
  const getRiskLevel = () => {
    const score = formData.totalScore;
    
    if (score >= 75) return 'severe';
    if (score >= 50) return 'high';
    if (score >= 25) return 'moderate';
    return 'low';
  };

  // Obtener datos para el indicador visual de riesgo
  const getRiskData = () => {
    const score = formData.totalScore;
    const percentage = Math.min(score, 100);
    
    let riskText, riskColor, recommendations;
    
    if (score >= 75) {
      riskText = 'Severe Risk';
      riskColor = '#ef4444'; // red
      recommendations = [
        'Immediate fall prevention interventions required',
        'Continuous monitoring recommended',
        'Environmental modifications essential',
        'Consider assistive devices'
      ];
    } else if (score >= 50) {
      riskText = 'High Risk';
      riskColor = '#f97316'; // orange
      recommendations = [
        'Implement comprehensive fall prevention strategies',
        'Regular assessment needed',
        'Environmental safety review',
        'Balance and strength training recommended'
      ];
    } else if (score >= 25) {
      riskText = 'Moderate Risk';
      riskColor = '#f59e0b'; // amber
      recommendations = [
        'Monitor for changes in condition',
        'Basic fall prevention education',
        'Home safety assessment',
        'Consider exercise program'
      ];
    } else {
      riskText = 'Low Risk';
      riskColor = '#10b981'; // green
      recommendations = [
        'Maintain current status',
        'General fall prevention awareness',
        'Regular check-ups',
        'Stay active'
      ];
    }
    
    return {
      percentage,
      riskText,
      riskColor,
      recommendations
    };
  };

  // Manejar cambios en los factores del paciente
  const handlePatientFactorChange = (factor, checked) => {
    setFormData(prevData => ({
      ...prevData,
      patientFactors: {
        ...prevData.patientFactors,
        [factor]: checked
      }
    }));
  };

  // Manejar cambios en los factores ambientales
  const handleEnvironmentalFactorChange = (factor, checked) => {
    setFormData(prevData => ({
      ...prevData,
      environmentalFactors: {
        ...prevData.environmentalFactors,
        [factor]: checked
      }
    }));
  };

  // Manejar cambios en las guías organizacionales
  const handleGuidelinesChange = (guideline, checked) => {
    setFormData(prevData => ({
      ...prevData,
      organizationalGuidelines: {
        ...prevData.organizationalGuidelines,
        [guideline]: checked
      }
    }));
  };

  // Manejar cambios en la información adicional
  const handleAdditionalInfoChange = (value) => {
    setFormData(prevData => ({
      ...prevData,
      additionalInformation: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    onClose({
      ...formData,
      isComplete: true,
      score: formData.totalScore
    });
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  // Datos para el indicador visual
  const riskData = getRiskData();

  return (
    <div className="fall-risk-modal-overlay">
      <div className="fall-risk-modal">
        <div className="modal-header">
          <h2>
            <span className="header-icon">
              <i className="fas fa-person-falling"></i>
            </span>
            <span>Fall Risk Assessment</span>
          </h2>
          <button className="close-button" onClick={() => onClose()} aria-label="Close">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-content">
          <div className="risk-indicator-container">
            <div className="risk-meter">
              <div className="risk-meter-labels">
                <span>Low</span>
                <span>Moderate</span>
                <span>High</span>
                <span>Severe</span>
              </div>
              <div className="risk-meter-track">
                <div 
                  className="risk-meter-fill" 
                  style={{
                    width: `${riskData.percentage}%`,
                    backgroundColor: riskData.riskColor
                  }}
                ></div>
                <div className="risk-threshold" style={{ left: '25%' }}></div>
                <div className="risk-threshold" style={{ left: '50%' }}></div>
                <div className="risk-threshold" style={{ left: '75%' }}></div>
              </div>
              <div className="risk-score-display">
                <div className="score-value">
                  <span className="score-number">{formData.totalScore}</span>
                  <span className="score-max">/100</span>
                </div>
                <div className="risk-level" style={{ color: riskData.riskColor }}>
                  {riskData.riskText}
                </div>
              </div>
              
              <div className="risk-recommendations">
                <h4>Recommendations:</h4>
                <ul>
                  {riskData.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="info-note">
            <div className="info-icon">
              <i className="fas fa-info-circle"></i>
            </div>
            <p>Prior scores are for reference only. All risk factors should be thoroughly evaluated on each assessment.</p>
          </div>
          
          <div className="assessment-form">
            <div className="form-section patient-factors">
              <div className="section-header">
                <div className="section-icon">
                  <i className="fas fa-user-injured"></i>
                </div>
                <h3>PATIENT FACTORS</h3>
                <div className="factor-count">
                  {Object.values(formData.patientFactors).filter(value => value).length} selected
                </div>
              </div>
              
              <div className="factors-grid">
                <div className={`factor-item ${formData.patientFactors.historyOfFalls ? 'active' : ''}`}>
                  <label htmlFor="historyOfFalls">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="historyOfFalls" 
                        checked={formData.patientFactors.historyOfFalls}
                        onChange={(e) => handlePatientFactorChange('historyOfFalls', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        History of falls
                        <span className="factor-points">15 pts</span>
                      </div>
                      <div className="factor-description">Any falls in the past 3 months</div>
                    </div>
                  </label>
                </div>
                
                <div className={`factor-item ${formData.patientFactors.sensoryDeficit ? 'active' : ''}`}>
                  <label htmlFor="sensoryDeficit">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="sensoryDeficit" 
                        checked={formData.patientFactors.sensoryDeficit}
                        onChange={(e) => handlePatientFactorChange('sensoryDeficit', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        Sensory deficit
                        <span className="factor-points">5 pts</span>
                      </div>
                      <div className="factor-description">Vision and/or hearing deficiencies</div>
                    </div>
                  </label>
                </div>
                
                <div className={`factor-item ${formData.patientFactors.ageOver65 ? 'active' : ''}`}>
                  <label htmlFor="ageOver65">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="ageOver65" 
                        checked={formData.patientFactors.ageOver65}
                        onChange={(e) => handlePatientFactorChange('ageOver65', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        Age over 65
                        <span className="factor-points">5 pts</span>
                      </div>
                      <div className="factor-description">Increased fall risk with age</div>
                    </div>
                  </label>
                </div>
                
                <div className={`factor-item ${formData.patientFactors.multipleCoexistingDiagnoses ? 'active' : ''}`}>
                  <label htmlFor="multipleCoexistingDiagnoses">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="multipleCoexistingDiagnoses" 
                        checked={formData.patientFactors.multipleCoexistingDiagnoses}
                        onChange={(e) => handlePatientFactorChange('multipleCoexistingDiagnoses', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        Multiple co-existing diagnoses
                        <span className="factor-points">5 pts</span>
                      </div>
                      <div className="factor-description">3 or more co-existing conditions</div>
                    </div>
                  </label>
                </div>
                
                <div className={`factor-item ${formData.patientFactors.confusion ? 'active' : ''}`}>
                  <label htmlFor="confusion">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="confusion" 
                        checked={formData.patientFactors.confusion}
                        onChange={(e) => handlePatientFactorChange('confusion', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        Confusion
                        <span className="factor-points">5 pts</span>
                      </div>
                      <div className="factor-description">Disorientation, memory issues</div>
                    </div>
                  </label>
                </div>
                
                <div className={`factor-item ${formData.patientFactors.impairedJudgment ? 'active' : ''}`}>
                  <label htmlFor="impairedJudgment">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="impairedJudgment" 
                        checked={formData.patientFactors.impairedJudgment}
                        onChange={(e) => handlePatientFactorChange('impairedJudgment', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        Impaired judgment
                        <span className="factor-points">5 pts</span>
                      </div>
                      <div className="factor-description">Poor decision making</div>
                    </div>
                  </label>
                </div>
                
                <div className={`factor-item ${formData.patientFactors.decreasedCooperation ? 'active' : ''}`}>
                  <label htmlFor="decreasedCooperation">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="decreasedCooperation" 
                        checked={formData.patientFactors.decreasedCooperation}
                        onChange={(e) => handlePatientFactorChange('decreasedCooperation', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        Decreased level of cooperation
                        <span className="factor-points">5 pts</span>
                      </div>
                      <div className="factor-description">Non-adherence to safety recommendations</div>
                    </div>
                  </label>
                </div>
                
                <div className={`factor-item ${formData.patientFactors.increasedAnxiety ? 'active' : ''}`}>
                  <label htmlFor="increasedAnxiety">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="increasedAnxiety" 
                        checked={formData.patientFactors.increasedAnxiety}
                        onChange={(e) => handlePatientFactorChange('increasedAnxiety', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        Increased anxiety/emotional lability
                        <span className="factor-points">5 pts</span>
                      </div>
                      <div className="factor-description">Emotional state affecting function</div>
                    </div>
                  </label>
                </div>
                
                <div className={`factor-item ${formData.patientFactors.painAffectingFunction ? 'active' : ''}`}>
                  <label htmlFor="painAffectingFunction">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="painAffectingFunction" 
                        checked={formData.patientFactors.painAffectingFunction}
                        onChange={(e) => handlePatientFactorChange('painAffectingFunction', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        Pain affecting level of function
                        <span className="factor-points">5 pts</span>
                      </div>
                      <div className="factor-description">Functional limitations due to pain</div>
                    </div>
                  </label>
                </div>
                
                <div className={`factor-item ${formData.patientFactors.unableToAmbulate ? 'active' : ''}`}>
                  <label htmlFor="unableToAmbulate">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="unableToAmbulate" 
                        checked={formData.patientFactors.unableToAmbulate}
                        onChange={(e) => handlePatientFactorChange('unableToAmbulate', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        Unable to ambulate independently
                        <span className="factor-points">5 pts</span>
                      </div>
                      <div className="factor-description">Needs ambulatory aide, chairboard, etc.</div>
                    </div>
                  </label>
                </div>
                
                <div className={`factor-item ${formData.patientFactors.gaitBalanceProblems ? 'active' : ''}`}>
                  <label htmlFor="gaitBalanceProblems">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="gaitBalanceProblems" 
                        checked={formData.patientFactors.gaitBalanceProblems}
                        onChange={(e) => handlePatientFactorChange('gaitBalanceProblems', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        Gait/balance/coordination problems
                        <span className="factor-points">5 pts</span>
                      </div>
                      <div className="factor-description">Mobility issues</div>
                    </div>
                  </label>
                </div>
                
                <div className={`factor-item ${formData.patientFactors.incontinence ? 'active' : ''}`}>
                  <label htmlFor="incontinence">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="incontinence" 
                        checked={formData.patientFactors.incontinence}
                        onChange={(e) => handlePatientFactorChange('incontinence', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        Incontinence/urgency
                        <span className="factor-points">5 pts</span>
                      </div>
                      <div className="factor-description">Rushing to bathroom</div>
                    </div>
                  </label>
                </div>
                
                <div className={`factor-item ${formData.patientFactors.cardiovascularRespiratory ? 'active' : ''}`}>
                  <label htmlFor="cardiovascularRespiratory">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="cardiovascularRespiratory" 
                        checked={formData.patientFactors.cardiovascularRespiratory}
                        onChange={(e) => handlePatientFactorChange('cardiovascularRespiratory', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        Cardiovascular/respiratory disease
                        <span className="factor-points">5 pts</span>
                      </div>
                      <div className="factor-description">Affecting perfusion and/or oxygenation</div>
                    </div>
                  </label>
                </div>
                
                <div className={`factor-item ${formData.patientFactors.posturalHypotension ? 'active' : ''}`}>
                  <label htmlFor="posturalHypotension">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="posturalHypotension" 
                        checked={formData.patientFactors.posturalHypotension}
                        onChange={(e) => handlePatientFactorChange('posturalHypotension', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        Postural hypotension with dizziness
                        <span className="factor-points">5 pts</span>
                      </div>
                      <div className="factor-description">Blood pressure drops when standing</div>
                    </div>
                  </label>
                </div>
                
                <div className={`factor-item ${formData.patientFactors.alcoholUse ? 'active' : ''}`}>
                  <label htmlFor="alcoholUse">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="alcoholUse" 
                        checked={formData.patientFactors.alcoholUse}
                        onChange={(e) => handlePatientFactorChange('alcoholUse', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        Alcohol use
                        <span className="factor-points">5 pts</span>
                      </div>
                      <div className="factor-description">Current or recent use</div>
                    </div>
                  </label>
                </div>
                
                <div className={`factor-item ${formData.patientFactors.medicationsAffecting ? 'active' : ''}`}>
                  <label htmlFor="medicationsAffecting">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="medicationsAffecting" 
                        checked={formData.patientFactors.medicationsAffecting}
                        onChange={(e) => handlePatientFactorChange('medicationsAffecting', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        High-risk medications
                        <span className="factor-points">5 pts</span>
                      </div>
                      <div className="factor-description">Medications affecting BP, LOC, or blood coagulants</div>
                      <div className="factor-note">Consider: antihistamines, antihypertensives, antiseizure, benzodiazepines, cathartics, diuretics, hypoglycemics, narcotics, psychotropics, sedatives/hypnotics, anticoagulants</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="form-section environmental-factors">
              <div className="section-header">
                <div className="section-icon">
                  <i className="fas fa-home"></i>
                </div>
                <h3>ENVIRONMENTAL FACTORS</h3>
                <div className="factor-count">
                  {Object.values(formData.environmentalFactors).filter(value => value).length} selected
                </div>
              </div>
              
              <div className="factors-grid">
                <div className={`factor-item ${formData.environmentalFactors.homeSafetyIssues ? 'active' : ''}`}>
                  <label htmlFor="homeSafetyIssues">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="homeSafetyIssues" 
                        checked={formData.environmentalFactors.homeSafetyIssues}
                        onChange={(e) => handleEnvironmentalFactorChange('homeSafetyIssues', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        Home safety issues
                        <span className="factor-points">5 pts</span>
                      </div>
                      <div className="factor-description">Lighting, pathway, cord, tubing, floor coverings, stairs, etc.</div>
                    </div>
                  </label>
                </div>
                
                <div className={`factor-item ${formData.environmentalFactors.lackOfHomeModifications ? 'active' : ''}`}>
                  <label htmlFor="lackOfHomeModifications">
                    <div className="factor-checkbox">
                      <input 
                        type="checkbox" 
                        id="lackOfHomeModifications" 
                        checked={formData.environmentalFactors.lackOfHomeModifications}
                        onChange={(e) => handleEnvironmentalFactorChange('lackOfHomeModifications', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="factor-content">
                      <div className="factor-title">
                        Lack of home modifications
                        <span className="factor-points">5 pts</span>
                      </div>
                      <div className="factor-description">Bathroom, kitchen, stairs, entries, etc.</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="form-section guidelines">
              <div className="section-header">
                <div className="section-icon">
                  <i className="fas fa-clipboard-list"></i>
                </div>
                <h3>ORGANIZATIONAL GUIDELINES</h3>
              </div>
              
              <div className="guidelines-grid">
                <div className={`guideline-item ${formData.organizationalGuidelines.educateOnFallPrevention ? 'active' : ''}`}>
                  <label htmlFor="educateOnFallPrevention">
                    <div className="guideline-checkbox">
                      <input 
                        type="checkbox" 
                        id="educateOnFallPrevention" 
                        checked={formData.organizationalGuidelines.educateOnFallPrevention}
                        onChange={(e) => handleGuidelinesChange('educateOnFallPrevention', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="guideline-content">
                      <div className="guideline-title">Educate on fall prevention strategies</div>
                      <div className="guideline-description">Specific to areas of risk</div>
                    </div>
                  </label>
                </div>
                
                <div className={`guideline-item ${formData.organizationalGuidelines.referToTherapy ? 'active' : ''}`}>
                  <label htmlFor="referToTherapy">
                    <div className="guideline-checkbox">
                      <input 
                        type="checkbox" 
                        id="referToTherapy" 
                        checked={formData.organizationalGuidelines.referToTherapy}
                        onChange={(e) => handleGuidelinesChange('referToTherapy', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="guideline-content">
                      <div className="guideline-title">Refer to PT/OT</div>
                      <div className="guideline-description">Physical Therapy and/or Occupational Therapy</div>
                    </div>
                  </label>
                </div>
                
                <div className={`guideline-item ${formData.organizationalGuidelines.monitorRiskAreas ? 'active' : ''}`}>
                  <label htmlFor="monitorRiskAreas">
                    <div className="guideline-checkbox">
                      <input 
                        type="checkbox" 
                        id="monitorRiskAreas" 
                        checked={formData.organizationalGuidelines.monitorRiskAreas}
                        onChange={(e) => handleGuidelinesChange('monitorRiskAreas', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="guideline-content">
                      <div className="guideline-title">Monitor areas of risk</div>
                      <div className="guideline-description">Ongoing monitoring to reduce falls</div>
                    </div>
                  </label>
                </div>
                
                <div className={`guideline-item ${formData.organizationalGuidelines.reassessPatient ? 'active' : ''}`}>
                  <label htmlFor="reassessPatient">
                    <div className="guideline-checkbox">
                      <input 
                        type="checkbox" 
                        id="reassessPatient" 
                        checked={formData.organizationalGuidelines.reassessPatient}
                        onChange={(e) => handleGuidelinesChange('reassessPatient', e.target.checked)}
                      />
                      <div className="checkbox-display">
                        <i className="fas fa-check"></i>
                      </div>
                    </div>
                    <div className="guideline-content">
                      <div className="guideline-title">Reassess patient</div>
                      <div className="guideline-description">Regular reassessment of fall risk</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="form-section additional-info">
              <div className="section-header">
                <div className="section-icon">
                  <i className="fas fa-comment-alt"></i>
                </div>
                <h3>ADDITIONAL INFORMATION</h3>
              </div>
              
              <div className="additional-info-input">
                <textarea 
                  value={formData.additionalInformation}
                  onChange={(e) => handleAdditionalInfoChange(e.target.value)}
                  placeholder="Enter any additional observations, notes, or context about the patient's fall risk..."
                  rows={4}
                />
                <div className="input-help">
                  <p>Include any other factors that may influence fall risk that are not covered in the assessment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <div className="action-summary">
            <div className="summary-item">
              <i className="fas fa-exclamation-triangle"></i>
              <span>Risk Level: <strong style={{ color: riskData.riskColor }}>{riskData.riskText}</strong></span>
            </div>
            <div className="summary-item">
              <i className="fas fa-calculator"></i>
              <span>Total Score: <strong>{formData.totalScore}/100</strong></span>
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="cancel-btn" onClick={() => onClose()}>
              <i className="fas fa-times"></i>
              <span>Cancel</span>
            </button>
            <button className="save-btn" onClick={handleSubmit}>
              <i className="fas fa-save"></i>
              <span>Save Assessment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallRiskModal;