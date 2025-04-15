import { charMatrixMap } from './chars.js'; // Import the character matrix map

// Extracted helper function for speed normalization
const normalizeSpeed = (speed) => Math.max(0, Math.min(10, speed)) / 1000;

// Extracted helper function for padding a phrase
const padPhrase = (phrase, minInputLength) => {
    const spacesToAdd = Math.max(0, minInputLength - phrase.length);
    const padding = ' '.repeat(Math.ceil(spacesToAdd / 2));
    return padding + phrase + padding;
};

export const generateContributionGrid = (options) => {    
    let {
        letters,
        gridContainer,
        contributionsGrid,
        message,
        speed,
        paddingX,
        paddingY,
        creditsValue,
        creditsContainer,
        numRows,
        squareGap,
        animationDuration,
        maxInputLength,
        minInputLength        
    } = Object.assign({
        letters: charMatrixMap, // Map of characters to their grid representations
        gridContainer: document.getElementById('grid-container'), // Main container for the grid
        contributionsGrid: document.getElementById('contribution-grid'), // Grid element where contributions are displayed
        creditsContainer: document.getElementById('credits'), // Container for displaying credits
        message: 'HI THERE', // User input message
        speed: 3, // Animation speed 
        paddingX: 20, // Horizontal padding for the grid
        paddingY: 20, // Vertical padding for the grid
        creditsValue: 'github.artem.work', // Credits text input        
        numRows: 7, // Number of rows in the grid, it's 7 as the days of the week
        squareGap: 2, // Gap in squares between chars in the grid
        animationDuration: 0.5, // Duration of the animation for each square in seconds
        maxInputLength: 15, // Maximum length of the input message, it's limited because of the grid size (12 months)
        minInputLength: 10 // Minimum length of the input message, it's limited because of the grid size (12 months)
    }, options);

    if (!gridContainer) {
        throw new Error('Argument error: gridContainer is not defined. Please ensure the grid container element exists.');
    }
    if (!contributionsGrid) {
        throw new Error('Argument error: contributionsGrid is not defined. Please ensure the contributions grid element exists.');
    }
    if (!creditsContainer)  {
        throw new Error('Argument error: creditsContainer is not defined. Please ensure the credits container element exists.');
    }

    const speedFactor = normalizeSpeed(speed); // Normalize speed using helper function
    
    creditsContainer.innerHTML = creditsValue; // Update credits text 
    creditsContainer.style.display = creditsValue ? 'block' : 'none'; // Show or hide credits based on input

    // Set grid container padding based on user input
    Object.assign(gridContainer.style, {
        paddingLeft: `${paddingX}px`,
        paddingRight: `${paddingX}px`,
        paddingTop: `${paddingY}px`,
        paddingBottom: `${paddingY}px`
    });

    let phrase = '';
    for (const char of message.toUpperCase()) { // Convert message to uppercase and iterate through each character
        if (letters[char]) { // Only include characters that exist in the character map
            phrase += char;
        }
        if (phrase.length >= maxInputLength) {
            break; // Limit to max input length
        }
    }

    // Pad the phrase to meet minimum length using helper function
    if (phrase.length < minInputLength) {
        phrase = padPhrase(phrase, minInputLength);
    }

    contributionsGrid.innerHTML = ''; // Clear previous grid
    let totalColumns = 0;
    // calculate the total number of columns needed for the grid
    for (const char of phrase) {
        totalColumns += letters[char][0].length + squareGap; // Add character width and spacing      
    }
    totalColumns = Math.max(0, totalColumns - squareGap); // Remove trailing space

    // Set grid styles based on calculated values
    Object.assign(contributionsGrid.style, {
        gridTemplateRows: `repeat(${numRows}, 0.625rem)`, // Set grid row template
        gridTemplateColumns: `repeat(${totalColumns}, 0.625rem)` // Set grid column template
    });

    let animationDelay = 0;
    // draw the chars line by line
    for (let row = 0; row < numRows; row++) {
        let letterCol = 0;
        let currentLetter = 0;
        for (let col = 0; col < totalColumns; col++) {
            const letterTemplate = letters[phrase[currentLetter]]; // Get the grid representation of the current letter

            const square = document.createElement('div'); // Create a square element
            square.classList.add('square');
            square.style.animationDuration = `${speedFactor == 0 ? 0 : animationDuration}s`; // Set animation duration
            square.style.animationDelay = `${animationDelay}s`; // Set animation delay
            animationDelay += speedFactor; // Increment delay for staggered effect

            // when the letter line is done,
            // add spacing and move to the next letter
            if (letterCol >= letterTemplate[0].length) {
                square.classList.add(`level-${Math.floor(Math.random() * 2)}`); // Assign random level for spacing
                contributionsGrid.appendChild(square); // Add square to the grid
                if (letterCol >= letterTemplate[0].length + squareGap - 1) {
                    letterCol = 0;
                    currentLetter++;
                } else {
                    letterCol++;
                }
            } else {
                if (letterTemplate[row][letterCol] === 1) { // Check if the square is part of the letter in the map
                    square.classList.add(`level-${3 + Math.floor(Math.random() * 2)}`); // Assign higher level for letter squares
                } else {
                    square.classList.add(`level-${Math.floor(Math.random() * 2)}`); // Assign random level for non-letter squares
                }
                contributionsGrid.appendChild(square); // Add square to the grid
                letterCol++;
            }
        }

        currentLetter = 0; // Reset current letter index for the next row
        letterCol = 0; // Reset column index for the next row
    }

    generateLabels(); // Generate labels for the grid
}

const generateLabels = () => {
    const dayLabels = ['Mon', 'Wed', 'Fri']; // Labels for days
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // Labels for months
    const currentMonth = new Date().getMonth(); // Get the current month index

    const dayLabelsContainer = document.getElementById('day-labels'); // Container for day labels
    const monthLabelsContainer = document.getElementById('month-labels'); // Container for month labels

    dayLabelsContainer.innerHTML = dayLabels.map(day => `<div class="day-label">${day}</div>`).join(''); // Generate day labels
    monthLabelsContainer.innerHTML = Array.from({ length: 12 }, (_, i) => {
        const month = monthLabels[(currentMonth + i) % 12]; // Calculate month label based on current month
        return `<div class="month-label">${month}</div>`;
    }).join(''); // Generate month labels
}