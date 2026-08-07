import React, { useState } from 'react';
// Import your game components
import MaizeGameComponent from '../../games/maize/MaizeGameComponent';
import WordSearchComponent from '../../games/wordsearch/WordSearchComponent';
import SudokuComponent from '../../games/sudokuComponent/SudokuComponent';
import MemoryMatchComponent from '../../games/memoryMatch/MemoryMatchComponent';
import MedSolution from '../../games/medSolution/MedSolution';

export default function GamesModal({ user }){
  const [showGameModal, setShowGameModal] = useState(true);
  //WO112SEAR - wordsearch
  //MA5e4erAL - Maize
  //SODC25eku - Sudoku 
  //MACH3589F - Match Card
  //MEDS3589N - Medical Solutions

  const gameType = "WO112SEAR";

  return (
    <div>
    {/* Game Modal */}
    {showGameModal && (
        <div className="modal-backdrop fade show" onClick={() => setShowGameModal(false)}>
          <div className="modal fade show d-block modal-game-full" onClick={(e) => e.stopPropagation()}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Play Game: </h5>
                  <button type="button" className="btn-close" onClick={() => setShowGameModal(false)}></button>
                </div>
                <div className="modal-body">
                  {
                    gameType === "MA5e4erAL" &&
                    <MaizeGameComponent user={user} />  
                  }

                   {
                    gameType === "WO112SEAR" &&
                    <WordSearchComponent user={user} />  
                  }

                  {
                    gameType === "SODC25eku" &&
                    <SudokuComponent user={user} />  
                  }

                  {
                    gameType === "MACH3589F" &&
                    <MemoryMatchComponent user={user} />  
                  }

                  {
                    gameType === "MEDS3589N" &&
                    <MedSolution user={user} />  
                  }
                                   
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    </div>
  );
}