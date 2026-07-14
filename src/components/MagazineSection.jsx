import { Link } from 'react-router-dom';
import CoverCard from './CoverCard'
import { useEffect, useState } from 'react'
import { collectMagazines } from '../../lib/fetchRequests'

export default function MagazineSection() {
  const [latestMagazines, setLatestMagazines] = useState([])

  useEffect(() => {
    fetchListOfMagazines()
  }, [])

  const fetchListOfMagazines = async () => {
    try {
      const response = await collectMagazines()
      if (Array.isArray(response)) {
        setLatestMagazines(response)
      }
    } catch (error) {
      console.error('Error fetching magazines:', error)
    }
  }

  // 👇 slice for counts
  const desktopMagazines = latestMagazines.slice(0, 3)
  const mobileMagazines = latestMagazines.slice(0, 2)

  return (
    <div className="container-xl my-5">
      {/* Section header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">The Script Magazine</h2>

        {/* Desktop button */}
        <Link
          to="/magazines"
          className="btn-view-more d-none d-md-inline-flex"
        >
          View more issues
          <span className="arrow-circle">
            <i className="bi bi-arrow-right"></i>
          </span>
        </Link>
      </div>

      {/* ===== DESKTOP (3 items) ===== */}
      <div className="row g-4 d-none d-md-flex">
        {desktopMagazines.map((mag, index) => (
          <div key={mag._id} className="col-md-4">
            <CoverCard
              image={mag.featuredImage}
              href={`/magazine/${mag._id}`}
              badge={index === 0 ? <>Latest<br />Issue</> : undefined}
              cardClass="cover-magazine"
              footer={
                <Link
                  to={`/magazine/${mag._id}`}
                  className="btn-pill-sm"
                >
                  Read Issue
                </Link>
              }
            />
          </div>
        ))}
      </div>

      {/* ===== MOBILE (2 items) ===== */}
      <div className="row g-4 d-md-none">
        {mobileMagazines.map((mag) => (
          <div key={mag._id} className="col-6">
            <CoverCard
              image={mag.featuredImage}
              href={`/magazine/${mag._id}`}
              cardClass="cover-magazine"
            />
          </div>
        ))}
      </div>

      {/* Mobile button */}
      <div className="d-md-none text-center mt-3">
        <Link to="/magazines" className="btn-view-more">
          View more issues
          <span className="arrow-circle">
            <i className="bi bi-arrow-right"></i>
          </span>
        </Link>
      </div>
    </div>
  )
}
