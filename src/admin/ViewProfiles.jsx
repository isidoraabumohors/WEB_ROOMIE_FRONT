import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import './AdminViews.css';

function ViewProfiles() {
  const { userId } = useParams();
  const [profiles, setProfiles] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getProfiles();
  }, []);

  const getProfiles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profiles/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfiles(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const redirectToPreviousPage = () => {
    navigate(-1);
  };

  const handleDeleteClick = async (profileId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/profiles/${profileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getProfiles();
      console.log(`Profile with ID ${profileId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <br></br>
      <h1>Profiles List</h1>
      <table className="views-table">
        <thead>
          <tr>
            <th className="table-text">Profile ID</th>
            <th className="table-text">Location ID</th>
            <th className="table-text">Actions</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id}>
              <td className="table-text">{profile.id}</td>
              <td className="table-text">{profile.location_id}</td>
              <td>
                <button className="admin-button" onClick={() => handleDeleteClick(profile.id)}>Delete Profile</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="back-button" onClick={redirectToPreviousPage}>
                Volver
      </button>
    </div>
  );
}

export default ViewProfiles;
