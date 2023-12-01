import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import { AuthContext } from './auth/AuthContext';
import './Navbar.css';

function Navbar() {
  const { token, logout } = useContext(AuthContext);

  let Id;
  let UserId;
  let AdminId;
  try {
    const decodedToken = jwtDecode(token);
    Id = decodedToken.sub;
    if (Id == 'admin') {
      AdminId = Id;
    } else {    
      UserId = Id;
    }
  } catch (error) {
    UserId = null; 
  }

  const InicioLink = [
    { to: `/`, label: 'Inicio', className: 'small-button' },
  ];

  const myUserLink = [
    { to: `/myuser/${UserId}`, label: 'My User', className: 'small-button' },
  ];

  const instructionLink = [
    { to: '/instructions', label: 'Instrucciones', className: 'small-button' },
  ];

  const logoutLink = [ 
    { to: '/', label: 'Cerrar sesión', className: 'small-button', onClick: logout},
  ];

  const loginLink = { to: '/login', label: 'Iniciar sesión', className: 's-button' };
  const registerLink = { to: '/register', label: 'Registrarse', className: 's-button' };
  const adminLink = { to: '/admin-main-page', label: 'Página administrador', className: 's-button' };



  const renderLinks = () => {

    if (UserId) {
      return [
        ...instructionLink,
        ...myUserLink,
        ...logoutLink,
      ].map((link, index) => (
        <li key={index} className={link.className}>
          <Link to={link.to} onClick={link.onClick}>{link.label}</Link>
        </li>
      ))
    } else if (AdminId) {
      return [
        ...logoutLink,
        {... adminLink },
      ].map((link, index) => (
        <li key={index} className={link.className}>
          <Link to={link.to} onClick={link.onClick}>{link.label}</Link>
        </li>
      ))

    } else {
      return [
        ...instructionLink,
        ...InicioLink,
        { ...loginLink },
        { ...registerLink },
      ].map((link, index) => (
        <li key={index} className={link.className}>
          <Link to={link.to} onClick={link.onClick}>{link.label}</Link>
        </li>
      ));
    }
  };

  return (
    <nav>
      <ul>
        {renderLinks()}
      </ul>
    </nav>
  );
}

export default Navbar;