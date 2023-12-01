import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Chat.css';
import Navbar from './Navbar';
import axios from 'axios';
import { AuthContext } from './auth/AuthContext';

function Chat() {
  const { matchid, chatid, profileid } = useParams();
  const { token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUserName, setOtherUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/messages/chat/${chatid}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMessages(messagesResponse.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    const fetchOtherUserProfile = async () => {
      try {
        const matchResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/matches/${matchid}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const otherProfileId = matchResponse.data.profile_A_id === parseInt(profileid)
          ? matchResponse.data.profile_B_id
          : matchResponse.data.profile_A_id;

        const otherProfileResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profiles/${otherProfileId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const userId = otherProfileResponse.data.user_id;

        const userResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setOtherUserName(userResponse.data.username);
      } catch (error) {
        console.error('Error fetching other user data:', error);
      }
    };

    fetchMessages();
    fetchOtherUserProfile();
  }, [chatid, matchid, profileid, token]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      try {
        const messageData = {
          date: new Date().toISOString(), // Using ISO format
          text: newMessage,
          chat_id: chatid,
          sender: profileid
        };

        const sendMessageResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/messages`, messageData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Add the new message to the UI
        setMessages([...messages, sendMessageResponse.data]);
        // Clear the input field after sending the message
        setNewMessage('');
        console.log(sendMessageResponse);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="chat-container">
        <h3 className="chat-name">{otherUserName}</h3>
        <>
          {messages.map((message, index) => (
            <div key={index} className="old-message">
              <p className={`text${message.sender === parseInt(profileid) ? 'sent' : 'received'}`}>{message.text}</p>
              <span className={`date${message.sender === parseInt(profileid) ? 'sent' : 'received'}`}>{message.date}</span>
            </div>
          ))}
        </>
        <div className="message-input">
          <input
          className = "chat-box"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className = "send-message-button" onClick={handleSendMessage}>Send</button>
        </div>
      </div>
      <button className = "back-button" onClick={() => navigate(-1)}>Volver</button>
    </>
  );
          }
export default Chat;

