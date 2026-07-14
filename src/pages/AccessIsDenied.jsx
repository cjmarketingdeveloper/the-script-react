import React from 'react'


function AccessIsDenied() {
  const handleGoBack = () => {
    window.history.back();
  };
  
  return (
    <div>
      <div className="text-center">
        <div className="mb-4">
          <div 
            className="bg-danger bg-opacity-10 d-inline-flex align-items-center justify-content-center rounded-circle" 
            style={{ width: '120px', height: '120px' }}
          >
           
          </div>
        </div>
        
        <h1 className="display-4 fw-bold text-dark">Access Denied</h1>
        <p className="lead text-muted mb-5">
          Oops! You don't have the necessary permissions to view this page. <br />
          Please contact your administrator if you believe this is an error.
        </p>

        <div className="d-flex gap-3 justify-content-center">
   
          
          <a 
            href="/" 
            className="btn btn-primary btn-lg d-flex align-items-center gap-2"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  )
}

export default AccessIsDenied