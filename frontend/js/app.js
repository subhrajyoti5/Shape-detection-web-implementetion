
// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create instances of our classes
    window.cameraInstance = new Camera();
    window.faceProcessingInstance = new FaceProcessing();
    
    // Check for browser compatibility
    checkBrowserSupport();
});

// Function to check if the browser supports camera access
function checkBrowserSupport() {
    const statusElement = document.getElementById('status');
    
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        statusElement.textContent = 'Camera access is not supported in this browser';
        statusElement.style.backgroundColor = '#f5b7b1'; // Light red
        
        // Disable camera buttons
        document.getElementById('startButton').disabled = true;
        document.getElementById('captureButton').disabled = true;
        document.getElementById('detectButton').disabled = true;
        
        console.error('getUserMedia is not supported in this browser');
    }
}

// Handle errors globally
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    const statusElement = document.getElementById('status');
    statusElement.textContent = `Error: ${event.error.message || 'An unknown error occurred'}`;
    statusElement.style.backgroundColor = '#f5b7b1'; // Light red
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    const statusElement = document.getElementById('status');
    statusElement.textContent = `Error: ${event.reason.message || 'An unknown error occurred'}`;
    statusElement.style.backgroundColor = '#f5b7b1'; // Light red
});