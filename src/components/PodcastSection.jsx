import { Link } from 'react-router-dom';
import CoverCard from './CoverCard'
import { useEffect, useState } from 'react'
// Import the static array directly
import { podcasts as localPodcasts } from '../data/podcasts'

export default function PodcastSection() {
  // 1. Initialize the state directly with the local static data
  const [podcastsList] = useState(localPodcasts || [])
  const [isMobile, setIsMobile] = useState(false)

  // Mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 576)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Sort latest first
  const sortedPodcasts = [...podcastsList].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )

  // Take latest 3 (desktop) or 2 (mobile)
  const podcastsToShow = isMobile
    ? sortedPodcasts.slice(0, 2)
    : sortedPodcasts.slice(0, 3)

  return (
    <div className="container-xl my-5">
      {/* Section header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">The Script Podcast</h2>

        {/* Desktop button */}
        <Link
          to="/podcasts"
          className="btn-view-more d-none d-md-inline-flex"
        >
          View more podcasts
          <span className="arrow-circle">
            <i className="bi bi-arrow-right"></i>
          </span>
        </Link>
      </div>

      <div className="row g-4">
        {podcastsToShow.map((pod) => (
          <div key={pod._id || pod.id} className="col-12 col-md-4">
            <CoverCard
              image={pod.featuredImage}
              href={`/podcast/${pod._id}`}
              cardClass="cover-podcast"
              overlay={<button className="btn-pill-sm">▶ Play</button>}
            />
          </div>
        ))}
      </div>

      {/* Mobile button */}
      <div className="d-md-none text-center mt-3">
        <Link to="/podcasts" className="btn-view-more">
          View more podcasts
          <span className="arrow-circle">
            <i className="bi bi-arrow-right"></i>
          </span>
        </Link>
      </div>
    </div>
  )
}