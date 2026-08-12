"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactGA from "react-ga4";
import Spinner from "../../components/global/Spinner";
import axios from "axios";
import * as CONSTANTS from "../../CONSTANTS";
import { useSelector } from "react-redux";

export default function SinglePodcast() {
  const params = useParams();
  const id = params?.id;
  const navigate = useNavigate();

  // Retrieve user authentication state safely from Redux
  const user = useSelector((state) => state.auth?.user);

  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Audio Player States
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Volume States (range 0 to 1)
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(1);

  // --- FETCH SINGLE PODCAST DATA ---
  useEffect(() => {
    if (!id) return;

    const token = user?.accessToken || user?.token;

    const fetchPodcast = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${CONSTANTS.API_URL}settings/podcast/find-item/v1/${id}`,
          {
            headers: token ? { token: `Bearer ${token}` } : {},
          }
        );

        // Extract payload safely
        const data = response.data?.data || response.data;
        if (data) {
          setPodcast(data);
        } else {
          setPodcast(null);
        }
      } catch (error) {
        console.error("Error fetching single podcast details:", error);
        setPodcast(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcast();
  }, [id, user]);

  // --- AUDIO CONTROL HANDLERS ---
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

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

  // --- GOOGLE ANALYTICS TRACKING ---
  useEffect(() => {
    if (!podcast) return;

    const startTime = performance.now();
    const podcastTitle = podcast?.title || podcast?.name || "Podcast Episode";

    ReactGA.event("podcast_view", {
      podcast_id: id,
      podcast_title: podcastTitle,
    });

    return () => {
      const endTime = performance.now();
      const dwellTimeSeconds = Math.round((endTime - startTime) / 1000);

      if (dwellTimeSeconds >= 1) {
        ReactGA.event("podcast_dwell", {
          podcast_id: id,
          podcast_title: podcastTitle,
          dwell_time_seconds: dwellTimeSeconds,
        });
      }
    };
  }, [id, podcast]);

  if (loading) {
    return (
      <div
        className="container p-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner />
      </div>
    );
  }

  if (!podcast) {
    return (
      <div className="container p-5 text-center my-5">
        <h3 className="mb-3">Podcast episode not found.</h3>
        <button className="btn btn-script" onClick={() => navigate("/podcasts")}>
          &larr; Back to All Podcasts
        </button>
      </div>
    );
  }

  const title = podcast?.title || podcast?.name || "Podcast Episode";
  const image =
    podcast?.featuredImage ||
    podcast?.imageUrl ||
    podcast?.image ||
    podcast?.coverImage;
  const audioSrc =
    podcast?.audioUrl || podcast?.audio || podcast?.fileUrl;
  const description = podcast?.description || podcast?.summary || "";
  const guests = podcast?.guest || podcast?.guests;
  const formattedGuests = Array.isArray(guests) ? guests.join(", ") : guests;

  return (
    <div
      className="page-body"
      style={{
        backgroundImage: `url('/assets/background/1.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      {/* Styles for range sliders */}
      <style>{`
        .volume-range::-webkit-slider-thumb {
          background-color: var(--color-script-accent, #2db8eb) !important;
        }
        .volume-range::-moz-range-thumb {
          background-color: var(--color-script-accent, #2db8eb) !important;
        }
      `}</style>

      <div className="content-area py-5 container-xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-4">
          <Link to="/podcasts" className="btn btn-script text-white">
            &larr; Back to Podcasts
          </Link>
        </div>

        {/* Podcast Card with Embedded Audio Player */}
        <div className="card shadow-lg border-0 overflow-hidden rounded-4 bg-white">
          <div className="row g-0">
            {/* Podcast Featured Image */}
            {image && (
              <div className="col-12 col-md-5 col-lg-4">
                <img
                  src={image}
                  alt={title}
                  className="img-fluid w-100 h-100"
                  style={{ objectFit: "cover", minHeight: "320px" }}
                />
              </div>
            )}

            {/* Content & Inline Audio Controls */}
            <div
              className={`col-12 ${
                image ? "col-md-7 col-lg-8" : "col-12"
              } p-4 p-md-5 d-flex flex-column justify-content-between`}
            >
              <div>
                {/* Guest Badge */}
                {Boolean(formattedGuests && String(formattedGuests).trim()) && (
                  <div className="mb-3">
                    <span className="badge bg-secondary px-3 py-2 fs-6">
                      <i className="bi bi-person-fill me-1"></i> Guest:{" "}
                      {formattedGuests}
                    </span>
                  </div>
                )}

                <h1 className="mb-3 text-dark fw-bold">{title}</h1>

                {description && (
                  <p
                    className="text-muted fs-5 mb-4"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {description}
                  </p>
                )}
              </div>

              {/* In-Page Audio Player Section */}
              <div className="p-4 bg-light rounded-3 border mt-3">
                <audio
                  ref={audioRef}
                  src={audioSrc}
                  onLoadedMetadata={(e) => {
                    setDuration(e.currentTarget.duration);
                    e.currentTarget.volume = isMuted ? 0 : volume;
                  }}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onEnded={() => setIsPlaying(false)}
                />

                <div className="d-flex align-items-center gap-3 mb-3">
                  {/* Play / Pause Toggle Button */}
                  <button
                    type="button"
                    className="btn text-white rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "56px",
                      height: "56px",
                      backgroundColor: "var(--color-script-main, #1e293b)",
                    }}
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? (
                      <i className="bi bi-pause-fill fs-2"></i>
                    ) : (
                      <i className="bi bi-play-fill fs-2 ms-1"></i>
                    )}
                  </button>

                  <div className="flex-grow-1">
                    {/* Scrub Bar */}
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

                    {/* Progress Timers */}
                    <div className="d-flex justify-content-between small text-muted mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>

                {/* Inline Volume Control */}
                <div className="d-flex align-items-center justify-content-end gap-2 border-top pt-2">
                  <button
                    type="button"
                    className="btn btn-link text-secondary p-0 border-0"
                    onClick={toggleMute}
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    <i className={`bi ${getVolumeIcon()} fs-5`}></i>
                  </button>

                  <input
                    type="range"
                    className="form-range volume-range"
                    style={{
                      maxWidth: "120px",
                      accentColor: "var(--color-script-accent, #2db8eb)",
                    }}
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
      </div>
    </div>
  );
}