import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, ChevronsDown, X } from 'lucide-react';
import { Icon } from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import FaceIcon from '@mui/icons-material/Face';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import DiamondIcon from '@mui/icons-material/Diamond';
import './JokerSlot.css';
import jokerSlotsImage from './assets/JokerSpinning.webp';
import jokerCasinoImage from './assets/HarleySpinning.webp';
import ReactMarkdown from 'react-markdown';
import jokerImage from './assets/icons/Joker.png';
import harleyImage from './assets/icons/Harley.png';

const SYMBOLS = ['9', '10', 'J', 'Q', 'K', 'A'];
const CARD_SYMBOLS = ['9', '10', 'J', 'Q', 'K', 'A'];
const PAYLINES = 20;
const VISIBLE_SYMBOLS = 3;
const SYMBOL_HEIGHT = 5; // rem
const SPIN_DURATION = 3000; // 3 seconds
const REEL_SIZE = 30; // Increased for smoother spinning

const gameDescription = `
# Joker's Jackpot

Dive into the whimsical world of jesters and jokers, where laughter and surprises await at every spin! Enjoy a vibrant 5x3 slot game filled with playful symbols like joker hats, playing cards, and mysterious masks.

## Quick Rules:
- 5 reels, 3 rows, and 20 fixed paylines
- Wild Symbol (Joker Himself) substitutes for all symbols except Scatter
- Scatter Symbol (Joker's Laughing Mouth) triggers Free Spins
- Land 3+ Scatters to win 10-20 Free Spins with 3x multiplier
- Collect 20 Wilds to trigger the Joker's Prank Bonus Game
- Random Wild Reels can turn up to 3 reels entirely Wild
- Progressive Jackpot available in the Bonus Game
- Gamble Feature allows you to double or quadruple your wins up to 5 times

## Special Features:
- Free Spins with 3x multiplier
- Joker's Prank Bonus Game with big multipliers
- Random Wild Reels for increased win potential
- Progressive Jackpot for life-changing wins
- Exciting Gamble Feature to boost your winnings

Embrace the chaos and let the Joker bring you unparalleled excitement and winnings! Good luck on your spinning adventure!
`;

const JokerSlot = () => {
    const [reels, setReels] = useState(Array(5).fill().map(() => generateRandomReel()));
    const [spinning, setSpinning] = useState(false);
    const [spinComplete, setSpinComplete] = useState([false, false, false, false, false]);
    const [balance, setBalance] = useState(1000);
    const [betPerLine, setBetPerLine] = useState(1);
    const [totalBet, setTotalBet] = useState(PAYLINES);
    const [winAmount, setWinAmount] = useState(0);
    const [showWin, setShowWin] = useState(false);
    const [jackpotWon, setJackpotWon] = useState(false);
    const [showAnimatedWinText, setShowAnimatedWinText] = useState(false);
    const [reelPositions, setReelPositions] = useState([0, 0, 0, 0, 0]);
    const [finalSymbols, setFinalSymbols] = useState([]);
    const [autoplayActive, setAutoplayActive] = useState(false);
    const [autoplaySpins, setAutoplaySpins] = useState(0);
    const [progressiveJackpot, setProgressiveJackpot] = useState(10000);
    const [spinResult, setSpinResult] = useState(null);
    const animationRef = useRef(null);
    const [autoplayCount, setAutoplayCount] = useState(0);
    const [winningPositions, setWinningPositions] = useState([]);
    const [showWinningAnimation, setShowWinningAnimation] = useState(false);

    useEffect(() => {
        setTotalBet(betPerLine * PAYLINES);
    }, [betPerLine]);

    useEffect(() => {
        if (autoplayCount > 0 && !spinning) {
            const timer = setTimeout(() => {
                spin();
                setAutoplayCount(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [autoplayCount, spinning]);

    const handleBetChange = (amount) => {
        if (balance >= (betPerLine + amount) * PAYLINES) {
            setBetPerLine(prevBet => Math.max(1, prevBet + amount));
        } else {
            alert("Insufficient balance!");
        }
    };

    const clearBet = () => {
        setBetPerLine(1);
    };

    function generateRandomReel() {
        return Array(REEL_SIZE).fill().map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    }

    const spin = async () => {
        if (totalBet > balance) {
            alert("Insufficient balance!");
            return;
        }

        setWinningPositions([]);
        setShowAnimatedWinText(false);
        setShowWin(false);

        setSpinning(true);
        setSpinComplete([false, false, false, false, false]);
        setBalance(prevBalance => prevBalance - totalBet);
        setProgressiveJackpot(prevJackpot => prevJackpot + totalBet * 0.01);

        try {
            const response = await fetch('http://localhost:3001/play', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ betAmount: totalBet }),
            });
            const result = await response.json();
            setSpinResult(result);

            // Generate new random reels for spinning animation
            const newReels = Array(5).fill().map(() => generateRandomReel());
            setReels(newReels);

            // Start spinning animation
            startSpinningAnimation(result.board);
        } catch (error) {
            console.error('Error:', error);
            setSpinning(false);
        }
    };

    const startSpinningAnimation = (finalBoard) => {
        const spinSpeeds = [
            Math.random() * 2 + 3,
            Math.random() * 2 + 3.5,
            Math.random() * 2 + 4,
            Math.random() * 2 + 4.5,
            Math.random() * 2 + 5
        ];

        let startTime = performance.now();
        const animate = (time) => {
            const elapsed = time - startTime;
            if (elapsed < SPIN_DURATION) {
                setReelPositions(prevPositions =>
                    prevPositions.map((pos, i) =>
                        (pos + spinSpeeds[i]) % (REEL_SIZE * SYMBOL_HEIGHT)
                    )
                );
                animationRef.current = requestAnimationFrame(animate);
            } else {
                stopReels(finalBoard);
            }
        };
        animationRef.current = requestAnimationFrame(animate);
    };

    const stopReels = (finalBoard) => {
        // Update reels with final symbols
        const updatedReels = reels.map((reel, i) => {
            const finalSymbols = finalBoard[i];
            return [...finalSymbols, ...generateRandomReel().slice(finalSymbols.length)];
        });
        setReels(updatedReels);
        setReelPositions([0, 0, 0, 0, 0]);
        setSpinComplete([true, true, true, true, true]);
        setSpinning(false);

        // Log final symbols after stopping the reels
        console.log("Final Symbols (displayed):");
        finalBoard.forEach((column, index) => {
            console.log(`Reel ${index + 1}:`, column.join(', '));
        });

        // Handle win
        if (spinResult) {
            handleWin(spinResult);
            setSpinResult(null);
        }
    };

    const handleWin = (result) => {
        setWinAmount(result.winAmount);
        setJackpotWon(result.jackpotWon);

        if (result.winAmount > 0 && result.winningLines) {
            // Log winning combinations
            console.log("\n=== Winning Combinations ===");
            result.winningLines.forEach(line => {
                // Get the actual symbols from the board for this payline
                const lineSymbols = line.positions.map(pos => result.board[pos.col][pos.row]);
                console.log(`Payline ${line.payline}: ${lineSymbols.join(' ')} - Pays ${line.payout}x`);
            });
            console.log(`Total Win: $${result.winAmount.toFixed(2)}`);
            console.log("=========================\n");

            // Set winning positions for animation
            const winPositions = result.winningLines.flatMap(line =>
                line.positions.map(pos => `${pos.row}-${pos.col}`)
            );

            setShowWin(true);
            setBalance(prevBalance => prevBalance + result.winAmount);
            setShowAnimatedWinText(true);
            setWinningPositions(winPositions);

            setTimeout(() => {
                setShowAnimatedWinText(false);
                setWinningPositions([]);
                setShowWin(false);
            }, 3000);
        }
    };

    const startAutoplay = (count) => {
        setAutoplayCount(count);
        spin(); // Start the first spin immediately
    };

    const stopAutoplay = () => {
        setAutoplayCount(0);
    };

    const getCardIcon = (symbol) => {
        switch (symbol) {
            case '9':
                return '♠️'; // Spade
            case '10':
                return '♣️'; // Club
            case 'J':
                return <img src={jokerImage} alt="Joker" className="card-symbol" />;
            case 'Q':
                return <img src={harleyImage} alt="Harley" className="card-symbol" />;
            case 'K':
                return '♥️'; // Heart
            case 'A':
                return '♦️'; // Diamond
            default:
                return symbol;
        }
    };

    const renderSymbol = (symbol, reelIndex, symbolIndex) => {
        const stableIndex = symbolIndex % VISIBLE_SYMBOLS;
        const isWinning = winningPositions.includes(`${stableIndex}-${reelIndex}`);

        return (
            <div
                key={`${reelIndex}-${symbolIndex}`}
                className={`symbol ${isWinning ? 'winning' : ''}`}
            >
                {symbol === 'J' || symbol === 'Q' ? (
                    getCardIcon(symbol)
                ) : (
                    <span className="emoji-symbol">{getCardIcon(symbol)}</span>
                )}
            </div>
        );
    };

    return (
        <div className="joker-slot-container">
            <div className="jackpot-display">
                Progressive Jackpot: ${progressiveJackpot.toLocaleString()}
            </div>

            <div className="slot-content">
                <h1 className="joker-slot-title">Joker's Jackpot</h1>
                <div className="balance">Balance: ${balance.toLocaleString()}</div>

                <div className="slot-machine">
                    {reels.map((reel, reelIndex) => (
                        <div
                            key={`reel-${reelIndex}`}
                            className={`reel-container ${spinning && !spinComplete[reelIndex] ? 'spinning' : ''}`}
                        >
                            <div
                                className="reel"
                                style={{
                                    transform: `translateY(-${reelPositions[reelIndex]}rem)`,
                                    transition: spinning ? 'none' : 'transform 0.5s ease-out'
                                }}
                            >
                                {reel.map((symbol, symbolIndex) => (
                                    renderSymbol(symbol, reelIndex, symbolIndex)
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bet-controls">
                    <div className="bet-buttons">
                        <button onClick={() => handleBetChange(-1)} className="bet-button">-1</button>
                        <button onClick={() => handleBetChange(1)} className="bet-button">+1</button>
                        <button onClick={() => handleBetChange(5)} className="bet-button">+5</button>
                        <button onClick={clearBet} className="clear-bet-button">Clear</button>
                    </div>
                    <div className="current-bet">
                        Bet Per Line: ${betPerLine} | Total Bet: ${totalBet}
                    </div>
                </div>

                <div className="spin-controls">
                    <button
                        onClick={spin}
                        disabled={spinning || autoplayCount > 0}
                        className="spin-button"
                    >
                        {spinning ? 'Spinning...' : 'Spin'}
                    </button>

                    <div className="autoplay-buttons">
                        <button onClick={() => startAutoplay(20)} className="autoplay-button">Auto 20</button>
                        <button onClick={() => startAutoplay(50)} className="autoplay-button">Auto 50</button>
                        <button onClick={stopAutoplay} className="stop-autoplay-button">Stop Auto</button>
                    </div>
                </div>
            </div>

            {showAnimatedWinText && (
                <div className="animated-win-text">
                    {jackpotWon ? (
                        <span>JACKPOT! ${winAmount.toLocaleString()}</span>
                    ) : (
                        <span>Win! ${winAmount.toLocaleString()}</span>
                    )}
                </div>
            )}

            <div className="game-description">
                <ReactMarkdown>{gameDescription}</ReactMarkdown>
            </div>
        </div>
    );
};

export default JokerSlot;
