import { generateContributionGrid  } from './generator.js'; // Import the contribution grid generator
import { saveContributionGridAsImage } from './contribution-grid-to-image.js'; // Import the function to save the grid as an image

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
    if (!saveButton) {        
        throw new Error('Save button (id="save-button") not found. Please ensure the save button exists in your HTML.');        
    }
    if (!document.getElementById('grid-container')) {
        throw new Error('Grid container (id="grid-container") not found. Please ensure the grid container exists in your HTML.');        
    }
    saveButton.addEventListener('click', () => saveContributionGridAsImage({
        gridContainer: document.getElementById('grid-container'),
        saveButton: saveButton,
        // Assuming htmlToImage is available globally via script tag,
        htmlToImage: window.htmlToImage, 
        // Generate a file name based on the input value
        fileName: `contribution-grid-${document.getElementById('message-input').value.toLowerCase().replace(/[^a-z0-9]/g, '')}.png` 
    }));

    // Set up the form submission to generate the contribution grid
    const form = document.getElementById('form');
    if (!form) {
        throw new Error('Form (id="form") not found. Please ensure the form exists in your HTML.');
    }

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
        'credits'
    ];
    for (const elementId of requiredElements) {
        if (!document.getElementById(elementId)) {
            throw new Error(`Required element with id "${elementId}" not found. Please ensure all required elements are present in your HTML.`);
        }
    }
}