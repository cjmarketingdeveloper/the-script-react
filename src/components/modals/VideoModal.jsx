import React, { useRef, useEffect } from 'react';

export default function VideoModal({ show, onClose, videoData }) {
  const videoRef = useRef(null);

  // Pause video when modal closes
  useEffect(() => {
    if (!show && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [show]);

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    onClose();
  };

  if (!show || !videoData) return null;

  const videoTitle = videoData?.title || videoData?.name || "Watch Video";
  const videoUrl = videoData?.videoUrl || videoData?.urlFrame || videoData?.url || videoData?.fileUrl;
  const videoGuests = videoData?.guest || videoData?.guests;

  return (
    <>
      <div className="modal-backdrop fade show" />

      <div 
        className="modal fade show d-block" 
        tabIndex="-1"
        // onClick={handleClose}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{videoTitle}</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={handleClose}
              ></button>
            </div>
            
            <div className="modal-body text-center p-0">
              {Boolean(
                videoGuests && 
                (Array.isArray(videoGuests) ? videoGuests.length > 0 : String(videoGuests).trim().length > 0)
              ) && (
                <div className="pt-3 px-3">
                  <span className="badge bg-secondary">
                    Guest: {Array.isArray(videoGuests) ? videoGuests.join(", ") : videoGuests}
                  </span>
                </div>
              )}

              <div className="p-3">
                {videoUrl?.includes("iframe") || videoUrl?.includes("youtube") || videoUrl?.includes("vimeo") ? (
                  <iframe 
                    src={videoUrl} 
                    style={{ width: "100%", height: "420px", border: "none" }} 
                    title={videoTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video 
                    ref={videoRef}
                    controls 
                    autoPlay 
                    className="w-100 rounded shadow-sm"
                    style={{ maxHeight: "450px" }}
                    src={videoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}