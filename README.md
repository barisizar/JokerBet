# JokerBet Casino Games (Mock-up)

⚠️ **DISCLAIMER: This is a mock-up casino application created for demonstration purposes only. No real money or gambling is involved. This project showcases frontend and backend development skills, UI/UX design, and game logic implementation.**

A modern casino gaming platform featuring two exciting games: Joker's Jackpot and Sweet Bonanza. Built with React for the frontend and Node.js/Express for the backend.

## 🎮 Game Showcase

### Welcome Page
![Welcome Page Demo](./assets/mainpage.png)
- Modern purple-themed interface
- Smooth transitions between games
- Responsive design for all devices
- Animated game selection cards

### Joker's Jackpot
https://github.com/barisizar/JokerBet/assets/JokerSlot.mov
- Dynamic 5x3 slot machine
- Smooth spinning animations
- Card-themed symbol animations
- Progressive jackpot counter
- Win celebration effects
- Autoplay functionality demo

### Sweet Bonanza
https://github.com/barisizar/JokerBet/assets/JokerBet.mov
- 8x8 fruit grid gameplay
- Sequential fruit dropping animations
- Cluster win highlights
- Win multiplier displays
- Autoplay feature in action
- Modern control interface

Each recording demonstrates the actual gameplay, animations, and user interactions in real-time. The videos showcase the smooth transitions, winning combinations, and special effects that make each game unique.

## 🎮 Games

### 1. Joker's Jackpot
A classic slot machine with a modern twist:
- 5x3 slot machine with card-themed symbols
- 20 paylines for multiple winning combinations
- Special Joker (Wild) and Harley (Scatter) symbols
- Progressive jackpot system
- Autoplay functionality with 20/50 spins options
- Detailed win animations and effects
- Paytable:
  - Three of a kind: 5x-15x
  - Four of a kind: 15x-50x
  - Five of a kind: 50x-100x
  - Five Jokers: Progressive Jackpot

### 2. Sweet Bonanza
A fruit-themed cluster pays game:
- 8x8 grid with colorful fruit symbols
- Vertical matching mechanics (4-8 symbols)
- Sequential fruit dropping animations
- Time-based win rates
- Autoplay feature
- Multipliers:
  - 4 matching fruits: 2x bet
  - 5 matching fruits: 5x bet
  - 6 matching fruits: 15x bet
  - 7 matching fruits: 50x bet
  - 8 matching fruits: 100x bet

## 🎯 Game Mechanics

### Win Rate System
The games feature a time-based win rate system:
- Peak Hours (17:00-20:00): 70% win rate
- Evening Hours (20:00-24:00): 40% win rate
- Other Times: 50% win rate

### Random Number Generation
- Custom LCG (Linear Congruential Generator) implementation
- Seed-based randomization for fairness
- Controlled win rates for better game balance

## 🚀 Features

- Modern, minimalist UI design
- Responsive layout for all devices
- Custom random number generation using LCG
- Time-based win rate system
- Progressive jackpot system
- Detailed game rules and paytables
- Smooth animations and transitions
- Real-time win calculations

## 🛠️ Technology Stack

### Frontend
- React.js for component-based UI
- CSS3 with modern animations
- Lucide React for icons
- React Markdown for game descriptions
- Axios for API calls

### Backend
- Node.js runtime
- Express.js framework
- Custom LCG randomization
- RESTful API endpoints

## 🎯 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
bash
git clone

2. Install frontend dependencies:
cd frontend
npm install

3. Install backend dependencies:
cd ../backend
npm install

4. Start the backend server:
npm start

Server will start on http://localhost:3001

5. In a new terminal, start the frontend development server:
cd ../frontend
npm start

Application will open on http://localhost:3000

## 💫 Project Structure

JokerBet/
├── backend/ # Backend server
│ ├── server.js # Main server file
│ └── package.json # Backend dependencies
│
└── frontend/ # Frontend application
├── public/ # Static files
├── src/
│ ├── App.js # Main React component
│ ├── JokerSlot.js # Joker's Jackpot game
│ ├── JokerBet.js # Sweet Bonanza game
│ └── .css # Styling files
└── package.json # Frontend dependencies


## 💡 Educational Purpose

This project demonstrates:
- Modern React application architecture
- State management in gaming applications
- Complex animation implementations
- Backend game logic and randomization
- Responsive design principles
- API integration and real-time updates

## 🔒 Security Note

While this is a mock-up application, it implements security best practices:
- Server-side random number generation
- Protected API endpoints
- Secure win calculation
- No real money transactions

## 📱 Responsive Design

The application is fully responsive across all devices:
- Desktop optimized (1920px and above)
- Tablet friendly (768px to 1919px)
- Mobile responsive (below 768px)

## ⚠️ Final Note

Remember: This is a demonstration project only. No real gambling or money is involved. The project serves as a showcase of frontend and backend development skills.