import { describe, it, vi, expect, beforeEach } from 'vitest';
import { saveContributionGridAsImage } from './to-image';
import { toPng } from 'html-to-image';

vi.mock('html-to-image', () => ({
    toPng: vi.fn()
}));

beforeEach(() => {
    vi.restoreAllMocks();
});

describe('saveContributionGridAsImage', () => {
    

    it('disables the save button and restores it after saving', async () => {
        const mockGridContainer = document.createElement('div');
        const mockSaveButton = document.createElement('button');
        mockSaveButton.innerHTML = 'Save';

        vi.mocked(toPng).mockResolvedValue('data:image/png;base64,mockImageData');
        const mockToPng = vi.mocked(toPng);
        
        const promise = saveContributionGridAsImage({
            gridContainer: mockGridContainer,
            saveButton: mockSaveButton,
            fileName: 'test.png',
        });

        // check that the button is disabled and text is changed
        expect(mockSaveButton.getAttribute('disabled')).toBe('disabled');
        expect(mockSaveButton.innerHTML).toBe('Saving...');

        // resolve promise
        await promise;

        // restore the button state
        expect(mockSaveButton.getAttribute('disabled')).toBeNull();
        expect(mockSaveButton.innerHTML).toBe('Save');
        expect(mockToPng).toHaveBeenCalledWith(mockGridContainer, {
            width: mockGridContainer.scrollWidth,
            height: mockGridContainer.scrollHeight,
            skipFonts: true,
        });
    });    

    it('restore save button state if saving fails', async () => {
        const mockGridContainer = document.createElement('div');
        const mockSaveButton = document.createElement('button');
        mockSaveButton.innerHTML = 'Save';

        vi.mocked(toPng).mockRejectedValue(new Error('Mock error'));
        
        await saveContributionGridAsImage({
            gridContainer: mockGridContainer,
            saveButton: mockSaveButton,
            fileName: 'test.png',
        });

        // restore the button state
        expect(mockSaveButton.getAttribute('disabled')).toBeNull();
        expect(mockSaveButton.innerHTML).toBe('Save');
    });
});