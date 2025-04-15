import { charMatrixMap } from './chars.js'; // Import the character matrix map

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
        letters: charMatrixMap,
        gridContainer: document.getElementById('grid-container'),
        contributionsGrid: document.getElementById('contribution-grid'),
        message: document.getElementById('message-input').value.toUpperCase(),
        speed: document.getElementById('speed-input').value,
        paddingX: document.getElementById('padding-x-input').value,
        paddingY: document.getElementById('padding-y-input').value,
        creditsValue: document.getElementById('credits-input').value,
        creditsContainer: document.getElementById('credits'),
        numRows: 7,
        squareGap: 2,
        animationDuration: 0.5,
        maxInputLength: 15,
        minInputLength: 10
    }, options);

    const speedFactor = Math.max(0, Math.min(10, speed)) / 1000; // Normalize speed    
    
    creditsContainer.innerHTML = creditsValue; // Update credits text 
    creditsContainer.style.display = creditsValue ? 'block' : 'none'; // Show or hide credits based on input

    gridContainer.style.paddingLeft = `${paddingX}px`;
    gridContainer.style.paddingRight = `${paddingX}px`;
    gridContainer.style.paddingTop = `${paddingY}px`;
    gridContainer.style.paddingBottom = `${paddingY}px`;

    let phrase = '';
    for (const char of message) {
        if (letters[char]) {
            phrase += char;
        }
        if (phrase.length >= maxInputLength) {
            break; // Limit to max input length
        }
    }
    if (phrase.length < minInputLength) {
        const spacesToAdd = Math.max(0, minInputLength - phrase.length);
        const padding = ' '.repeat(Math.ceil(spacesToAdd / 2));
        phrase = padding + phrase + padding;
    }

    contributionsGrid.innerHTML = ''; // Clear previous grid
    let totalColumns = 0;
    for (const char of phrase) {
        totalColumns += letters[char][0].length + squareGap; // +squareGap for spacing      
    }
    totalColumns = Math.max(0, totalColumns - squareGap); // Remove trailing space

    contributionsGrid.style.gridTemplateRows = `repeat(${numRows}, 0.625rem)`;
    contributionsGrid.style.gridTemplateColumns = `repeat(${totalColumns}, 0.625rem)`;

    let animationDelay = 0;
    for (let row = 0; row < numRows; row++) {
        let letterCol = 0;
        let currentLetter = 0;
        for (let col = 0; col < totalColumns; col++) {
            const letterTemplate = letters[phrase[currentLetter]];

            const square = document.createElement('div');
            square.classList.add('square');
            square.style.animationDuration = `${speedFactor == 0 ? 0 : animationDuration}s`;
            square.style.animationDelay = `${animationDelay}s`;
            animationDelay += speedFactor; // Increment delay for staggered effect

            // when the letter line is done,
            // add spacing and move to the next letter
            if (letterCol >= letterTemplate[0].length) {
                square.classList.add(`level-${Math.floor(Math.random() * 2)}`);
                contributionsGrid.appendChild(square);
                if (letterCol >= letterTemplate[0].length + squareGap - 1) {
                    letterCol = 0;
                    currentLetter++;
                } else {
                    letterCol++;
                }
            } else {
                if (letterTemplate[row][letterCol] === 1) {
                    square.classList.add(`level-${3 + Math.floor(Math.random() * 2)}`);
                } else {
                    square.classList.add(`level-${Math.floor(Math.random() * 2)}`);
                }
                contributionsGrid.appendChild(square);
                letterCol++;
            }
        }

        currentLetter = 0;
        letterCol = 0;
    }

    generateLabels();
}

const generateLabels = () => {
    const dayLabels = ['Mon', 'Wed', 'Fri'];
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();

    const dayLabelsContainer = document.getElementById('day-labels');
    const monthLabelsContainer = document.getElementById('month-labels');

    dayLabelsContainer.innerHTML = dayLabels.map(day => `<div class="day-label">${day}</div>`).join('');
    monthLabelsContainer.innerHTML = Array.from({ length: 12 }, (_, i) => {
        const month = monthLabels[(currentMonth + i) % 12];
        return `<div class="month-label">${month}</div>`;
    }).join('');
}