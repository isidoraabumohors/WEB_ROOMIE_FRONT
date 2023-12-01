import React from 'react';
//import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import Navbar from './Navbar';
import axios from 'axios';
import { AuthContext } from './auth/AuthContext';
import { useContext, useState } from 'react';

function Register() {

  const [errorMessage, setErrorMessage] = useState('');
  const {setToken} = useContext(AuthContext);  
  const[formData, setFormData] = React.useState({
    username: '',
    password: '',
    email: '',
    age: '',
    bio: '',
    photo: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // Convert the 'age' value to an integer
    if (name === 'age') {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else {
      setFormData({ ...formData, [name]: value });
  }
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

  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/signup`, formData);
    console.log(response);
    console.log(response.data.email)

    // Hacemos un login automático
    const response2 = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
      email: response.data.email,
      password: formData.password,
    });
    console.log(response2);
    const access_token = response2.data.access_token;
    setToken(access_token);

    const userId = await (async () => {
      try {
        return await getUserID(response.data.email, access_token);
      } catch (error) {
        console.log(error);
      }
    })();

    console.log(userId)

    navigate(`/myuser/${userId}`);
  } catch (error) {
    console.log(error);

    if (error.response && error.response.data) {
      const errorMessage = error.response.data;

      // Handle the error message in the navigate function or elsewhere
      if (errorMessage.errors && errorMessage.errors.length > 0) {
        console.log("Validation Error:", errorMessage.errors[0].message);
        setErrorMessage(errorMessage.errors[0].message);
      }

      else if (errorMessage == "El usuario con el mail ingresado ya existe") {
        setErrorMessage("El usuario con el mail ingresado ya existe");
      }

    else {setErrorMessage("Por favor revise que los datos ingresados sean válidos.")}
  
  }}
};

    return (
      <>
        <Navbar />

        <div className="registration-form">
          <h1> ¡Bienvenid@ a Roomie!</h1>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <form onSubmit={handleSubmit}>

            <div className =  "field-container">
              <h4>Nombre de usuario</h4>
              <input type="text" name="username" placeholder="Ingresa tu nombre..." className="input" value={formData.username} onChange={handleInputChange} />
            </div>

            <div className =  "field-container">
              <h4>Contraseña</h4>
              <input type="password" name="password" placeholder="Ingresa tu contraseña..." className="input" value={formData.password} onChange={handleInputChange} />
            </div>

            <div className =  "field-container">
              <h4>Email</h4>
              <input type="email" name="email" placeholder="Ingresa tu email..." className="input" value={formData.email} onChange={handleInputChange} />
            </div>

            <div className =  "field-container">
              <h4>Edad</h4>
              <input type="age" name="age" placeholder="Ingresa tu edad..." className="input" value={formData.age} onChange={handleInputChange} />
            </div>

            <div className =  "field-container">
              <h4>Biografía</h4>
              <input type="bio" name="bio" placeholder="Ingresa tu biografía..." className="input" value={formData.bio} onChange={handleInputChange} />
            </div>

            <div className =  "field-container">
              <h4>Foto</h4>
              <input type="url" name="photo" placeholder="Ingresa la URL de la foto..." className="input" value={formData.photo} onChange={handleInputChange} />
            </div>
    
          <br></br>
          <br></br>

          <button type="submit" className="button">
      Registrarse
    </button>

          </form>
      </div>
    </>
  );
}

export default Register;

