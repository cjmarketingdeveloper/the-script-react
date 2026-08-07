import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CoverCard from '../../components/CoverCard';
import Spinner from '../../components/global/Spinner';

import axios from 'axios';
import * as CONSTANTS from '../../CONSTANTS'
import { useSelector } from 'react-redux';

const ITEMS_PER_PAGE = 6;

export default function Magazines() {
    const {user} = useSelector((state) => state.auth);
    // ----- YEAR LOGIC -----
    //const currentYear = new Date().getFullYear(); // Dynamic current year (e.g., 2026)
    //const years = [currentYear, currentYear - 1, currentYear - 2];

    const [years, setYears]                                 = useState([]);
    const [selectedYear, setSelectedYear]                   = useState("");
    const [page, setPage] = useState(1);

    const [magazinesList, setMagazineList]                    = useState([]);
    const [isProcessing, setIsProcessing]                     = useState(false);
    const [noMagazines, setNoMagazines]                       = useState("");

    useEffect(() => {
      collectPresentYears();
    }, [])
    
    useEffect(() => {
      
      if(years.length > 0){
        ListOfMagazines();
      }        
    }, [selectedYear])

    const collectPresentYears = async () => {
      try{
        
         const response = await axios.get(CONSTANTS.API_URL + 'magazines/collect/list/year/options/v1/', {
              headers: {
                token: "Bearer " + user.accessToken
              }
            });

            if(response.data.length > 0){
              setYears(response.data);
              setSelectedYear(response.data[0])
            }
             
      }catch(err){
         console.error('Error fetching magazines:', err)
      }
    }

    const ListOfMagazines = async () => {
        try {
          const response = await axios.get(CONSTANTS.API_URL + 'magazines/collect/list/v1/year/' + selectedYear, {
            headers: {
              token: "Bearer " + user.accessToken
            }
          });
    
         
          if (Array.isArray(response.data)) {
            setMagazineList(response.data);
            setNoMagazines(false);
          }else {
            setNoMagazines(true)
          }
        } catch (error) {
          console.error('Error fetching magazines:', error)
        }
    }
    
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

  
    if(isProcessing){
      return <Spinner />
    }

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
      <div className="container-xl my-5 mb-5">
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
          {/* Magazine Grid */}
          {noMagazines ? (
            <p className="text-muted">No magazines found for {selectedYear}.</p>
          ) : (
            <div className="row g-4">
              {magazinesList.length > 0 &&
                magazinesList.map((mag, index) => { {/* Added index parameter */}
                  // Check if this specific item is the absolute newest one
                  const isLatest = absoluteLatestIssue && (mag._id === absoluteLatestIssue._id);

                  return (
                    <div key={mag._id || mag.id || mag.title} className="col-6 col-md-4">
                    <CoverCard
                      image={mag.featuredImage}
                      href={`/magazines/${mag._id}`}
                      badge={
                        isLatest ? (
                          <div className="pulse-badge">
                            Latest<br />Issue
                          </div>
                        ) : undefined
                      }
                      cardClass="cover-magazine"
                      footer={
                        <Link to={`/magazines/${mag._id}`} className="btn btn-script">
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