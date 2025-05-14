import React, { useState, useEffect } from 'react';

const EmergencyContactsComponent = ({ patient }) => {
  const [contacts, setContacts] = useState([]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(null);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relation: ''
  });

  // Inicializa los contactos desde los datos del paciente
  useEffect(() => {
    if (patient?.emergencyContact) {
      setContacts([
        {
          id: 1,
          name: patient.emergencyContact,
          phone: patient.emergencyPhone,
          relation: 'Family Member'
        }
      ]);
    }
  }, [patient]);

  // Maneja el cambio en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Abre el formulario para añadir un nuevo contacto
  const handleAddContactClick = () => {
    setIsAddingContact(true);
    setIsEditingContact(null);
    setNewContact({
      name: '',
      phone: '',
      relation: ''
    });
  };

  // Abre el formulario para editar un contacto existente
  const handleEditContactClick = (contact) => {
    setIsEditingContact(contact.id);
    setIsAddingContact(false);
    setNewContact({
      name: contact.name,
      phone: contact.phone,
      relation: contact.relation
    });
  };

  // Guarda un nuevo contacto
  const handleSaveContact = () => {
    if (newContact.name && newContact.phone) {
      if (isEditingContact) {
        // Actualiza un contacto existente
        setContacts(contacts.map(contact => 
          contact.id === isEditingContact 
            ? { ...contact, ...newContact } 
            : contact
        ));
        setIsEditingContact(null);
      } else {
        // Añade un nuevo contacto
        const newId = contacts.length > 0 
          ? Math.max(...contacts.map(c => c.id)) + 1 
          : 1;
        
        setContacts([...contacts, {
          id: newId,
          ...newContact
        }]);
      }
      
      setIsAddingContact(false);
      setNewContact({
        name: '',
        phone: '',
        relation: ''
      });
    }
  };

  // Cancela la adición/edición de contacto
  const handleCancelEdit = () => {
    setIsAddingContact(false);
    setIsEditingContact(null);
  };

  // Elimina un contacto
  const handleDeleteContact = (contactId) => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
    if (isEditingContact === contactId) {
      setIsEditingContact(null);
      setIsAddingContact(false);
    }
  };

  return (
    <div className="emergency-contacts-card">
      <div className="card-header">
        <div className="header-title">
          <i className="fas fa-phone-alt"></i>
          <h3>Emergency Contacts</h3>
        </div>
        {!isAddingContact && !isEditingContact && (
          <button 
            className="add-button" 
            onClick={handleAddContactClick}
          >
            <i className="fas fa-plus"></i>
          </button>
        )}
      </div>

      <div className="card-body">
        {(isAddingContact || isEditingContact) ? (
          <div className="contact-form">
            <div className="form-row">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={newContact.name}
                onChange={handleInputChange}
                placeholder="Full Name"
              />
            </div>
            
            <div className="form-row">
              <label htmlFor="contact-phone">Phone</label>
              <input
                id="contact-phone"
                type="text"
                name="phone"
                value={newContact.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
              />
            </div>
            
            <div className="form-row">
              <label htmlFor="contact-relation">Relation</label>
              <select
                id="contact-relation"
                name="relation"
                value={newContact.relation}
                onChange={handleInputChange}
              >
                <option value="">Select Relation</option>
                <option value="Family Member">Family Member</option>
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Child">Child</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button 
                className="cancel-btn" 
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button 
                className="save-btn" 
                onClick={handleSaveContact}
                disabled={!newContact.name || !newContact.phone}
              >
                {isEditingContact ? 'Update Contact' : 'Add Contact'}
              </button>
            </div>
          </div>
        ) : contacts.length > 0 ? (
          <div className="contacts-list">
            {contacts.map((contact) => (
              <div className="contact-item" key={contact.id}>
                <div className="contact-details">
                  <div className="contact-name">
                    <i className="fas fa-user"></i>
                    <span>{contact.name}</span>
                  </div>
                  <div className="contact-info">
                    <div className="contact-phone">
                      <i className="fas fa-phone"></i>
                      <span>{contact.phone}</span>
                    </div>
                    <div className="contact-relation">
                      <i className="fas fa-users"></i>
                      <span>{contact.relation}</span>
                    </div>
                  </div>
                </div>
                <div className="contact-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditContactClick(contact)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
            <button 
              className="add-more-btn"
              onClick={handleAddContactClick}
            >
              <i className="fas fa-plus-circle"></i>
              <span>Add Another Contact</span>
            </button>
          </div>
        ) : (
          <div className="no-contacts">
            <i className="fas fa-exclamation-circle"></i>
            <p>No emergency contacts available</p>
            <button 
              className="add-contact-btn"
              onClick={handleAddContactClick}
            >
              <i className="fas fa-plus"></i>
              <span>Add Contact</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyContactsComponent;