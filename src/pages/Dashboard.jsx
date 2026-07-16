// src/pages/MagazineDashboard.jsx
import React from 'react';
import { Guard } from '../components/Guard';

export const Dashboard = () => {
  return (
    <div className="container mt-4">
      <h2>The Script Management Portal</h2>
      <p className="text-muted">Welcome to the interactive magazine hub.</p>

      <div className="row g-3">
        {/* Visible only to: Designers & Developers */}
        <Guard permission="content:write">
          <div className="col-12 col-md-4">
            <div className="card p-3">
              <h5>Designer Studio</h5>
              <p className="small">Upload visual assets and strip magazine pages.</p>
              <button className="btn btn-dark">Upload Content</button>
            </div>
          </div>
        </Guard>

        {/* Visible only to: Designers & Developers */}
        <Guard permission="content:arrange">
          <div className="col-12 col-md-4">
            <div className="card p-3">
              <h5>Layout Sequencer</h5>
              <p className="small">Adjust the ordering and flow of current issues.</p>
              <button className="btn btn-secondary">Open Sequencer</button>
            </div>
          </div>
        </Guard>

        {/* Visible only to: Evaluators & Developers */}
        <Guard permission="data:analytics">
          <div className="col-12 col-md-4">
            <div className="card p-3">
              <h5>Analytics Desk</h5>
              <p className="small">View survey completion rates and page-view metrics.</p>
              <button className="btn btn-primary">Open Reports</button>
            </div>
          </div>
        </Guard>
      </div>

      <div className="mt-4">
        {/* Visible to: Owners, Reps, Staff, & Developers (but NOT Designers or Evaluators) */}
        <Guard permission="content:consume" fallback={<p className="text-danger mt-3">You do not have access to view this magazine content.</p>}>
          <div className="p-4 border rounded bg-light">
            <h4>Latest Magazine Issue</h4>
            <p>Enjoy reading through our digital, mobile-optimized catalog!</p>
            
            {/* Interactive features visible only to Staff & Owners (Reps can ONLY look but not click/interact) */}
            <Guard permission="game:participate">
              <button className="btn btn-success me-2">Play Game (1 Entry Limit)</button>
            </Guard>
            
            <Guard permission="feedback:submit">
              <button className="btn btn-outline-success">Submit Feedback Survey</button>
            </Guard>
          </div>
        </Guard>
      </div>
    </div>
  );
};