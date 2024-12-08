import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { DollarSign, ChevronsDown, X } from 'lucide-react';
import './JokerBet.css';
import ReactMarkdown from 'react-markdown';

const BET_AMOUNTS = [1, 10, 100];
const BOARD_SIZE = 8;

const gameDescription = `
# Sweet Bonanza

Welcome to Sweet Bonanza, a delightful 8x8 grid slot game filled with juicy fruits and sweet wins!

## Quick Rules:
- 8x8 grid with cluster pays mechanics
- Win by matching 4 or more identical fruits vertically
- Fruits cascade from top after each win
- Multiple winning combinations possible in a single spin

## Payouts:
- 4 matching fruits: 2x bet
- 5 matching fruits: 5x bet
- 6 matching fruits: 15x bet
- 7 matching fruits: 50x bet
- 8 matching fruits: 100x bet

## Special Features:
- Cascading Reels: Winning combinations disappear, allowing new fruits to drop
- Chain Reactions: Multiple wins possible from a single spin
- Time-Based Win Rates: Higher chances of winning during peak hours
- Progressive Win Multipliers: Consecutive wins increase multiplier

Enjoy the sweet cascade of fruits and watch as your wins multiply! Good luck!
`;

const JokerBetBoard = () => {
  const [board, setBoard] = useState([]);
  const [balance, setBalance] = useState(1000);
  const [currentBet, setCurrentBet] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [winningPositions, setWinningPositions] = useState([]);
  const [showCenteredWinText, setShowCenteredWinText] = useState(false);
  const [autoplayCount, setAutoplayCount] = useState(0);
  const winTimer = useRef(null);

  useEffect(() => {
    initializeBoard();
  }, []);

  useEffect(() => {
    if (autoplayCount > 0 && !isSpinning && !isDropping) {
      const timer = setTimeout(() => {
        handleSpin();
        setAutoplayCount(prev => prev - 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [autoplayCount, isSpinning, isDropping]);

  useEffect(() => {
    return () => {
      if (winTimer.current) {
        clearTimeout(winTimer.current);
      }
    };
  }, []);

  const initializeBoard = () => {
    const newBoard = Array(BOARD_SIZE).fill().map(() =>
      Array(BOARD_SIZE).fill(null)
    );
    setBoard(newBoard);
  };

  const handleBet = (amount) => {
    if (balance >= currentBet + amount && currentBet + amount > 0) {
      setCurrentBet(prevBet => prevBet + amount);
    } else {
      alert("Invalid bet amount!");
    }
  };

  const clearBet = () => {
    setCurrentBet(1);
  };

  const handleSpin = async () => {
    if (currentBet > balance) {
      alert("Insufficient balance!");
      return;
    }

    setIsSpinning(true);
    setShowWin(false);
    setWinningPositions([]);
    setShowCenteredWinText(false);
    setBalance(prevBalance => prevBalance - currentBet);

    try {
      const response = await axios.post('http://localhost:3001/play-sweet-bonanza', {
        betAmount: currentBet
      });

      // Start dropping animation
      setIsDropping(true);
      await animateDropping(response.data.board);

      // Handle win after animation
      if (response.data.winAmount > 0) {
        handleWin(response.data);
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSpinning(false);
      setIsDropping(false);
    }
  };

  const animateDropping = async (finalBoard) => {
    const newBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    setBoard(newBoard);

    // Start all columns simultaneously
    const promises = [];

    for (let col = 0; col < BOARD_SIZE; col++) {
      promises.push((async () => {
        for (let row = 0; row < BOARD_SIZE; row++) {
          await new Promise(resolve => setTimeout(resolve, 100));
          newBoard[row][col] = finalBoard[row][col];
          setBoard([...newBoard]);
        }
      })());
    }

    // Wait for all columns to finish dropping
    await Promise.all(promises);
  };

  const handleWin = (result) => {
    // Clear any existing timers
    if (winTimer.current) {
      clearTimeout(winTimer.current);
    }

    setWinAmount(result.winAmount);
    setBalance(prevBalance => prevBalance + result.winAmount);
    setShowWin(true);
    setShowCenteredWinText(true);
    setWinningPositions(result.winningPositions);

    // Store the timer reference
    winTimer.current = setTimeout(() => {
      setShowCenteredWinText(false);
      setWinningPositions([]);
      setShowWin(false);
    }, 2000);
  };

  const startAutoplay = (count) => {
    setAutoplayCount(count);
    handleSpin();
  };

  const stopAutoplay = () => {
    setAutoplayCount(0);
  };

  return (
    <div className="sweet-bonanza-container">
      <div className="game-header">
        <h1 className="game-title">Sweet Bonanza</h1>
        <div className="balance-display">Balance: ${balance.toLocaleString()}</div>
      </div>

      <div className="game-content">
        <div className={`fruit-grid ${isSpinning ? 'spinning' : ''}`}>
          {board.map((row, rowIndex) => (
            row.map((fruit, colIndex) => {
              const isWinning = winningPositions.some(([r, c]) => r === rowIndex && c === colIndex);
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`fruit-cell ${isWinning ? 'winning' : ''}`}
                >
                  <span className="fruit-emoji">{fruit}</span>
                </div>
              );
            })
          ))}
          {showCenteredWinText && (
            <div className="centered-win-text">
              ${winAmount.toLocaleString()} 🎉
            </div>
          )}
        </div>

        <div className="game-controls">
          <div className="bet-controls">
            <div className="bet-buttons">
              {BET_AMOUNTS.map(amount => (
                <button
                  key={amount}
                  onClick={() => handleBet(amount)}
                  className="bet-button"
                >
                  +${amount}
                </button>
              ))}
              <button onClick={() => handleBet(-1)} className="bet-button">-$1</button>
              <button onClick={clearBet} className="clear-bet-button">
                <X size={16} /> Clear
              </button>
            </div>
            <div className="current-bet">
              Current Bet: ${currentBet}
            </div>
          </div>

          <div className="spin-controls">
            <button
              onClick={handleSpin}
              disabled={isSpinning || isDropping || autoplayCount > 0}
              className="spin-button"
            >
              {isSpinning ? <ChevronsDown className="animate-bounce" /> : <DollarSign />}
              {isSpinning ? 'Spinning...' : isDropping ? 'Dropping...' : 'Spin'}
            </button>

            <div className="autoplay-buttons">
              <button
                onClick={() => startAutoplay(20)}
                disabled={autoplayCount > 0}
                className="autoplay-button"
              >
                Auto 20
              </button>
              <button
                onClick={() => startAutoplay(50)}
                disabled={autoplayCount > 0}
                className="autoplay-button"
              >
                Auto 50
              </button>
              <button
                onClick={stopAutoplay}
                disabled={!autoplayCount}
                className="stop-autoplay-button"
              >
                Stop Auto ({autoplayCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="game-description">
        <ReactMarkdown>{gameDescription}</ReactMarkdown>
      </div>
    </div>
  );
};

export default JokerBetBoard;
