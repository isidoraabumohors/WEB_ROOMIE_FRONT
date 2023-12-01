
//import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './CreateProfile.css';
import Navbar from './Navbar';
import axios from 'axios';
import { AuthContext } from './auth/AuthContext';

function CreateProfile() {

const [locations, setLocations] = useState([]);
const [unusedLocations, setUnusedLocations] = useState([]);
const [profiles, setProfiles] = useState([]);
const [selectedLocation, setSelectedLocation] = useState('');
const { token } = useContext(AuthContext);
const { id } = useParams(); 
const navigate = useNavigate();

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/locations`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLocations(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
}, [token]);
  
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profiles/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const profileArray = Object.values(response.data);
      setProfiles(profileArray);
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
}, [id, token]);

  // Filter unused locations
useEffect(() => {
    const usedLocationIds = profiles.map((profile) => profile.location_id);
    const filteredLocations = locations.filter(
        (location) => !usedLocationIds.includes(location.id)
    );
    setUnusedLocations(filteredLocations);
}, [locations, profiles]);

const handleCreateProfile = () => {
  if (selectedLocation) {
    const profileData = {
      user_id: id,
      location_id: selectedLocation,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/profiles`, profileData, config)
      .then((response) => {
        console.log(response);
        navigate(`/myuser/${id}`);
      })
      .catch((error) => {
        console.error(error);
      });
  }
};
return (
      <>
        <Navbar />
        <div className="registration-form">

          <h1>¡Vamos a crear tu nuevo perfil!</h1>

          <h3> Elige una de las ubicaciones disponibles para crear un perfil y buscar compañeros en tu misma ubicación.</h3>

          <div className =  "dropdown-container">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">Selecciona una ubicación</option>
                 {unusedLocations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.city}, {location.country}
                    </option>
            ))}
          </select>  
          </div>

          <br></br>
          <br></br>
        
        <Link to={`/myuser/${id}`}>
          <button className="button">Volver</button>
        </Link>
        {/* <a href="`/myuser/${id}`"> <button className="button"> Volver </button> </a> */}
        <button className="button" onClick={handleCreateProfile}>Crear perfil</button>

        </div>
      </>
  );
}
export default CreateProfile;