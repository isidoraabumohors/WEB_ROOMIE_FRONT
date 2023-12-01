import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import './MyMatches.css';
import Navbar from './Navbar';
import axios from 'axios';
import { AuthContext } from './auth/AuthContext';

function MyMatches() {
  const { profileid } = useParams();
  const { token } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loadedMatches, setLoadedMatches] = useState([]);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const navigate = useNavigate();

  const fetchMatchesData = async () => {
    try {
      const profileResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profiles/${profileid}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const locationId = profileResponse.data.location_id;
      const locationResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/locations/${locationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const { city, country } = locationResponse.data;
      setCity(city);
      setCountry(country);

      const matchesResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/matches/profile/${profileid}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const matchesData = matchesResponse.data;

      const processedMatches = await Promise.all(
        matchesData.map(async (match) => {
          const matchId = match.id;
          const otherProfileId = match.profile_A_id !== parseInt(profileid) ? match.profile_A_id : match.profile_B_id;

          const profileResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profiles/${otherProfileId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const userId = profileResponse.data.user_id;

          const userResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const { username, bio, age, photo } = userResponse.data;

          return {
            matchId,
            otherProfileId,
            username,
            bio,
            age,
            photo,
          };
        })
      );

      setLoadedMatches(processedMatches);
      setMatches(matchesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Call fetchMatchesData when the component mounts
    fetchMatchesData();
  }, [profileid, token]); 

  const handleChatButtonClick = async (matchId) => {
    try {
      const chatCheckResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/chats/matches/${matchId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (chatCheckResponse.data && chatCheckResponse.data.id) {
        const chatId = chatCheckResponse.data.id;
        navigate(`/chat/${matchId}/${chatId}/${profileid}`);
      } else {
        console.log("Chat no encontrado, pero lo vamos a crear!");
        const int_match_id = parseInt(matchId)
        try {
          const chatCreationResponse = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/chats`,
            { match_id: int_match_id }, 
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
    
          if (chatCreationResponse.data && chatCreationResponse.data.id) {
            console.log("Chat creado!");
            const createdChatId = chatCreationResponse.data.id;
            navigate(`/chat/${matchId}/${createdChatId}/${profileid}`);
          } else {
            console.error('Failed to create chat.');
            // Handle the scenario where chat creation fails
          }
        } catch (createError) {
          console.error('Error creating chat:', createError);
          // Handle error in chat creation request
        }
      }
    } catch (error) {
      console.error('Error handling chat:', error);
      // Handle network errors or request failures appropriately
    }
  };

  const handleDeleteMatch = async (matchId, otherProfileId) => {
    try {
      // Eliminamos el match
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/matches/${matchId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Refetch
      fetchMatchesData();

      // Notificar que se eliminó el match correctamente
      alert('Match eliminado!');

    } catch (error) {
      console.error('Error deleting match:', error);
      // Handle error in match deletion request
    }
  };
  
  const redirectToPreviousPage = () => {
    navigate(-1);
  };
  

  return (
    <>
      <Navbar />
      <div className="your-matches-container">
        <h1> Tus matches en {city}, {country}</h1>
        <br/>
        {loadedMatches.length === 0 ? (
          <p className="no-matches-message">Aún no tienes matches.</p>
        ) : (
          loadedMatches.map((match, index) => (
            <div className="match" key={index}>
              <h4 className="matched-name">{match.username}</h4>
              <button
                className="profile-button"
                onClick={() => navigate(`/matchedprofile/${match.otherProfileId}`)} 
              >
                Ver detalles
              </button>
              <button
                className="profile-button"
                onClick={() => handleChatButtonClick(match.matchId)}
              >
                Chat
              </button>
              <button
                className="profile-button"
                onClick={() => handleDeleteMatch(match.matchId, match.otherProfileId)}>
                Eliminar match
              </button>
            </div>
          ))
        )}
        <button className="back-button" onClick={redirectToPreviousPage}>
              Volver
        </button>
      </div>
    </>
  );
}

export default MyMatches;
