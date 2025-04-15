let isDrawing = false;

const startDrawing = () => {
    isDrawing = true;
};

const stopDrawing = () => {
    isDrawing = false;    
};

const paintSquare = (event) => {    
    if (!isDrawing && event.type != 'click') return;
    const square = event.target;
    if (square.classList.contains('square')) {        
        square.className = `square ${Math.random() > 0.5 ? 'level-3' : 'level-4'}`;
    }
};

// Define reusable event handlers for touch events
const handleTouchStart = (event) => {
    startDrawing();
    paintSquare(event.touches[0]);
};

const handleTouchMove = (event) => {
    paintSquare(event.touches[0]);
};

export const activateDrawMode = (grid) => {
    document.addEventListener('mousedown', startDrawing);
    document.addEventListener('mouseup', stopDrawing);
    document.addEventListener('mouseleave', stopDrawing);
    document.addEventListener('mousemove', paintSquare);
    document.addEventListener('click', paintSquare);

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', stopDrawing);
    document.addEventListener('touchmove', handleTouchMove);
};

export const deactiveDrawMode = (grid) => {
    document.removeEventListener('mousedown', startDrawing);
    document.removeEventListener('mouseup', stopDrawing);
    document.removeEventListener('mouseleave', stopDrawing);
    document.removeEventListener('mousemove', paintSquare);
    document.removeEventListener('click', paintSquare);

    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchend', stopDrawing);
    document.removeEventListener('touchmove', handleTouchMove);
};