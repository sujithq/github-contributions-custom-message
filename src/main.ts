import { activateDrawMode, deactivateDrawMode } from '@/features/draw/index';
import { saveContributionGridAsImage } from '@/features/export/to-image';
import { generateContributionGrid } from '@/features/generate/index';
import { matrixMap } from '@/features/generate/matrices-collection';
import { shareContributionGrid } from '@/features/share';
import { getValueFromURL, setValueInURL } from '@/features/value-from-url';
import { captureGridToMatrix, centerGridWrapper, debounce, getGeneratorOptions } from '@/utils/dom-utils';
import { sanitizeInput } from '@/utils/sanitizer';

if (import.meta.env.VITE_IS_VERCEL === 'true') {
    const script = document.createElement('script');
    script.defer = true;
    script.src = '/_vercel/insights/script.js';
    document.head.appendChild(script);
}

let currentMatrix: number[][] | undefined | null;

// Encapsulate event listeners into separate functions
const setupThemeToggle = () => {
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle?.addEventListener('click', () => {
        const html = document.documentElement;
        html.setAttribute('theme', html.getAttribute('theme') === 'dark' ? 'light' : 'dark');
    });
};

const setupSaveButton = () => {
    const saveButton = document.getElementById('save-button') as HTMLButtonElement;
    const messageInput = document.getElementById('message-input') as HTMLInputElement;

    saveButton.addEventListener('click', () =>
        saveContributionGridAsImage({
            gridContainer: document.getElementById('grid-container') as HTMLElement,
            saveButton: saveButton,
            fileName: `contribution-grid-${messageInput.value.toLowerCase().replace(/[^a-z0-9]/g, '')}.png`,
        })
    );
};

const setupMessageInputHandler = () => {
    const messageInput = document.getElementById('message-input') as HTMLInputElement;
    const messageInputHandler = () => {
        const message = sanitizeInput(messageInput.value.toUpperCase());
        setValueInURL('value', message);
    };
    messageInput.addEventListener('input', messageInputHandler);
    messageInput.addEventListener('paste', messageInputHandler);
    messageInput.addEventListener('cut', messageInputHandler);

    if (messageInput) {
        const messageFromUrl = sanitizeInput(getValueFromURL('value'));
        if (messageFromUrl) messageInput.value = messageFromUrl;
    }
};

const setupFillEmptySquaresHandler = () => {
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
};

const setupDrawModeHandler = () => {
    const drawMode = document.getElementById('draw-mode-input') as HTMLInputElement;
    const contributionGrid = document.getElementById('contribution-grid') as HTMLElement;
    const gridPaintedHandler = () => {
        currentMatrix = captureGridToMatrix();
    };

    drawMode?.addEventListener('change', (event) => {
        if ((event.target as HTMLInputElement).checked) {
            activateDrawMode(contributionGrid);
            contributionGrid.addEventListener('painted', gridPaintedHandler);
        } else {
            deactivateDrawMode(contributionGrid);
            contributionGrid.removeEventListener('painted', gridPaintedHandler);
        }
    });
};

const setupClearButtonHandler = () => {
    const clearButton = document.getElementById('clear-button');
    clearButton?.addEventListener('click', () => {
        const squares = document.querySelectorAll('#contribution-grid .square');
        const fillEmptySquares = (document.getElementById('fill-empty-squares-input') as HTMLInputElement)?.checked;
        squares.forEach((square) => {
            square.className = `square level-${fillEmptySquares ? Math.floor(Math.random() * 2) : 0}`;
        });
        currentMatrix = null;
    });
};

const setupFormSubmitHandler = () => {
    const form = document.getElementById('form');
    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        generateImage();
        centerGridWrapper();
    });
};

const setupShareButtonHandlers = () => {
    const gridContainer = document.getElementById('grid-container') as HTMLElement;
    const shareImageButton = document.getElementById('share-image-button');
    shareImageButton?.addEventListener('click', async () => {
        shareContributionGrid({
            gridContainer: gridContainer,
            button: shareImageButton as HTMLButtonElement,
            fileName: `contribution-grid-${sanitizeInput((document.getElementById('message-input') as HTMLInputElement).value.toLowerCase().replace(/[^a-z0-9]/g, ''))}.png`,
        });
    });

    const shareLinkButton = document.getElementById('share-link-button');
    shareLinkButton?.addEventListener('click', async () => {
        shareContributionGrid({
            gridContainer: gridContainer,
            button: shareLinkButton as HTMLButtonElement,
        });
    });
};

const setupInputChangeHandlers = () => {
    const inputs = [
        'message-input',
        'speed-input',
        'padding-x-input',
        'padding-y-input',
        'credits-input',
        'fill-empty-squares-input',
    ];
    const inputChangeHandler = debounce((event: Event) => {
        if ((event.target as HTMLInputElement)?.id === 'message-input') {
            currentMatrix = null;
        }
        generateImage();
        centerGridWrapper();
    }, 500);
    inputs.forEach((inputId) => {
        const input = document.getElementById(inputId) as HTMLInputElement;
        input?.addEventListener('input', inputChangeHandler);
    });
};

const setupMatricesButtonsHandlers = () => {
    const matricesButtons = document.querySelectorAll('button[data-matrix]');
    matricesButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const matrixName = (button as HTMLButtonElement).getAttribute('data-matrix') as string;
            if (matrixName && matrixMap[matrixName]) {
                generateImage({
                    input: matrixMap[matrixName],
                });
                centerGridWrapper();
            }
        });
    });
};

// Initialize all event listeners
const initializeEventListeners = () => {
    setupThemeToggle();
    setupSaveButton();
    setupMessageInputHandler();
    setupFillEmptySquaresHandler();
    setupDrawModeHandler();
    setupClearButtonHandler();
    setupFormSubmitHandler();
    setupShareButtonHandlers();
    setupInputChangeHandlers();
    setupMatricesButtonsHandlers();
};

document.addEventListener('DOMContentLoaded', () => {
    checkRequiredElements();
    initializeEventListeners();
    generateImage();
    centerGridWrapper();
});

const generateImage = (props? : {
    input?: number[][];
}) => {
    const options = {
        ...getGeneratorOptions(),
        ...props
    }
    if (!props && currentMatrix) {
        options.input = currentMatrix;
    }
    generateContributionGrid(options);
    currentMatrix = options.input;
}

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
