// Enhanced FinaleSection.jsx
import React, { useState, useEffect } from 'react';
import '../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/FinaleSection.scss';
import SignaturePad from './SignaturePad';

const FinaleSection = ({ data, onChange, autoSaveMessage }) => {
  const [activeTab, setActiveTab] = useState('additionalForms');

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const tabs = [
    { id: 'additionalForms', label: 'Additional Forms', icon: 'fa-file-alt' },
    { id: 'patientSignature', label: 'Patient Signature', icon: 'fa-signature' },
    { id: 'therapistSignature', label: 'Therapist Signature', icon: 'fa-pen-fancy' },
    { id: 'therapistDate', label: 'Therapist Date', icon: 'fa-calendar-check' },
    { id: 'timeInOut', label: 'Time In / Time Out', icon: 'fa-clock' },
    { id: 'finalize', label: 'Finalize', icon: 'fa-check-circle' }
  ];

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const [units, setUnits] = useState('(4) - 53-67 minutes');

  useEffect(() => {
    if (data.timeInHour && data.timeInMinute && data.timeOutHour && data.timeOutMinute && 
        data.timeInAmPm && data.timeOutAmPm) {
      const timeInMinutes = calculateTotalMinutes(data.timeInHour, data.timeInMinute, data.timeInAmPm);
      const timeOutMinutes = calculateTotalMinutes(data.timeOutHour, data.timeOutMinute, data.timeOutAmPm);
      let diffMinutes = timeOutMinutes - timeInMinutes;
      if (diffMinutes < 0) diffMinutes += 24 * 60;

      let unitValue = '(0) - 0 minutes';
      if (diffMinutes >= 8 && diffMinutes <= 22) unitValue = '(1) - 8-22 minutes';
      else if (diffMinutes >= 23 && diffMinutes <= 37) unitValue = '(2) - 23-37 minutes';
      else if (diffMinutes >= 38 && diffMinutes <= 52) unitValue = '(3) - 38-52 minutes';
      else if (diffMinutes >= 53 && diffMinutes <= 67) unitValue = '(4) - 53-67 minutes';
      else if (diffMinutes >= 68 && diffMinutes <= 82) unitValue = '(5) - 68-82 minutes';
      else if (diffMinutes >= 83) unitValue = '(6+) - 83+ minutes';

      setUnits(unitValue);
    }
  }, [data.timeInHour, data.timeInMinute, data.timeOutHour, data.timeOutMinute, data.timeInAmPm, data.timeOutAmPm]);

  const calculateTotalMinutes = (hour, minute, ampm) => {
    let h = parseInt(hour, 10);
    const m = parseInt(minute, 10);
    if (ampm === 'PM' && h !== 12) h += 12;
    else if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  const handlePatientSignatureChange = (signatureData) => {
    handleChange('patientSignature', signatureData);
  };

  const handleTherapistSignatureChange = (signatureData) => {
    handleChange('therapistSignature', signatureData);
  };

  const handleDateSignatureChange = (signatureData) => {
    handleChange('dateSignature', signatureData);
  };

  const handleMoveSignatureToPatient = () => {
    if (data.therapistSignature) {
      handleChange('patientSignature', data.therapistSignature);
      handleChange('therapistSignature', null);
      setActiveTab('patientSignature');
    }
  };

  const handleMoveDateToPatient = () => {
    if (data.dateSignature) {
      handleChange('patientSignature', data.dateSignature);
      handleChange('dateSignature', null);
      setActiveTab('patientSignature');
    }
  };

  const hasIncompleteSections = () => {
    const requiredSections = ['subjective', 'transfers', 'problemList', 'skilledCare', 'muscleStrength'];
    return requiredSections.some(section => !data[section]);
  };

  return (
    <div className="finale-section-container">
      <div className="tabs-container">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={`fas ${tab.icon}`}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'additionalForms' && (
          <div className="additional-forms-tab">
            <div className="form-section">
              <div className="section-title">
                <h2>
                  <i className="fas fa-file-alt"></i>
                  Additional Forms
                </h2>
                <span className={`autosaved-badge ${autoSaveMessage ? 'visible' : ''}`}>
                  <i className="fas fa-check-circle"></i>
                  {autoSaveMessage || 'AUTOSAVED'}
                </span>
              </div>

              <div className="forms-reference">
                <div className="forms-card">
                  <div className="card-header">
                    <h3>Form Reference Guide</h3>
                    <i className="fas fa-book"></i>
                  </div>
                  <table className="forms-table">
                    <tbody>
                      <tr>
                        <td><span className="form-code">NOMNC</span></td>
                        <td>Notice of Medicare Non-Coverage</td>
                      </tr>
                      <tr>
                        <td><span className="form-code">ABN</span></td>
                        <td>Advance Beneficiary Notice of Non-Coverage</td>
                      </tr>
                      <tr>
                        <td><span className="form-code">HHCCN</span></td>
                        <td>Home Health Change of Care Notice</td>
                      </tr>
                      <tr>
                        <td><span className="form-code">PRN</span></td>
                        <td>Patient's Rights Notification</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="form-note">
                    <i className="fas fa-info-circle"></i>
                    Consult an administrator for guidance on when to use these forms
                  </p>
                </div>
              </div>

              <div className="form-row">
                <div className="instruction-text">
                  <i className="fas fa-check-square"></i>
                  <p>Check the forms that you would like to complete</p>
                </div>
                <div className="forms-checkboxes">
                  <div className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id="nomnc" 
                      checked={data.nomnc || false}
                      onChange={(e) => handleChange('nomnc', e.target.checked)}
                    />
                    <label htmlFor="nomnc">
                      <span className="checkbox-icon">
                        <i className="fas fa-file-medical"></i>
                      </span>
                      <span className="checkbox-text">NOMNC</span>
                    </label>
                  </div>
                  <div className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id="abn" 
                      checked={data.abn || false}
                      onChange={(e) => handleChange('abn', e.target.checked)}
                    />
                    <label htmlFor="abn">
                      <span className="checkbox-icon">
                        <i className="fas fa-file-invoice-dollar"></i>
                      </span>
                      <span className="checkbox-text">ABN</span>
                    </label>
                  </div>
                  <div className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id="hhccn" 
                      checked={data.hhccn || false}
                      onChange={(e) => handleChange('hhccn', e.target.checked)}
                    />
                    <label htmlFor="hhccn">
                      <span className="checkbox-icon">
                        <i className="fas fa-file-medical-alt"></i>
                      </span>
                      <span className="checkbox-text">HHCCN</span>
                    </label>
                  </div>
                  <div className="checkbox-item">
                    <input 
                      type="checkbox" 
                      id="patientsRights" 
                      checked={data.patientsRights || false}
                      onChange={(e) => handleChange('patientsRights', e.target.checked)}
                    />
                    <label htmlFor="patientsRights">
                      <span className="checkbox-icon">
                        <i className="fas fa-user-shield"></i>
                      </span>
                      <span className="checkbox-text">Patient's Rights Notification</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patientSignature' && (
          <div className="patient-signature-tab">
            <div className="form-section">
              <div className="section-title">
                <h2>
                  <i className="fas fa-signature"></i>
                  Capture Patient Signature
                </h2>
                <span className={`autosaved-badge ${autoSaveMessage ? 'visible' : ''}`}>
                  <i className="fas fa-check-circle"></i>
                  {autoSaveMessage || 'AUTOSAVED'}
                </span>
              </div>
              <div className="signature-instructions">
                <p>Please have the patient sign below or check the box if the signature was captured outside of the system.</p>
              </div>
              <div className="form-row">
                <div className="checkbox-item outside-signature">
                  <input 
                    type="checkbox" 
                    id="capturedSignatureOutside" 
                    checked={data.capturedSignatureOutside || false}
                    onChange={(e) => handleChange('capturedSignatureOutside', e.target.checked)}
                  />
                  <label htmlFor="capturedSignatureOutside">
                    <i className="fas fa-clipboard-check"></i>
                    Captured signature outside of system
                  </label>
                </div>
              </div>
              <div className="signature-container">
                <SignaturePad 
                  label="PATIENT SIGNATURE" 
                  onSignatureChange={handlePatientSignatureChange}
                  initialSignature={data.patientSignature}
                  disabled={data.capturedSignatureOutside}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'therapistSignature' && (
          <div className="therapist-signature-tab">
            <div className="form-section">
              <div className="section-title">
                <h2>
                  <i className="fas fa-pen-fancy"></i>
                  Capture Therapist Signature
                </h2>
                <span className={`autosaved-badge ${autoSaveMessage ? 'visible' : ''}`}>
                  <i className="fas fa-check-circle"></i>
                  {autoSaveMessage || 'AUTOSAVED'}
                </span>
              </div>
              <div className="signature-instructions">
                <p>Please sign below or check the box if your signature was captured outside of the system.</p>
              </div>
              <div className="form-row">
                <div className="checkbox-item outside-signature">
                  <input 
                    type="checkbox" 
                    id="therapistSignatureOutside" 
                    checked={data.therapistSignatureOutside || false}
                    onChange={(e) => handleChange('therapistSignatureOutside', e.target.checked)}
                  />
                  <label htmlFor="therapistSignatureOutside">
                    <i className="fas fa-clipboard-check"></i>
                    Captured signature outside of system
                  </label>
                </div>
              </div>
              <div className="form-row signature-control-row">
                <div className="signature-control-card">
                  <div className="card-icon">
                    <i className="fas fa-exchange-alt"></i>
                  </div>
                  <div className="signature-control-text">
                    <p>Did the patient accidentally sign the wrong spot? Click here to move this signature to the patient spot.</p>
                  </div>
                  <button 
                    className="move-signature-btn"
                    onClick={handleMoveSignatureToPatient}
                    disabled={!data.therapistSignature}
                  >
                    <i className="fas fa-exchange-alt"></i>
                    <span>MOVE SIGNATURE</span>
                  </button>
                </div>
              </div>
              <div className="signature-container">
                <SignaturePad 
                  label="THERAPIST SIGNATURE" 
                  onSignatureChange={handleTherapistSignatureChange}
                  initialSignature={data.therapistSignature}
                  disabled={data.therapistSignatureOutside}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'therapistDate' && (
          <div className="therapist-date-tab">
            <div className="form-section">
              <div className="section-title">
                <h2>
                  <i className="fas fa-calendar-check"></i>
                  Capture Date
                </h2>
                <span className={`autosaved-badge ${autoSaveMessage ? 'visible' : ''}`}>
                  <i className="fas fa-check-circle"></i>
                  {autoSaveMessage || 'AUTOSAVED'}
                </span>
              </div>
              <div className="signature-instructions">
                <p>Please add the date signature below.</p>
              </div>
              <div className="form-row signature-control-row">
                <div className="signature-control-card">
                  <div className="card-icon">
                    <i className="fas fa-exchange-alt"></i>
                  </div>
                  <div className="signature-control-text">
                    <p>Did the patient accidentally sign the wrong spot? Click here to move this signature to the patient spot.</p>
                  </div>
                  <button 
                    className="move-signature-btn"
                    onClick={handleMoveDateToPatient}
                    disabled={!data.dateSignature}
                  >
                    <i className="fas fa-exchange-alt"></i>
                    <span>MOVE SIGNATURE</span>
                  </button>
                </div>
              </div>
              <div className="signature-container">
                <SignaturePad 
                  label="DATE SIGNATURE" 
                  onSignatureChange={handleDateSignatureChange}
                  initialSignature={data.dateSignature}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeInOut' && (
          <div className="time-in-out-tab">
            <div className="form-section">
              <div className="section-title">
                <h2>
                  <i className="fas fa-clock"></i>
                  Time In/Time Out
                </h2>
                <span className={`autosaved-badge ${autoSaveMessage ? 'visible' : ''}`}>
                  <i className="fas fa-check-circle"></i>
                  {autoSaveMessage || 'AUTOSAVED'}
                </span>
              </div>
              <div className="form-row">
                <div className="info-card">
                  <div className="card-header">
                    <i className="fas fa-info-circle"></i>
                    <h3>Important Note</h3>
                  </div>
                  <p className="time-note">Be sure to modify your time in & time out. When you open a note, the current time is selected (as time in) & the system defaults units (4), as a guide for your time out. If this is your first visit of the day leave drive time at 0.</p>
                </div>
              </div>
              <div className="time-selection-container">
                <div className="time-selectors">
                  <div className="time-group">
                    <label>
                      <i className="fas fa-sign-in-alt"></i>
                      TIME IN:
                    </label>
                    <div className="time-inputs">
                      <select 
                        value={data.timeInHour || '05'}
                        onChange={(e) => handleChange('timeInHour', e.target.value)}
                      >
                        {hours.map(hour => (
                          <option key={`in-hour-${hour}`} value={hour}>{hour}</option>
                        ))}
                      </select>
                      <span className="time-separator">:</span>
                      <select 
                        value={data.timeInMinute || '15'}
                        onChange={(e) => handleChange('timeInMinute', e.target.value)}
                      >
                        {minutes.map(minute => (
                          <option key={`in-min-${minute}`} value={minute}>{minute}</option>
                        ))}
                      </select>
                      <select 
                        value={data.timeInAmPm || 'AM'}
                        onChange={(e) => handleChange('timeInAmPm', e.target.value)}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="time-group">
                    <label>
                      <i className="fas fa-sign-out-alt"></i>
                      TIME OUT:
                    </label>
                    <div className="time-inputs">
                      <select 
                        value={data.timeOutHour || '06'}
                        onChange={(e) => handleChange('timeOutHour', e.target.value)}
                      >
                        {hours.map(hour => (
                          <option key={`out-hour-${hour}`} value={hour}>{hour}</option>
                        ))}
                      </select>
                      <span className="time-separator">:</span>
                      <select 
                        value={data.timeOutMinute || '09'}
                        onChange={(e) => handleChange('timeOutMinute', e.target.value)}
                      >
                        {minutes.map(minute => (
                          <option key={`out-min-${minute}`} value={minute}>{minute}</option>
                        ))}
                      </select>
                      <select 
                        value={data.timeOutAmPm || 'AM'}
                        onChange={(e) => handleChange('timeOutAmPm', e.target.value)}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="drive-time">
                  <div className="time-group">
                    <label>
                      <i className="fas fa-car"></i>
                      DRIVE TIME:
                    </label>
                    <div className="time-inputs">
                      <select 
                        value={data.driveTimeHour || '0'}
                        onChange={(e) => handleChange('driveTimeHour', e.target.value)}
                      >
                        {Array.from({ length: 5 }, (_, i) => String(i)).map(hour => (
                          <option key={`drive-hour-${hour}`} value={hour}>{hour}</option>
                        ))}
                      </select>
                      <span className="time-separator">:</span>
                      <select 
                        value={data.driveTimeMinute || '00'}
                        onChange={(e) => handleChange('driveTimeMinute', e.target.value)}
                      >
                        {minutes.map(minute => (
                          <option key={`drive-min-${minute}`} value={minute}>{minute}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="units-display">
                <div className="units-card">
                  <div className="units-icon">
                    <i className="fas fa-calculator"></i>
                  </div>
                  <div className="units-content">
                    <h3>Calculated Units</h3>
                    <p className="units-value">{units}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'finalize' && (
          <div className="finalize-tab">
            <div className="form-section">
              <div className="section-title">
                <h2>
                  <i className="fas fa-check-circle"></i>
                  Finalize
                </h2>
                <span className={`autosaved-badge ${autoSaveMessage ? 'visible' : ''}`}>
                  <i className="fas fa-check-circle"></i>
                  {autoSaveMessage || 'AUTOSAVED'}
                </span>
              </div>

              {hasIncompleteSections() && (
                <div className="incomplete-sections">
                  <div className="warning-header">
                    <i className="fas fa-exclamation-triangle"></i>
                    <h3>Required Sections Incomplete</h3>
                  </div>
                  <p className="warning-text">
                    You must complete the following sections before being able to finalize:
                  </p>
                  <ul className="incomplete-list">
                    {!data.subjective && <li><i className="fas fa-times-circle"></i> Subjective</li>}
                    {!data.transfers && <li><i className="fas fa-times-circle"></i> Transfers / Functional Independence</li>}
                    {!data.problemList && <li><i className="fas fa-times-circle"></i> Problem List / Functional Limitations</li>}
                    {!data.skilledCare && <li><i className="fas fa-times-circle"></i> Skilled Care Provided This Visit</li>}
                    {!data.muscleStrength && <li><i className="fas fa-times-circle"></i> Muscle Strength/ROM</li>}
                  </ul>
                </div>
              )}

              <div className="summary-container">
                <div className="summary-header">
                  <h3>Visit Summary</h3>
                  <div className="header-line"></div>
                </div>
                <div className="facility-info">
                  <div className="info-card">
                    <div className="card-header">
                      <i className="fas fa-hospital-alt"></i>
                      <h4>Facility Information</h4>
                    </div>
                    <div className="card-content">
                      <p>14445 Avenida Colonia<br />
                         Moorpark, CA 93021<br />
                         (805) 223-4094</p>
                      <div className="patient-details">
                        <div className="detail-item">
                          <span className="detail-label">DOB:</span>
                          <span className="detail-value">{data.dob || 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Frequency:</span>
                          <span className="detail-value">{data.frequency || 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Cert Period:</span>
                          <span className="detail-value">{data.certPeriod || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="card-header">
                      <i className="fas fa-calendar-alt"></i>
                      <h4>Visit Information</h4>
                    </div>
                    <div className="card-content">
                      <div className="detail-item">
                        <span className="detail-label">Physician:</span>
                        <span className="detail-value">{data.physician || 'Not provided'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Agency:</span>
                        <span className="detail-value">{data.agency || 'Not provided'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Medicare Week:</span>
                        <span className="detail-value">Sunday - Saturday</span>
                      </div>
                      <div className="visit-details">
                        <div className="detail-item">
                          <span className="detail-label">Visit Date:</span>
                          <span className="detail-value">{data.visitDate || 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Time In:</span>
                          <span className="detail-value">{data.timeInHour || 'Not set'}:{data.timeInMinute || 'Not set'} {data.timeInAmPm || 'Not set'} PST</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Time Out:</span>
                          <span className="detail-value">{data.timeOutHour || 'Not set'}:{data.timeOutMinute || 'Not set'} {data.timeOutAmPm || 'Not set'} PST</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Supervisor:</span>
                          <span className="detail-value">{data.supervisor || 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Therapist:</span>
                          <span className="detail-value">{data.therapist || 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Company:</span>
                          <span className="detail-value">{data.company || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="patient-information">
                  <div className="section-card">
                    <div className="card-header">
                      <i className="fas fa-user-alt"></i>
                      <h3>Patient Information</h3>
                    </div>
                    <div className="card-content">
                      <div className="info-columns">
                        <div className="info-column">
                          <div className="info-row">
                            <div className="info-label">Past Medical History:</div>
                            <div className="info-value">{data.pastMedicalHistory || 'Not provided'}</div>
                          </div>
                          <div className="info-row">
                            <div className="info-label">Past Therapy History:</div>
                            <div className="info-value">{data.pastTherapyHistory || 'Not provided'}</div>
                          </div>
                          <div className="info-row">
                            <div className="info-label">Weight Bearing Status:</div>
                            <div className="info-value">{data.weightBearingStatus || 'Not provided'}</div>
                          </div>
                          <div className="info-row">
                            <div className="info-label">Prior Level Of Function:</div>
                            <div className="info-value">{data.priorLevelOfFunction || 'Not provided'}</div>
                          </div>
                          <div className="info-row">
                            <div className="info-label">Surgical Procedure(s):</div>
                            <div className="info-value">{data.surgicalProcedures || 'Not provided'}</div>
                          </div>
                        </div>

                        <div className="info-column">
                          <div className="info-row">
                            <div className="info-label">Expectations of Therapy:</div>
                            <div className="info-value">{data.expectations || 'Not provided'}</div>
                          </div>
                          <div className="info-row">
                            <div className="info-label">Therapy Diagnosis:</div>
                            <div className="info-value">{data.therapyDiagnosis || 'Not provided'}</div>
                          </div>
                          <div className="info-row">
                            <div className="info-label">Additional Disciplines:</div>
                            <div className="info-value">{data.additionalDisciplines || 'Not provided'}</div>
                          </div>
                          <div className="info-row">
                            <div className="info-label">Homebound Status:</div>
                            <div className="info-value">{data.homeboundStatus || 'Not provided'}</div>
                          </div>
                          <div className="info-row">
                            <div className="info-label">Hospitalization Dates:</div>
                            <div className="info-value">{data.hospitalizationDates || 'Not provided'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="clinical-information">
                  <div className="section-card">
                    <div className="card-header">
                      <i className="fas fa-clipboard-list"></i>
                      <h3>Clinical Information</h3>
                    </div>
                    <div className="card-content">
                      <div className="clinical-section">
                        <h4>
                          <i className="fas fa-comment-alt"></i>
                          Subjective
                        </h4>
                        <p>{data.subjective || 'Not provided'}</p>
                      </div>

                      <div className="clinical-section">
                        <h4>
                          <i className="fas fa-microscope"></i>
                          Objective
                        </h4>
                        <div className="objective-item">
                          <span className="objective-label">Transfers/Functional Independence:</span>
                          <span className="objective-value">{data.transfers || 'Not provided'}</span>
                        </div>
                        <div className="objective-item">
                          <span className="objective-label">Problem List/Functional Limitations:</span>
                          <span className="objective-value">{data.problemList || 'Not provided'}</span>
                        </div>
                        <div className="objective-item">
                          <span className="objective-label">Skilled Care Provided This Visit:</span>
                          <span className="objective-value">{data.skilledCare || 'Not provided'}</span>
                        </div>
                        <div className="objective-item">
                          <span className="objective-label">Muscle Strength/ROM:</span>
                          <span className="objective-value">{data.muscleStrength || 'Not provided'}</span>
                        </div>
                        
                        {data.prosthetics && data.prosthetics.length > 0 && (
                          <div className="addon-section">
                            <h5>Prosthetics</h5>
                            <ul className="addon-list">
                              {data.prosthetics.map((item, index) => (
                                <li key={index}>{item.type} - {item.usage} {item.notes ? `(${item.notes})` : ''}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {data.orthotics && data.orthotics.length > 0 && (
                          <div className="addon-section">
                            <h5>Orthotics</h5>
                            <ul className="addon-list">
                              {data.orthotics.map((item, index) => (
                                <li key={index}>{item.type} - {item.usage} {item.notes ? `(${item.notes})` : ''}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {data.additionalInformation && (
                          <div className="objective-item">
                            <span className="objective-label">Additional Information:</span>
                            <span className="objective-value">{data.additionalInformation}</span>
                          </div>
                        )}
                      </div>

                      <div className="clinical-section">
                        <h4>
                          <i className="fas fa-chart-bar"></i>
                          Assessment
                        </h4>
                        <div className="assessment-item">
                          <span className="assessment-label">Rehab Potential:</span>
                          <span className="assessment-value">{data.rehabPotential || 'Not provided'}</span>
                        </div>
                      </div>

                      <div className="clinical-section">
                        <h4>
                          <i className="fas fa-tasks"></i>
                          Plan
                        </h4>
                        <div className="plan-item">
                          <span className="plan-label">Treatment As Tolerated/Interventions:</span>
                          <span className="plan-value">{data.treatmentInterventions || 'Not provided'}</span>
                        </div>
                        <div className="plan-item">
                          <span className="plan-label">Frequency:</span>
                          <span className="plan-value">{data.frequency || 'Not provided'}</span>
                        </div>
                        <div className="plan-item">
                          <span className="plan-label">Additional Information:</span>
                          <span className="plan-value">{data.certificationAdditionalInfo || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="goals-information">
                  <div className="section-card">
                    <div className="card-header">
                      <i className="fas fa-bullseye"></i>
                      <h3>Goals</h3>
                    </div>
                    <div className="card-content">
                      {data.goals && Object.keys(data.goals).length > 0 ? (
                        Object.entries(data.goals).map(([category, goal]) => (
                          <div className="goal-category" key={category}>
                            <h4>{category}</h4>
                            <div className="goal-item">
                              <span className="goal-label">Long Term (In Progress):</span>
                              <span className="goal-value">{goal.description || 'Not provided'}</span>
                            </div>
                            <div className="goal-timeframe">
                              <span className="timeframe-item">
                                <strong>Starting:</strong> {goal.startDate || 'Not provided'} 
                              </span>
                              <span className="timeframe-item">
                                <strong>Duration:</strong> {goal.duration || 'Not provided'} 
                                {goal.duration === '1' ? ' week' : ' weeks'}
                              </span>
                              <span className="timeframe-item">
                                <strong>Completion:</strong> {
                                  goal.startDate && goal.duration ? 
                                  new Date(
                                    new Date(goal.startDate).getTime() + 
                                    (parseInt(goal.duration, 10) * 7 * 24 * 60 * 60 * 1000)
                                  ).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : 
                                  'Not provided'
                                }
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="no-goals">No goals set.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="signature-info">
                  <div className="section-card">
                    <div className="card-header">
                      <i className="fas fa-signature"></i>
                      <h3>Signatures</h3>
                    </div>
                    <div className="card-content">
                      <p className="digital-signature-text">
                        <i className="fas fa-info-circle"></i>
                        Digitally Signed, which is approved by the Home Health Care Governing Bodies and Federal Guidelines.
                      </p>
                      <div className="signature-grid">
                        <div className="signature-row">
                          <div className="signature-item">
                            <div className="signature-label">Patient (HATCHER, LEONARD)</div>
                            <div className="signature-image">
                              {data.patientSignature ? (
                                <img src={data.patientSignature} alt="Patient Signature" />
                              ) : (
                                <div className="no-signature">
                                  <i className="fas fa-signature"></i>
                                  <span>No signature captured</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="signature-item">
                            <div className="signature-label">Therapist (Weiss, Barry, PT)</div>
                            <div className="signature-image">
                              {data.therapistSignature ? (
                                <img src={data.therapistSignature} alt="Therapist Signature" />
                              ) : (
                                <div className="no-signature">
                                  <i className="fas fa-signature"></i>
                                  <span>No signature captured</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="signature-item">
                            <div className="signature-label">Date</div>
                            <div className="signature-image">
                              {data.dateSignature ? (
                                <img src={data.dateSignature} alt="Date Signature" />
                              ) : (
                                <div className="no-signature">
                                  <i className="fas fa-calendar-day"></i>
                                  <span>No date captured</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinaleSection;