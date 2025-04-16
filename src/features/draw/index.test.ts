import { describe, expect, it, vi } from 'vitest';
import { activateDrawMode, deactiveDrawMode } from './index';

describe('activateDrawMode', () => {
    it('should add event listeners to the grid', () => {
        const grid = document.createElement('div');
        grid.classList.add('grid');

        const gridAddEventListenerSpy = vi.spyOn(grid, 'addEventListener');
        const documentAddEventListenerSpy = vi.spyOn(document, 'addEventListener');

        activateDrawMode(grid);

        expect(grid.style.touchAction).toBe('none');
        expect(gridAddEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
        expect(gridAddEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
        expect(gridAddEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
        expect(gridAddEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
        expect(documentAddEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

        gridAddEventListenerSpy.mockRestore();
        documentAddEventListenerSpy.mockRestore();
    });
});

describe('deactiveDrawMode', () => {
    it('should remove event listeners from the grid', () => {
        const grid = document.createElement('div');
        grid.classList.add('grid');

        const gridRemoveEventListenerSpy = vi.spyOn(grid, 'removeEventListener');
        const documentRemoveEventListenerSpy = vi.spyOn(document, 'removeEventListener');

        deactiveDrawMode(grid);

        expect(grid.style.touchAction).toBe('auto');
        expect(gridRemoveEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
        expect(gridRemoveEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
        expect(gridRemoveEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
        expect(gridRemoveEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
        expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

        gridRemoveEventListenerSpy.mockRestore();
        documentRemoveEventListenerSpy.mockRestore();
    });
});
