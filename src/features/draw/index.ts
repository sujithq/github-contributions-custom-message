let isDrawing = false;

const startDrawing = () => {
    isDrawing = true;
};

const stopDrawing = () => {
    isDrawing = false;
};

type PaintSquareEvent = MouseEvent | TouchEvent | { target: EventTarget | null; type: string };

const paintSquare = (event: PaintSquareEvent) => {
    if (!isDrawing && event.type != 'click') return;
    const square = event.target as HTMLElement;
    if (square?.classList.contains('square')) {
        square.className = `square ${Math.random() > 0.5 ? 'level-3' : 'level-4'}`;
        square.setAttribute('data-value', '1'); // Set the value attribute to 1

        // Dispatch a custom event with the square and event details
        const customEvent = new CustomEvent('painted', {
            detail: { square, originalEvent: event },
            bubbles: true,
            cancelable: true
        });
        square.dispatchEvent(customEvent);
    }
};

// Define reusable event handlers for touch events
const handleTouchStart = (event: TouchEvent) => {
    startDrawing();
    paintSquare(event);
};

const handleTouchMove = (event: TouchEvent) => {
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
    if (element) {
        paintSquare({ target: element, type: 'touchmove' });
    }
};

export const activateDrawMode = (grid: HTMLElement) => {    
    grid.style.touchAction = 'none'; // Disable default touch actions to prevent scrolling
    document.addEventListener('mousedown', startDrawing);
    document.addEventListener('mouseup', stopDrawing);
    document.addEventListener('mouseleave', stopDrawing);
    document.addEventListener('mousemove', paintSquare);
    grid.addEventListener('click', paintSquare);

    grid.addEventListener('touchstart', handleTouchStart);
    grid.addEventListener('touchend', stopDrawing);
    grid.addEventListener('touchmove', handleTouchMove);
};

export const deactivateDrawMode = (grid: HTMLElement) => {    
    grid.style.touchAction = 'auto'; // Re-enable default touch actions
    document.removeEventListener('mousedown', startDrawing);
    document.removeEventListener('mouseup', stopDrawing);
    document.removeEventListener('mouseleave', stopDrawing);
    document.removeEventListener('mousemove', paintSquare);
    grid.removeEventListener('click', paintSquare);

    grid.removeEventListener('touchstart', handleTouchStart);
    grid.removeEventListener('touchend', stopDrawing);
    grid.removeEventListener('touchmove', handleTouchMove);
};
