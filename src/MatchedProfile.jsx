import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MatchedProfile.css';
import Navbar from './Navbar';
import axios from 'axios';
import { AuthContext } from './auth/AuthContext';

function MatchedProfile() {
  const { profileid } = useParams();
  const { token } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Fetch profile data to get the user_id
        console.log(profileid)
        const profileResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profiles/${profileid}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(profileResponse.data)
        const user_id = profileResponse.data.user_id;
        console.log(user_id)

        // Fetch user data based on the user_id
        const userResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserData(userResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserDetails();
  }, [profileid, token]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Navbar />
      <div className="matched-profile-container">
          <div>
            {userData && (
              <>
                <h1>{userData.username}</h1>
                {userData.photo && <img src={userData.photo} alt="User's photo" />}
                <h5>{userData.age} años</h5>
                <h5>{userData.email}</h5>
                <h5>{userData.bio}</h5>
              </>
            )}
           <button className = "back-button" onClick={handleBack}>Volver</button>
        </div>
      </div>
    </div>
  );
}

export default MatchedProfile;

