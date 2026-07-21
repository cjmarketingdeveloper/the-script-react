import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react'

import CoverCard from '../../components/CoverCard'
// 1. Import your offline podcast data directly
import { podcasts as localPodcasts } from '../../data/podcasts'

export default function ArchivePodcasts() {
  const [podcasts] = useState(localPodcasts || [])
  const [filter, setFilter] = useState('newest')
  const [open, setOpen] = useState(false)

  // 2. Determine the absolute newest podcast in the entire dataset for the badge
  const absoluteLatestEpisode = [...podcasts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0]

  // 3. Sort podcasts based on the selected filter
  const sortedPodcasts = [...podcasts].sort((a, b) => {
    if (filter === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }

    if (filter === 'episode') {
      // Sorts by episode number (handling potential string types safely)
      const epA = parseInt(a.episode || a.issue || 0, 10)
      const epB = parseInt(b.episode || b.issue || 0, 10)
      return epB - epA
    }

    // newest (default)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <>
      <div className="container-xl my-5">
        {/* BACK BUTTON */}
        <Link
          to="/podcasts"
          className="btn btn-outline-orange btn-sm mb-3 d-inline-flex align-items-center gap-1"
        >
          <ArrowLeft size={14} />
          Back
        </Link>

        {/* HEADER ROW */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="section-title mb-0">
            Podcast Archive
          </h1>

          {/* FILTER */}
          <div className="position-relative">
            <button
              className="btn btn-script d-flex align-items-center gap-2"
              onClick={() => setOpen(!open)}
            >
              Filter by
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {open && (
              <div className="dropdown-menu show mt-2 p-2 shadow-sm" style={{ right: 0, left: 'auto' }}>
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
                    setFilter('episode')
                    setOpen(false)
                  }}
                >
                  Episode number
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PODCAST GRID */}
        {sortedPodcasts.length === 0 ? (
          <p className="text-muted">No podcast episodes found in the archive.</p>
        ) : (
          <div className="row g-4">
            {sortedPodcasts.map((pod) => {
              // Only apply the 'Latest Episode' badge to the absolute newest database entry
              const isLatest = absoluteLatestEpisode && pod._id === absoluteLatestEpisode._id

              return (
                <div key={pod._id || pod.id} className="col-12 col-md-4">
                  <CoverCard
                    image={pod.featuredImage}
                    href={`/podcast/${pod._id}`}
                    badge={isLatest ? 'Latest Episode' : undefined}
                    cardClass="cover-podcast"
                    footer={
                      <Link
                        to={`/podcast/${pod._id}`}
                        className="btn btn-script"
                      >
                        Listen Now
                      </Link>
                    }
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}