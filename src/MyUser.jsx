
import { useEffect, useState, useContext} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './MyUser.css';
import Navbar from './Navbar';
import axios from 'axios'; 
import { AuthContext } from './auth/AuthContext';

function MyUser() {
  const { id } = useParams();
  const { token, setToken } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Usuario eliminado exitosamente');
      setToken(null);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el usuario');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [id, token]);

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

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/locations`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        setLocations(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token]);
  

  
  return (
    <>
      <Navbar />
      <div className="main-container">
        {userData ? (
          <div>
            <h1>{userData.username}</h1>

            {userData.photo && <img src={userData.photo} alt="User's photo" />} {/* Displaying the user's photo */}

            <h5>Edad: {userData.age}</h5>
            <h5>Mail: {userData.email}</h5>
            <h5>Biografía: {userData.bio}</h5>

            <h3>
              {profiles.length > 0
                ? 'Actualmente tienes perfiles en:'
                : 'Actualmente no tienes perfiles'}
            </h3>

            <ul>
            {profiles.map((profile) => {
                const locationData = locations.find((location) => location.id === profile.location_id);
                return (
                  <li key={profile.id}>
                    <Link to={`/myprofile/${id}/${profile.id}`}>
                    <h3>{locationData ? `${locationData.city}, ${locationData.country}` : 'Location not found'}</h3>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className = "button-box">    
            <Link to={`/createprofile/${id}`}>
              <button className="button-myuser">Crear perfil</button>
            </Link>

            <Link to={`/edituser/${id}`}>
              <button className="button-myuser">Editar usuario</button>
            </Link>

            <button onClick={handleDelete} className="button-myuser">
              Eliminar Cuenta
            </button>
            </div>

            


          </div>
        ) : (
            <p>Loading...</p>
            )}
      </div>

    </>
  );
}

export default MyUser;