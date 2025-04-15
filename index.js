import { generateContributionGrid  } from './generator.js'; // Import the contribution grid generator
import { saveContributionGridAsImage } from './contribution-grid-to-image.js'; // Import the function to save the grid as an image

// generate default contribution grid
// and set up event listeners for the theme toggle and save button
document.addEventListener('DOMContentLoaded', () => {
    // check that all required elements are present in the DOM
    checkRequiredElements();


    const themeToggle = document.getElementById('theme-toggle');        
    const themeToggleClickHandler = () => {
        const html = document.documentElement;
        html.setAttribute('theme', html.getAttribute('theme') === 'dark' ? 'light' : 'dark');
    }
    themeToggle?.addEventListener('click', themeToggleClickHandler);
        
    const saveButton = document.getElementById('save-button');
    if (!saveButton) {        
        throw new Error('Save button (id="save-button") not found. Please ensure the save button exists in your HTML.');        
    }
    if (!document.getElementById('grid-container')) {
        throw new Error('Grid container (id="grid-container") not found. Please ensure the grid container exists in your HTML.');        
    }
    saveButton.addEventListener('click', () => saveContributionGridAsImage({
        gridContainer: document.getElementById('grid-container'),
        saveButton: saveButton,
        htmlToImage: window.htmlToImage // Assuming htmlToImage is available globally via script tag
    }));

    const form = document.getElementById('form');
    if (!form) {
        throw new Error('Form (id="form") not found. Please ensure the form exists in your HTML.');
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission
        generateContributionGrid(getGeneratorOptions());
    });

    generateContributionGrid(getGeneratorOptions());
});

function getGeneratorOptions() {    
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

function checkRequiredElements() {
    const requiredElements = [
        'grid-container',
        'contribution-grid',
        'message-input',
        'speed-input',
        'padding-x-input',
        'padding-y-input',
        'credits-input',
        'credits'
    ];
    for (const elementId of requiredElements) {
        if (!document.getElementById(elementId)) {
            throw new Error(`Required element with id "${elementId}" not found. Please ensure all required elements are present in your HTML.`);
        }
    }
}