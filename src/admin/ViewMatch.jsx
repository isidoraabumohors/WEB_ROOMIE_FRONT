import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import Navbar from '../Navbar';
import './ViewMatch.css';

function ViewMatch() {
  const { matchId, profile_A_id, profile_B_id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileA, setProfileA] = useState({});
  const [profileB, setProfileB] = useState({});
  const [locationId, setLocationId] = useState({});
  const [locationCity, setLocationCity] = useState({});
  const [locationCountry, setLocationCountry] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState(null); // Add chatId state

  const redirectToPreviousPage = () => {
    navigate(-1);
  };

  const fetchData = async () => {
    try {
      const responseUserIdA = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profiles/${profile_A_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userIdA = responseUserIdA.data.user_id;

      const responseA = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userIdA}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileA(responseA.data);

      const locationId = responseUserIdA.data.location_id;
      setLocationId(locationId);

      const responseUserIdB = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profiles/${profile_B_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userIdB = responseUserIdB.data.user_id;

      const responseB = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userIdB}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileB(responseB.data);

      const responseMatch = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/chats/matches/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const chatId = responseMatch.data.id;
      setChatId(chatId); 

      const responseLocation = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/locations/${locationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const city = responseLocation.data.city;
      const country = responseLocation.data.country;
      setLocationCity(city); 
      setLocationCountry(country);

      const responseMessages = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/messages/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(responseMessages.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, matchId, profile_A_id, profile_B_id]);

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData(); 
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleDeleteAllMessages = async () => {
    try {
      if (!chatId) {
        console.error('Chat ID not available');
        return;
      }

      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/messages/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData(); 
    } catch (error) {
      console.error('Error deleting messages', error);
    }
  }

  return (
    <>
      <Navbar />
  
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <br></br>
            <br></br>
            <h1> Información del Match </h1>
            <div className = "admin-view-container">
            <h2> Usuario 1: {profileA.username} ( ID {profile_A_id}) </h2>
            <h2> Usuario 2: {profileB.username} ( ID {profile_B_id}) </h2>
            <h2> Match en: {locationCity}, {locationCountry} ( ID {locationId}) </h2>
            </div>
  
            <h1> Mensajes del chat </h1>
            <div className= "admin-view-container">
              {messages.map((message, index) => (

                <div key={index} className={`text ${message.sender === parseInt(profile_A_id) ? 'sent' : 'received'}`}>
                  <p className="message">
                    {message.sender === parseInt(profile_A_id)
                      ? `${profileA.username}: ${message.text}`
                      : `${profileB.username}: ${message.text}`}
                  </p>
                  <span className="datesent">{message.date}</span>
                  <button className="delete-button" onClick={() => handleDeleteMessage(message.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <button className="back-button" onClick={handleDeleteAllMessages}>
          Vaciar chat
        </button>
        <button className="back-button" onClick={redirectToPreviousPage}>
          Volver
        </button>
      </div>
    </>
  );
}

export default ViewMatch;
