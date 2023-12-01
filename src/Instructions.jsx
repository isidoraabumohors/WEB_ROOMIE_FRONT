import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Instructions.css';
import Navbar from './Navbar';

function Instructions() {
  const instructionData = [
    {
      question: '¿Cómo funciona Roomie?',
      answer:
        'Crea tu perfil y únete a la red social que te permitirá ver el perfil de distintas personas que también buscan un roomie. Podrás revisar su biografía, y si te interesa, darle un ¡swipe right! Si ambos se interesan entre sí, su perfil quedará guardado bajo MyMatches y podrás conversar a través de un chat para que se conozcan. Con suerte, compartirán hogar a la brevedad.',
    },
    {
      question: '¿Cómo creo un perfil?',
      answer:
        'Haz clic en el botón Registrarse completando el formulario, luego anda a My User, presiona crear perfil, selecciona una ubicación y listo!. ¡Es así de fácil!',
    },
    {
      question: '¿Qué foto de perfil debería usar en Roomie?',
      answer:
        'Sube fotos a Roomie que muestren a la persona que todos quieren ver: ¡tú! Asegúrate de que tu rostro esté claramente visible sin lentes de sol. Las mejores fotos están bien enfocadas y algunas expresan una sonrisa que te llevará lejos.',
    },
    {
      question: '¿Qué debería escribir en mi biografía?',
      answer:
        'Tu biografía es un resumen de quién eres. Si escribir no es lo tuyo, puedes hacer una lista de las cosas que te gustan o quieres. Mantén un tono casual y habla sobre tus pasatiempos o describe lo que estás buscando en un match.',
    },
    {
      question: '¿Cómo funcionan los matches de Roomie?',
      answer:
        'Dos miembros deben usar la función Swipe a la derecha para darse Like mutuamente y hacer match. Luego de esto, pueden iniciar una conversación a través de un chat para conocerse mejor.',
    },
    {
      question: '¿Cómo cancelo match?',
      answer:
        'Si te estás arrepintiendo de haberle dado Like a alguien, no hay problema. Puedes cancelar match con alguien en cualquier momento. Desde My User, selecciona el perfil en el que hicieron match, luego anda a My Matches y presiona el botón "Eliminar Match".',
    },
  ];

  const [instructionIndex, setInstructionIndex] = useState(-1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (instructionIndex < instructionData.length - 1) {
        setInstructionIndex(instructionIndex + 1);
      }
    }, 1100);

    return () => clearTimeout(timeout);
  }, [instructionIndex, instructionData.length]);

  return (
    <> <Navbar/>
    <div className="instructions-outer-container">
      <div className="instructions-container">
        <h1>Instrucciones</h1>
        {instructionData.map((instruction, index) => (
          <div key={index}>
            <p
              className={`fade-in ${index <= instructionIndex ? 'active' : ''}`}
              style={{ marginBottom: '0' }}
            >
              <strong>{instruction.question}</strong>
            </p>
            <p
              className={`fade-in ${index <= instructionIndex ? 'active' : ''} answer`}
            >
              {instruction.answer}
            </p>

          </div>
        ))}
      </div>
    </div>
  </>
  );
}

export default Instructions;
