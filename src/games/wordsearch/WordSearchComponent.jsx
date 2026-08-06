import React, { useState, useEffect, useRef } from 'react';

// Static pharmaceutical terms
const PHARMA_WORDS = [
  'ASPIRIN',
  'DOSAGE',
  'VACCINE',
  'PLACEBO',
  'SYRUP',
  'CAPSULE',
  'GENERIC',
  'STATIN'
];

const GRID_SIZE = 10;


function WordSearchComponent({ user }) {

    const [grid, setGrid] = useState([]);
    const [placedWords, setPlacedWords] = useState([]);
    const [foundWords, setFoundWords] = useState([]);
    const [selectedCells, setSelectedCells] = useState([]);
    const [isSelecting, setIsSelecting] = useState(false);

    const gridRef = useRef(null);

    // Initialize the Word Search Board
    useEffect(() => {
        initBoard();
    }, []);

    const initBoard = () => {
        // 1. Create empty grid
        let newGrid = Array(GRID_SIZE).fill(null).map(() => 
        Array(GRID_SIZE).fill(null).map(() => ({ letter: '', highlighted: false }))
        );

        const placed = [];

        // 2. Place words horizontally, vertically, or diagonally
        const directions = [
        [0, 1],   // Horizontal right
        [1, 0],   // Vertical down
        [1, 1],   // Diagonal down-right
        [-1, 1]   // Diagonal up-right
        ];

        PHARMA_WORDS.forEach((word) => {
        let wordPlaced = false;
        let attempts = 0;

        while (!wordPlaced && attempts < 100) {
            attempts++;
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const row = Math.floor(Math.random() * GRID_SIZE);
            const col = Math.floor(Math.random() * GRID_SIZE);

            if (canPlaceWord(newGrid, word, row, col, dir)) {
            for (let i = 0; i < word.length; i++) {
                const r = row + i * dir[0];
                const c = col + i * dir[1];
                newGrid[r][c].letter = word[i];
            }
            placed.push(word);
            wordPlaced = true;
            }
        }
        });

        // 3. Fill remaining empty spaces with random uppercase letters
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (!newGrid[r][c].letter) {
            newGrid[r][c].letter = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
        }

        setGrid(newGrid);
        setPlacedWords(placed);
        setFoundWords([]);
        setSelectedCells([]);
    };

    const canPlaceWord = (board, word, row, col, dir) => {
        for (let i = 0; i < word.length; i++) {
        const r = row + i * dir[0];
        const c = col + i * dir[1];

        if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
        if (board[r][c].letter !== '' && board[r][c].letter !== word[i]) return false;
        }
        return true;
    };

    // Helper to get touch position relative to grid cells
    const getCellFromTouch = (touch) => {
        if (!gridRef.current) return null;
        const rect = gridRef.current.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        const cellWidth = rect.width / GRID_SIZE;
        const cellHeight = rect.height / GRID_SIZE;

        const col = Math.floor(x / cellWidth);
        const row = Math.floor(y / cellHeight);

        if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
        return { row, col };
        }
        return null;
    };

    // Selection Handlers (Mouse & Touch)
    const handleStart = (row, col) => {
        setIsSelecting(true);
        setSelectedCells([{ row, col }]);
    };

    const handleEnter = (row, col) => {
        if (!isSelecting) return;
        
        // Avoid duplicate cells in sequence
        setSelectedCells((prev) => {
        const exists = prev.some((cell) => cell.row === row && cell.col === col);
        if (exists) return prev;
        return [...prev, { row, col }];
        });
    };

    const handleEnd = () => {
        if (!isSelecting) return;
        setIsSelecting(false);

        // Form selected word string
        const selectedWord = selectedCells
        .map(({ row, col }) => grid[row][col].letter)
        .join('');

        const reversedWord = selectedWord.split('').reverse().join('');

        // Check if word is valid and not already found
        const matchedWord = placedWords.find(
        (w) => (w === selectedWord || w === reversedWord) && !foundWords.includes(w)
        );

        if (matchedWord) {
        setFoundWords((prev) => [...prev, matchedWord]);
        }

        setSelectedCells([]);
    };

    // Mobile Touch Move Event
    const handleTouchMove = (e) => {
        if (!isSelecting) return;
        const touch = e.touches[0];
        const cell = getCellFromTouch(touch);
        if (cell) {
        handleEnter(cell.row, cell.col);
        }
    };

    const isCellSelected = (r, c) => {
        return selectedCells.some((cell) => cell.row === r && cell.col === c);
    };


    return (
        <div className="d-flex flex-column align-items-center w-100">
      <p className="text-muted mb-2 text-center small">
        Pharmacist: <strong>{user?.name} {user?.surname}</strong>
      </p>

      {/* Word Grid */}
      <div
        ref={gridRef}
        className="user-select-none border rounded shadow-sm bg-white p-1 mb-3"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '2px',
          width: '100%',
          maxWidth: '360px',
          aspectRatio: '1 / 1',
          touchAction: 'none' // Prevents page scrolling during drag
        }}
        onMouseLeave={handleEnd}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const selected = isCellSelected(r, c);
            return (
              <div
                key={`${r}-${c}`}
                className={`d-flex align-items-center justify-content-center fw-bold rounded ${
                  selected ? 'bg-primary text-white' : 'bg-light text-dark'
                }`}
                style={{
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.1s ease'
                }}
                onMouseDown={() => handleStart(r, c)}
                onMouseEnter={() => handleEnter(r, c)}
                onMouseUp={handleEnd}
                onTouchStart={() => handleStart(r, c)}
              >
                {cell.letter}
              </div>
            );
          })
        )}
      </div>

      {/* Target Word List Badges */}
      <div className="w-100 px-2">
        <h6 className="text-center small text-uppercase text-secondary fw-bold mb-2">
          Find Pharma Terms ({foundWords.length}/{placedWords.length})
        </h6>
        <div className="d-flex flex-wrap justify-content-center gap-1">
          {placedWords.map((word) => {
            const isFound = foundWords.includes(word);
            return (
              <span
                key={word}
                className={`badge ${
                  isFound ? 'bg-success text-decoration-line-through' : 'bg-outline-secondary text-dark border'
                }`}
                style={{ fontSize: '0.75rem', padding: '6px 10px' }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {/* Victory Reset */}
      {foundWords.length > 0 && foundWords.length === placedWords.length && (
        <div className="mt-3 text-center">
          <p className="text-success fw-bold mb-1">🎉 All words found!</p>
          <button className="btn btn-sm btn-outline-primary" onClick={initBoard}>
            Play Again
          </button>
        </div>
      )}
    </div>
    )
}

export default WordSearchComponent