import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Instructions from './Instructions'
import MyMatches from './MyMatches'
import MainPage from './MainPage'
import Navbar from './Navbar';
import Register from './Register'
import Login from './Login'
import MyUser from './MyUser'
import CreateProfile from './CreateProfile'
import EditUser from './EditUser'
import App from './App'
import MyProfile from './MyProfile';
import MatchedProfile from './MatchedProfile';
import Chat from './Chat';
import Slideshow from './Slideshow';
import AdminLogin from './admin/AdminLogin';
import AdminMainPage from './admin/AdminMainPage';
import ViewUsers from "./admin/ViewUsers";
import ViewUser from './admin/ViewUser';
import ViewMatches from './admin/ViewMatches';
import ViewProfiles from './admin/ViewProfiles';
import ViewMatch from './admin/ViewMatch';
import ViewLocations from './admin/ViewLocations';

function Routing() { 
  return (
    <BrowserRouter> 
      <Routes>
        <Route path={"/"} element={<App/>} />
        <Route path={"/instructions"} element={<Instructions/>} />
        <Route path={"mymatches/:userid/:profileid"} element={<MyMatches/>} />
        <Route path={"/myprofile/:userid/:profileid"} element={<MyProfile/>} />
        <Route path={"/MainPage/:userid/:profileid/:locationid"} element={<MainPage/>} />
        <Route path={"/navbar"} element={<Navbar/>} />
        <Route path={"/register"} element={<Register/>} />
        <Route path={"/login"} element={<Login/>} />
        <Route path={"/myuser/:id"} element={<MyUser/>} />
        <Route path={"/createprofile/:id"} element={<CreateProfile/>} />
        <Route path={"/edituser/:id"} element={<EditUser/>} /> 
        <Route path={"/matchedprofile/:profileid"} element={<MatchedProfile/>} />
        <Route path={"/chat/:matchid/:chatid/:profileid"} element={<Chat/>} />
        <Route path={"/slideshow/:id"} element={<Slideshow/>} />
        <Route path={"/admin-login"} element={<AdminLogin/>} />
        <Route path={"/admin-main-page"} element={<AdminMainPage/>} />
        <Route path={"/view-users"} element={<ViewUsers/>} />
        <Route path={"/view-matches"} element={<ViewMatches/>} />
        <Route path={"/admin-view-user/:userId"} element={<ViewUser/>} />
        <Route path={"/admin-view-user-profiles/:userId"} element={<ViewProfiles/>} />
        <Route path={"/admin-view-match/:matchId/:profile_A_id/:profile_B_id"} element={<ViewMatch/>} />
        <Route path={"/view-locations"} element={<ViewLocations/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default Routing;