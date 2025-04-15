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
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);        
    if (element) {
        paintSquare({ target: element });
    }
        
};

export const activateDrawMode = (grid) => {
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

export const deactiveDrawMode = (grid) => {
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