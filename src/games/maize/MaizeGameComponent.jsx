import React, { useEffect, useRef } from 'react';
import './maize.css';
import { toast } from 'react-toastify';

const COLS = 20;
const ROWS = 20;

class Cell {
  constructor(col, row) {
    this.col = col;
    this.row = row;
    this.walls = [true, true, true, true]; // Top, Right, Bottom, Left
    this.visited = false;
  }

  draw(ctx, cellSize) {
    const x = this.col * cellSize;
    const y = this.row * cellSize;

    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;

    const drawLine = (x1, y1, x2, y2) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    if (this.walls[0]) drawLine(x, y, x + cellSize, y);
    if (this.walls[1]) drawLine(x + cellSize, y, x + cellSize, y + cellSize);
    if (this.walls[2]) drawLine(x + cellSize, y + cellSize, x, y + cellSize);
    if (this.walls[3]) drawLine(x, y + cellSize, x, y);
  }
}


function MaizeGameComponent({user}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  const gridRef = useRef([]);
  const playerRef = useRef({ col: 0, row: 0 });
  const goal = { col: COLS - 1, row: ROWS - 1 };

  // Helper functions for maze grid logic
  const getIndex = (c, r) => {
    if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return -1;
    return c + r * COLS;
  };

  const getUnvisitedNeighbor = (cell, grid) => {
    const neighbors = [];
    const { col, row } = cell;

    const top    = grid[getIndex(col, row - 1)];
    const right  = grid[getIndex(col + 1, row)];
    const bottom = grid[getIndex(col, row + 1)];
    const left   = grid[getIndex(col - 1, row)];

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    if (neighbors.length > 0) {
      return neighbors[Math.floor(Math.random() * neighbors.length)];
    }
    return undefined;
  };

  const removeWalls = (a, b) => {
    const x = a.col - b.col;
    if (x === 1) { a.walls[3] = false; b.walls[1] = false; }
    else if (x === -1) { a.walls[1] = false; b.walls[3] = false; }

    const y = a.row - b.row;
    if (y === 1) { a.walls[0] = false; b.walls[2] = false; }
    else if (y === -1) { a.walls[2] = false; b.walls[0] = false; }
  };

  const generateMaze = () => {
    const grid = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        grid.push(new Cell(c, r));
      }
    }

    const stack = [];
    let current = grid[0];
    current.visited = true;

    while (true) {
      const next = getUnvisitedNeighbor(current, grid);
      if (next) {
        next.visited = true;
        stack.push(current);
        removeWalls(current, next);
        current = next;
      } else if (stack.length > 0) {
        current = stack.pop();
      } else {
        break;
      }
    }

    gridRef.current = grid;
    playerRef.current = { col: 0, row: 0 };
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const cellSize = canvas.width / COLS;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Walls
    gridRef.current.forEach(cell => cell.draw(ctx, cellSize));

    // Draw Goal (Green Dot)
    ctx.fillStyle = '#2ec4b6';
    ctx.beginPath();
    ctx.arc(
      goal.col * cellSize + cellSize / 2,
      goal.row * cellSize + cellSize / 2,
      cellSize / 3, 0, Math.PI * 2
    );
    ctx.fill();

    // Draw Player (Red Dot)
    ctx.fillStyle = '#e63946';
    ctx.beginPath();
    ctx.arc(
      playerRef.current.col * cellSize + cellSize / 2,
      playerRef.current.row * cellSize + cellSize / 2,
      cellSize / 3, 0, Math.PI * 2
    );
    ctx.fill();
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = width * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${width}px`;

    renderCanvas();
  };

  const movePlayer = (dir) => {
    const { col, row } = playerRef.current;
    const currentCell = gridRef.current[getIndex(col, row)];

    if (!currentCell) return;

    if (dir === 'up' && !currentCell.walls[0]) playerRef.current.row--;
    if (dir === 'right' && !currentCell.walls[1]) playerRef.current.col++;
    if (dir === 'down' && !currentCell.walls[2]) playerRef.current.row++;
    if (dir === 'left' && !currentCell.walls[3]) playerRef.current.col--;

    renderCanvas();

    // Check Win Condition
    if (playerRef.current.col === goal.col && playerRef.current.row === goal.row) {
      setTimeout(() => {
        alert(`Great job ${user?.name || 'Player'}! You solved the maze!`);
        toast.success("Thank you");
        generateMaze();
        renderCanvas();
      }, 100);
    }
  };

  useEffect(() => {
    generateMaze();
    resizeCanvas();

    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowUp') movePlayer('up');
      if (e.key === 'ArrowDown') movePlayer('down');
      if (e.key === 'ArrowLeft') movePlayer('left');
      if (e.key === 'ArrowRight') movePlayer('right');
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="d-flex flex-column align-items-center w-100">
      <p className="text-muted mb-2 text-center small">
        Player: <strong>{user?.name} {user?.surname}</strong>
      </p>

      {/* Canvas Square Container */}
      <div 
        ref={containerRef} 
        className="w-100 border rounded shadow-sm overflow-hidden bg-white" 
        style={{ maxWidth: '380px', aspectRatio: '1 / 1' }}
      >
        <canvas ref={canvasRef} />
      </div>

      {/* Touch D-Pad Controls */}
      <div className="mt-3 display-flex flex-column align-items-center">
        <div className="row g-1 justify-content-center" style={{ width: '180px' }}>
          <div className="col-12 text-center">
            <button className="btn btn-dark btn-sm w-50 py-2 fw-bold" onClick={() => movePlayer('up')}>▲</button>
          </div>
          <div className="col-12 d-flex justify-content-between my-1">
            <button className="btn btn-dark btn-sm w-45 py-2 fw-bold" onClick={() => movePlayer('left')}>◄</button>
            <button className="btn btn-dark btn-sm w-45 py-2 fw-bold" onClick={() => movePlayer('right')}>►</button>
          </div>
          <div className="col-12 text-center">
            <button className="btn btn-dark btn-sm w-50 py-2 fw-bold" onClick={() => movePlayer('down')}>▼</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaizeGameComponent