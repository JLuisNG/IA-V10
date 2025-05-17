import React, { useState, useEffect } from 'react';
import '../../../../styles/developer/Patients/Staffing/StaffEditComponent.scss';

const DevStaffEditComponent = ({ onBackToOptions, onAddNewStaff }) => {
  // Estados para gestionar la interfaz y datos
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Connecting to database...');
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [showInactive, setShowInactive] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'staff', 'agencies'

  // Función para construir parámetros de consulta para API
  const buildQueryParams = (params) =>
    Object.entries(params)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

  // Simulación de carga con mensajes dinámicos
  useEffect(() => {
    setIsLoading(true);
    setLoadingMessage('Connecting to database...');
    
    const loadingMessages = [
      { message: 'Verifying user permissions...', time: 800 },
      { message: 'Retrieving staff list...', time: 800 },
      { message: 'Loading associated documents...', time: 500 },
      { message: 'Preparing interface...', time: 1500 },
      { message: 'Optimizing performance...', time: 1000 }
    ];
    
    const timeouts = [];
    
    loadingMessages.forEach((item, index) => {
      const timeout = setTimeout(() => {
        setLoadingMessage(item.message);
        if (index === loadingMessages.length - 1) {
          const finalTimeout = setTimeout(() => {
            setIsLoading(false);
            fetchStaffData();
          }, 800);
          timeouts.push(finalTimeout);
        }
      }, item.time);
      
      timeouts.push(timeout);
    });
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Obtener datos del personal desde la API
  const fetchStaffData = async () => {
    try {
      const response = await fetch('http://localhost:8000/staff/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener los datos del personal');
      }
  
      const data = await response.json();
  
      const adjustedData = data.map(staff => {
        // Procesar el nombre completo para separarlo en nombre y apellido
        const [firstName, ...rest] = staff.name?.split(' ') || [''];
        const lastName = rest.join(' ');
  
        // Mapear el rol a su visualización correspondiente
        const roleDisplay = roles.find(r => r.value === staff.role)?.label || staff.role;
        
        // Determinar el tipo basado en el rol (agency o staff)
        const type = staff.role === 'agency' ? 'agency' : 'staff';
        
        // Para el tipo agency, usar el name como agencyName
        const agencyName = type === 'agency' ? staff.name : '';
        
        // Para los tipos staff que pueden tener una agencia asignada, buscar si tiene agency_id 
        // (esto depende de cómo esté estructurada tu API)
        const agency = staff.agency_id ? {
          id: staff.agency_id,
          name: staff.agency_name || '',
          address: staff.agency_address || '',
          phone: staff.agency_phone || ''
        } : null;
        
        // Procesar las sucursales si existen (esto depende de cómo esté estructurada tu API)
        const branches = staff.branches ? JSON.parse(staff.branches) : [];
        
        // Inicializar documentos basados en el tipo y rol
        const documents = staff.documents ? JSON.parse(staff.documents) : 
          type === 'agency' ? initializeDocuments('agency', 'agency') : 
          requiresDocuments(staff.role) ? initializeDocuments(staff.role, 'staff') : {};
  
        return {
          id: staff.id,
          type: type,
          firstName: firstName || '',
          lastName: lastName || '',
          agencyName: agencyName,
          dob: staff.birthday || '',
          gender: staff.gender || '',
          email: staff.email || '',
          phone: staff.phone || '',
          alternatePhone: staff.alt_phone || '',
          zipCode: staff.postal_code || '',
          address: staff.address || '',
          userName: staff.username || '',
          password: '********', // Por seguridad siempre ocultamos la contraseña
          role: staff.role || '',
          roleDisplay: roleDisplay,
          agency: agency,
          branches: branches,
          documents: documents,
          status: staff.is_active ? 'active' : 'inactive',
          fax: staff.fax || ''
        };
      });
  
      setStaffList(adjustedData);
      setFilteredStaff(adjustedData);
    } catch (error) {
      console.error('Error al obtener la lista de personal:', error);
      alert('Hubo un error al cargar los datos del personal. Por favor, intenta de nuevo.');
      setStaffList([]);
      setFilteredStaff([]);
    }
  };

  // Filtrar y ordenar la lista de personal
  useEffect(() => {
    let filtered = [...staffList];
    
    // Filtrar por tipo (staff/agency)
    if (viewMode === 'staff') {
      filtered = filtered.filter(member => member.type === 'staff');
    } else if (viewMode === 'agencies') {
      filtered = filtered.filter(member => member.type === 'agency');
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(member => {
        const nameField = member.type === 'agency' 
          ? member.agencyName.toLowerCase()
          : `${member.firstName} ${member.lastName}`.toLowerCase();
        
        return nameField.includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.phone.includes(searchTerm);
      });
    }
    
    // Filtrar por rol (solo si está viendo staff)
    if (filterRole !== 'all' && viewMode !== 'agencies') {
      filtered = filtered.filter(member => member.role === filterRole);
    }
    
    // Filtrar por estado si no se muestran inactivos
    if (!showInactive) {
      filtered = filtered.filter(member => member.status === 'active');
    }
    
    setFilteredStaff(filtered);
  }, [staffList, searchTerm, filterRole, showInactive, viewMode]);

  // Roles disponibles con iconos mejorados
  const roles = [
    { value: 'developer', label: 'Developer', icon: 'fa-laptop-code', description: 'System development and technical support' },
    { value: 'administrator', label: 'Administrator', icon: 'fa-user-shield', description: 'System administration and user management' },
    { value: 'agency', label: 'Agency', icon: 'fa-hospital-alt', description: 'Healthcare provider organization' },
    { value: 'pt', label: 'PT - Physical Therapist', icon: 'fa-user-md', description: 'Evaluates and treats physical mobility disorders' },
    { value: 'pta', label: 'PTA - Physical Therapist Assistant', icon: 'fa-user-nurse', description: 'Assists physical therapists in treatment delivery' },
    { value: 'ot', label: 'OT - Occupational Therapist', icon: 'fa-hand-holding-medical', description: 'Helps patients improve daily living activities' },
    { value: 'cota', label: 'COTA - Occupational Therapy Assistant', icon: 'fa-hand-holding', description: 'Assists occupational therapists with treatment' },
    { value: 'st', label: 'ST - Speech Therapist', icon: 'fa-comment-medical', description: 'Evaluates and treats communication disorders' },
    { value: 'sta', label: 'STA - Speech Therapy Assistant', icon: 'fa-comment-dots', description: 'Assists speech therapists with therapy sessions' },
  ];

  // Lista de documentos requeridos con iconos mejorados
  const documentsList = {
    staff: [
      { id: 'covidVaccine', name: 'Proof of COVID Vaccine', icon: 'fa-syringe', description: 'Vaccination record or certificate' },
      { id: 'tbTest', name: 'TB Test Proof (PPD/X-Ray)', icon: 'fa-lungs', description: 'PPD Test (valid for 1 year) or X-Ray TB test (valid for 5 years)' },
      { id: 'physicalExam', name: 'Annual Physical Exam Proof', icon: 'fa-stethoscope', description: 'Medical clearance for healthcare duties' },
      { id: 'liabilityInsurance', name: 'Professional Liability Insurance', icon: 'fa-shield-alt', description: 'Malpractice insurance coverage document' },
      { id: 'driversLicense', name: 'Driver\'s License', icon: 'fa-id-card', description: 'Valid state-issued driver\'s license' },
      { id: 'autoInsurance', name: 'Auto Insurance', icon: 'fa-car-alt', description: 'Proof of current auto insurance coverage' },
      { id: 'cprCertification', name: 'CPR/BLS Certification', icon: 'fa-heartbeat', description: 'Current CPR or Basic Life Support certification' },
      { id: 'businessLicense', name: 'Copy of Business License or EIN', icon: 'fa-certificate', description: 'Business license or Employer Identification Number document' },
    ],
    agency: [
      { id: 'businessLicense', name: 'Business License', icon: 'fa-building', description: 'Valid business operation license' },
      { id: 'contractDocument', name: 'Contract with TherapySync', icon: 'fa-file-contract', description: 'Signed service agreement' },
      { id: 'liabilityInsurance', name: 'Liability Insurance', icon: 'fa-shield-alt', description: 'Organization liability coverage documentation' },
    ]
  };

  // Abrir modal para editar un miembro existente
  const handleOpenProfile = (member) => {
    setSelectedStaff({...member}); // Clonar para evitar modificaciones directas
    setShowProfileModal(true);
    setEditMode(true);
    
    // Resetear la pestaña activa según el tipo de miembro
    if (member.type === 'agency') {
      setActiveTab('info');
    } else {
      setActiveTab('info');
    }
    
    setPasswordVisible(false);
  };

  // Cerrar el modal
  const handleCloseProfile = () => {
    setShowProfileModal(false);
    setSelectedStaff(null);
    setEditMode(false);
  };

  // Toggle visibilidad de contraseña
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Guardar cambios en la API
  const handleSaveProfile = async (updatedStaff) => {
    try {
      // Preparar el objeto para enviar a la API
      const staffToUpdate = {
        name: updatedStaff.type === 'agency' 
          ? updatedStaff.agencyName 
          : `${updatedStaff.firstName} ${updatedStaff.lastName}`,
        birthday: updatedStaff.dob || '',
        gender: updatedStaff.gender || '',
        postal_code: updatedStaff.zipCode || '',
        email: updatedStaff.email,
        phone: updatedStaff.phone || '',
        alt_phone: updatedStaff.alternatePhone || '',
        address: updatedStaff.address || '',
        username: updatedStaff.userName,
        role: updatedStaff.role,
        is_active: updatedStaff.status === 'active',
        fax: updatedStaff.fax || ''
      };
      
      // Si el password ha sido modificado (no es '********'), enviarlo
      if (updatedStaff.password && updatedStaff.password !== '********') {
        staffToUpdate.password = updatedStaff.password;
      }
      
      // Si tiene agencia asignada, incluir esa información
      if (updatedStaff.agency && updatedStaff.agency.id) {
        staffToUpdate.agency_id = updatedStaff.agency.id;
      }
      
      // Si es una agencia, incluir la información de sucursales
      if (updatedStaff.type === 'agency' && updatedStaff.branches) {
        staffToUpdate.branches = JSON.stringify(updatedStaff.branches);
      }
      
      // Incluir documentos si existen
      if (updatedStaff.documents && Object.keys(updatedStaff.documents).length > 0) {
        staffToUpdate.documents = JSON.stringify(updatedStaff.documents);
      }
      
      // Construir la cadena de consulta
      const queryString = buildQueryParams(staffToUpdate);
      
      // Realizar la petición PUT a la API
      const response = await fetch(`http://localhost:8000/staff/${updatedStaff.id}?${queryString}`, {
        method: 'PUT'
      });
      
      if (!response.ok) {
        const error = await response.json();
        const readable = error?.detail || 'Error al actualizar los datos del personal';
        throw new Error(readable);
      }
      
      const data = await response.json();
      console.log("✅ Staff updated:", data);
      
      // Actualizar la lista de staff localmente con los datos actualizados
      const updatedStaffList = staffList.map(item => 
        item.id === updatedStaff.id ? updatedStaff : item
      );
      
      setStaffList(updatedStaffList);
      
      // Actualizar el filtrado manteniendo los filtros actuales
      setFilteredStaff(updatedStaffList.filter(member => {
        let matchesFilters = true;
        
        if (viewMode === 'staff' && member.type !== 'staff') {
          return false;
        }
        
        if (viewMode === 'agencies' && member.type !== 'agency') {
          return false;
        }
        
        if (filterRole !== 'all' && viewMode !== 'agencies') {
          matchesFilters = matchesFilters && member.role === filterRole;
        }
        
        if (!showInactive) {
          matchesFilters = matchesFilters && member.status === 'active';
        }
        
        if (searchTerm) {
          const nameField = member.type === 'agency' 
            ? member.agencyName.toLowerCase()
            : `${member.firstName} ${member.lastName}`.toLowerCase();
          
          matchesFilters = matchesFilters && (
            nameField.includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.phone.includes(searchTerm)
          );
        }
        
        return matchesFilters;
      }));
      
      alert('Los cambios se guardaron correctamente.');
      handleCloseProfile();
      
    } catch (error) {
      console.error('❌ Error in handleSaveProfile:', error);
      alert(`Hubo un error al procesar la información del personal.\n${error.message}`);
    }
  };

  const handleChangeTab = (tab) => {
    setActiveTab(tab);
  };

  const handleDocumentStatusToggle = (memberId, documentId) => {
    const updatedStaffList = staffList.map(member => {
      if (member.id === memberId) {
        return {
          ...member,
          documents: {
            ...member.documents,
            [documentId]: {
              ...member.documents[documentId],
              status: member.documents[documentId].status === 'obtained' ? 'pending' : 'obtained'
            }
          }
        };
      }
      return member;
    });
    
    setStaffList(updatedStaffList);
    
    if (selectedStaff && selectedStaff.id === memberId) {
      setSelectedStaff({
        ...selectedStaff,
        documents: {
          ...selectedStaff.documents,
          [documentId]: {
            ...selectedStaff.documents[documentId],
            status: selectedStaff.documents[documentId].status === 'obtained' ? 'pending' : 'obtained'
          }
        }
      });
    }
  };

  const handleDocumentUpload = (memberId, documentId, e) => {
    if (e.target.files[0]) {
      const updatedStaffList = staffList.map(member => {
        if (member.id === memberId) {
          // Asegurarnos de que documents esté inicializado
          const updatedDocuments = member.documents || {};
          
          return {
            ...member,
            documents: {
              ...updatedDocuments,
              [documentId]: {
                status: 'obtained',
                file: e.target.files[0].name
              }
            }
          };
        }
        return member;
      });
      
      setStaffList(updatedStaffList);
      
      if (selectedStaff && selectedStaff.id === memberId) {
        // Asegurarnos de que documents esté inicializado
        const updatedDocuments = selectedStaff.documents || {};
        
        setSelectedStaff({
          ...selectedStaff,
          documents: {
            ...updatedDocuments,
            [documentId]: {
              status: 'obtained',
              file: e.target.files[0].name
            }
          }
        });
      }
    }
  };

  // Actualizar datos de miembro
  const handleUpdateMember = (field, value) => {
    if (!selectedStaff) return;
    
    setSelectedStaff(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Actualizar agencia para staff
  const handleUpdateAgency = (agencyId) => {
    if (!selectedStaff) return;
    
    const selectedAgency = staffList
      .filter(item => item.type === 'agency')
      .find(a => a.id === parseInt(agencyId));
    
    if (selectedAgency) {
      setSelectedStaff(prev => ({
        ...prev,
        agency: {
          id: selectedAgency.id,
          name: selectedAgency.agencyName,
          address: selectedAgency.address,
          phone: selectedAgency.phone
        }
      }));
    }
  };

  // Actualizar campos de agencia
  const handleUpdateAgencyField = (field, value) => {
    if (!selectedStaff || selectedStaff.type !== 'agency') return;
    
    setSelectedStaff(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Actualizar sucursal de agencia
  const handleUpdateBranch = (index, field, value) => {
    if (!selectedStaff || selectedStaff.type !== 'agency') return;
    
    const updatedBranches = [...(selectedStaff.branches || [])];
    updatedBranches[index] = {
      ...(updatedBranches[index] || {}),
      [field]: value
    };
    
    setSelectedStaff(prev => ({
      ...prev,
      branches: updatedBranches
    }));
  };

  // Añadir nueva sucursal
  const handleAddBranch = () => {
    if (!selectedStaff || selectedStaff.type !== 'agency') return;
    
    setSelectedStaff(prev => ({
      ...prev,
      branches: [
        ...(prev.branches || []),
        { name: '', address: '', phone: '' }
      ]
    }));
  };

  // Eliminar sucursal
  const handleRemoveBranch = (index) => {
    if (!selectedStaff || selectedStaff.type !== 'agency') return;
    
    const updatedBranches = [...(selectedStaff.branches || [])];
    updatedBranches.splice(index, 1);
    
    setSelectedStaff(prev => ({
      ...prev,
      branches: updatedBranches
    }));
  };

  // Calcular porcentaje de documentos completados correctamente
  const getCompletedDocsPercentage = (documents, type) => {
    if (!documents || Object.keys(documents).length === 0) return 0;
    
    // Determinar qué lista de documentos usar
    const docList = type === 'agency' ? documentsList.agency : documentsList.staff;
    
    // Contar cuántos documentos requeridos hay para este tipo
    const requiredDocsCount = docList.length;
    
    // Contar cuántos están completados
    let completedCount = 0;
    docList.forEach(doc => {
      if (documents[doc.id] && documents[doc.id].status === 'obtained') {
        completedCount++;
      }
    });
    
    // Calcular el porcentaje
    return Math.round((completedCount / requiredDocsCount) * 100);
  };

  // Inicializa los documentos para un tipo específico
  const initializeDocuments = (role, type) => {
    const documents = {};
    
    // Determinar qué lista de documentos usar
    const docList = type === 'agency' ? documentsList.agency : documentsList.staff;
    
    // Inicializar todos como pendientes
    docList.forEach(doc => {
      documents[doc.id] = { status: 'pending', file: null };
    });
    
    return documents;
  };

  // Debemos inicializar documentos cuando cambia el rol
  useEffect(() => {
    if (selectedStaff && editMode) {
      // Si cambia de rol y necesita documentos diferentes, inicializamos
      if (['pt', 'pta', 'ot', 'cota', 'st', 'sta'].includes(selectedStaff.role) && 
          (!selectedStaff.documents || Object.keys(selectedStaff.documents).length === 0)) {
        setSelectedStaff(prev => ({
          ...prev,
          documents: initializeDocuments(prev.role, prev.type)
        }));
      } else if (selectedStaff.role === 'agency' && 
                (!selectedStaff.documents || Object.keys(selectedStaff.documents).length === 0)) {
        setSelectedStaff(prev => ({
          ...prev,
          documents: initializeDocuments(prev.role, 'agency')
        }));
      }
    }
  }, [selectedStaff?.role, editMode]);

  // Verificar si el rol requiere afiliación a una agencia
  const requiresAgency = (role) => {
    return ['pt', 'pta', 'ot', 'cota', 'st', 'sta', 'administrator'].includes(role);
  };

  // Verificar si el rol requiere documentos
  const requiresDocuments = (role) => {
    return ['pt', 'pta', 'ot', 'cota', 'st', 'sta', 'agency'].includes(role);
  };

  // Renderizar pestañas basado en el tipo de miembro seleccionado
  const renderTabs = () => {
    if (!selectedStaff) return null;
    
    const commonTabs = [
      { id: 'info', icon: 'fa-user-circle', label: 'Personal Information' },
      { id: 'security', icon: 'fa-shield-alt', label: 'Security' },
    ];
    
    // Pestañas específicas para staff
    if (selectedStaff.type === 'staff') {
      const tabs = [...commonTabs];
      
      // Solo mostrar pestaña de documentos para roles que requieren documentos
      if (requiresDocuments(selectedStaff.role)) {
        tabs.splice(1, 0, { id: 'documents', icon: 'fa-file-medical-alt', label: 'Documents' });
      }
      
      // Mostrar pestaña de agencia para roles que requieren afiliación
      if (requiresAgency(selectedStaff.role)) {
        // Solo añadir la pestaña de agencia si no está ya
        if (!tabs.some(tab => tab.id === 'agency')) {
          tabs.splice(1, 0, { id: 'agency', icon: 'fa-hospital-user', label: 'Agency' });
        }
      }
      
      return tabs;
    }
    
    // Pestañas específicas para agencias
    return [
      { id: 'info', icon: 'fa-building', label: 'Agency Information' },
      { id: 'branches', icon: 'fa-code-branch', label: 'Branches' },
      { id: 'documents', icon: 'fa-file-contract', label: 'Documents' },
      { id: 'security', icon: 'fa-lock', label: 'Security' },
    ];
  };

  // Renderizar contenido de pestañas basado en tipo y rol
  const renderTabContent = () => {
    if (!selectedStaff) return null;
    
    // Renderizar contenido para staff
    if (selectedStaff.type === 'staff') {
      switch (activeTab) {
        case 'info':
          return renderStaffInfoTab();
        case 'documents':
          return requiresDocuments(selectedStaff.role) ? renderDocumentsTab('staff') : null;
        case 'security':
          return renderSecurityTab();
        case 'agency':
          return requiresAgency(selectedStaff.role) ? renderAgencyTab() : null;
        default:
          return null;
      }
    }
    
    // Renderizar contenido para agencias
    switch (activeTab) {
      case 'info':
        return renderAgencyInfoTab();
      case 'branches':
        return renderBranchesTab();
      case 'documents':
        return renderDocumentsTab('agency');
      case 'security':
        return renderSecurityTab();
      default:
        return null;
    }
  };

  // Pestaña de información personal para staff
  const renderStaffInfoTab = () => (
    <div className="info-tab-content">
      {/* Información Personal */}
      <div className="info-section">
        <h3>Personal Information</h3>
        <div className="contact-form">
          <div className="form-row">
            <div className="input-group">
              <label>Date of Birth</label>
              <input 
                type="date" 
                value={selectedStaff.dob || ''} 
                onChange={(e) => handleUpdateMember('dob', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Gender</label>
              <select 
                value={selectedStaff.gender || ''} 
                onChange={(e) => handleUpdateMember('gender', e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Información de Contacto */}
      <div className="info-section">
        <h3>Contact Information</h3>
        <div className="contact-form">
          <div className="form-row">
            <div className="input-group">
              <label>Email</label>
              <input 
                type="email" 
                value={selectedStaff.email || ''} 
                onChange={(e) => handleUpdateMember('email', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Phone</label>
              <input 
                type="tel" 
                value={selectedStaff.phone || ''} 
                onChange={(e) => handleUpdateMember('phone', e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="input-group">
              <label>Alternative Phone (Optional)</label>
              <input 
                type="tel" 
                value={selectedStaff.alternatePhone || ''} 
                onChange={(e) => handleUpdateMember('alternatePhone', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Zip Code</label>
              <input 
                type="text" 
                value={selectedStaff.zipCode || ''} 
                onChange={(e) => handleUpdateMember('zipCode', e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="input-group full-width">
              <label>Address</label>
              <input 
                type="text" 
                value={selectedStaff.address || ''} 
                onChange={(e) => handleUpdateMember('address', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

// Pestaña de información para agencias
const renderAgencyInfoTab = () => (
  <div className="info-tab-content">
    <div className="info-section">
      <h3>Agency Information</h3>
      <div className="contact-form">
        <div className="form-row">
          <div className="input-group">
            <label>Agency Name</label>
            <input 
              type="text" 
              value={selectedStaff.agencyName || ''} 
              onChange={(e) => handleUpdateAgencyField('agencyName', e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              value={selectedStaff.email || ''} 
              onChange={(e) => handleUpdateAgencyField('email', e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Phone</label>
            <input 
              type="tel" 
              value={selectedStaff.phone || ''} 
              onChange={(e) => handleUpdateAgencyField('phone', e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="input-group full-width">
            <label>Main Address</label>
            <input 
              type="text" 
              value={selectedStaff.address || ''} 
              onChange={(e) => handleUpdateAgencyField('address', e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="input-group">
            <label>Zip Code</label>
            <input 
              type="text" 
              value={selectedStaff.zipCode || ''} 
              onChange={(e) => handleUpdateAgencyField('zipCode', e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Fax (Optional)</label>
            <input 
              type="tel" 
              value={selectedStaff.fax || ''} 
              onChange={(e) => handleUpdateAgencyField('fax', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Pestaña de sucursales para agencias
const renderBranchesTab = () => (
  <div className="branches-tab-content">
    <div className="branches-header">
      <h3>Agency Branches</h3>
      <button 
        className="add-branch-btn"
        onClick={handleAddBranch}
      >
        <i className="fas fa-plus-circle"></i>
        <span>Add New Branch</span>
      </button>
    </div>

    {selectedStaff.branches && selectedStaff.branches.length > 0 ? (
      <div className="branches-list">
        {selectedStaff.branches.map((branch, index) => (
          <div key={index} className="branch-card">
            <div className="branch-header">
              <h4>Branch #{index + 1}</h4>
              <button 
                className="remove-branch-btn"
                onClick={() => handleRemoveBranch(index)}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
            <div className="branch-body">
              <div className="form-row">
                <div className="input-group">
                  <label>Branch Name</label>
                  <input 
                    type="text" 
                    value={branch.name || ''} 
                    onChange={(e) => handleUpdateBranch(index, 'name', e.target.value)}
                    placeholder="Branch name"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group full-width">
                  <label>Branch Address</label>
                  <input 
                    type="text" 
                    value={branch.address || ''} 
                    onChange={(e) => handleUpdateBranch(index, 'address', e.target.value)}
                    placeholder="Full address"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Branch Phone</label>
                  <input 
                    type="tel" 
                    value={branch.phone || ''} 
                    onChange={(e) => handleUpdateBranch(index, 'phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="no-branches">
        <div className="no-branches-icon">
          <i className="fas fa-code-branch"></i>
        </div>
        <h4>No Branches Added</h4>
        <p>This agency doesn't have any branches yet. Add a branch using the button above.</p>
      </div>
    )}
  </div>
);

// Pestaña de documentos (para ambos tipos)
const renderDocumentsTab = (type) => {
  // Asegurarse de que existe documents en selectedStaff
  if (!selectedStaff.documents) {
    selectedStaff.documents = {};
  }
  
  // Determinar qué lista de documentos mostrar
  const docList = type === 'agency' ? documentsList.agency : documentsList.staff;
  
  // Calcular el porcentaje correcto
  const completionPercentage = getCompletedDocsPercentage(selectedStaff.documents, type);
  
  return (
    <div className="documents-tab-content">
      <div className="documents-header">
        <h3>Required Documents</h3>
        <div className="documents-summary">
          <div className="completed-percentage">
            <div className="circular-progress">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3498db" />
                    <stop offset="100%" stopColor="#5dade2" />
                  </linearGradient>
                </defs>
                <path className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path className="circle"
                  strokeDasharray={`${completionPercentage}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage">{completionPercentage}%</text>
              </svg>
            </div>
            <span className="documents-text">Completed Documents</span>
          </div>
        </div>
      </div>
      
      <div className="documents-grid">
        {docList.map(doc => {
          // Inicializar el documento si no existe
          if (!selectedStaff.documents[doc.id]) {
            selectedStaff.documents[doc.id] = { status: 'pending', file: null };
          }
          
          return (
            <div 
              key={doc.id} 
              className={`document-card ${selectedStaff.documents[doc.id]?.status || 'pending'}`}
            >
              <div className="document-card-header">
                <div className="document-icon">
                  <i className={`fas ${doc.icon}`}></i>
                </div>
                <div className="document-info">
                  <h4>{doc.name}</h4>
                  {doc.description && <p>{doc.description}</p>}
                </div>
                <div 
                  className={`status-toggle ${selectedStaff.documents[doc.id]?.status || 'pending'}`}
                  onClick={() => handleDocumentStatusToggle(selectedStaff.id, doc.id)}
                >
                  <div className="toggle-slider">
                    <div className="toggle-circle"></div>
                  </div>
                  <span className="toggle-text">
                    {selectedStaff.documents[doc.id]?.status === 'obtained' ? 'Obtained' : 'Pending'}
                  </span>
                </div>
              </div>
              
              <div className="document-card-body">
                {selectedStaff.documents[doc.id]?.file ? (
                  <div className="file-preview">
                    <div className="file-info">
                      <i className="fas fa-file-pdf"></i>
                      <span className="file-name">{selectedStaff.documents[doc.id].file}</span>
                    </div>
                    <div className="file-actions">
                      <button className="view-file-btn">
                        <i className="fas fa-eye"></i>
                        <span>View</span>
                      </button>
                      <div className="upload-new">
                        <label htmlFor={`file-${selectedStaff.id}-${doc.id}`}>
                          <i className="fas fa-sync-alt"></i>
                          <span>Update</span>
                        </label>
                        <input
                          type="file"
                          id={`file-${selectedStaff.id}-${doc.id}`}
                          onChange={(e) => handleDocumentUpload(selectedStaff.id, doc.id, e)}
                          className="file-input"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-file">
                    <div className="upload-container">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <p>No file uploaded. Click to upload document.</p>
                      <label htmlFor={`file-${selectedStaff.id}-${doc.id}`} className="upload-btn">
                        <i className="fas fa-plus"></i>
                        <span>Upload File</span>
                      </label>
                      <input
                        type="file"
                        id={`file-${selectedStaff.id}-${doc.id}`}
                        onChange={(e) => handleDocumentUpload(selectedStaff.id, doc.id, e)}
                        className="file-input"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Pestaña de seguridad para ambos tipos
const renderSecurityTab = () => (
  <div className="security-tab-content">
    <div className="security-section">
      <h3>Access Information</h3>
      
      <div className="security-form">
        <div className="form-row">
          <div className="input-group">
            <label>Username</label>
            <div className="input-with-icon">
              <input 
                type="text" 
                value={selectedStaff.userName || ''} 
                onChange={(e) => handleUpdateMember('userName', e.target.value)}
              />
              <button 
                className="icon-button"
                onClick={() => {
                  navigator.clipboard.writeText(selectedStaff.userName);
                  alert('Username copied to clipboard');
                }}
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="input-group">
            <label>Password</label>
            <div className="input-with-action">
              <input 
                type={passwordVisible ? "text" : "password"}
                value={selectedStaff.password || ''}
                onChange={(e) => handleUpdateMember('password', e.target.value)}
              />
              <button 
                className="icon-button"
                onClick={togglePasswordVisibility}
              >
                <i className={`fas fa-${passwordVisible ? 'eye-slash' : 'eye'}`}></i>
              </button>
            </div>
            <p className="help-text">
              You can view and edit the password directly, or use the reset button to generate a new one.
            </p>
          </div>
        </div>
        
        <div className="form-row">
          <div className="input-group">
            <div className="button-container">
              <button 
                className="reset-password-btn"
                onClick={() => {
                  // Generar contraseña aleatoria más segura
                  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
                  let newPassword = '';
                  for (let i = 0; i < 12; i++) {
                    newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
                  }
                  handleUpdateMember('password', newPassword);
                  setPasswordVisible(true);
                }}
              >
                <i className="fas fa-key"></i>
                <span>Generate Secure Password</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Pestaña de agencia para terapeutas y administradores
const renderAgencyTab = () => {
  const availableAgencies = staffList.filter(item => 
    item.type === 'agency' && item.status === 'active'
  );
  
  return (
    <div className="agency-tab-content">
      <div className="agency-section">
        <h3>Agency Affiliation</h3>
        
        <div className="agency-form">
          <div className="form-row">
            <div className="input-group">
              <label>Select Agency</label>
              <select
                value={selectedStaff.agency?.id || ''}
                onChange={(e) => handleUpdateAgency(e.target.value)}
                className="agency-select"
              >
                <option value="">-- Select an Agency --</option>
                {availableAgencies.map(agency => (
                  <option key={agency.id} value={agency.id}>
                    {agency.agencyName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {selectedStaff.agency && (
            <div className="agency-details-card">
              <h4>Agency Details</h4>
              <div className="agency-info">
                <div className="agency-info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{selectedStaff.agency.name}</span>
                </div>
                <div className="agency-info-item">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{selectedStaff.agency.address}</span>
                </div>
                <div className="agency-info-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{selectedStaff.agency.phone}</span>
                </div>
              </div>
              <div className="agency-note">
                <i className="fas fa-info-circle"></i>
                <p>Staff member will be linked to this agency and can only access its patients and resources.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Si está cargando, mostrar pantalla de carga
if (isLoading) {
  return (
    <div className="staff-edit-loading">
      <div className="loading-container">
        <div className="loading-hologram">
          <div className="hologram-ring"></div>
          <div className="hologram-circle"></div>
          <div className="hologram-bars">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
        
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
        
        <div className="loading-text">{loadingMessage}</div>
        <div className="loading-status">TherapySync Pro <span className="status-dot"></span></div>
      </div>
    </div>
  );
}

return (
  <div className="staff-edit-container">
    {/* Encabezado mejorado */}
    <div className="staff-edit-header">
      <div className="header-content">
        <button className="back-button" onClick={onBackToOptions}>
          <i className="fas fa-arrow-left"></i>
          <span>Back</span>
        </button>
        <div className="header-title-container">
          <h2>Staff Management</h2>
          <p>Manage and update information for team members and agencies</p>
        </div>
      </div>
      <div className="header-actions">
        <button className="add-new-btn" onClick={onAddNewStaff}>
          <i className="fas fa-user-plus"></i>
          <span>Add New</span>
        </button>
      </div>
    </div>
    
    {/* Selector de vista (staff/agencies/todos) */}
    <div className="view-selector">
      <button 
        className={`view-option ${viewMode === 'all' ? 'active' : ''}`}
        onClick={() => setViewMode('all')}
      >
        <i className="fas fa-th-large"></i>
        <span>All</span>
      </button>
      <button 
        className={`view-option ${viewMode === 'staff' ? 'active' : ''}`}
        onClick={() => setViewMode('staff')}
      >
        <i className="fas fa-user-md"></i>
        <span>Staff</span>
      </button>
      <button 
        className={`view-option ${viewMode === 'agencies' ? 'active' : ''}`}
        onClick={() => setViewMode('agencies')}
      >
        <i className="fas fa-hospital-alt"></i>
        <span>Agencies</span>
      </button>
    </div>
    
    {/* Barra de búsqueda y filtros mejorada */}
    <div className="search-filter-container">
      <div className="search-bar">
        <div className="search-input-wrapper">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder={viewMode === 'agencies' ? "Search agencies..." : "Search staff..."} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        
        <div className="filter-options">
          {/* Mostrar filtro de rol solo si no está en modo agencies */}
          {viewMode !== 'agencies' && (
            <div className="role-filter">
              <div className="filter-label">
                <i className="fas fa-filter"></i>
                <span>Filter by role:</span>
              </div>
              <div className="role-options">
                <button 
                  className={`role-option ${filterRole === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterRole('all')}
                >
                  <span>All</span>
                </button>
                
                {roles.filter(r => r.value !== 'agency' || viewMode === 'agencies').map(role => (
                  <button 
                    key={role.value}
                    className={`role-option ${filterRole === role.value ? 'active' : ''}`}
                    onClick={() => setFilterRole(role.value)}
                  >
                    <i className={`fas ${role.icon}`}></i>
                    <span>{role.value.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Toggle para mostrar inactivos */}
          <div className="inactive-filter">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={showInactive}
                onChange={() => setShowInactive(!showInactive)}
              />
              <span className="toggle-slider"></span>
              <div className="toggle-label">
                <i className="fas fa-user-slash"></i>
                <span>Show Inactive {viewMode === 'agencies' ? 'Agencies' : viewMode === 'staff' ? 'Staff' : 'Members'}</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
    
    {/* Contenedor de tarjetas de personal */}
    <div className="staff-cards-container">
      {filteredStaff.length > 0 ? (
        filteredStaff.map(member => {
          // Calcular el porcentaje de documentos completados
          const docsPercentage = member.documents ? 
            getCompletedDocsPercentage(member.documents, member.type === 'agency' ? 'agency' : 'staff') : 0;
          
          // Determinar si se deben mostrar documentos
          const shouldShowDocs = requiresDocuments(member.role);
          
          return (
            <div 
              key={member.id} 
              className={`staff-card ${member.status}`}
              onClick={() => handleOpenProfile(member)}
            >
              <div className="card-highlight"></div>
              <div className="staff-card-header">
                <div className="avatar-status">
                  <div className={`avatar-container ${member.role}`}>
                    <div className="avatar-inner">
                      {member.type === 'agency' 
                        ? member.agencyName.charAt(0) + (member.agencyName.split(' ')[1]?.charAt(0) || '')
                        : member.firstName.charAt(0) + member.lastName.charAt(0)}
                    </div>
                    <span className={`status-indicator ${member.status}`}></span>
                  </div>
                </div>
                
                <div className="staff-identity">
                  <h3>
                    {member.type === 'agency' 
                      ? member.agencyName 
                      : `${member.firstName} ${member.lastName}`}
                  </h3>
                  <div className="staff-meta">
                    <span className="staff-role">{member.roleDisplay}</span>
                    {member.status === 'inactive' && (
                      <span className="status-badge inactive">
                        <i className="fas fa-user-slash"></i> Inactive
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="edit-action">
                  <button className="edit-btn">
                    <i className="fas fa-pen"></i>
                  </button>
                </div>
              </div>
              
              <div className="staff-card-body">
                <div className="contact-details">
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <span>{member.email}</span>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-phone-alt"></i>
                    <span>{member.phone}</span>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Zip: {member.zipCode}</span>
                  </div>
                  
                  {/* Mostrar agencia o número de sucursales */}
                  {member.type === 'agency' ? (
                    <div className="contact-item">
                      <i className="fas fa-code-branch"></i>
                      <span>{member.branches?.length || 0} Branches</span>
                    </div>
                  ) : member.agency && (
                    <div className="contact-item">
                      <i className="fas fa-hospital-alt"></i>
                      <span>{member.agency.name}</span>
                    </div>
                  )}
                </div>
                
                {/* Mostrar progreso de documentos si aplica */}
                {shouldShowDocs && (
                  <div className="documents-progress">
                    <div className="progress-label">
                      <span>Documentation</span>
                      <span className="percentage">{docsPercentage}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${docsPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-results">
          <div className="no-results-icon">
            <i className="fas fa-search"></i>
          </div>
          <h3>No results found</h3>
          <p>Try different search criteria or change filters</p>
          <button 
            className="reset-filters-btn"
            onClick={() => {
              setSearchTerm('');
              setFilterRole('all');
              setShowInactive(true);
              setViewMode('all');
            }}
          >
            <i className="fas fa-redo-alt"></i>
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </div>
    
    {/* Modal de perfil mejorado */}
    {showProfileModal && selectedStaff && (
      <div className="profile-modal-overlay">
        <div className="profile-modal">
          <div className="modal-header">
            <div className="staff-profile-header">
              <div className={`modal-avatar ${selectedStaff.role}`}>
                <span className="avatar-text">
                  {selectedStaff.type === 'agency' 
                    ? selectedStaff.agencyName.charAt(0) + (selectedStaff.agencyName.split(' ')[1]?.charAt(0) || '')
                    : selectedStaff.firstName.charAt(0) + selectedStaff.lastName.charAt(0)}
                </span>
                <span className={`modal-status ${selectedStaff.status}`}></span>
              </div>
              
              <div className="staff-details">
                <div className="name-inputs">
                  {selectedStaff.type === 'agency' ? (
                    <div className="input-group full-width">
                      <label>Agency Name</label>
                      <input 
                        type="text" 
                        value={selectedStaff.agencyName || ''} 
                        onChange={(e) => handleUpdateAgencyField('agencyName', e.target.value)}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="input-group">
                        <label>First Name</label>
                        <input 
                          type="text" 
                          value={selectedStaff.firstName || ''} 
                          onChange={(e) => handleUpdateMember('firstName', e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label>Last Name</label>
                        <input 
                          type="text" 
                          value={selectedStaff.lastName || ''} 
                          onChange={(e) => handleUpdateMember('lastName', e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <div className="role-status-selects">
                  <div className="input-group">
                    <label>Role</label>
                    <select 
                      value={selectedStaff.role || ''} 
                      onChange={(e) => {
                        const newRole = e.target.value;
                        const roleDisplay = roles.find(r => r.value === newRole)?.label || newRole;
                        
                        handleUpdateMember('role', newRole);
                        handleUpdateMember('roleDisplay', roleDisplay);
                        
                        // Resetear la pestaña activa para evitar bugs al cambiar de rol
                        setActiveTab('info');
                        
                        // Asegurarse de que los documentos se inicialicen correctamente
                        if (requiresDocuments(newRole) && (!selectedStaff.documents || Object.keys(selectedStaff.documents).length === 0)) {
                          handleUpdateMember('documents', initializeDocuments(newRole, selectedStaff.type));
                        }
                      }}
                      disabled={selectedStaff.type === 'agency'} // No cambiar rol para agencias
                    >
                      {roles.filter(r => selectedStaff.type === 'agency' ? r.value === 'agency' : r.value !== 'agency').map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Status</label>
                    <select 
                      value={selectedStaff.status || 'active'} 
                      onChange={(e) => handleUpdateMember('status', e.target.value)}
                      className={`status-select ${selectedStaff.status}`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="close-modal-btn" onClick={handleCloseProfile}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          <div className="modal-tabs">
            {renderTabs().map(tab => (
              <button 
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleChangeTab(tab.id)}
              >
                <i className={`fas ${tab.icon}`}></i>
                 <span>{tab.label}</span>
               </button>
             ))}
           </div>
           
           <div className="modal-content">
             {renderTabContent()}
           </div>
           
           <div className="modal-footer">
             <button className="cancel-btn" onClick={handleCloseProfile}>
               <i className="fas fa-times"></i>
               <span>Cancel</span>
             </button>
             <button className="save-btn" onClick={() => handleSaveProfile(selectedStaff)}>
               <i className="fas fa-save"></i>
               <span>Save Changes</span>
             </button>
           </div>
         </div>
       </div>
     )}
   </div>
 );
};

export default DevStaffEditComponent;