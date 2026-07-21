import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CoverCard from '../../components/CoverCard';
// import HeroCarousel from '../../components/home/HeroCarousel'; 

// 1. Import with a unique name to prevent variable shadowing!
import { magazines as localMagazines } from '../../data/magazines';

const ITEMS_PER_PAGE = 6;

export default function Magazines() {
  // ----- YEAR LOGIC -----
  const currentYear = new Date().getFullYear(); // Dynamic current year (e.g., 2026)
  const years = [currentYear, currentYear - 1, currentYear - 2];

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [page, setPage] = useState(1);

  // 2. Initialize your state directly with your local data array. No useEffect needed!
  const [magazinesList] = useState(localMagazines || []);

  // ----- FILTER + SORT -----
// 1. Find the absolute latest issue across ALL years before filtering
const absoluteLatestIssue = [...magazinesList].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
)[0];

// 2. Filter + Sort for the current year tab
const filteredMagazines = magazinesList
  .filter((mag) => {
    if (!mag.createdAt) return false;
    const year = new Date(mag.createdAt).getFullYear();
    return year === selectedYear;
  })
  .sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  // ----- PAGINATION -----
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const visibleMagazines = filteredMagazines.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      {/* ================= HERO (SLIDER) ================= */}
      <div className="container-xl my-5 slider-relative-container">
        <div
          className="hero-slide position-relative d-flex align-items-center"
          style={{
            backgroundImage: "url('/assets/hero/mag1.jpg')",
            minHeight: '420px',
          }}
        >
          <div className="hero-overlay"></div>
          <div className="container-xl text-white">
            <h1 className="mb-3">Reach the Heart of South Africa's Pharmacy Industry</h1>
            <p className="mb-4 col-md-6">
              Connect with thousands of pharmacists, healthcare professionals, and decision-makers through our multi-channel platform
            </p>
          </div>
        </div>
      </div>

      {/* ========== EDITIONS BY YEAR ========== */}
      <div className="container-xl my-5">
        <h2 className="mb-3">Editions by Year</h2>

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
                setSelectedYear(year);
                setPage(1);
              }}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Magazine Grid */}
        {/* Magazine Grid */}
        {visibleMagazines.length === 0 ? (
          <p className="text-muted">No magazines found for {selectedYear}.</p>
        ) : (
          <div className="row g-4"> {/* <--- THIS wrapper is crucial for side-by-side layout */}
            {visibleMagazines.map((mag) => {
              // Check if this specific item is the absolute newest one in the database
              const isLatest = absoluteLatestIssue && (mag._id === absoluteLatestIssue._id);

              return (
                <div key={mag._id || mag.id || mag.title} className="col-6 col-md-4">
                  <CoverCard
                    image={mag.featuredImage}
                    href={`/magazines/${mag._id}`}
                    badge={isLatest ? 'Latest Issue' : undefined}
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
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredMagazines.length > ITEMS_PER_PAGE && (
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
                filteredMagazines.length
              }
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