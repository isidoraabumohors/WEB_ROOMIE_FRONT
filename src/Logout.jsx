import { useContext, useState } from 'react';
import { AuthContext } from './auth/AuthContext.jsx';
import './Login.css';
import {useNavigate} from 'react-router-dom';

const LogoutButton = () => {
    const { logout } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setMessage("Logout successful");
        navigate('/');
    }

    return (
        <>
            {message.length > 0 && <div className="successMsg"> {message} </div>}
            <button onClick={handleLogout}>Logout</button>
        </>
    );
}

export default LogoutButton;