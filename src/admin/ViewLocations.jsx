import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import Navbar from '../Navbar';
import './AdminViews.css';

function ViewLocations() {
  const [locations, setLocations] = useState([]);
  const [editLocation, setEditLocation] = useState(null); 
  const [newCity, setNewCity] = useState(''); 
  const [newCountry, setNewCountry] = useState(''); 
  const [showEditModal, setShowEditModal] = useState(false); 
  const [showAddModal, setShowAddModal] = useState(false); 
  const [newLocationCity, setNewLocationCity] = useState(''); 
  const [newLocationCountry, setNewLocationCountry] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    getLocations();
  }, []);

  const getLocations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/locations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleEditClick = (locationId) => {
    const locationToEdit = locations.find((location) => location.id === locationId);
    setEditLocation(locationToEdit);
    setNewCity(locationToEdit.city);
    setNewCountry(locationToEdit.country);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {

        if (!newCity || !newCountry) {
            setErrorMessage('City and Country are required');
            console.error('City and Country are required');
            return;}

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/locations/${editLocation.id}`,
        {
          city: newCity,
          country: newCountry,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log(`Location with ID ${editLocation.id} updated successfully`);
      setErrorMessage('');
      setEditLocation(null);
      setNewCity('');
      setNewCountry('');
      setShowEditModal(false);
      getLocations();
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };
  

  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  const handleDeleteClick = async (locationId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/locations/${locationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getLocations();
      console.log(`Location with ID ${locationId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleSaveAdd = async () => {
    try {

        if (!newLocationCity || !newLocationCountry) {
            setErrorMessage('City and Country are required');
            console.error('City and Country are required');
            return;}

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/locations`,
        {
          city: newLocationCity,
          country: newLocationCountry,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('New location added successfully');
      setErrorMessage('');
      setNewLocationCity('');
      setNewLocationCountry('');
      setShowAddModal(false);
      getLocations();
    } catch (error) {
      console.error('Error adding new location:', error);
    }
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
  };


  return (
    <div>
      <Navbar />
      <br></br>
      <br></br>
      <h1>Locations List</h1>
      <br></br>
      <br></br>
      <table className="views-table">
        <thead>
          <tr>
            <th className="table-text">ID</th>
            <th className="table-text">Ciudad</th>
            <th className="table-text">País</th>
            <th className="table-text">Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location.id}>
              <td className="table-text">{location.id}</td>
              <td className="table-text">{location.city}</td>
              <td className="table-text">{location.country}</td>
              <td>
                <button className="admin-button" onClick={() => handleEditClick(location.id)}>
                  Edit
                </button>
                <button className="admin-button" onClick={() => handleDeleteClick(location.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="admin-button-principal" onClick={handleAddClick}>
        Add New Location
      </button>

      {showAddModal && (
        <div className="add-modal">
          <h2>AddLocation</h2>
          <label className='edit-admin-tag'>
            City:
            <input className = "edit-admin-box" type="text" value={newLocationCity} onChange={(e) => setNewLocationCity(e.target.value)} />
          </label>
          <label className='edit-admin-tag'>
            Country:
            <input className = "edit-admin-box" type="text" value={newLocationCountry} onChange={(e) => setNewLocationCountry(e.target.value)} />
          </label>
          <button className="admin-button" onClick={handleSaveAdd}>
            Save
          </button>
          <button className="admin-button" onClick={handleCancelAdd}>
            Cancel
          </button>
        </div>
      )}

      {showEditModal && (
        <div className="edit-modal">
          <h2>Edit Location</h2>
          <label className='edit-admin-tag'>
            City:
            <input className = "edit-admin-box" type="text" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
          </label>
          <label className='edit-admin-tag'>
            Country:
            <input className = "edit-admin-box" type="text" value={newCountry} onChange={(e) => setNewCountry(e.target.value)} />
          </label>
          <button className="admin-button" onClick={handleSaveEdit}>
            Save
          </button>
          <button className="admin-button" onClick={handleCancelEdit}>
            Cancel
          </button>
        </div>
      )}
      {errorMessage && <p className='error-message'>{errorMessage}</p>}
    </div>
  );
}

export default ViewLocations;
