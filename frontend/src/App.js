import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import JokerBetBoard from './JokerBet';
import JokerSlot from './JokerSlot';
import './App.css';

import welcomeImage from './assets/JokerBetWelcome.webp';
import slotsImage from './assets/JokerSlots.webp';
import sweetBonanzaImage from './assets/JokerSweetBonanza.webp';

const JokerSlotWrapper = () => {
    return (
        <div className="joker-slot-page" style={{
            position: 'relative',
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #4a0e4e, #81007f)',
            overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                // Use a gradient as a fallback
                background: 'linear-gradient(to bottom right, #6a2c70, #b83b5e)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.3,
                zIndex: 1,
            }}></div>
            <div style={{
                position: 'relative',
                zIndex: 2,
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
            }}>
                <JokerSlot />
            </div>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <div className="welcome-container">
                        <img src={welcomeImage} alt="Welcome to Joker Bet" className="welcome-image" />
                        <h1 className="welcome-title">Welcome to Joker Bet</h1>
                        <p className="welcome-description">Choose your favorite game and start playing!</p>
                        <div className="game-options">
                            <Link to="/slots" className="game-option">
                                <img src={slotsImage} alt="Joker Slots" className="game-image" />
                                <h2>Joker Slots</h2>
                            </Link>
                            <Link to="/sweetbonanza" className="game-option">
                                <img src={sweetBonanzaImage} alt="Sweet Bonanza" className="game-image" />
                                <h2>Sweet Bonanza</h2>
                            </Link>
                        </div>
                    </div>
                } />
                <Route path="/sweetbonanza" element={<JokerBetBoard />} />
                <Route path="/slots" element={<JokerSlotWrapper />} />
            </Routes>
        </Router>
    );
};

export default App;
