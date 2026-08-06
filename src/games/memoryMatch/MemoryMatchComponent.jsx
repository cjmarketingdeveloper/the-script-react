import React, { useEffect, useState } from 'react';

// Sample images array formatted with matching numbers
const SAMPLE_IMAGES = [
  {
    number: 2,
    url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=150&auto=format&fit=crop&q=60'
  },
  {
    number: 3,
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=60'
  },
  {
    number: 6,
    url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=150&auto=format&fit=crop&q=60'
  },
  {
    number: 2,
    url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=150&auto=format&fit=crop&q=60'
  },
  {
    number: 3,
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=60'
  },
  {
    number: 7,
    url: 'https://images.unsplash.com/photo-1550572017-edf706da2018?w=150&auto=format&fit=crop&q=60'
  },
  {
    number: 5,
    url: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1cdb?w=150&auto=format&fit=crop&q=60'
  },
  ,
  {
    number: 4,
    url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=150&auto=format&fit=crop&q=60'
  },
  {
    number: 1,
    url: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=150&auto=format&fit=crop&q=60'
  },
  {
    number: 8,
    url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=150&auto=format&fit=crop&q=60'
  },
  {
    number: 2,
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60'
  },
  {
    number: 4,
    url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=150&auto=format&fit=crop&q=60'
  },
  {
    number: 2,
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60'
  },
  {
    number: 1,
    url: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=150&auto=format&fit=crop&q=60'
  },
  {
    number: 6,
    url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=150&auto=format&fit=crop&q=60'
  },
  {
    number : 5,
    url : 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1cdb?w=150&auto=format&fit=crop&q=60'
  },
  {
    number: 7,
    url: 'https://images.unsplash.com/photo-1550572017-edf706da2018?w=150&auto=format&fit=crop&q=60'
  },
  {
    number: 8,
    url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=150&auto=format&fit=crop&q=60'
  }
];
//1   2   3    4   5   6    7    8


function MemoryMatchComponent({user}) {
    const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);

  // Initialize and Shuffle Grid
  const initializeGame = () => {
    // Duplicate 12 images to form 24 cards (12 pairs)
    const cardDeck = [...SAMPLE_IMAGES, ...SAMPLE_IMAGES].map((imgUrl, index) => ({
      id: index,
      imgUrl,
      pairId: imgUrl
    }));

    // Fisher-Yates Shuffle algorithm
    for (let i = cardDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardDeck[i], cardDeck[j]] = [cardDeck[j], cardDeck[i]];
    }

    setCards(cardDeck);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setDisabled(false);
    setMoves(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Handle Card Click
  const handleCardClick = (index) => {
    if (
      disabled ||
      flippedIndices.includes(index) ||
      matchedPairs.includes(cards[index].pairId)
    ) {
      return;
    }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // When 2 cards are flipped
    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setDisabled(true);

      const [firstIndex, secondIndex] = newFlipped;
      if (cards[firstIndex].pairId === cards[secondIndex].pairId) {
        // Match found
        setMatchedPairs((prev) => [...prev, cards[firstIndex].pairId]);
        setFlippedIndices([]);
        setDisabled(false);
      } else {
        // Not a match, flip back after timeout
        setTimeout(() => {
          setFlippedIndices([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  const isGameComplete = matchedPairs.length === SAMPLE_IMAGES.length;

  return (
    <div className="d-flex flex-column align-items-center w-100 user-select-none">
      {/* Header Info */}
      <div className="d-flex justify-content-between align-items-center w-100 mb-2 px-1">
        <span className="small text-muted">
          Player: <strong>{user?.name || 'Guest'}</strong>
        </span>
        <span className="badge bg-primary">Moves: {moves}</span>
      </div>

      {/* 3 Cards Per Row Grid */}
      <div
        className="w-100 mb-3"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)', // 3 per row for mobile
          gap: '8px',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}
      >
        {cards.map((card, index) => {
          const isFlipped =
            flippedIndices.includes(index) || matchedPairs.includes(card.pairId);

          return (
            <div
              key={index}
              onClick={() => handleCardClick(index)}
              className="position-relative border rounded shadow-sm overflow-hidden"
              style={{
                aspectRatio: '1 / 1',
                cursor: 'pointer',
                perspective: '1000px'
              }}
            >
              <div
                className="w-100 h-100 d-flex align-items-center justify-content-center transition-all"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.4s ease',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Back Side (Covered) */}
                <div
                  className="position-absolute w-100 h-100 bg-dark text-white d-flex align-items-center justify-content-center fw-bold"
                  style={{
                    backfaceVisibility: 'hidden',
                    borderRadius: '4px'
                  }}
                >
                  ❓
                </div>

                {/* Front Side (Image Revealed) */}
                <div
                  className="position-absolute w-100 h-100 bg-white"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderRadius: '4px'
                  }}
                >
                  <img
                    src={card.imgUrl}
                    alt="Memory Card"
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Game Completed View */}
      {isGameComplete && (
        <div className="text-center p-2 bg-success-subtle rounded border border-success w-100 mb-2">
          <h6 className="text-success fw-bold mb-1">🎉 All Pairs Matched!</h6>
          <p className="small text-muted mb-2">Completed in {moves} moves.</p>
          <button className="btn btn-sm btn-success" onClick={initializeGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}

export default MemoryMatchComponent