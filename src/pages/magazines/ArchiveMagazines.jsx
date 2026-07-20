import { useState } from 'react'
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react'

import CoverCard from '../../components/CoverCard'
// Import your offline data directly
import { magazines as localMagazines } from '../../data/magazines'

export default function ArchiveMagazines() {
  // 1. Instantly load the static local data
  const [magazines] = useState(localMagazines || [])
  const [filter, setFilter] = useState('newest')
  const [open, setOpen] = useState(false)

  // 2. Determine the absolute newest magazine in the entire dataset for the badge
  const absoluteLatestIssue = [...magazines].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  // 3. Sort the magazines based on selected filter
  const sortedMagazines = [...magazines].sort((a, b) => {
    if (filter === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }

    if (filter === 'issue') {
      // Handle potential string issue numbers by parsing them
      return parseInt(b.issue, 10) - parseInt(a.issue, 10)
    }

    // newest (default)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <>
      <div className="container-xl my-5">
        {/* BACK BUTTON */}
        <Link
          to="/magazines"
          className="btn btn-outline-orange btn-sm mb-3 d-inline-flex align-items-center gap-1"
        >
          <ArrowLeft size={14} />
          Back
        </Link>

        {/* HEADER ROW */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="section-title mb-0">
            The Script Archive
          </h1>

          {/* FILTER */}
          <div className="position-relative">
            <button
              className="btn-pill-sm d-flex align-items-center gap-2"
              onClick={() => setOpen(!open)}
            >
              Filter by
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {open && (
              <div className="dropdown-menu show mt-2 p-2 shadow-sm">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setFilter('newest')
                    setOpen(false)
                  }}
                >
                  Newest first
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setFilter('oldest')
                    setOpen(false)
                  }}
                >
                  Oldest first
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setFilter('issue')
                    setOpen(false)
                  }}
                >
                  Issue number
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MAGAZINE GRID */}
        <div className="row g-4">
          {sortedMagazines.map((mag) => {
            // Check if this item is the absolute latest issue
            const isLatest = absoluteLatestIssue && mag._id === absoluteLatestIssue._id;

            return (
              <div key={mag._id || mag.id} className="col-6 col-md-4">
                <CoverCard
                  image={mag.featuredImage}
                  href={`/magazine/${mag._id}`}
                  badge={isLatest ? 'Latest Issue' : undefined}
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
            );
          })}
        </div>
      </div>
    </>
  )
}