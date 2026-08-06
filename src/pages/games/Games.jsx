import React, { useState } from 'react';
// Import your game components
import MaizeGameComponent from '../../games/maize/MaizeGameComponent';
import WordSearchComponent from '../../games/wordsearch/WordSearchComponent';
import SudokuComponent from '../../games/sudokuComponent/SudokuComponent';
import MemoryMatchComponent from '../../games/memoryMatch/MemoryMatchComponent';
import MedSolution from '../../games/medSolution/MedSolution';

// 1. Define your game registry/data
const GAMES_LIST = [
  {
    id: 'MA5e4erAL',
    title: 'Maize Game',
    description: 'Navigate through the maze challenge!',
    thumbnail: 'assets/background/1.jpg', // Replace with your image paths
  },
  {
    id: 'WO112SEAR',
    title: 'Word Search',
    description: 'Find all hidden words in the grid.',
    thumbnail: 'assets/background/1.jpg',
  },
  {
    id: 'SODC25eku',
    title: 'Sudoku',
    description: 'Classic number-placement puzzle game.',
    thumbnail: 'assets/background/1.jpg',
  },
  {
    id: 'MACH3589F',
    title: 'Memory Match',
    description: 'Test your memory and match the cards.',
    thumbnail: 'assets/background/1.jpg',
  },
  {
    id: 'MEDS3589N',
    title: 'Med Solution',
    description: 'Interactive medical learning challenge.',
    thumbnail: 'assets/background/1.jpg',
  },
];

export default function Games({ user }) {
  const [showGameModal, setShowGameModal] = useState(false);
  const [activeGame, setActiveGame] = useState(null); // Stores the full active game object

  // Helper to trigger the modal open
  const handlePlayGame = (game) => {
    setActiveGame(game);
    setShowGameModal(true);
  };

  return (
    <div className="container mt-4 mb-5">
      <h2>Games & Interactive Features</h2>
      <p className="text-muted">Engage with our interactive content and games.</p>

      {/* 2. Responsive 3-4 Column Grid */}
      {/* row-cols-1 (mobile), row-cols-sm-2 (tablet), row-cols-md-3 (desktop), row-cols-lg-4 (large screens) */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-2">
        {GAMES_LIST.map((game) => (
          <div key={game.id} className="col">
            <div className="card h-100 shadow-sm border-0 hover-shadow transition">
              {/* Thumbnail Image */}
              <img 
                src={game.thumbnail} 
                className="card-img-top" 
                alt={game.title}
                style={{ height: '180px', objectFit: 'cover' }} 
              />
              
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{game.title}</h5>
                <p className="card-text text-secondary flex-grow-1 small">
                  {game.description}
                </p>
                
                <button 
                  className="btn btn-primary w-100 mt-3"
                  onClick={() => handlePlayGame(game)}
                >
                  Play Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Game Modal Component */}
      {showGameModal && activeGame && (
        <>
          {/* Dark semi-transparent background overlay */}
          <div 
            className="modal-backdrop fade show" 
            onClick={() => setShowGameModal(false)}
          />

          {/* Actual modal content layer */}
          <div 
            className="modal fade show d-block modal-game-full" 
            tabIndex={-1}
            onClick={() => setShowGameModal(false)}
          >
            <div 
              className="modal-dialog modal-dialog-centered modal-lg" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Play Game: {activeGame.title}</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowGameModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {activeGame.id === "MA5e4erAL" && <MaizeGameComponent user={user} />}
                  {activeGame.id === "WO112SEAR" && <WordSearchComponent user={user} />}
                  {activeGame.id === "SODC25eku" && <SudokuComponent user={user} />}
                  {activeGame.id === "MACH3589F" && <MemoryMatchComponent user={user} />}
                  {activeGame.id === "MEDS3589N" && <MedSolution user={user} />}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}