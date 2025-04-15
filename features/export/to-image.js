// htmlToImage import is done via script tag in index.html
// saves the contribution grid as an image (PNG) using htmlToImage library
export const saveContributionGridAsImage = async (options) => {
    let {
        gridContainer,
        saveButton,
        htmlToImage,
        fileName
    } = Object.assign({
        gridContainer: document.getElementById('grid-container'),
        saveButton: document.getElementById('save-button'),
        fileName: 'contribution-grid.png',
        htmlToImage: window.htmlToImage // Assuming htmlToImage is available globally via script tag
    }, options);

    if (!htmlToImage)
        throw new Error('htmlToImage is not available. Please include the html-to-image library using <script> tag.');

    const saveButtonText = saveButton.innerHTML;

    try {
        saveButton.setAttribute('disabled', 'disabled'); // Disable the button to prevent multiple clicks        
        saveButton.innerHTML = 'Saving...';

        // Use setTimeout to allow the browser to render the updated UI
        await new Promise((resolve) => setTimeout(resolve, 0));

        const dataUrl = await htmlToImage.toPng(gridContainer, {
            width: gridContainer.scrollWidth,
            height: gridContainer.scrollHeight,
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