import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
//import BottomBar from '../Components/Widgets/BottomBar';
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
         (user.approve === true) ? (
            <div className="main-mobile-view">
                <div className="main-mobile-content-view">                        
                        <div className="main-content-arena">
                            <Outlet />
                        </div>
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