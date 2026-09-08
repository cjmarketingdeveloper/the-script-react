import React, { useRef, useState, useEffect } from 'react';

export default function PodcastModal({ show, onClose, podcastData, isLiked, CONSTANTS, user }) {

  const audioRef                                    = useRef(null);
  const [isPlaying, setIsPlaying]                   = useState(false);
  const [currentTime, setCurrentTime]               = useState(0);
  const [duration, setDuration]                     = useState(0);

  // Volume States (range 0 to 1)
  const [volume, setVolume]                         = useState(1);
  const [isMuted, setIsMuted]                       = useState(false);
  const [prevVolume, setPrevVolume]                 = useState(1);

  const [sessionId, setSessionId]                   = useState(null);

  // Sync volume level to the <audio> element whenever it updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, show]);

  // Pause and reset audio when modal closes
  useEffect(() => {
    if (!show && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);

      startPodcastSession();
    }
  }, [show, podcastData]);

  const startPodcastSession = async () => {
    try {
      const response = await fetch(CONSTANTS.API_URL + "pages/podcast/podcast-sessions/commernce/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          podcastId: podcastData._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create podcast session");
      }

      const data = await response.json();

      setSessionId(data._id);

      console.log("Podcast session started:", data);
    } catch (error) {
      console.error("Failed to start podcast session:", error);
    }
  }

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    onClose();
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Audio playback error:", error);
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }

    if (newVol === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      const restoreVol = prevVolume > 0 ? prevVolume : 1;
      setVolume(restoreVol);
      if (audioRef.current) audioRef.current.volume = restoreVol;
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return "bi-volume-mute-fill";
    if (volume < 0.5) return "bi-volume-down-fill";
    return "bi-volume-up-fill";
  };

  const formatTime = (s) => {
    if (isNaN(s) || !s) return "0:00";
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleLikePost = async () => {
    console.log("User");
    console.log(user);
    
    //console.log("Podcast");
    //console.log(podcastData);
    //console.log(isLiked);

    try{

      const payload = {
        userId: user._id,
        podcastId: podcastData._id
      }
      
      console.log(payload);

      
      const response = await fetch(CONSTANTS.API_URL + "pages/podcast/like-status/toggle-action/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token" : "Bearer " + user.accessToken
        },
        body: JSON.stringify({
          podcastId: podcastData._id,
        }),
      });
      console.log(response);
      
    }catch(err){
      console.log(err);
    }
  }

  if (!show || !podcastData) return null;

  const podcastTitle = podcastData?.title || podcastData?.name || "Podcast Episode";
  const podcastImg = podcastData?.featuredImage || podcastData?.imageUrl || podcastData?.image || podcastData?.coverImage;
  const podcastAudio = podcastData?.audioUrl || podcastData?.audio || podcastData?.fileUrl;
  const podcastGuests = podcastData?.guest || podcastData?.guests;

  return (
    <>
      {/* Styles targeted ONLY at the volume range slider thumb */}
      <style>{`
        .volume-range::-webkit-slider-thumb {
          background-color: var(--color-script-accent, #2db8eb) !important;
        }
        .volume-range::-moz-range-thumb {
          background-color: var(--color-script-accent, #2db8eb) !important;
        }
        .volume-range:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 1px #fff, 0 0 0 0.25rem rgba(45, 184, 235, 0.25) !important;
        }
        .volume-range:focus::-moz-range-thumb {
          box-shadow: 0 0 0 1px #fff, 0 0 0 0.25rem rgba(45, 184, 235, 0.25) !important;
        }
      `}</style>

      <div className="modal-backdrop fade show" />

      <div 
        className="modal fade show d-block" 
        tabIndex="-1"
        // onClick={handleClose}
      >
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Listen to Podcast</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={handleClose}
              ></button>
            </div>
            
            <div className="modal-body text-center">
              {/* Featured Image */}
              {podcastImg && (
                <img 
                  src={podcastImg} 
                  alt={podcastTitle} 
                  className="img-fluid rounded mb-3 shadow-sm"
                  style={{ maxHeight: "220px", width: "100%", objectFit: "cover" }}
                />
              )}
              <div className="like-space-ab-layer" onClick={handleLikePost}>
                {isLiked ? (
                  <i className="bi bi-heart-fill" style={{ color: 'red' }}></i>
                ) : (
                  <i className="bi bi-heart" style={{ color: 'gray' }}></i>
                )}
              </div>
              {/* Guests Badge */}
              {Boolean(
                podcastGuests && 
                (Array.isArray(podcastGuests) ? podcastGuests.length > 0 : String(podcastGuests).trim().length > 0)
              ) && (
                <div className="mb-2">
                  <span className="badge bg-secondary">
                    Guest: {Array.isArray(podcastGuests) ? podcastGuests.join(", ") : podcastGuests}
                  </span>
                </div>
              )}

              <h4 className="mb-3">{podcastTitle}</h4>

              <audio
                ref={audioRef}
                src={podcastAudio}
                onLoadedMetadata={(e) => {
                  setDuration(e.currentTarget.duration);
                  e.currentTarget.volume = isMuted ? 0 : volume;
                }}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onEnded={() => setIsPlaying(false)}
              />

              {/* Play/Pause Button */}
              <button 
                type="button"
                className="btn text-white rounded-circle mb-3 shadow border-0" 
                style={{ 
                  width: "64px", 
                  height: "64px", 
                  backgroundColor: "var(--color-script-main)" 
                }} 
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <i className="bi bi-pause-fill fs-2"></i>
                ) : (
                  <i className="bi bi-play-fill fs-2"></i>
                )}
              </button>

              {/* Progress Slider (Original Default Styling) */}
              <input 
                type="range" 
                className="form-range podcast-range" 
                min={0} 
                max={duration || 0} 
                value={currentTime} 
                onChange={(e) => {
                  const time = Number(e.target.value);
                  if (audioRef.current) audioRef.current.currentTime = time;
                  setCurrentTime(time);
                }} 
              />

              {/* Time Display */}
              <div className="d-flex justify-content-between mt-1 small text-muted">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Volume Adjuster Bar */}
              <div className="d-flex align-items-center justify-content-center gap-2 mt-3 pt-2 border-top">
                <button 
                  type="button" 
                  className="btn btn-link text-secondary p-0 border-0" 
                  onClick={toggleMute}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  <i className={`bi ${getVolumeIcon()} fs-4`}></i>
                </button>

                {/* Volume Range Slider (Custom Accent Colored Dot) */}
                <input 
                  type="range" 
                  className="form-range volume-range" 
                  style={{ maxWidth: "140px", accentColor: "var(--color-script-accent, #2db8eb)" }}
                  min={0} 
                  max={1} 
                  step={0.01} 
                  value={isMuted ? 0 : volume} 
                  onChange={handleVolumeChange} 
                />

                <span className="small text-muted" style={{ minWidth: "35px" }}>
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}