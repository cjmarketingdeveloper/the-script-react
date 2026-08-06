import React, { useState } from 'react';

// Static preset board (0 represents empty cells)
const INITIAL_BOARD = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

function SudokuComponent({user}) {
    const [board, setBoard] = useState(INITIAL_BOARD.map(row => [...row]));
  const [selectedCell, setSelectedCell] = useState(null); // { row, col }

  // Check if initial value (non-editable)
  const isInitialCell = (r, c) => INITIAL_BOARD[r][c] !== 0;

  // Handles placing a number into the selected cell
  const handleNumberInput = (num) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    if (isInitialCell(row, col)) return; // Prevent overwriting given numbers

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);
  };

  // Conflict validation logic
  const hasConflict = (r, c, val) => {
    if (val === 0) return false;

    // Row & Column Check
    for (let i = 0; i < 9; i++) {
      if (i !== c && board[r][i] === val) return true;
      if (i !== r && board[i][c] === val) return true;
    }

    // 3x3 Box Check
    const startRow = Math.floor(r / 3) * 3;
    const startCol = Math.floor(c / 3) * 3;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const curR = startRow + row;
        const curC = startCol + col;
        if ((curR !== r || curC !== c) && board[curR][curC] === val) {
          return true;
        }
      }
    }

    return false;
  };

  return (
    <div className="d-flex flex-column align-items-center w-100 user-select-none">
      <p className="text-muted mb-2 text-center small">
        Player: <strong>{user?.name} {user?.surname}</strong>
      </p>

      {/* 9x9 Sudoku Grid */}
      <div 
        className="border border-2 border-dark rounded bg-white p-1 mb-3 shadow-sm w-100"
        style={{
          maxWidth: '360px',
          aspectRatio: '1 / 1',
          display: 'grid',
          gridTemplateColumns: 'repeat(9, 1fr)',
          gap: '1px'
        }}
      >
        {board.map((row, r) =>
          row.map((val, c) => {
            const isSelected = selectedCell?.row === r && selectedCell?.col === c;
            const isGiven = isInitialCell(r, c);
            const isInvalid = hasConflict(r, c, val);

            // Dynamic thick borders for 3x3 grid boxes
            const borderStyle = {
              borderRight: (c + 1) % 3 === 0 && c < 8 ? '2px solid #333' : '1px solid #ddd',
              borderBottom: (r + 1) % 3 === 0 && r < 8 ? '2px solid #333' : '1px solid #ddd',
            };

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => setSelectedCell({ row: r, col: c })}
                className={`d-flex align-items-center justify-content-center fw-bold ${
                  isSelected ? 'bg-primary text-white' : 
                  isInvalid ? 'bg-danger-subtle text-danger' : 
                  isGiven ? 'bg-light text-dark' : 'bg-white text-primary'
                }`}
                style={{
                  ...borderStyle,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: isGiven ? '700' : '500'
                }}
              >
                {val !== 0 ? val : ''}
              </div>
            );
          })
        )}
      </div>

      {/* Mobile Number Keypad */}
      <div className="w-100" style={{ maxWidth: '360px' }}>
        <div className="d-flex justify-content-between gap-1 mb-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              className="btn btn-outline-dark flex-fill p-2 fw-bold"
              onClick={() => handleNumberInput(num)}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="d-flex justify-content-end">
          <button 
            className="btn btn-sm btn-outline-danger px-3"
            onClick={() => handleNumberInput(0)}
          >
            Clear Cell
          </button>
        </div>
      </div>
    </div>
  )
}

export default SudokuComponent