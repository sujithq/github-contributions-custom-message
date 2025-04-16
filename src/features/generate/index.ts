import { charMatrixMap } from '@/features/generate/char-matrix-map';

// Extracted helper function for speed normalization
const normalizeSpeed = (speed: number) => Math.max(0, Math.min(10, speed)) / 1000;

const whitespace = ' ';

// Extracted helper function for padding a phrase
const padPhrase = (phrase: string, minInputLength: number) => {
    const spacesToAdd = Math.max(0, minInputLength - phrase.length);
    const padding = whitespace.repeat(Math.ceil(spacesToAdd / 2));
    return padding + phrase + padding;
};

interface GenerateContributionGridOptions {
    gridContainer: HTMLElement; // Main container for the grid
    contributionsGrid: HTMLElement; // Grid element where contributions are displayed
    creditsContainer: HTMLElement; // Container for displaying credits
    message: string; // User input message
    letters: Record<string, number[][]>; // Map of characters to their grid representations
    speed?: number; // Animation speed
    paddingX?: number; // Horizontal padding for the grid
    paddingY?: number; // Vertical padding for the grid
    creditsValue?: string; // Credits text input
    numRows?: number; // Number of rows in the grid
    charGap?: number; // Gap in squares between chars in the grid
    gridGap?: string; // Gap between squares in the grid
    animationDuration?: number; // Duration of the animation for each square in seconds
    maxInputLength?: number; // Maximum length of the input message
    minInputLength?: number; // Minimum length of the input message
}

export const generateContributionGrid = (options: GenerateContributionGridOptions) => {
    const {
        gridContainer,
        contributionsGrid,
        creditsContainer,
        letters = charMatrixMap,
        message = 'HI THERE',
        creditsValue = 'github.artem.work',
        speed = 3,
        paddingX = 20,
        paddingY = 20,
        numRows = 7,
        charGap = 2,
        gridGap = '0.625rem',
        animationDuration = 0.5,
        maxInputLength = 15,
        minInputLength = 10,
    } = options;

    const speedFactor = normalizeSpeed(speed); // Normalize speed using helper function

    creditsContainer.innerHTML = creditsValue; // Update credits text
    creditsContainer.style.display = creditsValue ? 'block' : 'none'; // Show or hide credits based on input

    // Set grid container padding based on user input
    Object.assign(gridContainer.style, {
        paddingLeft: `${paddingX}px`,
        paddingRight: `${paddingX}px`,
        paddingTop: `${paddingY}px`,
        paddingBottom: `${paddingY}px`,
    });

    let phrase = '';
    for (const char of message.toUpperCase()) {
        // Convert message to uppercase and iterate through each character
        if (letters[char] && letters[char].length > 0) {
            // Only include characters that exist in the character map
            phrase += char;
        }
        if (phrase.length >= maxInputLength) {
            break; // Limit to max input length
        }
    }

    // Pad the phrase to meet minimum length using helper function
    if (phrase.length < minInputLength && letters[whitespace]) {
        phrase = padPhrase(phrase, minInputLength);
    }

    contributionsGrid.innerHTML = ''; // Clear previous grid
    let totalColumns = 0;
    // calculate the total number of columns needed for the grid
    for (const char of phrase) {
        totalColumns += letters[char][0].length + charGap; // Add character width and spacing
    }
    totalColumns = Math.max(0, totalColumns - charGap); // Remove trailing space

    // Set grid styles based on calculated values
    Object.assign(contributionsGrid.style, {
        gridTemplateRows: `repeat(${numRows}, ${gridGap})`, // Set grid row template
        gridTemplateColumns: `repeat(${totalColumns}, ${gridGap})`, // Set grid column template
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
                if (letterCol >= letterTemplate[0].length + charGap - 1) {
                    letterCol = 0;
                    currentLetter++;
                } else {
                    letterCol++;
                }
            } else {
                if (letterTemplate[row][letterCol] === 1) {
                    // Check if the square is part of the letter in the map
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

    generateLabels({
        dayLabelsContainer: gridContainer.querySelector('#day-labels') as HTMLElement, // Get the day labels container
        monthLabelsContainer: gridContainer.querySelector('#month-labels') as HTMLElement, // Get the month labels container
    });
};

const generateLabels = ({
    dayLabels = ['Mon', 'Wed', 'Fri'], // Default labels for days
    monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Default labels for months
    dayLabelsContainer,
    monthLabelsContainer,
}: {
    dayLabels?: string[]; // Optional custom labels for days
    monthLabels?: string[]; // Optional custom labels for months
    dayLabelsContainer?: HTMLElement; // Optional container for day labels
    monthLabelsContainer?: HTMLElement; // Optional container for month labels
}) => {
    const currentMonth = new Date().getMonth(); // Get the current month index
    if (dayLabelsContainer && monthLabelsContainer) {
        dayLabelsContainer.innerHTML = dayLabels.map((day) => `<div class="day-label">${day}</div>`).join(''); // Generate day labels
        monthLabelsContainer.innerHTML = Array.from({ length: 12 }, (_, i) => {
            const month = monthLabels[(currentMonth + i) % 12]; // Calculate month label based on current month
            return `<div class="month-label">${month}</div>`;
        }).join(''); // Generate month labels
    }
};
