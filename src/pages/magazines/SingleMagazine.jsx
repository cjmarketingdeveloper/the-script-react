"use client";

import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import React, { useEffect, useRef, useState } from "react";
import ReactGA from "react-ga4";
import Spinner from '../../components/global/Spinner';
import GamesModal from '../../components/modals/games-modal';
import axios from 'axios';
import * as CONSTANTS from '../../CONSTANTS';
import { useSelector } from 'react-redux';

// Import your game components
import MaizeGameComponent from '../../games/maize/MaizeGameComponent';
import WordSearchComponent from '../../games/wordsearch/WordSearchComponent';
import SudokuComponent from '../../games/sudokuComponent/SudokuComponent';
import MemoryMatchComponent from '../../games/memoryMatch/MemoryMatchComponent';
import MedSolution from '../../games/medSolution/MedSolution';

import PageImageTemp from "../../components/PageImageTemp";

export default function SingleMagazine() {
  const params = useParams();
  const id = params?.id;

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [searchParams] = useSearchParams();

  // Retrieve user token safely from Redux auth state
  const user = useSelector((state) => state.auth?.user);

  const [magazine, setMagazine] = useState(null);
  const [currentPageData, setCurrentPageData] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const pageParam = searchParams?.get("page") || "1";
  const activeIndex = Math.max(0, parseInt(pageParam, 10) - 1);

  // Modal & Media States
  const [podcastData, setPodcastData] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [videoData, setVideoData] = useState(null);

  const [showPodcastModal, setShowPodcastModal] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Audio Player States
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const gameType = "WO112SEAR";

  const updatePageUrl = (newIndex) => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
    current.set("page", (newIndex + 1).toString());
    navigate(`${pathname}?${current.toString()}`, { replace: true });
  };

  // Safe Close Handler for Podcast Modal
  const handleClosePodcastModal = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setShowPodcastModal(false);
  };

  // Safe Close Handler for Video Modal
  const handleCloseVideoModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setShowVideoModal(false);
  };

  // --- 1. FETCH MAGAZINE PAGE DATA AND METADATA FROM API ---
  useEffect(() => {
    if (!id) return;

    const token = user?.accessToken || user?.token;

    if (!token) {
      console.warn("No authentication token found in user state.");
      setLoading(false);
      return;
    }

    const fetchMagazinePage = async () => {
      setLoading(true);
      try {
        const currentPageNumber = activeIndex + 1;
        
        // Fetch current page content and magazine metadata
        const [pageResponse, magazineResponse] = await Promise.all([
          axios.get(
            `${CONSTANTS.API_URL}pages/find/idandpage/v1/${id}?page=${currentPageNumber}`,
            { headers: { token: `Bearer ${token}` } }
          ),
          axios.get(
            `${CONSTANTS.API_URL}magazines/find/${id}`,
            { headers: { token: `Bearer ${token}` } }
          )
        ]);

        const pageData = pageResponse.data;
        let magData = magazineResponse.data;

        if (Array.isArray(magData)) {
          magData = magData.find((m) => m._id === id) || magData[0];
        }

        if (pageData) {
          setCurrentPageData(pageData);

          // 1. Handle Podcast Data
          const podcast = pageData.podcast || pageData.formatType?.podcastId;
          if (typeof podcast === 'string' && podcast.trim() !== '') {
            try {
              const podcastRes = await axios.get(
                `${CONSTANTS.API_URL}settings/podcast/find-item/v1/${podcast}`,
                { headers: { token: `Bearer ${token}` } }
              );
              setPodcastData(podcastRes.data);
            } catch (err) {
              console.error('Error fetching podcast details:', err);
              setPodcastData(null);
            }
          } else if (typeof podcast === 'object' && podcast !== null) {
            setPodcastData(podcast);
          } else {
            setPodcastData(null);
          }

          // 2. Handle Video Data
          const video = pageData.video || pageData.videoId || pageData.formatType?.videoId;

          if (typeof video === 'string' && video.trim() !== '') {
            try {
              // Matched to existing backend endpoint: /video/single/v1/:id
              const videoRes = await axios.get(
                `${CONSTANTS.API_URL}settings/video/single/v1/${video}`
              );

              // Safely handle extracted data payload
              const payload = videoRes.data?.data || (Array.isArray(videoRes.data) ? videoRes.data[0] : videoRes.data);
              setVideoData(payload || null);
            } catch (err) {
              console.error('Error fetching video details:', err);
              setVideoData(null);
            }
          } else if (typeof video === 'object' && video !== null) {
            setVideoData(video);
          } else {
            setVideoData(null);
          }

          // 3. Handle Game Data
          const game = pageData.game || pageData.formatType?.gameId;
          if (typeof game === 'string' && game.trim() !== '') {
            try {
              const gameRes = await axios.get(
                `${CONSTANTS.API_URL}games/find/${game}`,
                { headers: { token: `Bearer ${token}` } }
              );
              setGameData(gameRes.data);
            } catch (err) {
              console.error('Error fetching game details:', err);
              setGameData(null);
            }
          } else if (typeof game === 'object' && game !== null) {
            setGameData(game);
          } else {
            setGameData(null);
          }
        }

        if (magData) {
          setMagazine(magData);
          const count = magData.totalPages || magData.pages?.length || magData.pageCount;
          setTotalPages(count || 1);
        }
      } catch (error) {
        console.error('Error fetching magazine page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazinePage();
  }, [id, activeIndex, user]);

  // Cleanup media when switching pages or closing modals
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    };
  }, [activeIndex, showPodcastModal, showVideoModal]);

  // --- 2. GOOGLE ANALYTICS TRACKING ENGINE ---
  useEffect(() => {
    if (!magazine || !currentPageData) return;

    const pageNumber = activeIndex + 1;
    const startTime = performance.now();

    ReactGA.event("magazine_page_view", {
      magazine_id: id,
      magazine_title: magazine?.title || "Magazine",
      page_number: pageNumber,
      total_pages: totalPages,
    });

    if (pageNumber === totalPages) {
      ReactGA.event("magazine_completed", {
        magazine_id: id,
        magazine_title: magazine?.title || "Magazine",
      });
    }

    return () => {
      const endTime = performance.now();
      const dwellTimeSeconds = Math.round((endTime - startTime) / 1000);

      if (dwellTimeSeconds >= 1) {
        ReactGA.event("magazine_page_dwell", {
          magazine_id: id,
          magazine_title: magazine?.title || "Magazine",
          page_number: pageNumber,
          dwell_time_seconds: dwellTimeSeconds,
        });
      }
    };
  }, [activeIndex, currentPageData, magazine, id, totalPages]);

  // --- HANDLERS ---
  const handleNext = () => {
    if (activeIndex < totalPages - 1) {
      updatePageUrl(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      updatePageUrl(activeIndex - 1);
    }
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

  const formatTime = (s) => {
    if (isNaN(s) || !s) return "0:00";
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) {
    return (
      <div className="container p-5 d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner />
      </div>
    );
  }

  if (!magazine || !currentPageData) {
    return <div className="container p-5 text-white">Magazine content not found.</div>;
  }

  // Extract podcast properties safely with fallbacks
  const podcastTitle = podcastData?.title || podcastData?.name || "Podcast Episode";
  const podcastImg = podcastData?.featuredImage || podcastData?.imageUrl || podcastData?.image || podcastData?.coverImage;
  const podcastAudio = podcastData?.audioUrl || podcastData?.audio || podcastData?.fileUrl;
  const podcastGuests = podcastData?.guest || podcastData?.guests;

  // Extract video properties safely with fallbacks
  const videoTitle = videoData?.title || videoData?.name || "Watch Video";
  const videoUrl = videoData?.videoUrl || videoData?.urlFrame || videoData?.url || videoData?.fileUrl;
  const videoGuests = videoData?.guest || videoData?.guests;



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
      <div className="content-area my-5 container-xl">
        <h1 className="mb-4 text-black">
          {magazine.title || "Magazine"} {magazine.issue ? `- Issue ${magazine.issue}` : ''}
        </h1>

        {/* Podcast Modal */}
        {showPodcastModal && podcastData && (
          <div 
            className="modal fade show d-block" 
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} 
            onClick={handleClosePodcastModal}
          >
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Listen to Podcast</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleClosePodcastModal}
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

                  {/* Title */}
                  <h4 className="mb-3">{podcastTitle}</h4>

                  {/* Audio Element */}
                  <audio
                    ref={audioRef}
                    src={podcastAudio}
                    onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    onEnded={() => setIsPlaying(false)}
                  />

                  {/* Play/Pause Button with --color-script-main */}
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

                  {/* Progress Slider */}
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
                  <div className="d-flex justify-content-between mt-2 small text-muted">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Modal */}
        {showVideoModal && videoData && (
          <div 
            className="modal fade show d-block" 
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }} 
            onClick={handleCloseVideoModal}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{videoTitle}</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleCloseVideoModal}
                  ></button>
                </div>
                
                <div className="modal-body text-center p-0">
                  {/* Guests Badge (if present) */}
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

                  {/* Video Player Render (Handles direct files or iframe embeds) */}
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
        )}

        {showGameModal && (
          <>
            {/* Dark overlay background */}
            <div 
              className="modal-backdrop fade show" 
              onClick={() => setShowGameModal(false)} 
            />

            {/* Modal container */}
            <div 
              className="modal fade show d-block modal-game-full" 
              tabIndex="-1"
              onClick={() => setShowGameModal(false)}
            >
              <div 
                className="modal-dialog modal-dialog-centered" 
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Play Game:</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setShowGameModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    {gameType === "MA5e4erAL" && <MaizeGameComponent user={user} />}
                    {gameType === "WO112SEAR" && <WordSearchComponent user={user} />}
                    {gameType === "SODC25eku" && <SudokuComponent user={user} />}
                    {gameType === "MACH3589F" && <MemoryMatchComponent user={user} />}
                    {gameType === "MEDS3589N" && <MedSolution user={user} />}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="page-content-area position-relative text-center my-4">
          {/* Media Trigger Buttons */}
          <div className="d-flex justify-content-center gap-3">
            {podcastData && (
              <button className="btn btn-script btn-script-accent mb-3" onClick={() => setShowPodcastModal(true)}>
                Podcast <i className="bi bi-mic-fill"></i>
              </button>
            )}
            {videoData && (
              <button className="btn btn-script btn-script-accent mb-3" onClick={() => setShowVideoModal(true)}>
                Watch Video <i className="bi bi-camera-video-fill"></i>
              </button>
            )}
            {/* {gameData && ( */}
            {(
              <button className="btn btn-script btn-script-accent mb-3" onClick={() => setShowGameModal(true)}>
                Play Game <i className="bi bi-controller"></i>
              </button>
            )}
          </div>

          <div className="d-flex align-items-center my-3 w-100">
            {/* Left container */}
            <div className="d-flex justify-content-start flex-grow-1 flex-shrink-1 flex-basis-0">
              <button className="btn btn-script" onClick={handlePrev} disabled={activeIndex === 0}>
                &larr; Previous
              </button>
            </div>

            {/* Center text */}
            <span className="fw-bold px-2 text-center" style={{ color: 'var(--color-script-accent)', whiteSpace: 'nowrap' }}>
              Page {activeIndex + 1} / {totalPages}
            </span>

            {/* Right container */}
            <div className="d-flex justify-content-end flex-grow-1 flex-shrink-1 flex-basis-0">
              <button className="btn btn-script" onClick={handleNext} disabled={activeIndex >= totalPages - 1}>
                Next &rarr;
              </button>
            </div>
          </div>

          {currentPageData && (
            <div className="magazine-page-image mx-auto my-3" key={currentPageData._id || activeIndex}>
              <PageImageTemp
                page={currentPageData}
                style={{ width: "100%", height: "auto", maxWidth: "800px", boxShadow: "3px 4px 13px rgba(0, 0, 0, 0.4)" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}