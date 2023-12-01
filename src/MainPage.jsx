import { useState, useEffect, useContext } from 'react';
import './MainPage.css';
import Navbar from './Navbar.jsx';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from './auth/AuthContext';

export default function MainPage() {

    const { userid, profileid, locationid } = useParams();
    const { token } = useContext(AuthContext);
    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
    const [usersData, setUsersData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profiles`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProfiles(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfiles();
    }, [token]);

    useEffect(() => {
        const fetchSwipedProfiles = async () => {
     
            try {
                let swipedProfileIds = [];
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/swipes/profile/${profileid}/swiper`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data == "Swipes not found for given profile_id") {
                    swipedProfileIds = [];
                }
                else {
                    swipedProfileIds = response.data.map(swipe => swipe.swiped_profile_id);
                }

                const filtered = profiles.filter(
                    profile => (
                        profile.location_id === parseInt(locationid) &&
                        profile.id !== parseInt(profileid) &&
                        !swipedProfileIds.includes(profile.id)
                    )
                );
                setFilteredProfiles(filtered);

            } catch (error) {
                console.error(error);
            }
        };

        fetchSwipedProfiles();
    }, [profileid, token, profiles, locationid]);

    useEffect(() => {
        const fetchUserForProfile = async (userId) => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return response.data;
            } catch (error) {
                console.error(error);
                return null;
            }
        };

        const fetchUsersData = async () => {
            const usersDataPromises = profiles.map((profile) => fetchUserForProfile(profile.user_id));
            Promise.all(usersDataPromises)
                .then((usersInfo) => {
                    setUsersData(usersInfo);
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        fetchUsersData();
    }, [profiles, token]);
    
    const currentProfile = filteredProfiles[currentProfileIndex];
    const [currentUser, setCurrentUser] = useState(null);

    const handleSwipe = async (body) => {
        if (currentProfile) {
            try {
                // Creamos el swipe
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/swipes`, body, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Swipe performed:', response.data);

                // Revisamos si hay match
                const swipesResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/swipes/profile/${profileid}/swiped`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const matchingSwipe = swipesResponse.data.find((swipe) => {
                    return swipe.swiper_profile_id === body.swiped_profile_id && swipe.action === 'like';
                });

                if (matchingSwipe) {
                    // If a match is found, post the match
                    const matchBody = {
                        "profile_A_id": parseInt(body.swiper_profile_id),
                        "profile_B_id": parseInt(body.swiped_profile_id)
                    };

                    try {
                        const matchResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/matches`, matchBody, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                    
                        console.log('Match created:', matchResponse.data);
                    } catch (error) {
                        console.error('Error creating match:', error);
                    }
                }

            } catch (error) {
                console.error('Error performing swipe:', error);
            }
        } else {
            console.log('No profile to swipe.');
        }
    };

    const handleDislike = () => {
        const newIndex = (currentProfileIndex + 1)
        setCurrentProfileIndex(newIndex)
        const swipeBody = { "action": "dislike", "swiper_profile_id": parseInt(profileid), "swiped_profile_id": currentProfile.id };
        handleSwipe(swipeBody);
    };

    const handleLike = () => {
        const newIndex = (currentProfileIndex + 1)
        setCurrentProfileIndex(newIndex)
        const swipeBody = { "action": "like", "swiper_profile_id": parseInt(profileid), "swiped_profile_id": currentProfile.id };
        handleSwipe(swipeBody);
    };

    useEffect(() => {
        // Update currentUser whenever currentProfileIndex changes
        if (currentProfileIndex >= 0 && currentProfileIndex < filteredProfiles.length) {
            const userId = filteredProfiles[currentProfileIndex].user_id;
            const updatedUser = usersData.find(user => user.id === userId);
            setCurrentUser(updatedUser);
        }
        else {
            setCurrentUser(null);
        }
    }, [currentProfileIndex, filteredProfiles, usersData]);
    
    return (
        <>
          <div>
            <Navbar />
          </div>
          <div className="main-container">
            {currentProfile && currentUser ? (
              <>
                <button className='swipe-button' onClick={handleDislike}>{'<'}</button>
                <div className="card-container">
                  <div className="name">
                    <h1 className="match-name">{currentUser.username}</h1>
                  </div>
                  <div className="photo">
                    <img src={currentUser.photo} alt="Foto no disponible" />
                  </div>
                  <div className="bio">
                    <span className="bio-description">{currentUser.bio}</span>
                  </div>
                </div>
                <button className='swipe-button' onClick={handleLike}>{'>'}</button>
              </>
            ) : (
              <div className="card-container">
                <p>Ya no quedan perfiles por revisar. Vuelve más tarde.</p>
              </div>
            )}
          </div>
          <>
          <button className="back-button" onClick={() => navigate(-1)}>
              Volver
        </button></>
        </>
      );
      
}