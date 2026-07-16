import React, { useEffect, useRef, useState } from 'react';

import * as CONSTANTS from "../CONSTANTS";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../reduxAuth/authSlice';
import Spinner from '../components/global/Spinner';

export default function Login() {
   const navigate                                          = useNavigate();
  const dispatch                                          = useDispatch();

  const {user, isLoading, isError, isSuccess, message}    = useSelector((state) => state.auth);

  const [agreePopi, setAgreePopi]                         = useState(true);

  const phoneNumberRef                                    = useRef();
  const passwordRef                                       = useRef();

  useEffect(() => {
      if(isError){
          toast.error(message)
      }    
      if(isSuccess || user){
          navigate('/');
       }

       dispatch(reset())
  },[user, isError, isSuccess, message, navigate, dispatch])

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("1")
      let checkTest = isValidPhoneNumber(phoneNumberRef.current.value);
      if(checkTest){
        console.log("2")
          const userData = {
              "phonenumber": phoneNumberRef.current.value,
              "password": passwordRef.current.value
            }        
            console.log("3")
            dispatch(login(userData));
      }else {
        console.log("4")
          toast.error("Phone number not valid");
      }
  }

  function isValidPhoneNumber(cell){
    if (!cell) {
      return false; // Handle empty input
    }
  
    // Remove any non-digit characters (e.g., spaces, hyphens, parentheses)
    const cleanedPhoneNumber = cell.replace(/\D/g, '');
    // Check if the cleaned number is exactly 10 digits
    return /^\d{10}$/.test(cleanedPhoneNumber);
  }

  if (isLoading) {
      return  <Spinner />
  }

  
  return (
    <div className="logo-base flexlog">
      <div className="log-start">
          
          <div className="main-login-data">        
       
              <div className="form-card ">
                  <div className="frm-log-area">
                      <h4 className="title-login text-center">Login</h4>
                          <form encType="multipart/form-data">
                              <div className="form-group frg">
                                  <input type="tel" className="form-control ct-content wide100" ref={phoneNumberRef} maxLength={10} placeholder="Enter Phone Number" required/>
                              </div>
                              <div className="form-group frg">
                                  <input type="password" className="form-control ct-content wide100"  ref={passwordRef} placeholder="Enter Password" required/>
                              </div>

                              <div className="form-group">
                                <input
                                    type="checkbox"
                                    id="popiCheckbox"
                                    checked={agreePopi}
                                    onChange={() => setAgreePopi(!agreePopi)}
                                    />
                                    <label htmlFor="popiCheckbox" className="mgl10">
                                      I agree with the terms of use <Link to={"/privacy-policy"}>POPIA</Link>
                                    </label>
                              </div>

                              {
                                agreePopi && (
                                    <div className="form-group mgtop20">
                                        <button className="btn btn-primary btn-full" onClick={handleLogin} disabled={isLoading}>Login</button>
                                    </div>
                                )
                              }
                              
                              <div className=" frg">
                              </div>
                          </form>
                          
                          
                          
                          <p className="flex mgtop20 txts12">
                              <Link to="/forgot-password"  className="link-log-text">Forgot Password?</Link>
                              <Link to="/register"  className="link-log-text">Register?</Link>
                          </p>

                          <p className="text-center smal-g mt-3">
                            { CONSTANTS.VERSION}
                          </p>
                         
                  </div>
              </div>
          
          </div>
      </div>       
  </div>
  );
}