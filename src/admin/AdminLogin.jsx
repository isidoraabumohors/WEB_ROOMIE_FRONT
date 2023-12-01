import React from 'react';
import './AdminLogin.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import { useState, useContext } from 'react';

function AdminLogin() {

  const {setToken} = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const[formData, setFormData] = React.useState({
    password: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    //console.log(formData);
    //console.log(import.meta.env.VITE_BACKEND_URL);
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin-login`, formData);
      console.log(response);
      const access_token = response.data.access_token;
      setToken(access_token);
      navigate(`/admin-main-page`);

    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        const errorMessage = error.response.data;

        if (errorMessage === "Contraseña incorrecta") {
          setErrorMessage("Contraseña inválida");
        }
      } else {
        setErrorMessage("Hubo un problema. Intente nuevamente.");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="login-form">
        <h1> ¡Bienvenid@ Admin!</h1>
        
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>

          <div className =  "field-container">
            <h4>Contraseña</h4>
            <input type="password" name="password" placeholder="Ingresa tu contraseña..." className="input" value={formData.password} onChange={handleInputChange} />
          </div>
        <br></br>
        <br></br>

        <button type="submit" className="button">
    Iniciar Sesión
  </button>

        </form>

    </div>

  </>
);
}

export default AdminLogin;



  