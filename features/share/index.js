export const shareContributionGrid = async (options) => {
    let {
        gridContainer,
        button,
        htmlToImage,
        fileName
    } = Object.assign({
        gridContainer: document.getElementById('grid-container'),
        button: document.getElementById('share-button')        
    }, options);
    
    const buttonText = button.innerHTML;

    button.setAttribute('disabled', 'disabled'); // Disable the button to prevent multiple clicks        
    button.innerHTML = 'Sharing...';

    const url = window.location.href;

    try {
        // Use setTimeout to allow the browser to render the updated UI
        await new Promise((resolve) => setTimeout(resolve, 0));
        
        // Use Web Share API if available
        const shareOptions = {
            title: 'Custom GitHub Contributions Grid',
            text: 'Check out this custom GitHub contributions grid!',
            url: url
        };
        
        if (htmlToImage && fileName) {
            // Generate image from the grid        
            const dataUrl = await htmlToImage.toPng(gridContainer, {
                width: gridContainer.scrollWidth,
                height: gridContainer.scrollHeight,
                skipFonts: true                
            });
            // Convert dataUrl to Blob
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            shareOptions.file = [new File([blob], fileName, { type: 'image/png' })];
        }

        if (navigator.share) {            
            await navigator.share(shareOptions);
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