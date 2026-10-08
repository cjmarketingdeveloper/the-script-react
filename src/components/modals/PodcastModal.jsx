import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function PodcastModal({ show, onClose, podcastData, isLiked, setIsLiked, CONSTANTS, user }) {

  const audioRef                                    = useRef(null);
  const [isPlaying, setIsPlaying]                   = useState(false);
  const [currentTime, setCurrentTime]               = useState(0);
  const [duration, setDuration]                     = useState(0);

  // Volume States (range 0 to 1)
  const [volume, setVolume]                         = useState(1);
  const [isMuted, setIsMuted]                       = useState(false);
  const [prevVolume, setPrevVolume]                 = useState(1);

  const [sessionId, setSessionId]                   = useState(null);

  // --------------------------------------------------
  // Podcast tracking refs
  // --------------------------------------------------

    const sessionIdRef = useRef(null);
    const lastTrackedTimeRef = useRef(0);
    const isSeekingRef = useRef(false);
    const hasCompletedRef = useRef(false);

  // Sync volume level to the <audio> element whenever it updates
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, show]);

  useEffect(() => {
      if (!show && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        setIsPlaying(false);
        setCurrentTime(0);

        // Reset local session state.
        // The actual session should already have been
        // closed by handleClose().
        sessionIdRef.current = null;
        setSessionId(null);

        lastTrackedTimeRef.current = 0;
        hasCompletedRef.current = false;
      }
  }, [show]);
  /*
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
  */

  /*
  const startPodcastSession = async () => {
    try {
      const response = await fetch(CONSTANTS.API_URL + "podcasts/commence/podcast-sessions/v1", {
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
  */

  const startPodcastSession = async () => {
      try {
        const response = await fetch(CONSTANTS.API_URL + "podcasts/commence/podcast-sessions/v1",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "token": "Bearer " + user.accessToken,                
            },
            body: JSON.stringify({
              podcastId: podcastData._id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create podcast session");
        }

        const data = await response.json();

        sessionIdRef.current = data._id;
        setSessionId(data._id);

        // Start measuring from the current audio position
        lastTrackedTimeRef.current = audioRef.current?.currentTime || 0;
        hasCompletedRef.current = false;

        console.log("Podcast session started:", data);

        return data._id;
      } catch (error) {
        console.error("Failed to start podcast session:", error);
        return null;
      }
  };
  const updatePodcastSession = async ({
      isPaused = false,
      isClosed = false,
      isCompleted = false,
    } = {}) => {
      const activeSessionId = sessionIdRef.current;

      if (!activeSessionId || !audioRef.current) {
        return;
      }

      const currentPosition = audioRef.current.currentTime;

      let durationListenedDelta = 0;

      // Don't count seeking as listening
      if (!isSeekingRef.current) {
        durationListenedDelta = Math.max(
          0,
          currentPosition - lastTrackedTimeRef.current
        );
      }

      try {
        const response = await fetch(
          `${CONSTANTS.API_URL}podcasts/analyze/sessions/v1/${activeSessionId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "token": "Bearer " + user.accessToken,
            },
            body: JSON.stringify({
              stoppedAtTimestamp: Math.floor(currentPosition),
              durationListenedDelta: Math.floor(durationListenedDelta),
              isPaused,
              isClosed,
              isCompleted,
            }),
          }
        );

        if (!response.ok && response.status !== 204) {
          throw new Error("Failed to update podcast session");
        }

        // Move our tracking point forward
        lastTrackedTimeRef.current = currentPosition;

        console.log("Podcast session updated:", {
          sessionId: activeSessionId,
          stoppedAtTimestamp: currentPosition,
          durationListenedDelta,
          isPaused,
          isClosed,
          isCompleted,
        });
      } catch (error) {
        console.error("Failed to update podcast session:", error);
      }
  };

  const handleClose = async () => {
    if (audioRef.current) {
      // Final tracking update before resetting currentTime
      if (sessionIdRef.current && !hasCompletedRef.current) {
        await updatePodcastSession({
          isClosed: true,
        });
      }

      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);

    sessionIdRef.current = null;
    setSessionId(null);

    lastTrackedTimeRef.current = 0;
    hasCompletedRef.current = false;

    onClose();
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        
        await updatePodcastSession({
          isPaused: true,
        });

        setIsPlaying(false);
        return;
      }

      // ---------------------------------------------
      // PLAY
      // ---------------------------------------------

      // First play = create the session
      if (!sessionIdRef.current) {
        const newSessionId = await startPodcastSession();

        if (!newSessionId) {
          return;
        }
      } else {
        // Resuming an existing session.
        // Reset tracking point so the time from here
        // is counted correctly.
        lastTrackedTimeRef.current =
          audioRef.current.currentTime;
      }

      await audioRef.current.play();

      setIsPlaying(true);
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
    
    try{
      const payload = {
        userId: user._id,
        podcastId: podcastData._id
      }
      
      const response = await fetch(CONSTANTS.API_URL + "podcasts/apply/like-status/toggle-action/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token" : "Bearer " + user.accessToken
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      setIsLiked(data.isLiked);
      toast.success(data.message);
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
                onEnded={async () => {
                  if (sessionIdRef.current && !hasCompletedRef.current) {
                    hasCompletedRef.current = true;

                    await updatePodcastSession({
                      isCompleted: true,
                    });
                  }

                  setIsPlaying(false);
                }}
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
                  style={{ maxWidth: "140px", accentColor: "var(--color-script-accent, #eb2dcbff)" }}
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