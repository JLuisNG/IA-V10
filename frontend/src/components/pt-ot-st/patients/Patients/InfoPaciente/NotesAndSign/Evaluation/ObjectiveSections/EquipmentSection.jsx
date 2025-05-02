// Enhanced EquipmentSection.jsx
import React, { useState } from 'react';
import '../../../../../../../../styles/developer/Patients/InfoPaciente/NotesAndSign/ObjectiveSections/EquipmentSection.scss';

const EquipmentSection = ({ data, onChange }) => {
  // Estado para búsqueda y filtrado
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({
    gaitMobility: true,
    transfers: true,
    toileting: true,
    bathing: true,
    bedMobility: true,
    dressing: true,
    other: true
  });
  
  // Información de los grupos para UI mejorada
  const groupInfo = {
    gaitMobility: {
      title: 'Gait & Mobility',
      icon: 'fas fa-walking',
      description: 'Equipment used to assist with walking and movement'
    },
    transfers: {
      title: 'Transfers',
      icon: 'fas fa-exchange-alt',
      description: 'Equipment used to assist with transfers between surfaces'
    },
    toileting: {
      title: 'Toileting',
      icon: 'fas fa-toilet',
      description: 'Equipment used to assist with toileting activities'
    },
    bathing: {
      title: 'Bathing',
      icon: 'fas fa-bath',
      description: 'Equipment used to assist with bathing and showering'
    },
    bedMobility: {
      title: 'Bed Mobility',
      icon: 'fas fa-bed',
      description: 'Equipment used to assist with movement in bed'
    },
    dressing: {
      title: 'Dressing',
      icon: 'fas fa-tshirt',
      description: 'Equipment used to assist with dressing activities'
    },
    other: {
      title: 'Other Equipment',
      icon: 'fas fa-tools',
      description: 'Additional assistive devices and equipment'
    }
  };

  // Grupos de equipamientos
  const equipmentGroups = {
    gaitMobility: [
      { id: 'rollingWalker', label: 'Rolling Walker' },
      { id: 'rollator', label: 'Rollator' },
      { id: 'singlePointCane', label: 'Single Point Cane' },
      { id: 'standardWalker', label: 'Standard Walker' },
      { id: 'standardWheelchair', label: 'Standard Wheelchair' },
      { id: 'quadCane', label: 'Quad Cane' },
      { id: 'axillaryCrutches', label: 'Axillary Crutches' },
      { id: 'hemiWalker', label: 'Hemi Walker' },
      { id: 'lofstrandCrutches', label: 'Lofstrand Crutches' },
      { id: 'oneArmDriveWheelchair', label: 'One Arm Drive Wheelchair' },
      { id: 'platformWalker', label: 'Platform Walker' },
      { id: 'powerChair', label: 'Power Chair' }
    ],
    transfers: [
      { id: 'grabBars', label: 'Grab Bars' },
      { id: 'liftChair', label: 'Lift Chair' },
      { id: 'showerChair', label: 'Shower Chair' },
      { id: 'slidingBoard', label: 'Sliding Board' },
      { id: 'stairLift', label: 'Stair Lift' },
      { id: 'stander', label: 'Stander' },
      { id: 'tubTransferBench', label: 'Tub Transfer Bench' }
    ],
    toileting: [
      { id: 'threeInOne', label: '3-in-1' },
      { id: 'bedsideCommode', label: 'Bedside Commode' },
      { id: 'raisedToiletSeat', label: 'Raised Toilet Seat' }
    ],
    bathing: [
      { id: 'bathMitt', label: 'Bath Mitt' },
      { id: 'handHeldShowerHead', label: 'Hand-held Shower Head' },
      { id: 'longHandleSponge', label: 'Long Handle Sponge' },
      { id: 'rubberMatForTub', label: 'Rubber Mat for Tub' },
      { id: 'suctionBrush', label: 'Suction Brush' }
    ],
    bedMobility: [
      { id: 'armRests', label: 'Arm Rests' },
      { id: 'bedBar', label: 'Bed Bar' },
      { id: 'bedRails', label: 'Bed Rails' },
      { id: 'hospitalBed', label: 'Hospital Bed' },
      { id: 'hoyerLift', label: 'Hoyer Lift' },
      { id: 'trapeze', label: 'Trapeze' }
    ],
    dressing: [
      { id: 'buttonHook', label: 'Button Hook' },
      { id: 'dressingStick', label: 'Dressing Stick' },
      { id: 'elasticShoeLaces', label: 'Elastic Shoe Laces' },
      { id: 'longHandleShoeHorn', label: 'Long Handle Shoe Horn' },
      { id: 'sockAide', label: 'Sock Aide' }
    ],
    other: [
      { id: 'armSling', label: 'Arm Sling' },
      { id: 'eatingUtensils', label: 'Eating Utensils' },
      { id: 'reacher', label: 'Reacher' },
      { id: 'stairRails', label: 'Stair Rails' },
      { id: 'tensUnit', label: 'TENS Unit' },
      { id: 'ueSplints', label: 'UE Splints' }
    ]
  };
  
  // Obtener la cantidad total de equipos seleccionados
  const getSelectedCount = () => {
    let count = 0;
    Object.keys(equipmentGroups).forEach(group => {
      if (data[group]) {
        count += Object.values(data[group]).filter(Boolean).length;
      }
    });
    return count;
  };
  
  // Obtener la cantidad de equipos seleccionados por grupo
  const getGroupSelectedCount = (group) => {
    if (!data[group]) return 0;
    return Object.values(data[group]).filter(Boolean).length;
  };
  
  // Manejar cambios en los checkboxes
  const handleCheckboxChange = (group, itemId) => {
    // Inicializar grupo si no existe
    const groupData = data[group] || {};
    
    // Actualizar el valor del checkbox
    const updatedGroup = {
      ...groupData,
      [itemId]: !groupData[itemId]
    };
    
    onChange({
      ...data,
      [group]: updatedGroup
    });
  };

  // Manejar cambios en textarea
  const handleTextChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };
  
  // Manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Alternar la expansión de un grupo
  const toggleGroupExpansion = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };
  
  // Filtrar equipos por término de búsqueda
  const filterEquipment = (items) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Renderizar un grupo de checkboxes
  const renderCheckboxGroup = (groupKey, items) => {
    const groupDetails = groupInfo[groupKey];
    const filteredItems = filterEquipment(items);
    const selectedCount = getGroupSelectedCount(groupKey);
    const isExpanded = expandedGroups[groupKey];
    const hasMatchingItems = filteredItems.length > 0;
    
    return (
      <div className={`equipment-group ${!hasMatchingItems && searchTerm ? 'hidden' : ''}`}>
        <div 
          className="group-header" 
          onClick={() => toggleGroupExpansion(groupKey)}
        >
          <div className="group-title-container">
            <div className="group-icon">
              <i className={groupDetails.icon}></i>
            </div>
            <div className="group-info">
              <h3 className="group-title">{groupDetails.title}</h3>
              <p className="group-description">{groupDetails.description}</p>
            </div>
          </div>
          <div className="group-actions">
            {selectedCount > 0 && (
              <span className="selected-badge">{selectedCount} selected</span>
            )}
            <button className="toggle-button">
              <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>
        
        {isExpanded && hasMatchingItems && (
          <div className="checkbox-container">
            <div className="checkbox-group">
              {filteredItems.map(item => (
                <div 
                  className={`checkbox-item ${data[groupKey]?.[item.id] ? 'selected' : ''}`} 
                  key={item.id}
                >
                  <input 
                    type="checkbox" 
                    id={item.id} 
                    checked={data[groupKey]?.[item.id] || false}
                    onChange={() => handleCheckboxChange(groupKey, item.id)}
                  />
                  <label htmlFor={item.id}>{item.label}</label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="equipment-section">
      <div className="section-header">
        <h2 className="section-title">
          <i className="fas fa-wheelchair"></i>
          Equipment
        </h2>
        <div className="section-meta">
          <div className="equipment-count">
            <span className="count-number">{getSelectedCount()}</span>
            <span className="count-label">items selected</span>
          </div>
        </div>
      </div>
      
      <div className="equipment-owned-section">
        <div className="section-header-actions">
          <h3 className="subsection-title">
            <i className="fas fa-box-open"></i>
            Equipment Owned
          </h3>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
            {searchTerm && (
              <button 
                className="clear-search" 
                onClick={() => setSearchTerm('')}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
        
        <div className="equipment-grid">
          <div className="equipment-column">
            {renderCheckboxGroup('gaitMobility', equipmentGroups.gaitMobility)}
            {renderCheckboxGroup('transfers', equipmentGroups.transfers)}
            {renderCheckboxGroup('toileting', equipmentGroups.toileting)}
            {renderCheckboxGroup('bathing', equipmentGroups.bathing)}
          </div>
          
          <div className="equipment-column">
            {renderCheckboxGroup('bedMobility', equipmentGroups.bedMobility)}
            {renderCheckboxGroup('dressing', equipmentGroups.dressing)}
            {renderCheckboxGroup('other', equipmentGroups.other)}
          </div>
        </div>
      </div>
      
      <div className="additional-info-container">
        <h3 className="subsection-title">
          <i className="fas fa-sticky-note"></i>
          Additional Information
        </h3>
        <textarea 
          value={data.additionalInformation || ''}
          onChange={(e) => handleTextChange('additionalInformation', e.target.value)}
          rows={4}
          placeholder="Add any additional information about equipment"
          className="additional-info-textarea"
        />
      </div>
    </div>
  );
};

export default EquipmentSection;