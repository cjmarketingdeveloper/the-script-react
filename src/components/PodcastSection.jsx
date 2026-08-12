import { Link } from 'react-router-dom';
import CoverCard from './CoverCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as CONSTANTS from '../CONSTANTS';

export default function PodcastSection({ user }) {
  const [podcastsList, setPodcastsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListOfPodcasts();
  }, []);

const fetchListOfPodcasts = async () => {
  const fullUrl = `${CONSTANTS.API_URL}settings/podcast/collect/list/v1/`;

  try {
    const response = await axios.get(fullUrl, {
      headers: user?.accessToken
        ? { token: "Bearer " + user.accessToken }
        : {}
    });

    // Ensure we actually got an Array back, not HTML string
    if (Array.isArray(response.data)) {
      setPodcastsList(response.data);
    } else {
      console.error("Expected array but got:", response.data);
    }
  } catch (error) {
    console.error("Error fetching podcasts:", error);
  } finally {
    setLoading(false);
  }
};

  // Slice for counts (3 for desktop, 2 for mobile)
  const desktopPodcasts = podcastsList.slice(0, 3);
  const mobilePodcasts = podcastsList.slice(0, 2);

  return (
    <div className="container-xl section-space">
      {/* Section header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">The Script Podcast</h2>

        {/* Desktop button */}
        <Link to="/podcasts" className="d-none d-md-flex btn btn-script">
          View more podcasts
          {/* <span className="arrow-circle">
            <i className="bi bi-arrow-right"></i>
          </span> */}
        </Link>
      </div>

      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading podcasts...</span>
          </div>
        </div>
      ) : (
        <>
          {/* ===== DESKTOP (3 items) ===== */}
          <div className="row g-4 d-none d-md-flex">
            {desktopPodcasts.map((pod) => (
              <div key={pod._id || pod.id} className="col-md-4">
                <CoverCard
                  image={pod.featuredImage}
                  href={`/podcasts/${pod._id || pod.id}`}
                  cardClass="cover-podcast"
                  overlay={<button className="btn btn-script">▶ Play</button>}
                />
              </div>
            ))}
          </div>

          {/* ===== MOBILE (2 items) ===== */}
          <div className="row g-4 d-md-none">
            {mobilePodcasts.map((pod) => (
              <div key={pod._id || pod.id} className="col-6">
                <CoverCard
                  image={pod.featuredImage}
                  href={`/podcasts/${pod._id || pod.id}`}
                  cardClass="cover-podcast"
                  overlay={<button className="btn btn-script">Play</button>}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Mobile button */}
      <div className="d-md-none text-center mt-3">
        <Link to="/podcasts" className="btn btn-script" style={{ backgroundColor: 'var(--color-script-black) !important' }}>
          View more podcasts
          <span className="arrow-circle">
            <i className="bi bi-arrow-right"></i>
          </span>
        </Link>
      </div>
    </div>
  );
}