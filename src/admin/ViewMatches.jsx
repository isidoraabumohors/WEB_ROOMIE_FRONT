import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import Navbar from '../Navbar';
import './AdminViews.css';

function ViewMatches() {
  const [matches, setMatches] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getMatches();
  }, []);

  const getMatches = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/matches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMatches(response.data); 
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const handleDetailsClick = (matchId, profile_A_id, profile_B_id) => {
    // Implement logic to navigate to user details page using the user ID
    navigate(`/admin-view-match/${matchId}/${profile_A_id}/${profile_B_id}`)
  };


  const handleDeleteClick = async (matchId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/matches/${matchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh the match list after deletion
      getMatches();
      console.log(`Match with ID ${matchId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  return (
    <div>
        <Navbar />
      <br></br>
      <h1>Matches List</h1>
      <table className='views-table'>
        <thead>
          <tr>
            <th className='table-text' >ID</th>
            <th className='table-text' >Profile A ID</th>
            <th className='table-text' >Profile B ID</th>
            <th className='table-text' >Actions</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.id}>
              <td className='table-text'>{match.id}</td>
              <td className='table-text'>{match.profile_A_id}</td>
              <td className='table-text'>{match.profile_B_id}</td>
              <td>
                <button className="admin-button" onClick={() => handleDetailsClick(match.id, match.profile_A_id, match.profile_B_id)}>Details</button>
                <button className="admin-button" onClick={() => handleDeleteClick(match.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewMatches;
