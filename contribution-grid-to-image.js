// htmlToImage import is done via script tag in index.html
// saves the contribution grid as an image (PNG) using htmlToImage library
export const saveContributionGridAsImage = (options) => {
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
        
    saveButton.setAttribute('disabled', 'disabled'); // Disable the button to prevent multiple clicks
    const saveButtonText = saveButton.innerHTML;
    saveButton.innerHTML = 'Saving...';

    setTimeout(() => {
        htmlToImage.toPng(gridContainer, {
            width: gridContainer.scrollWidth,
            height: gridContainer.scrollHeight,
        }).then(dataUrl => {
            const link = document.createElement('a');                        
            link.download = fileName;
            link.href = dataUrl;
            link.click();
        }).finally(() => {
            // Re-enable the button after saving
            saveButton.innerHTML = saveButtonText;            
            saveButton.removeAttribute('disabled');
        });
    }, 1); // Delay to ensure the update of button attributes
}