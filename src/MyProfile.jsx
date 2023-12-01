import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MyProfile.css';
import Navbar from './Navbar';
import axios from 'axios';
import { AuthContext } from './auth/AuthContext';

function MyProfile() {
  const { userid, profileid } = useParams();
  const { token } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [profileData, setProfileData] = useState({});
  const [locationName, setLocationName] = useState({ city: '', country: '', id: '' });
  const navigate = useNavigate();


  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/profiles/${profileid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Perfil eliminado exitosamente');
      navigate(`/myuser/${userid}`);
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el perfil');
    }
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userid}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(userResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchProfileData = async () => {
      try {
        const profileResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profiles/${profileid}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfileData(profileResponse.data);
        fetchLocationName(profileResponse.data.location_id);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    const fetchLocationName = async (locationId) => {
      try {
        const locationResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/locations/${locationId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const { city, country, id } = locationResponse.data;
        setLocationName({ city, country, id });
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchUserData();
    fetchProfileData();

    return () => {
      // Cleanup function if needed
    };
  }, [userid, profileid, token]);

  const handleSearchMatches = () => {
    navigate(`/MainPage/${userid}/${profileid}/${locationName.id}`);
  };

  const handleExistingMatches = () => {
    navigate(`/mymatches/${userid}/${profileid}`);
  };

  return (
    <div className='myprofile'>
      <Navbar />
      <div className="main-profile-container">
        <h1 className = "profile-tag">Tu perfil en:</h1>
        <h1 className = "location-tag">{locationName.city}, {locationName.country}</h1>
        <button onClick={handleSearchMatches} className="myprofilepage-button">Busca nuevas matches</button>
        <button onClick={handleExistingMatches} className="myprofilepage-button">Ver matches existentes</button>
        <button onClick={handleDelete} className="myprofilepage-button">Eliminar Perfil</button>
        <button className="back-button" onClick={() => navigate(-1)}>
              Volver
        </button>
      </div>
    </div>
  );
}

export default MyProfile;
