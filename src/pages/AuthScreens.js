import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/global/Header';
import Footer from '../components/global/Footer';
import AccessIsDenied from './AccessIsDenied';

function AuthScreens() {
    const navigate                              = useNavigate();
    const {user}                                = useSelector((state) => state.auth);

    useEffect(() => {
        if(!user){
            navigate("/login");
        }
    },[user, navigate])

  return (
    <div>
      {
         user && 
         (user.active === true) ? (
            <div className="main-mobile-view">
                <div className="main-mobile-content-view"> 
                    <Header />                       
                        <div className="main-content-arena">
                            <Outlet />
                        </div>
                    <Footer/>
                </div>
                <div className="section-dash">
                    {/* <BottomBar member={user} /> */}
                </div>    
            </div>
            )
        :
            <AccessIsDenied />
        }
    </div>
  )
}

export default AuthScreens