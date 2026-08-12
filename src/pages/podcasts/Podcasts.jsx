import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CoverCard from '../../components/CoverCard';
import Spinner from '../../components/global/Spinner';

import axios from 'axios';
import * as CONSTANTS from '../../CONSTANTS';
import { useSelector } from 'react-redux';

const ITEMS_PER_PAGE = 6;

export default function Podcasts() {
  const { user } = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [podcastsList, setPodcastsList] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [noPodcasts, setNoPodcasts] = useState(false);

  // Fetch all podcasts on mount
  useEffect(() => {
    listOfPodcasts();
  }, []);

  const listOfPodcasts = async () => {
    setIsProcessing(true);
    try {
      const response = await axios.get(
        `${CONSTANTS.API_URL}settings/podcast/collect/list/v1/`,
        {
          headers: {
            token: 'Bearer ' + user?.accessToken,
          },
        }
      );

      // Extract array safely whether response is directly an array or wrapped
      const podcastData = Array.isArray(response.data)
        ? response.data
        : response.data?.podcasts || response.data?.data || [];

      if (Array.isArray(podcastData) && podcastData.length > 0) {
        // Sort newest first by creation date
        const sortedData = [...podcastData].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPodcastsList(sortedData);
        setNoPodcasts(false);
      } else {
        setPodcastsList([]);
        setNoPodcasts(true);
      }
    } catch (error) {
      console.error('Error fetching podcasts:', error);
      setPodcastsList([]);
      setNoPodcasts(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // The first item in the sorted list is the latest episode
  const absoluteLatestEpisode = podcastsList[0];

  // Pagination calculation
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const visiblePodcasts = podcastsList.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (isProcessing) {
    return <Spinner />;
  }

  return (
    <>
      {/* ================= HERO (SLIDER) ================= */}
      <div className="container-xl my-5 slider-relative-container">
        <div
          className="hero-slide position-relative d-flex align-items-center"
          style={{
            backgroundImage: "url('/assets/hero/pod1.png')",
            minHeight: '420px',
          }}
        >
          <div className="container-xl text-white">
            <h1 className="mb-3">
              Reach the Heart of South Africa's Pharmacy Industry
            </h1>
            <p className="mb-4 col-md-6">
              Connect with thousands of pharmacists, healthcare professionals, and decision-makers through our multi-channel platform
            </p>
          </div>
        </div>
      </div>

      {/* ========== ALL EPISODES ========== */}
      <div className="container-xl my-5">
        <h2 className="mb-3">All Episodes</h2>

        {/* Podcast Grid */}
        {noPodcasts || visiblePodcasts.length === 0 ? (
          <p className="text-muted">No podcasts found.</p>
        ) : (
          <div className="row g-4">
            {visiblePodcasts.map((pod, index) => {
              const isLatest =
                absoluteLatestEpisode && pod._id === absoluteLatestEpisode._id;

              return (
                <div key={pod._id || `pod-${index}`} className="col-12 col-md-4">
                  <CoverCard
                    image={pod.featuredImage}
                    href={`/podcasts/${pod._id}`}
                    badge={
                      isLatest ? (
                        <div className="pulse-badge">
                          Latest<br />Episode
                        </div>
                      ) : undefined
                    }
                    cardClass="cover-podcast"
                    footer={
                      <Link
                        to={`/podcasts/${pod._id}`}
                        className="btn btn-script"
                      >
                        Listen Now
                      </Link>
                    }
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {podcastsList.length > ITEMS_PER_PAGE && (
          <div className="d-flex gap-3 mt-4">
            <button
              className="btn btn-outline-dark"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>

            <button
              className="btn btn-outline-dark"
              disabled={startIndex + ITEMS_PER_PAGE >= podcastsList.length}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}