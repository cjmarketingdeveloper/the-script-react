import React from 'react'
import './indexstytle.css';
import { Parser } from 'html-to-react';

function IndexTemplate({ template, pageId }) {
  const { indexPage } = template || {};

  const htmlParser                                                   = new Parser();

  return (
    <div className="container-fluid p-0 border rounded overflow-hidden">
      <div className="row g-0 min-vh-50 index_box-container">
        
        {/* Left Column (30%) */}
        <div 
          className="col-12 col-md-4 d-flex flex-column justify-content-between p-4"
          style={{ backgroundColor: indexPage?.graySection || "#b8b8b8" }}
        >
          <div className="flex-grow-1">
            <h4 className="fw-bold text-uppercase tracking-wider">Contents</h4>
          </div>
          
          {/* Bottom Corner */}
          <div className="indexer_bottom-left side-foot text-muted small mt-auto">
                 {htmlParser.parse(indexPage?.sideFoot)}
          </div>
        </div>

        {/* Right Column (70%) */}
        <div className="col-12 col-md-8 d-flex flex-column bg-white">
          
          {/* Top Section (75% height) */}
          <div className="index-list-section p-4 overflow-auto">
            <div className="index-heading">
                <h3 className="index-heading-title">Index</h3>
            </div>
            <ul className="list-unstyled mb-0">
              {indexPage?.list?.map((item, index) => (
                <li 
                  key={index} 
                  className="d-flex justify-content-between align-items-baseline border-bottom py-2"
                >
                  <span className="fw-medium text-dark">{item.title}</span>
                  <a href={`/magazines/${pageId}?page=${item.pageNumber}`}
                    className="index-linker" >
                    <span className="badge bg-secondary rounded-pill">{item.pageNumber}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Section (25% height) */}
          <div className="index-footer-section p-4 border-top bg-light mt-auto">
            <p className="mb-0 text-secondary small">
                {htmlParser.parse(indexPage?.footerSection)}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default IndexTemplate