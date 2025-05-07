
class FaceProcessing {
    constructor(apiEndpoint = '/api/detect') {
        this.apiEndpoint = apiEndpoint;
        this.detectButton = document.getElementById('detectButton');
        this.processedImage = document.getElementById('processedImage');
        this.faceCountElement = document.getElementById('face-count');
        this.statusElement = document.getElementById('status');
        
        // Bind event handlers
        this.detectButton.addEventListener('click', () => this.detectFaces());
    }
    
    async detectFaces() {
        try {
            // Get the captured image data
            const imageData = window.cameraInstance.getImageData();
            if (!imageData) {
                this.updateStatus('No image captured', 'error');
                return;
            }
            
            this.updateStatus('Processing image...', 'processing');
            
            // Send the image to the server for face detection
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: imageData
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to process image');
            }
            
            const result = await response.json();
            
            // Update the UI with the results
            this.displayResults(result);
            
        } catch (error) {
            console.error('Error in face detection:', error);
            this.updateStatus(`Detection error: ${error.message}`, 'error');
        }
    }
    
    displayResults(result) {
        // Display the processed image
        this.processedImage.src = result.processed_image;
        this.processedImage.style.display = 'block';
        
        // Update face count
        const faceCount = result.faces_detected;
        this.faceCountElement.textContent = `Detected ${faceCount} face${faceCount !== 1 ? 's' : ''}`;
        
        // Update status
        this.updateStatus(
            `Face detection complete: ${faceCount} face${faceCount !== 1 ? 's' : ''} found`,
            'success'
        );
        
        // Optionally, you could also draw the bounding boxes on a canvas overlay
        // instead of relying on the server-processed image
        this.drawBoundingBoxes(result.bounding_boxes);
    }
    
    drawBoundingBoxes(boundingBoxes) {
        // This is an optional method if you want to draw bounding boxes client-side
        // For now, we're using the server-processed image with boxes already drawn
        console.log('Bounding boxes data:', boundingBoxes);
        
        // Implementation could be added here if needed
    }
    
    updateStatus(message, type = 'info') {
        this.statusElement.textContent = message;
        
        // Clear existing styles
        this.statusElement.style.backgroundColor = '';
        
        // Apply style based on message type
        switch (type) {
            case 'success':
                this.statusElement.style.backgroundColor = '#d5f5e3'; // Light green
                break;
            case 'error':
                this.statusElement.style.backgroundColor = '#f5b7b1'; // Light red
                break;
            case 'processing':
                this.statusElement.style.backgroundColor = '#d6eaf8'; // Light blue
                break;
            default:
                this.statusElement.style.backgroundColor = '#f1f1f1'; // Light gray
        }
    }
}

// Export the FaceProcessing class
window.FaceProcessing = FaceProcessing;