import { activateDrawMode, deactivateDrawMode } from '@/features/draw/index';
import { saveContributionGridAsImage } from '@/features/export/to-image';
import { charMatrixMap } from '@/features/generate/char-matrix-map';
import { generateContributionGrid } from '@/features/generate/index';
import { shareContributionGrid } from '@/features/share';
import { getValueFromURL, setValueInURL } from '@/features/value-from-url';
import { sanitizeInput } from '@/utils/sanitizer';

document.addEventListener('DOMContentLoaded', () => {
    checkRequiredElements();

    // setup theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle?.addEventListener('click', () => {
        const html = document.documentElement;
        html.setAttribute('theme', html.getAttribute('theme') === 'dark' ? 'light' : 'dark');
    });

    // setup save button
    const saveButton = document.getElementById('save-button') as HTMLButtonElement;
    const messageInput = document.getElementById('message-input') as HTMLInputElement;

    saveButton.addEventListener('click', () =>
        saveContributionGridAsImage({
            gridContainer: document.getElementById('grid-container') as HTMLElement,
            saveButton: saveButton,
            fileName: `contribution-grid-${messageInput.value.toLowerCase().replace(/[^a-z0-9]/g, '')}.png`,
        })
    );

    // update url when message input changes
    const messageInputHandler = () => {
        const message = sanitizeInput(messageInput.value.toUpperCase());
        setValueInURL('value', message);
    };
    messageInput.addEventListener('input', messageInputHandler);
    messageInput.addEventListener('paste', messageInputHandler);
    messageInput.addEventListener('cut', messageInputHandler);

    // set initial values from url
    if (messageInput) {
        const messageFromUrl = sanitizeInput(getValueFromURL('value'));
        if (messageFromUrl) messageInput.value = messageFromUrl;
    }

    // update url when fill-empty-squares input changes
    const fillEmptySquaresInput = document.getElementById('fill-empty-squares-input') as HTMLInputElement;
    if (fillEmptySquaresInput) {
        fillEmptySquaresInput.addEventListener('change', () => {
            const fillEmptySquares = fillEmptySquaresInput.checked;
            setValueInURL('fillemptysquares', fillEmptySquares ? 'true' : 'false');
        });
        
        const fillEmptySquaresFromUrl = getValueFromURL('fillemptysquares');
        if (fillEmptySquaresFromUrl) {
            fillEmptySquaresInput.checked = fillEmptySquaresFromUrl === 'true';
        }        
    }
    

    // setup draw mode handler
    const drawMode = document.getElementById('draw-mode-input') as HTMLInputElement;
    const constributionGrid = document.getElementById('contribution-grid') as HTMLElement;
    drawMode?.addEventListener('change', (event) => {
        if ((event.target as HTMLInputElement).checked) {
            activateDrawMode(constributionGrid);
        } else {
            deactivateDrawMode(constributionGrid);
        }
    });

    // setup clear button handler
    const clearButton = document.getElementById('clear-button');
    clearButton?.addEventListener('click', () => {
        const squares = document.querySelectorAll('#contribution-grid .square');
        const fillEmptySquares = (document.getElementById('fill-empty-squares-input') as HTMLInputElement)?.checked;
        squares.forEach((square) => {
            square.className = `square level-${fillEmptySquares ? Math.floor(Math.random() * 2) : 0}`;
        });
    });

    // generate contribution grid on form submit
    const form = document.getElementById('form');
    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        generateContributionGrid(getGeneratorOptions());
    });

    // setup share button handlers
    const gridContainer = document.getElementById('grid-container') as HTMLElement;
    const shareImageButton = document.getElementById('share-image-button');
    shareImageButton?.addEventListener('click', async () => {
        shareContributionGrid({
            gridContainer: gridContainer,
            button: shareImageButton as HTMLButtonElement,
            fileName: `contribution-grid-${messageInput.value.toLowerCase().replace(/[^a-z0-9]/g, '')}.png`,
        });
    });

    const shareLinkButton = document.getElementById('share-link-button');
    shareLinkButton?.addEventListener('click', async () => {
        shareContributionGrid({
            gridContainer: gridContainer,
            button: shareLinkButton as HTMLButtonElement,
        });
    });

    // generate contribution grid on page load
    generateContributionGrid(getGeneratorOptions());
});

const getGeneratorOptions = () => {    
    return {
        letters: charMatrixMap,
        gridContainer: document.getElementById('grid-container') as HTMLElement,
        contributionsGrid: document.getElementById('contribution-grid') as HTMLElement,
        message: (document.getElementById('message-input') as HTMLInputElement).value.toUpperCase(),
        speed: parseInt((document.getElementById('speed-input') as HTMLInputElement)?.value),
        paddingX: parseInt((document.getElementById('padding-x-input') as HTMLInputElement)?.value),
        paddingY: parseInt((document.getElementById('padding-y-input') as HTMLInputElement)?.value),
        fillEmptySquares: (document.getElementById('fill-empty-squares-input') as HTMLInputElement)?.checked,
        creditsValue: (document.getElementById('credits-input') as HTMLInputElement).value,
        creditsContainer: document.getElementById('credits') as HTMLElement,
    };
};

const checkRequiredElements = () => {
    const requiredElements = [
        'grid-container',
        'contribution-grid',
        'message-input',
        'credits-input',
        'credits',
        'form',
        'save-button',
    ];
    for (const elementId of requiredElements) {
        if (!document.getElementById(elementId)) {
            throw new Error(
                `Required element with id "${elementId}" not found. Please ensure all required elements are present in your HTML.`
            );
        }
    }
};
