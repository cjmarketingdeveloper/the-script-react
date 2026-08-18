import { Link } from 'react-router-dom';
import CoverCard from './CoverCard';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import * as CONSTANTS from '../CONSTANTS';

export default function PodcastSection({ user }) {
  const [podcastsList, setPodcastsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListOfPodcasts = useCallback(async () => {
    const fullUrl = `${CONSTANTS.API_URL}settings/podcast/collect/list/v1/`;

    try {
      const response = await axios.get(fullUrl, {
        headers: user?.accessToken
          ? { token: `Bearer ${user.accessToken}` }
          : {}
      });

      if (Array.isArray(response.data)) {
        setPodcastsList(response.data);
      } else {
        console.error('Expected array but got:', response.data);
      }
    } catch (error) {
      console.error('Error fetching podcasts:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.accessToken]);

  useEffect(() => {
    fetchListOfPodcasts();
  }, [fetchListOfPodcasts]);

  const displayedPodcasts = podcastsList.slice(0, 3);

  return (
    <div className="container-xl section-space">
      {/* Section Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">The Script Podcast</h2>

        <Link to="/podcasts" className="d-none d-md-flex btn btn-script" >
          View more podcasts
        </Link>
      </div>

      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading podcasts...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {displayedPodcasts.map((pod, index) => {
            const themeColor = pod.themeColor || '#000000';
            const itemKey = pod._id || pod.id;

            return (
              <div
                key={itemKey}
                className={`col-12 col-md-4  ${index === 2 ? 'd-none d-md-block' : ''}`}
              >
                <div className="podcast-card-wrapper" >
                <CoverCard
                  image={pod.featuredImage}
                  href={`/podcasts/${itemKey}`}
                  cardClass="cover-podcast"
                  themeColor={themeColor}
                  overlay={
                    <div className="podcast-overlay">
                      <div className="podcast-content">
                        <h3 className="podcast-title">{pod.title}</h3>

                        <div className="row podcast-bottom">
                          <div className="col">
                            <div                              
                              className="btn btn-script podcast-play"
                              >
                              ▶ Play
                            </div>
                          </div>                          
                        </div>                      
                      </div>                    
                    </div>
                  }
                />
                 <div className="guest-box-item ">
                        <div
                          className="podcast-guests rounded-start px-2"
                        >
                          <p className="fw-bold">Guests:</p>
                          {pod.guest}
                        </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile Button */}
      <div className="d-md-none text-center mt-3">
        <Link to="/podcasts" className="btn btn-script" style={{ backgroundColor: 'var(--color-script-black) !important' }}>
          View more podcasts
          <span className="arrow-circle ms-2">
            <i className="bi bi-arrow-right"></i>
          </span>
        </Link>
      </div>
    </div>
  );
}