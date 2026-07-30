"use client";

import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import React, { useEffect, useRef, useState } from "react";
import ReactGA from "react-ga4";
import Spinner from '../../components/global/Spinner';

import axios from 'axios';
import * as CONSTANTS from '../../CONSTANTS';
import { useSelector } from 'react-redux';

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

  const [podcastData, setPodcastData] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [showPodcastModal, setShowPodcastModal] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const updatePageUrl = (newIndex) => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
    current.set("page", (newIndex + 1).toString());
    navigate(`${pathname}?${current.toString()}`, { replace: true });
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
        
        // Fetch current page content
        const pagePromise = axios.get(
          `${CONSTANTS.API_URL}pages/find/idandpage/v1/${id}?page=${currentPageNumber}`,
          { headers: { token: `Bearer ${token}` } }
        );

        // Fetch overall magazine metadata
        const magazinePromise = axios.get(
          `${CONSTANTS.API_URL}magazines/find/${id}`,
          { headers: { token: `Bearer ${token}` } }
        );

        const [pageResponse, magazineResponse] = await Promise.all([pagePromise, magazinePromise]);

        const pageData = pageResponse.data;
        let magData = magazineResponse.data;

        // ✅ FIX: Find the specific magazine that matches the 'id' parameter from the URL
        if (Array.isArray(magData)) {
          magData = magData.find((m) => m._id === id) || magData[0];
        }

        if (pageData) {
          setCurrentPageData(pageData);
          setPodcastData(pageData.podcast || pageData.formatType?.podcastId || null);
          setGameData(pageData.game || pageData.formatType?.gameId || null);
        }

        if (magData) {
          setMagazine(magData);
          // Extract totalPages safely
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

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (s) => {
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
          <div className="modal-backdrop fade show" onClick={() => setShowPodcastModal(false)}>
            <div className="modal fade show d-block" onClick={(e) => e.stopPropagation()}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Listen to Podcast</h5>
                    <button type="button" className="btn-close" onClick={() => setShowPodcastModal(false)}></button>
                  </div>
                  <div className="modal-body text-center">
                    {podcastData.guest && <span className="badge bg-secondary mb-2">{podcastData.guest}</span>}
                    <h4 className="mb-4">{podcastData.title}</h4>
                    <audio
                      ref={audioRef}
                      src={podcastData.audioUrl}
                      onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                      onEnded={() => setIsPlaying(false)}
                    />
                    <button className="btn btn-primary rounded-circle mb-3 shadow" style={{ width: "64px", height: "64px" }} onClick={togglePlayPause}>
                      {isPlaying ? <i className="bi bi-pause-fill fs-2"></i> : <i className="bi bi-play-fill fs-2"></i>}
                    </button>
                    <input type="range" className="form-range" min={0} max={duration || 0} value={currentTime} onChange={(e) => {
                        const time = Number(e.target.value);
                        if (audioRef.current) audioRef.current.currentTime = time;
                        setCurrentTime(time);
                    }} />
                    <div className="d-flex justify-content-between mt-2 small text-muted">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Modal */}
        {showGameModal && gameData && (
          <div className="modal-backdrop fade show" onClick={() => setShowGameModal(false)}>
            <div className="modal fade show d-block modal-game-full" onClick={(e) => e.stopPropagation()}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Play Game: {gameData.title}</h5>
                    <button type="button" className="btn-close" onClick={() => setShowGameModal(false)}></button>
                  </div>
                  <div className="modal-body text-center">
                    <iframe src={gameData.urlFrame} style={{ width: "100%", height: "500px", border: "none" }} title={gameData.title || "Game"} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="page-content-area position-relative text-center my-4">
          <div className="d-flex justify-content-center gap-3">
            {podcastData && (
              <button className="btn pd-cast1 ogreen-fade mb-3" onClick={() => setShowPodcastModal(true)}>
                Podcast <i className="bi bi-mic-fill"></i>
              </button>
            )}
            {gameData && (
              <button className="btn game-btn1 oblue-fade mb-3" onClick={() => setShowGameModal(true)}>
                Play Game <i className="bi bi-controller"></i>
              </button>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center my-3">
            <button className="btn btn-script" onClick={handlePrev} disabled={activeIndex === 0}>
              &larr; Previous
            </button>
            <span className="text-white fw-bold">Page {activeIndex + 1} / {totalPages}</span>
            <button className="btn btn-script" onClick={handleNext} disabled={activeIndex >= totalPages - 1}>
              Next &rarr;
            </button>
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