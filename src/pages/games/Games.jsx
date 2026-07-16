import React from 'react';
import { Guard } from '../../components/Guard';

export default function Games() {
  return (
    <div className="container mt-4">
      <h2>Games & Interactive Features</h2>
      <p className="text-muted">Engage with our interactive content and games.</p>

      <div className="row g-3">
        {/* Visible only to: Designers & Developers */}
        <Guard permission="content:write">
          <div className="col-12 col-md-4">
            <div className="card p-3">
              <h5>Game Studio</h5>
              <p className="small">Create and manage interactive games for the magazine.</p>
              <button className="btn btn-dark">Create Game</button>
            </div>
          </div>
        </Guard>

        {/* Visible only to: Evaluators & Developers */}
        <Guard permission="data:analytics">
          <div className="col-12 col-md-4">
            <div className="card p-3">
              <h5>Game Analytics</h5>
              <p className="small">View player engagement and game performance metrics.</p>
              <button className="btn btn-primary">View Analytics</button>
            </div>
          </div>
        </Guard>

        {/* Visible to: Owners, Reps, Staff, & Developers (but NOT Designers or Evaluators) */}
        <Guard permission="game:participate" fallback={<p className="text-danger mt-3">You do not have access to participate in games.</p>}>
          <div className="col-12 col-md-4">
            <div className="card p-3">
              <h5>Play Games</h5>
              <p className="small">Engage with our interactive games and features.</p>
              <button className="btn btn-success">Play Now</button>
            </div>
          </div>
        </Guard>
      </div>
    </div>
  );
};