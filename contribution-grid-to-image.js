// htmlToImage import is done via script tag in index.html

export const saveContributionGridAsImage = (options) => {
    let {        
        gridContainer,
        saveButton,
        htmlToImage
    } = Object.assign({        
        gridContainer: document.getElementById('grid-container'),
        saveButton: document.getElementById('save-button'),
        htmlToImage: window.htmlToImage // Assuming htmlToImage is available globally via script tag
    });

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
            const inputValue = document.getElementById('message-input').value.toLowerCase().replace(/[^a-z0-9]/g, '');
            link.download = `contribution-grid-${inputValue}.png`;
            link.href = dataUrl;
            link.click();
        }).finally(() => {
            saveButton.innerHTML = saveButtonText;
            // Re-enable the button after saving
            saveButton.removeAttribute('disabled');
        });
    }, 1); // Delay to ensure the update of button attributes
}