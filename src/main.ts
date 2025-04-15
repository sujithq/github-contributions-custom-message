import { activateDrawMode, deactiveDrawMode } from '@/features/draw/index';
import { saveContributionGridAsImage } from '@/features/export/to-image';
import { generateContributionGrid } from '@/features/generate/index';
import { shareContributionGrid } from '@/features/share';

const valueRegExp = /[^a-zA-Z0-9!?\-. ]/g;

const getDefaultMessageFromURL = (): string => {
    const urlParams = new URLSearchParams(window.location.search);
    let value = urlParams.get('value') || '';

    value = value.replace(valueRegExp, '');

    const maxLength = 15;
    if (value.length > maxLength) {
        value = value.substring(0, maxLength);
    }

    return value;
};

document.addEventListener('DOMContentLoaded', () => {
    checkRequiredElements();

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle?.addEventListener('click', () => {
        const html = document.documentElement;
        html.setAttribute('theme', html.getAttribute('theme') === 'dark' ? 'light' : 'dark');
    });

    const saveButton = document.getElementById('save-button') as HTMLButtonElement;
    const messageInput = document.getElementById('message-input') as HTMLInputElement;

    saveButton.addEventListener('click', () =>
        saveContributionGridAsImage({
            gridContainer: document.getElementById('grid-container') as HTMLElement,
            saveButton: saveButton,
            fileName: `contribution-grid-${messageInput.value.toLowerCase().replace(/[^a-z0-9]/g, '')}.png`,
        })
    );

    const messageInputHandler = () => {
        const message = messageInput.value.toUpperCase().replace(valueRegExp, '');
        if (message) {
            window.history.replaceState(null, '', `?value=${encodeURIComponent(message)}`);
        } else {
            window.history.replaceState(null, '', '?value=');
        }
    };
    messageInput.addEventListener('input', messageInputHandler);
    messageInput.addEventListener('paste', messageInputHandler);
    messageInput.addEventListener('cut', messageInputHandler);

    if (messageInput) {
        const messageFromUrl = getDefaultMessageFromURL();
        if (messageFromUrl) messageInput.value = messageFromUrl;
    }

    const drawMode = document.getElementById('draw-mode-input') as HTMLInputElement;
    drawMode.addEventListener('change', (event) => {
        if ((event.target as HTMLInputElement).checked) {
            activateDrawMode(document.getElementById('contribution-grid') as HTMLElement);
        } else {
            deactiveDrawMode(document.getElementById('contribution-grid') as HTMLElement);
        }
    });

    const clearButton = document.getElementById('clear-button');
    clearButton?.addEventListener('click', () => {
        const squares = document.querySelectorAll('#contribution-grid .square');
        squares.forEach((square) => {
            square.className = `square level-${Math.floor(Math.random() * 2)}`;
        });
    });

    const form = document.getElementById('form');
    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        generateContributionGrid(getGeneratorOptions());
    });

    const shareImageButton = document.getElementById('share-image-button');
    shareImageButton?.addEventListener('click', async () => {
        shareContributionGrid({
            gridContainer: document.getElementById('grid-container') as HTMLElement,
            button: shareImageButton as HTMLButtonElement,
            fileName: `contribution-grid-${messageInput.value.toLowerCase().replace(/[^a-z0-9]/g, '')}.png`,
        });
    });

    const shareLinkButton = document.getElementById('share-link-button');
    shareLinkButton?.addEventListener('click', async () => {
        shareContributionGrid({
            gridContainer: document.getElementById('grid-container') as HTMLElement,
            button: shareLinkButton as HTMLButtonElement,
        });
    });

    generateContributionGrid(getGeneratorOptions());
});

const getGeneratorOptions = () => {
    return {
        gridContainer: document.getElementById('grid-container') as HTMLElement,
        contributionsGrid: document.getElementById('contribution-grid') as HTMLElement,
        message: (document.getElementById('message-input') as HTMLInputElement).value.toUpperCase(),
        speed: parseInt((document.getElementById('speed-input') as HTMLInputElement).value),
        paddingX: parseInt((document.getElementById('padding-x-input') as HTMLInputElement).value),
        paddingY: parseInt((document.getElementById('padding-y-input') as HTMLInputElement).value),
        creditsValue: (document.getElementById('credits-input') as HTMLInputElement).value,
        creditsContainer: document.getElementById('credits') as HTMLElement,
    };
};

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
        'draw-mode-input',
        'share-image-button',
        'share-link-button',
    ];
    for (const elementId of requiredElements) {
        if (!document.getElementById(elementId)) {
            throw new Error(
                `Required element with id "${elementId}" not found. Please ensure all required elements are present in your HTML.`
            );
        }
    }
};
