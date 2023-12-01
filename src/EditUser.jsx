import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditUser.css';
import axios from 'axios';
import Navbar from './Navbar';
import { AuthContext } from './auth/AuthContext';

function EditUser() {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [newData, setNewData] = useState({
      username: '',
      password: '',
      email: '',
      age: '',
      bio: '',
      photo: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(response.data);
          setNewData({
            username: response.data.username,
            password: "", 
            email: response.data.email,
            age: response.data.age || '',
            bio: response.data.bio,
            photo: response.data.photo,
          });
        } catch (error) {
          console.error(error);
          setError('Error fetching user data');
        }
      };
      fetchUserData();
    }, [id, token]);
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      if (name === 'age') {
        setNewData({ ...newData, [name]: parseInt(value) });
      } else {
        setNewData({ ...newData, [name]: value });
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/users/${id}`,
          newData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        navigate(`/myuser/${id}`);
      } catch (error) {
        console.error(error);
        setError('Error updating user profile');
      }
    };
  
    return (
      <>
        <Navbar />
  
        <div className="registration-form">
          <form onSubmit={handleSubmit}>
        
            <div className="field-container">
              <h4>Nombre de usuario</h4>
              <input type="text" name="username" placeholder="Ingresa tu nombre..." className="input" value={newData.username} onChange={handleInputChange} />
            </div>
  
            <div className="field-container">
              <h4>Contraseña</h4>
              <input type="password" name="password" placeholder="Ingresa tu contraseña..." className="input" value={newData.password} onChange={handleInputChange} />
            </div>
  
            <div className="field-container">
              <h4>Email</h4>
              <input type="email" name="email" placeholder="Ingresa tu email..." className="input" value={newData.email} onChange={handleInputChange} />
            </div>
  
            <div className="field-container">
              <h4>Edad</h4>
              <input type="age" name="age" placeholder="Ingresa tu edad..." className="input" value={newData.age} onChange={handleInputChange} />
            </div>
  
            <div className="field-container">
              <h4>Biografía</h4>
              <input type="bio" name="bio" placeholder="Ingresa tu biografía..." className="input" value={newData.bio} onChange={handleInputChange} />
            </div>
  
            <div className="field-container">
              <h4>Foto</h4>
              <input type="photo" name="photo" placeholder="Ingresa tu foto..." className="input" value={newData.photo} onChange={handleInputChange} />
            </div>
    
            <br></br>
            <br></br>
  
            <button type="submit" className="button">
              Guardar
            </button>
            
  
          </form>
        </div>
      </>
    );
  }
  
  export default EditUser;