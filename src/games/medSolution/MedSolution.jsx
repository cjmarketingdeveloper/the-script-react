import React, { useEffect, useState } from 'react'

const SAMPLE_IMAGES = [
    {
		"answer"  : "Liver",
		"options" : ["Bones", "Liver", "Pelvic"],
		"url" :"image/Essentiale-extreme.jpg"
	},
	{
		"answer"  : "Nails & Skin",
		"options" : ["Nails & Skin", "Face", "Ears"],
		"url" : "image/Revita Metics.jpg"
	},
	{
		"answer"  : "Stomach",
		"options" : ["Neck", "Period", "Stomach"],
		"url" : "image/Ulsanic.jpg"
	},
	{
		"answer"  : "Pelvic Area",
		"options" : ["Thigh", "Pelvic Area", "Stomach"],
		"url" : "image/Midol.jpg"
	},
	{
		"answer"  : "Head",
		"options" : ["Neck", "Head", "Hair"],
		"url" : "image/Excedrin.jpg"
	},
	{
		"answer"  : "Diarrhea",
		"options" : ["Thirsty", "Diarrhea", "Hair"],
		"url" :"image/Rehidrat"
	},
	{
		"answer"  : "Throat",
		"options" : ["Throat", "Nostrils", "Tongue"],
		"url" :"image/Cepacol.jpg",
	},
	{
		"answer"  : "Eye",
		"options" : ["Eyebrow", "Face", "Eye"],
		"url" :"image/Gold-Eye-Maintenance.jpg"
	},
	{
		"answer"  : "Bones",
		"options" : ["Bones", "Immune", "Throat"],
		"url" :"image/calcium-complex.jpg"
	},
	{
		"answer"  : "Digestion",
		"options" : ["Body", "Immune", "Digestion"],
		"url" :"image/Entiro-Probiotic-Chews.jpg"
	},
	{
		"answer"  : "Immune",
		"options" : ["Bones", "Immune", "Skin"],
		"url" :"image/A-Vogel-Echinaforce.jpg"
	},    
	{
		"answer"  : "Body",
		"options" : ["Vomiting", "Skin", "Body"],
		"url" :"image/Panadol.jpg"
	},
	{
		"answer"  : "Nasal",
		"options" : ["Eye", "Nasal", "Skin"],
		"url" :"image/Sterimar-Nasal-Spray.jpg"
	}, 
    {
        "answer"  : "Headaches",
		"options" : ["Headaches", "Diarrhea", "Liver"],
        "url" : "image/Tibb-Sinugraine-Tablets-60.jpg"
    },
    {
        "answer" : "Combat stress",
        "options" : ["Combat stress", "Throat", "Nasal"],
        "url" : "image/Ultimag-Advanced-Effervescent-Tablets-30.jpg"
    },
    {
        "answer" : "Soreness and cracking",
        "options" : ["Soreness and cracking", "Itchy feet", "Head"],
        "url" : "image/Bennetts Nipple Cream 50ml.jpg"
    },
    {
        "answer" : "Immune support",
        "options" : ["Dry Skin", "Skin & Nails", "Immune support"],
        "url" : "image/Viral-Guard-Tablets-60.jpg"
    },
    {
        "answer" : "Congestion",
        "options" : ["Congestion", "Red Blood Cells", "Eye"],
        "url" : "image/Linctagon-Capsules-20.jpg"
    },
    {
        "answer" : "Urinary infections",
        "options" : ["Soreness and cracking", "Red Blood Cells", "Urinary infections"],
        "url" : "image/Linctagon-Capsules-20.jpg"
    },
    {
        "answer" : "Red Blood Cells",
        "options" : ["Body", "Red Blood Cells", "Indigestion"],
        "url" : "image/Brunel-Folic-Acid-Tablets-100.jpg"
    }, 
    {
        "answer" : "Indigestion",
        "options" : ["Liver", "Red Blood Cells", "indigestion"],
        "url" : "image/Gaviscon.jpg"
    }
];

const QUESTION_COUNT = 20;

function MedSolution({user}) {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Initialize and pick random questions
    const startNewGame = () => {
        const shuffledDeck = [...SAMPLE_IMAGES];
        for (let i = shuffledDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
        }

        const totalToTake = Math.min(shuffledDeck.length, QUESTION_COUNT);
        setQuestions(shuffledDeck.slice(0, totalToTake));
        setCurrentIndex(0);
        setScore(0);
        setIsCompleted(false);
        setImageError(false);
        setIsProcessing(false);
    };

    useEffect(() => {
        startNewGame();
    }, []);

    const handleOptionClick = (option) => {
        if (isProcessing) return; // Prevent multi-clicks during transition
        setIsProcessing(true);

        const currentQ = questions[currentIndex];
        const isCorrect = option === currentQ.answer;

        if (isCorrect) {
        setScore((prev) => prev + 1);
        }

        // Immediately advance to next question or end screen
        if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setImageError(false);
        setIsProcessing(false);
        } else {
        setIsCompleted(true);
        setIsProcessing(false);
        }
    };

    if (questions.length === 0) {
        return <div className="text-center p-3">Loading Quiz...</div>;
    }

    const currentQuestion = questions[currentIndex];
    const totalQuestions = questions.length;
    const isPassed = score === totalQuestions;
    
  return (
    <div className="d-flex flex-column align-items-center w-100 user-select-none">
      {/* Header Info */}
      <div className="d-flex justify-content-between align-items-center w-100 mb-2 px-1">
        <span className="small text-muted">
          Player: <strong>{user?.name || 'Guest'}</strong>
        </span>
        <span className="badge bg-secondary">
          Question {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="progress w-100 mb-3" style={{ height: '6px' }}>
        <div
          className="progress-bar bg-primary"
          role="progressbar"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        ></div>
      </div>

      {!isCompleted ? (
        <div className="w-100 d-flex flex-column align-items-center">
          
          {/* Product Image Container */}
          <div
            className="w-100 border rounded shadow-sm bg-light overflow-hidden d-flex justify-content-center align-items-center mb-3 p-2 text-center"
            style={{ maxWidth: '320px', height: '220px' }}
          >
            {imageError ? (
              <div className="text-muted small">
                <div className="fs-3 mb-1">📷</div>
                <strong>Image not found:</strong>
                <br />
                <code className="text-break">{currentQuestion.url}</code>
              </div>
            ) : (
              <img
                key={currentQuestion.url} // Forces clean image re-render per question
                src={currentQuestion.url}
                alt="Medication"
                className="img-fluid h-100"
                style={{ objectFit: 'contain' }}
                onError={() => setImageError(true)}
              />
            )}
          </div>

          <p className="fw-semibold text-center mb-3">
            What body area or symptom does this product treat?
          </p>

          {/* Neutral Blue Option Buttons */}
          <div className="w-100 d-flex flex-column gap-2" style={{ maxWidth: '320px' }}>
            {currentQuestion.options.map((option, idx) => (
              <button
                key={`${currentIndex}-${idx}`}
                className="btn btn-outline-primary py-2 fw-semibold text-capitalize"
                onClick={() => handleOptionClick(option)}
                disabled={isProcessing}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Final Outcome View */
        <div className="text-center w-100 p-3 my-2 border rounded shadow-sm bg-white">
          {isPassed ? (
            <div>
              <div className="display-4 text-success mb-2">🎉</div>
              <h4 className="text-success fw-bold">SUCCESS!</h4>
              <p className="text-muted">
                Perfect score! You correctly answered <strong>{score} / {totalQuestions}</strong> questions.
              </p>
            </div>
          ) : (
            <div>
              <div className="display-4 text-danger mb-2">❌</div>
              <h4 className="text-danger fw-bold">FAILED</h4>
              <p className="text-muted mb-1">
                You scored <strong>{score} / {totalQuestions}</strong>.
              </p>
              <p className="small text-danger fw-semibold">
                You need {totalQuestions} / {totalQuestions} correct answers to pass.
              </p>
            </div>
          )}

          <button className="btn btn-primary mt-3 px-4" onClick={startNewGame}>
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}

export default MedSolution