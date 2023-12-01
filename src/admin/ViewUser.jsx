import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import Navbar from '../Navbar';

function ViewUser() {
  const { userId } = useParams();
  const { token } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const redirectToPreviousPage = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching user data...');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('User data response:', response.data);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, token]);

  console.log('Rendered with userData:', userData);

  return (
    <>
        <Navbar />
      <div className="main-container">
        {userData ? (
          <div>
            <h1>{userData.username}</h1>
            {userData.photo && <img src={userData.photo} alt="User's photo" />}
            <h5>Edad: {userData.age}</h5>
            <h5>Mail: {userData.email}</h5>
            <h5>Biografía: {userData.bio}</h5>
            <button className="back-button" onClick={redirectToPreviousPage}>
                Volver
            </button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}

export default ViewUser;
