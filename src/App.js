import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from "./components/global/Header";
import Footer from "./components/global/Footer";
import AuthScreens from "./pages/AuthScreens";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgot-password";
import SupportPage from "./pages/SupportPage";
import TermsOfService from "./pages/TermsOfService";
import HomeScreen from "./pages/HomeScreen";
import Magazines from "./pages/magazines/Magazines";
import SingleMagazine from "./pages/magazines/SingleMagazine";
import Podcasts from "./pages/podcasts/Podcasts";
import SinglePodcast from "./pages/podcasts/SinglePodcst";
import MarketingEnquiriesPage from "./pages/MarketingEnquiriesPage";
import ArchiveMagazines from "./pages/magazines/ArchiveMagazines";
import ArchivePdodcasts from "./pages/podcasts/ArchivePodcasts";
import { Dashboard } from "./pages/Dashboard"; // Imported dashboard
import Games from "./pages/games/Games";

function AppContent() {
  const location = useLocation();
  
  const isAuthPage = 
    location.pathname === '/login' || 
    location.pathname === '/register' || 
    location.pathname === '/forgot-password' || 
    location.pathname === '/reset-password';  

  return (
    <>
      {!isAuthPage && <Header />}
      
      <div className="main-outer-container">  
        <Routes>
          <Route path="/login" element={<Login />}/> 
          <Route path="/register" element={<Register />}/>
          <Route path="/forgot-password" element={<ForgotPassword />}/> 
          <Route path="/support" element={<SupportPage />}/>  
          <Route path="/terms-of-service" element={<TermsOfService />} />
          
          {/* Protected Routes (Authorized Users Only) */}
          <Route element={<AuthScreens />}>                       
            <Route path="/" element={<HomeScreen />}/> 
            <Route path="/magazines" element={<Magazines />}/> 
            <Route path="/magazines/:id" element={<SingleMagazine />}/> 
            <Route path="/magazine-archive" element={<ArchiveMagazines />}/> 
            
            {/* 🟢 Mounted Dashboard under Auth wrapper */}
            <Route path="/dashboard" element={<Dashboard />}/> 

            <Route path="/games" element={<Games />}/>

            <Route path="/podcasts" element={<Podcasts />}/> 
            <Route path="/podcast/:id" element={<SinglePodcast />}/> 
            <Route path="/podcast-archive" element={<ArchivePdodcasts />}/>
            <Route path="/marketing-enquiries" element={<MarketingEnquiriesPage />}/> 
          </Route>
        </Routes>
      </div>

      {!isAuthPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <ToastContainer />
    </Router>
  );
}

export default App;