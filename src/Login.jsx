import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import { AuthContext } from './auth/AuthContext';
import { useState, useContext } from 'react';

function Login() {

  const {setToken} = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const[formData, setFormData] = React.useState({
    email: '',
    password: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

    const handleAdminLogin = () => {
    // Redirect to the admin login page or any other desired page
    navigate('/admin-login');
  };

  const getUserID = async (email, token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/email/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    //console.log(formData);
    //console.log(import.meta.env.VITE_BACKEND_URL);
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, formData);
      console.log(response);
      const access_token = response.data.access_token;
      setToken(access_token);
  
      const userId = await (async () => {
        try {
          return await getUserID(formData.email, access_token);
        } catch (error) {
          console.log(error);
        }
      })();

      //console.log(userId)

      navigate(`/myuser/${userId}`);

    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        const errorMessage = error.response.data;

        if (errorMessage === "Contraseña incorrecta") {
          setErrorMessage("Contraseña inválida");
        } else if (errorMessage === "No se encontró un usuario con el mail indicado.") {
          setErrorMessage("No se ha encontrado un usuario registrado con el mail indicado.");
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
        <h1> ¡Bienvenid@ a Roomie!</h1>
        
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>

          <div className =  "field-container">
            <h4>Mail</h4>
            <input type="text" name="email" placeholder="Ingresa tu email..." className="input" value={formData.email} onChange={handleInputChange} />
          </div>

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

        <button type="button" onClick={handleAdminLogin} className="button">
          Iniciar Administrador
        </button>

    </div>

  </>
);
}

export default Login;



  

