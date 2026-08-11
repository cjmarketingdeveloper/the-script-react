import React from 'react';

// Import game components relative to modal location
import MaizeGameComponent from '../../games/maize/MaizeGameComponent';
import WordSearchComponent from '../../games/wordsearch/WordSearchComponent';
import SudokuComponent from '../../games/sudokuComponent/SudokuComponent';
import MemoryMatchComponent from '../../games/memoryMatch/MemoryMatchComponent';
import MedSolution from '../../games/medSolution/MedSolution';

export default function GameModal({ show, onClose, gameType, user }) {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />

      <div 
        className="modal fade show d-block modal-game-full" 
        tabIndex="-1"
        onClick={onClose}
      >
        <div 
          className="modal-dialog modal-dialog-centered" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Play Game:</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              {gameType === "MA5e4erAL" && <MaizeGameComponent user={user} />}
              {gameType === "WO112SEAR" && <WordSearchComponent user={user} />}
              {gameType === "SODC25eku" && <SudokuComponent user={user} />}
              {gameType === "MACH3589F" && <MemoryMatchComponent user={user} />}
              {gameType === "MEDS3589N" && <MedSolution user={user} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}