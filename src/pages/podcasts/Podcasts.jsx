import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import CoverCard from '../../components/CoverCard'
import HeroCarousel from '../../components/home/HeroCarousel'

// 1. Import your offline podcast data directly
import { podcasts as localPodcasts } from '../../data/podcasts'

const ITEMS_PER_PAGE = 6

export default function Podcasts() {
  // ----- YEAR LOGIC -----
  const currentYear = new Date().getFullYear()
  const years = [currentYear, currentYear - 1, currentYear - 2]
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [page, setPage] = useState(1)

  // 2. Initialize your state directly with your local data array
  const [podcastsList] = useState(localPodcasts || [])

  // 3. Find the absolute latest episode across ALL years for the badge
  const absoluteLatestEpisode = [...podcastsList].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0]

  // ----- FILTER + SORT -----
  const filteredPodcasts = podcastsList
    .filter((pod) => {
      if (!pod.createdAt) return false
      const year = new Date(pod.createdAt).getFullYear()
      return year === selectedYear
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )

  // ----- PAGINATION -----
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const visiblePodcasts = filteredPodcasts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

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
            <h1 className="mb-3">Reach the Heart of South Africa's Pharmacy Industry</h1>
            <p className="mb-4 col-md-6">
              Connect with thousands of pharmacists, healthcare professionals, and decision-makers through our multi-channel platform
            </p>
          </div>
        </div>
      </div>

      {/* ========== EPISODES BY YEAR ========== */}
      <div className="container-xl my-5">
        <h2 className="mb-3">Episodes by Year</h2>

        {/* Year Selector */}
        <div className="d-flex gap-3 mb-4">
          {years.map((year) => (
            <button
              key={year}
              className={`btn ${
                year === selectedYear
                  ? 'btn-dark'
                  : 'btn-outline-dark'
              }`}
              onClick={() => {
                setSelectedYear(year)
                setPage(1)
              }}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Podcast Grid */}
        {visiblePodcasts.length === 0 ? (
          <p className="text-muted">No podcasts found for {selectedYear}.</p>
        ) : (
          <div className="row g-4">
            {visiblePodcasts.map((pod) => {
              // Check if this specific item is the absolute latest episode
              const isLatest = absoluteLatestEpisode && pod._id === absoluteLatestEpisode._id

              return (
                <div key={pod._id} className="col-12 col-md-4">
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

        {/* Pagination */}
        {filteredPodcasts.length > ITEMS_PER_PAGE && (
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
              disabled={
                startIndex + ITEMS_PER_PAGE >=
                filteredPodcasts.length
              }
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  )
}