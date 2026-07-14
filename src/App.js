import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthScreens from "./pages/AuthScreens";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgot-password";
import SupportPage from "./pages/SupportPage";
import TermsOfService from "./pages/TermsOfService";
import HomeScreen from "./pages/HomeScreen";
import Magazines from "./pages/magazines/Magazines";
import SingleMagazine from "./pages/magazines/SingleMagazine";
import MagazineArchivePage from "./pages/magazines/ArchiveMagazines";
import Podcasts from "./pages/podcasts/Podcasts";
import SinglePodcst from "./pages/podcasts/SinglePodcst";
import MarketingEnquiriesPage from "./pages/MarketingEnquiriesPage";
import ArchiveMagazines from "./pages/magazines/ArchiveMagazines";


function App() {
  
  return (
    <>
      <Router>
        <div className="main-outer-container">  
          <Routes>
            <Route path="/login" element={<Login />}/> 
            <Route path="/register" element={<Register />}/>
            <Route path="/forgot-password" element={<ForgotPassword />}/> 
            <Route path="/support" element={<SupportPage />}/>  
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route element={<AuthScreens />}>                       
                  <Route path="/" element={<HomeScreen />}/> 
                  <Route path="/magazines" element={<Magazines />}/> 
                  <Route path="/magazine/:id" element={<SingleMagazine />}/> 
                  <Route path="/magazine-archive" element={<ArchiveMagazines />}/> 
                  <Route path="/podcasts" element={<Podcasts />}/> 
                  <Route path="/podcast/:id" element={<SinglePodcast />}/> 
                  <Route path="/marketing-enquiries" element={<MarketingEnquiriesPage />}/> 
              </Route>
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;