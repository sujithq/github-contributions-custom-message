export const shareContributionGrid = async (options) => {
    let {
        gridContainer,
        button,
        htmlToImage,
        fileName
    } = Object.assign({
        gridContainer: document.getElementById('grid-container'),
        button: document.getElementById('share-button'),
        fileName: 'contribution-grid.png',
        htmlToImage: window.htmlToImage // Assuming htmlToImage is available globally via script tag
    }, options);

    if (!htmlToImage)
        throw new Error('htmlToImage is not available. Please include the html-to-image library using <script> tag.');

    const buttonText = button.innerHTML;

    button.setAttribute('disabled', 'disabled'); // Disable the button to prevent multiple clicks        
    button.innerHTML = 'Sharing...';

    const url = window.location.href;

    try {
        // Use setTimeout to allow the browser to render the updated UI
        await new Promise((resolve) => setTimeout(resolve, 0));
        
        // Generate image from the grid
        const dataUrl = await htmlToImage.toPng(gridContainer, {
            width: gridContainer.scrollWidth,
            height: gridContainer.scrollHeight,
            skipFonts: true
        });

        // Convert dataUrl to Blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();

        if (navigator.share) {
            // Use Web Share API if available
            await navigator.share({
                title: 'Custom GitHub Contributions Grid',
                text: 'Check out this custom GitHub contributions grid!',
                url: url,
                files: [new File([blob], fileName, { type: 'image/png' })]
            });
        } else {
            // Fallback: Copy URL to clipboard
            await navigator.clipboard.writeText(url);
            alert('URL copied to clipboard!');
        }
    } catch (error) {        
        alert('Sharing failed. Copy the url manually. Sorry!');
    } finally {
        button.innerHTML = buttonText;
        button.removeAttribute('disabled');
    }
}