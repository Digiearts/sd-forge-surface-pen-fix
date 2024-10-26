(function() {
    function enhanceCanvasForSurface() {
        const canvas = document.getElementById('drawingCanvas_forge_mixin');
        if (!canvas) return;

        const context = canvas.getContext('2d');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        // Store original drawing settings
        let currentColor = '#000000';
        let currentWidth = 4;
        let currentAlpha = 1.0;

        function updateDrawingSettings() {
            const colorPicker = document.getElementById('scribbleColor_forge_mixin');
            const widthSlider = document.getElementById('scribbleWidth_forge_mixin');
            const alphaSlider = document.getElementById('scribbleAlpha_forge_mixin');

            if (colorPicker) currentColor = colorPicker.value;
            if (widthSlider) currentWidth = parseInt(widthSlider.value);
            if (alphaSlider) currentAlpha = parseInt(alphaSlider.value) / 100;

            context.strokeStyle = currentColor;
            context.lineWidth = currentWidth;
            context.globalAlpha = currentAlpha;
        }

        function startDrawing(e) {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
            updateDrawingSettings();
            
            // Capture the pointer to ensure continuous drawing
            canvas.setPointerCapture(e.pointerId);
        }

        function draw(e) {
            if (!isDrawing) return;

            // Prevent scrolling/zooming while drawing
            e.preventDefault();

            context.beginPath();
            context.moveTo(lastX, lastY);
            context.lineTo(e.offsetX, e.offsetY);
            context.stroke();

            [lastX, lastY] = [e.offsetX, e.offsetY];
        }

        function stopDrawing(e) {
            if (isDrawing) {
                isDrawing = false;
                // Release pointer capture
                canvas.releasePointerCapture(e.pointerId);
            }
        }

        // Remove existing event listeners if any
        canvas.removeEventListener('pointerdown', startDrawing);
        canvas.removeEventListener('pointermove', draw);
        canvas.removeEventListener('pointerup', stopDrawing);
        canvas.removeEventListener('pointerout', stopDrawing);

        // Add enhanced event listeners
        canvas.addEventListener('pointerdown', startDrawing);
        canvas.addEventListener('pointermove', draw);
        canvas.addEventListener('pointerup', stopDrawing);
        canvas.addEventListener('pointerout', stopDrawing);

        // Prevent default touch behaviors
        canvas.addEventListener('touchstart', e => e.preventDefault());
        canvas.addEventListener('touchmove', e => e.preventDefault());

        // Handle pointer capture loss
        canvas.addEventListener('lostpointercapture', e => {
            if (isDrawing) {
                stopDrawing(e);
            }
        });
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', enhanceCanvasForSurface);

    // Re-initialize when canvas might be recreated
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                enhanceCanvasForSurface();
            }
        });
    });

    // Start observing the document for canvas changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();