import { buildMatrixFromPhrase } from "@/features/generate/build-matrix-from-phrase";
import { charMatrixMap } from "@/features/generate/char-matrix-map";

export const debounce = (func: (event: Event) => void, delay: number) => {
    let timeoutId: number | undefined;
    return (event: Event) => {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => func(event), delay);
    };
};

export const captureGridToMatrix = () => {
    const squares = document.querySelectorAll('#contribution-grid .square');
    const array: number[][] = [];
    squares.forEach((square) => {
        const rowIndex = parseInt(square.getAttribute('data-row') as string, 10);
        const colIndex = parseInt(square.getAttribute('data-col') as string, 10);
        const val = (square.className.indexOf('level-3') >= 0 || square.className.indexOf('level-4') >= 0) ? 1 : 0;
        if (!array[rowIndex]) {
            array[rowIndex] = [];
        }
        array[rowIndex][colIndex] = val;
    });
    return array;
};

export const centerGridWrapper = () => {
    const gridWrapper = document.getElementById('grid-wrapper');
    if (gridWrapper) {
        gridWrapper.scrollTo({
            left: (gridWrapper.scrollWidth - gridWrapper.clientWidth) / 2,
            behavior: 'smooth',
        });
    }
};

export const getGeneratorOptions = () => {
    return {
        input: buildMatrixFromPhrase((document.getElementById('message-input') as HTMLInputElement).value.toUpperCase()),
        letters: charMatrixMap,
        gridContainer: document.getElementById('grid-container') as HTMLElement,
        contributionsGrid: document.getElementById('contribution-grid') as HTMLElement,
        speed: parseInt((document.getElementById('speed-input') as HTMLInputElement)?.value),
        paddingX: parseInt((document.getElementById('padding-x-input') as HTMLInputElement)?.value),
        paddingY: parseInt((document.getElementById('padding-y-input') as HTMLInputElement)?.value),
        fillEmptySquares: (document.getElementById('fill-empty-squares-input') as HTMLInputElement)?.checked,
        creditsValue: (document.getElementById('credits-input') as HTMLInputElement).value,
        creditsContainer: document.getElementById('credits') as HTMLElement,
    };
};