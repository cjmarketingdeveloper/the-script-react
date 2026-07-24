import { Link } from 'react-router-dom';
import CoverCard from './CoverCard';
import { useEffect, useState } from 'react'
// import { collectMagazines } from '../../lib/fetchRequests'
import { magazines } from '../data/magazines'
import axios from 'axios';
import * as CONSTANTS from './../CONSTANTS'

export default function MagazineSection({user}) {
  const [latestMagazines, setLatestMagazines] = useState([])

  useEffect(() => {
    fetchListOfMagazines()
  }, [])

  const fetchListOfMagazines = async () => {
    try {
      const response = await axios.get(CONSTANTS.API_URL + 'magazines/collect/list/v1/', {
        headers: {
          token: "Bearer " + user.accessToken
        }
      });

      console.log(response.data);
      if (Array.isArray(response.data)) {
        setLatestMagazines(response.data)
      }
    } catch (error) {
      console.error('Error fetching magazines:', error)
    }
  }

  // 👇 slice for counts
  const desktopMagazines = latestMagazines.slice(0, 3)
  const mobileMagazines = latestMagazines.slice(0, 2)

  return (
    <div className="container-xl section-space">
      {/* Section header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">The Script Magazine</h2>

        {/* Desktop button */}
        <Link
          to="/magazines"
          className="btn btn-script"
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
          <div key={mag._id || mag.title} className="col-md-4">
            <CoverCard
              image={mag.featuredImage}
              href={`/magazines/${mag._id}`}
              badge={index === 0 ? <>Latest<br />Issue</> : undefined}
              cardClass="cover-magazine"
              footer={
                <Link
                  to={`/magazines/${mag._id}`}
                  className="btn btn-script"
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
          <div key={mag._id || mag.title} className="col-6">
            <CoverCard
              image={mag.featuredImage}
              href={`/magazines/${mag._id}`}
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
