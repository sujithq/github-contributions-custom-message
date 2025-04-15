import { generateContributionGrid  } from './features/generate/index.js'; // Import the contribution grid generator
import { saveContributionGridAsImage } from './features/export/to-image.js'; // Import the function to save the grid as an image
import { activateDrawMode, deactiveDrawMode } from './features/draw/index.js';

// generate default contribution grid
// and set up event listeners for the theme toggle and save button
document.addEventListener('DOMContentLoaded', () => {
    // check that all required elements are present in the DOM
    checkRequiredElements();

    // Set up the theme toggle button
    const themeToggle = document.getElementById('theme-toggle');        
    const themeToggleClickHandler = () => {
        const html = document.documentElement;
        html.setAttribute('theme', html.getAttribute('theme') === 'dark' ? 'light' : 'dark');
    }
    themeToggle?.addEventListener('click', themeToggleClickHandler);
        
    // Set up the save button to save the contribution grid as an image
    const saveButton = document.getElementById('save-button');    
    saveButton.addEventListener('click', () => saveContributionGridAsImage({
        gridContainer: document.getElementById('grid-container'),
        saveButton: saveButton,
        // Assuming htmlToImage is available globally via script tag,
        htmlToImage: window.htmlToImage, 
        // Generate a file name based on the input value
        fileName: `contribution-grid-${document.getElementById('message-input').value.toLowerCase().replace(/[^a-z0-9]/g, '')}.png` 
    }));

    // Set up draw mode
    const drawMode = document.getElementById('draw-mode-input');
    drawMode.addEventListener('change', (event) => {
        if (event.target.checked) {
            activateDrawMode(document.getElementById('grid-container'));
        } else {
            deactiveDrawMode(document.getElementById('grid-container'));
        }
    });

    // Set up clear button
    const clearButton = document.getElementById('clear-button');
    clearButton.addEventListener('click', (event) => {                
        const squares = document.querySelectorAll('#contribution-grid .square');
        squares.forEach(square => {
            square.className = `square level-${Math.floor(Math.random() * 2)}`; 
        });
    });

    // Set up the form submission to generate the contribution grid
    const form = document.getElementById('form');    
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission
        generateContributionGrid(getGeneratorOptions());
    });

    // generate the contribution grid on page load
    generateContributionGrid(getGeneratorOptions());
});

// Function to get the generator options from the form inputs
const getGeneratorOptions = () => {    
    return {        
        gridContainer: document.getElementById('grid-container'),
        contributionsGrid: document.getElementById('contribution-grid'),
        message: document.getElementById('message-input').value.toUpperCase(),
        speed: document.getElementById('speed-input').value,
        paddingX: document.getElementById('padding-x-input').value,
        paddingY: document.getElementById('padding-y-input').value,
        creditsValue: document.getElementById('credits-input').value,
        creditsContainer: document.getElementById('credits'),
    };
}

// Function to check if all required elements are present in the DOM
const checkRequiredElements = () => {
    const requiredElements = [
        'grid-container',
        'contribution-grid',
        'message-input',
        'speed-input',
        'padding-x-input',
        'padding-y-input',
        'credits-input',
        'credits',
        'form',
        'save-button',
        'theme-toggle', 
        'clear-button',
        'draw-mode-input'
    ];
    for (const elementId of requiredElements) {
        if (!document.getElementById(elementId)) {
            throw new Error(`Required element with id "${elementId}" not found. Please ensure all required elements are present in your HTML.`);
        }
    }
}