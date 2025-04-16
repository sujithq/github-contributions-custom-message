import { toPng } from 'html-to-image';

// htmlToImage import is done via script tag in index.html
// saves the contribution grid as an image (PNG) using htmlToImage library
export const saveContributionGridAsImage = async (options: {
    gridContainer: HTMLElement;
    saveButton: HTMLButtonElement;
    fileName: string;
}) => {
    const { gridContainer, saveButton, fileName = 'contribution-grid.png' } = options;
    const saveButtonText = saveButton.innerHTML;

    try {
        saveButton.setAttribute('disabled', 'disabled'); // Disable the button to prevent multiple clicks
        saveButton.innerHTML = 'Saving...';

        // Use setTimeout to allow the browser to render the updated UI
        await new Promise((resolve) => setTimeout(resolve, 0));

        const dataUrl = await toPng(gridContainer, {
            width: gridContainer.scrollWidth,
            height: gridContainer.scrollHeight,
            skipFonts: true,
        });
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Error saving the contribution grid as an image:', error);
    } finally {
        // Re-enable the button after saving
        saveButton.innerHTML = saveButtonText;
        saveButton.removeAttribute('disabled');
    }
};
