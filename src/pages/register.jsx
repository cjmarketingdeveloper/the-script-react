import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../reduxAuth/authSlice';
import Spinner from '../components/global/Spinner';
import * as CONSTANTS from "./../CONSTANTS";

export default function Register() {
  const navigate                                        = useNavigate();
  const dispatch                                        = useDispatch();

  const {user, isLoading, isError, isSuccess, message}  = useSelector((state) => state.auth);

  const nameRef                                           = useRef();
  const surnameRef                                        = useRef();
  const phoneNumberRef                                    = useRef();
  const passwordRef                                       = useRef();
  const emailRef                                          = useRef();
  const practiceNumberRef                                 = useRef();

  useEffect(() => {
      if(isError){
          toast.error(message)
      }
    
      if(isSuccess || user){
        navigate('/');
      }

        dispatch(reset());
  },[user, isError, isSuccess, message, navigate, dispatch])


  const handleRegister = async (e) => {
    e.preventDefault();

      try{

              if(passwordRef.current.value.length > 1 && 
                 nameRef.current.value.length > 1 && 
                 surnameRef.current.value.length > 1 ){


                    const userData = {
                      "phone": phoneNumberRef.current.value,
                      "password": passwordRef.current.value,
                      "practiceNumber": practiceNumberRef.current.value,
                      "name": nameRef.current.value,
                      "surname": surnameRef.current.value,
                      "email": emailRef.current.value,   
                      "apptype": "web",                      
                      "profilePic":""
                    }        
                    
                    dispatch(register(userData));
                 }else {
                    toast.error("Please fill in required fields");
                 }
                
            }catch(errorData){
              console.log(errorData);
            }
      
  }

  if (isLoading) {
      return  <Spinner />
  }

  return (
    <div className="logo-base flexlog">
      <div className="log-start">          
          <div className="main-login-data">
            <div className="reg-header ">
                  
            </div>
              <div className="form-card ">
                  <div className="frm-log-area">
                      <h4 className="title-login text-center">Register</h4>
                          <form encType="multipart/form-data">
                              <div className="form-group frg">
                                  <input 
                                    type="text" className="form-control ct-content wide100" 
                                    ref={phoneNumberRef} 
                                    maxLength={10} 
                                    placeholder="Enter Phone Number*" required/>
                              </div>
                              <div className="form-group frg">
                                  <input type="password" 
                                    className="form-control ct-content wide100"  
                                    ref={passwordRef} 
                                    placeholder="Enter Password*" required/>
                              </div>
                              <div className="form-group frg">
                                  <input type="text" 
                                    className="form-control ct-content" 
                                    ref={practiceNumberRef} 
                                    placeholder="Enter Name*" required/>
                              </div>
                              <div className="form-group frg">
                                  <input type="text" 
                                    className="form-control ct-content" 
                                    ref={nameRef} 
                                    placeholder="Enter Name*" required/>
                              </div>
                              <div className="form-group frg">
                                  <input 
                                      type="text" 
                                      className="form-control ct-content"  
                                      ref={surnameRef} 
                                      placeholder="Enter Surname*" required/>
                              </div>
                              <div className="form-group frg">
                                  <input type="email" 
                                    className="form-control ct-content"  
                                    ref={emailRef} placeholder="Enter Email Address" required/>
                              </div>
                                    
                              <div className="form-group mgtop20">
                                  <button 
                                      className="btn btn-mevent btn-full" 
                                      onClick={handleRegister} 
                                      disabled={isLoading}>Register
                                  </button>
                              </div>
                              <div className=" frg">
                              </div>
                          </form>
                                                    
                          <p className="mgtop20 space-flex txts12">
                              <Link to="/forgot-password"  className="link-log-text">Forgot Password?</Link>
                              <Link to="/login"  className="link-log-text">Login?</Link>
                          </p>
                          <p className="text-center smal-g">
                          { CONSTANTS.VERSION}
                          </p>
                  </div>         
              </div>
                
          </div>
      </div>       
  </div>
  );
}