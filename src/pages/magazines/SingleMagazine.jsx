"use client";

import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import Spinner from '../../components/global/Spinner';
import axios from 'axios';
import * as CONSTANTS from '../../CONSTANTS';
import { useSelector } from 'react-redux';

import PageImageTemp from "../../components/PageImageTemp";

// Import extracted modals
import PodcastModal from '../../components/modals/PodcastModal';
import VideoModal from '../../components/modals/VideoModal';
import GameModal from '../../components/modals/GameModal';

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

  const updatePageUrl = (newIndex) => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
    current.set("page", (newIndex + 1).toString());
    navigate(`${pathname}?${current.toString()}`, { replace: true });
  };

  // --- FETCH MAGAZINE PAGE DATA AND METADATA FROM API ---
  useEffect(() => {
    if (!id) return;

    const token = user?.accessToken || user?.token;

    if (!token) {
      console.warn("No authentication token found in user state.");
      setLoading(false);
      return;
    }

    console.log(`Fetching magazine page for ID: ${id}, Page: ${activeIndex + 1}`);
    if (!id) return;

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
              const videoRes = await axios.get(
                `${CONSTANTS.API_URL}settings/video/single/v1/${video}`
              );

              const payload = videoRes.data?.data || (Array.isArray(videoRes.data) ? videoRes.data[0] : videoRes.data);
              console.log('Fetched video data:', payload);
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

          // 3. Handle Game Data (Fetching by Page ID)
          const pageId = pageData._id || pageData.id || id;

          if (pageId) {
            try {
              console.log('Fetching game details using Page ID:', pageId);
              const gameRes = await axios.get(
                `${CONSTANTS.API_URL}settings/game/single-item/v1/${pageId}`,
                { headers: { token: `Bearer ${token}` } }
              );
              
              const gPayload = gameRes.data?.data || (Array.isArray(gameRes.data) ? gameRes.data[0] : gameRes.data);
              
              if (gPayload && typeof gPayload === 'object' && gPayload.show !== false) {
                console.log('Fetched game data:', gPayload);
                setGameData(gPayload);
              } else {
                setGameData(null);
              }
            } catch (err) {
              console.error('Error fetching game details:', err);
              setGameData(null);
            }
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

  // --- GOOGLE ANALYTICS TRACKING ENGINE ---
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

        {/* Modular Modals */}
        <PodcastModal 
          show={showPodcastModal} 
          onClose={() => setShowPodcastModal(false)} 
          podcastData={podcastData} 
        />

        <VideoModal 
          show={showVideoModal} 
          onClose={() => setShowVideoModal(false)} 
          videoData={videoData} 
        />

        {/* Pass fetched gameCode dynamically as gameType */}
        <GameModal 
          show={showGameModal} 
          onClose={() => setShowGameModal(false)} 
          gameType={gameData?.gameCode} 
          user={user} 
        />

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
            {/* Play Game Button rendered ONLY if a game exists for this page */}
            {gameData && (
              <button className="btn btn-script btn-script-accent mb-3" onClick={() => setShowGameModal(true)}>
                {gameData.title ? `Play ${gameData.title}` : 'Play Game'} <i className="bi bi-controller ms-1"></i>
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