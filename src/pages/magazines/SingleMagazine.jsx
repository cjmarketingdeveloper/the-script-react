"use client";

import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import React, { useEffect, useRef, useState } from "react";
import ReactGA from "react-ga4";

// 1. Import your offline local databases directly
import { magazines as localMagazines } from '../../data/magazines';
import { podcasts as localPodcasts } from '../../data/podcasts';
import { games as localGames } from '../../data/games';

import PageImageTemp from "../../components/PageImageTemp";

export default function SingleMagazine() {
  const params = useParams();
  const id = params?.id;

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [searchParams] = useSearchParams(); 

  const [magazine, setMagazine] = useState(null);
  const [allPages, setAllPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const pageParam = searchParams?.get("page");
  const activeIndex = pageParam ? Math.max(0, parseInt(pageParam, 10) - 1) : 0;

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

  // --- 1. LOCAL DATA PRELOADER ---
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    
    // Find the current magazine from your local static data array
    const foundMag = localMagazines.find(
      (m) => m._id === id || m.id?.toString() === id
    );

    if (foundMag) {
      setMagazine(foundMag);
      setAllPages(foundMag.pages || []);
    } else {
      setMagazine(null);
      setAllPages([]);
    }
    
    setLoading(false);
  }, [id]);

  // --- 2. LOCAL ASSET LOADER (RUNS WHEN PAGE TURNS) ---
  useEffect(() => {
    const currentPage = allPages[activeIndex];
    if (!currentPage) {
      setPodcastData(null);
      setGameData(null);
      return;
    }

    const pageId = currentPage._id || currentPage.id;

    // Search local offline database files for matches 
    const matchedPodcast = localPodcasts.find(
      (p) => 
        (p._id && p._id === pageId) || 
        (p.id && p.id?.toString() === pageId) || 
        (currentPage.formatType?.podcastId && p._id === currentPage.formatType.podcastId) ||
        (currentPage.formatType?.podcastId && p.id?.toString() === currentPage.formatType.podcastId)
    );
    
    const matchedGame = localGames.find(
      (g) => 
        (g._id && g._id === pageId) || 
        (g.id && g.id?.toString() === pageId) || 
        (currentPage.formatType?.gameId && g._id === currentPage.formatType.gameId) ||
        (currentPage.formatType?.gameId && g.id?.toString() === currentPage.formatType.gameId)
    );

    setPodcastData(matchedPodcast || null);
    setGameData(matchedGame || null);
    
    // Reset audio state on page change
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [activeIndex, allPages]);

  // --- 3. GOOGLE ANALYTICS TRACKING ENGINE ---
  useEffect(() => {
    if (!magazine || allPages.length === 0) return;

    const pageNumber = activeIndex + 1;
    const startTime = performance.now();

    ReactGA.event("magazine_page_view", {
      magazine_id: id,
      magazine_title: magazine.title,
      page_number: pageNumber,
      total_pages: allPages.length,
    });

    if (pageNumber === allPages.length) {
      ReactGA.event("magazine_completed", {
        magazine_id: id,
        magazine_title: magazine.title,
      });
    }

    return () => {
      const endTime = performance.now();
      const dwellTimeSeconds = Math.round((endTime - startTime) / 1000);

      if (dwellTimeSeconds >= 1) {
        ReactGA.event("magazine_page_dwell", {
          magazine_id: id,
          magazine_title: magazine.title,
          page_number: pageNumber,
          dwell_time_seconds: dwellTimeSeconds,
        });
      }
    };
  }, [activeIndex, allPages, magazine, id]);

  // --- HANDLERS ---
  const handleNext = () => {
    if (activeIndex < allPages.length - 1) {
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
        <h2 className="text-white">Loading issue...</h2>
      </div>
    );
  }

  if (!magazine || allPages.length === 0) {
    return <div className="container p-5 text-white">Magazine content not found.</div>;
  }

  const currentPage = allPages[activeIndex];

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
        <h1 className="mb-4 text-black">{magazine.title} - Issue {magazine.issue}</h1>

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
                    <span className="badge bg-secondary mb-2">{podcastData.guest}</span>
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
                    <iframe src={gameData.urlFrame} style={{ width: "100%", height: "500px", border: "none" }} />
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
            <span className="text-white fw-bold">Page {activeIndex + 1} / {allPages.length}</span>
            <button className="btn btn-script" onClick={handleNext} disabled={activeIndex === allPages.length - 1}>
              Next &rarr;
            </button>
          </div>

          {currentPage && currentPage.archetype === "image" && (
            <div className="magazine-page-image mx-auto my-3" key={currentPage._id}>
              <PageImageTemp
                page={currentPage}
                style={{ width: "100%", height: "auto", maxWidth: "800px" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}