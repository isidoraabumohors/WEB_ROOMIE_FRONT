import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import './AdminViews.css';

function ViewUsers() {
  const [users, setUsers] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Filter out the user with username "ADMINISTRADOR"
      const filteredUsers = response.data.filter(user => user.username !== 'ADMINISTRADOR');

      setUsers(filteredUsers);
      console.log(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDetailsClick = (userId) => {
    console.log(`View details for user with ID: ${userId}`);
    navigate(`/admin-view-user/${userId}`);
  };

  const handleProfileClick = (userId) => {
    console.log(`View profile for user with ID: ${userId}`);
    navigate(`/admin-view-user-profiles/${userId}`);
  };

  const handleDeleteClick = async (userId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getUsers();
      console.log(`User with ID ${userId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <br></br>
      <br></br>
      <h1>User List</h1>
      <table className="views-table">
        <thead>
          <tr>
            <th className="table-text">ID</th>
            <th className="table-text">Name</th>
            <th className="table-text">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="table-text">{user.id}</td>
              <td className="table-text">{user.username}</td>
              <td>
                <button className="admin-button" onClick={() => handleDetailsClick(user.id)}>See Details</button>
                <button className="admin-button" onClick={() => handleProfileClick(user.id)}>See Profiles</button>
                <button className="admin-button" onClick={() => handleDeleteClick(user.id)}>Delete User</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewUsers;

