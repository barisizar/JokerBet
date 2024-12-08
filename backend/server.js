const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const SYMBOLS = ['9', '10', 'J', 'Q', 'K', 'A'];
const PAYLINES = 20;
const WILD_SYMBOL = 'J'; // Joker is Wild
const SCATTER_SYMBOL = 'Q'; // Harley is Scatter

// Custom Linear Congruential Generator (LCG)
class LCG {
    constructor(seed = 1) {
        this.m = 2 ** 31 - 1; // modulus (a large prime number)
        this.a = 1664525; // multiplier
        this.c = 1013904223; // increment
        this.state = seed; // initial seed
    }

    next() {
        this.state = (this.a * this.state + this.c) % this.m;
        return this.state;
    }

    random() {
        return this.next() / this.m;
    }

    randomInt(min, max) {
        return Math.floor(this.random() * (max - min)) + min;
    }
}

class JokerJackpotGame {
    constructor(seed = Date.now()) {
        this.lcg = new LCG(seed);
    }

    getCurrentWinRate() {
        const currentHour = new Date().getHours();

        if (currentHour >= 17 && currentHour < 20) {
            return 0.7; // 70% win rate between 17:00 and 20:00
        } else if (currentHour >= 20 && currentHour < 24) {
            return 0.4; // 40% win rate between 20:00 and 24:00
        } else {
            return 0.5; // 50% win rate at other times
        }
    }

    generateBoard() {
        const winRate = this.getCurrentWinRate();
        const shouldWin = this.lcg.random() < winRate;

        const board = [];
        if (shouldWin) {
            // Generate a winning board
            for (let i = 0; i < 5; i++) {
                const column = [];
                for (let j = 0; j < 3; j++) {
                    if (j === 1) { // Middle row has higher chance of matching symbols
                        const symbolIndex = this.lcg.randomInt(0, SYMBOLS.length - 1);
                        column.push(SYMBOLS[symbolIndex]);
                    } else {
                        const symbolIndex = this.lcg.randomInt(0, SYMBOLS.length - 1);
                        column.push(SYMBOLS[symbolIndex]);
                    }
                }
                board.push(column);
            }
        } else {
            // Generate a non-winning board
            for (let i = 0; i < 5; i++) {
                const column = [];
                for (let j = 0; j < 3; j++) {
                    const symbolIndex = this.lcg.randomInt(0, SYMBOLS.length - 1);
                    column.push(SYMBOLS[symbolIndex]);
                }
                board.push(column);
            }
        }
        return board;
    }

    calculateWin(board, betAmount) {
        let totalWin = 0;
        let jackpotWon = false;
        let winningLines = [];

        // Check paylines
        for (let i = 0; i < PAYLINES; i++) {
            const { win, symbols, positions } = this.checkPayline(board, i);
            if (win > 0) {
                totalWin += win * betAmount / PAYLINES;
                winningLines.push({
                    payline: i + 1,
                    symbols: symbols,
                    positions: positions,
                    payout: win
                });
            }
        }

        // Check for jackpot (5 Wilds in a row)
        if (board[0][1] === WILD_SYMBOL &&
            board[1][1] === WILD_SYMBOL &&
            board[2][1] === WILD_SYMBOL &&
            board[3][1] === WILD_SYMBOL &&
            board[4][1] === WILD_SYMBOL) {
            jackpotWon = true;
            totalWin += betAmount * 1000; // Jackpot multiplier
        }

        return { totalWin, jackpotWon, winningLines };
    }

    checkPayline(board, lineIndex) {
        // Middle row payline check
        const positions = [];
        const line = board.map((col, colIndex) => {
            positions.push({ row: 1, col: colIndex });
            return col[1];
        });

        const firstSymbol = line[0] === WILD_SYMBOL ?
            line.find(s => s !== WILD_SYMBOL) || WILD_SYMBOL : line[0];

        let count = 0;
        for (const symbol of line) {
            if (symbol === firstSymbol || symbol === WILD_SYMBOL) {
                count++;
            } else {
                break;
            }
        }

        return {
            win: this.getPayoutMultiplier(firstSymbol, count),
            symbols: line,
            positions: positions
        };
    }

    getPayoutMultiplier(symbol, count) {
        if (count < 3) return 0;

        const payoutTable = {
            '9': [0, 0, 5, 15, 50],
            '10': [0, 0, 5, 15, 50],
            'J': [0, 0, 10, 25, 75],
            'Q': [0, 0, 10, 25, 75],
            'K': [0, 0, 15, 50, 100],
            'A': [0, 0, 15, 50, 100]
        };

        return payoutTable[symbol]?.[count - 1] || 0;
    }

    play(betAmount) {
        const board = this.generateBoard();
        const { totalWin, jackpotWon, winningLines } = this.calculateWin(board, betAmount);

        return {
            board,
            winAmount: totalWin,
            jackpotWon,
            winningLines
        };
    }
}

const game = new JokerJackpotGame();

app.post('/play', (req, res) => {
    const { betAmount } = req.body;
    console.log(`Received play request: { betAmount: ${betAmount} }`);
    console.log(`Current win rate: ${game.getCurrentWinRate() * 100}%`);

    const result = game.play(betAmount);

    console.log("Game result:");
    console.log(JSON.stringify(result, null, 2));

    if (result.winAmount > 0) {
        console.log(`Player won $${result.winAmount.toFixed(2)}`);
        result.winningLines.forEach(line => {
            console.log(`Payline ${line.payline}: ${line.symbols.join(', ')} - Payout: ${line.payout}x`);
        });
    } else {
        console.log("No win this spin");
    }

    if (result.jackpotWon) {
        console.log("JACKPOT WON!");
    }

    res.json(result);
});

// Update Sweet Bonanza Game Logic with explicit emoji codes
const FRUIT_SYMBOLS = [
    '🍎', // apple
    '🍊', // orange
    '🍇', // grapes
    '🍓', // strawberry
    '🍉', // watermelon
    '🍋', // lemon
    '🍑', // peach
    '🍍', // pineapple
    '🍌'  // banana
];
const BOARD_SIZE = 8;

class SweetBonanzaGame {
    constructor(seed = Date.now()) {
        this.lcg = new LCG(seed);
        this.symbols = FRUIT_SYMBOLS;
    }

    getCurrentWinRate() {
        const currentHour = new Date().getHours();

        if (currentHour >= 17 && currentHour < 20) {
            return 0.4; // Reduced from 0.7 to 0.4 (40% win rate during peak hours)
        } else if (currentHour >= 20 && currentHour < 24) {
            return 0.25; // Reduced from 0.4 to 0.25 (25% win rate during evening)
        } else {
            return 0.3; // Reduced from 0.5 to 0.3 (30% win rate at other times)
        }
    }

    generateBoard() {
        const winRate = this.getCurrentWinRate();
        const shouldWin = this.lcg.random() < winRate;

        const board = Array(BOARD_SIZE).fill().map(() =>
            Array(BOARD_SIZE).fill().map(() => {
                const symbolIndex = this.lcg.randomInt(0, this.symbols.length - 1);
                return this.symbols[symbolIndex];
            })
        );

        if (shouldWin) {
            // Add winning combinations less frequently and with shorter lengths
            const winningSymbol = this.symbols[this.lcg.randomInt(0, this.symbols.length - 1)];
            const winningCount = this.lcg.randomInt(4, 5); // Reduced max winning length from 6 to 5
            const startRow = this.lcg.randomInt(0, BOARD_SIZE - winningCount);
            const startCol = this.lcg.randomInt(0, BOARD_SIZE - 1);

            // Add some randomness to winning pattern
            if (this.lcg.random() < 0.7) { // 70% chance to actually place the winning combination
                for (let i = 0; i < winningCount; i++) {
                    board[startRow + i][startCol] = winningSymbol;
                }
            }
        }

        return board;
    }

    findWinningCombinations(board) {
        const winningPositions = [];
        const combinations = [];

        // Check vertical combinations (min 4 symbols)
        for (let col = 0; col < BOARD_SIZE; col++) {
            let currentSymbol = null;
            let count = 0;
            let positions = [];

            for (let row = 0; row < BOARD_SIZE; row++) {
                if (board[row][col] === currentSymbol) {
                    count++;
                    positions.push([row, col]);
                } else {
                    if (count >= 4) {
                        combinations.push({
                            symbol: currentSymbol,
                            count: count,
                            positions: [...positions]
                        });
                        winningPositions.push(...positions);
                    }
                    currentSymbol = board[row][col];
                    count = 1;
                    positions = [[row, col]];
                }
            }
            if (count >= 4) {
                combinations.push({
                    symbol: currentSymbol,
                    count: count,
                    positions: [...positions]
                });
                winningPositions.push(...positions);
            }
        }

        return { combinations, winningPositions };
    }

    calculateWin(combinations, betAmount) {
        let totalWin = 0;

        combinations.forEach(combo => {
            const multiplier = this.getMultiplier(combo.count);
            totalWin += betAmount * multiplier;
        });

        return totalWin;
    }

    getMultiplier(count) {
        switch (count) {
            case 4: return 2;    // 4 matching fruits
            case 5: return 5;    // 5 matching fruits
            case 6: return 15;   // 6 matching fruits
            case 7: return 50;   // 7 matching fruits
            case 8: return 100;  // 8 matching fruits (full column)
            default: return 0;
        }
    }

    play(betAmount) {
        const board = this.generateBoard();
        const { combinations, winningPositions } = this.findWinningCombinations(board);
        const winAmount = this.calculateWin(combinations, betAmount);

        return {
            board,
            winAmount,
            winningPositions,
            combinations
        };
    }
}

const sweetBonanzaGame = new SweetBonanzaGame();

// Add new endpoint for Sweet Bonanza
app.post('/play-sweet-bonanza', (req, res) => {
    const { betAmount } = req.body;
    console.log(`Received Sweet Bonanza play request: { betAmount: ${betAmount} }`);
    console.log(`Current win rate: ${sweetBonanzaGame.getCurrentWinRate() * 100}%`);

    const result = sweetBonanzaGame.play(betAmount);

    console.log("Game result:");
    console.log(JSON.stringify(result, null, 2));

    if (result.winAmount > 0) {
        console.log(`Player won $${result.winAmount.toFixed(2)}`);
        result.combinations.forEach(combo => {
            console.log(`Winning combination: ${combo.count}x ${combo.symbol} - Positions: ${JSON.stringify(combo.positions)}`);
        });
    } else {
        console.log("No win this spin");
    }

    res.json(result);
});

app.listen(port, () => {
    console.log(`Joker's Jackpot backend listening at http://localhost:${port}`);
    console.log(`Current win rate: ${game.getCurrentWinRate() * 100}%`);
});
