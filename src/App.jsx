import './App.css'
import Navbar from './Navbar';
// import React, { useState } from 'react';
import logo from './assets/roomie_logo.jpg';
import Slideshow from './Slideshow';

function App() {
  return (
    <>
      <div>
        <Navbar />
      </div>

      <div className= 'logo' >
        <img src={logo} alt="Logo" />
      </div>
      <p className="desc"> 
      ¡Somos una red social que te ayudará a encontrar el compañero perfecto para tu nuevo hogar! 
      </p>
      <h5> En nuestra aplicación podrás revisar el perfil de distintas personas, para conectar con alguien que comparta tus intereses, y en algún futuro, tu hogar. </h5>

    <div className="slider-container">
      <Slideshow/>
    </div>

    <p className="creators">
      Creado por Isidora Abumohor, Amelia Edwards y Teresa Orellana
    </p>
    </>
  );
}
export default App;

