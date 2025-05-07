class Camera {
    constructor() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.capturedImage = document.getElementById('capturedImage');
        this.startButton = document.getElementById('startButton');
        this.captureButton = document.getElementById('captureButton');
        this.statusElement = document.getElementById('status');
        
        this.stream = null;
        this.isActive = false;
        
        // Set up canvas context
        this.canvas.width = 640;
        this.canvas.height = 480;
        this.context = this.canvas.getContext('2d');
        
        // Bind event handlers
        this.startButton.addEventListener('click', () => this.toggleCamera());
        this.captureButton.addEventListener('click', () => this.captureImage());
    }
    
    async toggleCamera() {
        if (this.isActive) {
            await this.stopCamera();
        } else {
            await this.startCamera();
        }
    }
    
    async startCamera() {
        try {
            // Request camera access
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                },
                audio: false
            });
            
            // Set video source to the stream
            this.video.srcObject = this.stream;
            
            // Wait for the video to be loaded
            await new Promise(resolve => {
                this.video.onloadedmetadata = () => {
                    resolve();
                };
            });
            
            // Update UI
            this.isActive = true;
            this.startButton.textContent = 'Stop Camera';
            this.captureButton.disabled = false;
            this.statusElement.textContent = 'Camera is active';
            this.statusElement.style.backgroundColor = '#d5f5e3'; // Light green
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            this.statusElement.textContent = `Camera error: ${error.message}`;
            this.statusElement.style.backgroundColor = '#f5b7b1'; // Light red
        }
    }
    
    async stopCamera() {
        if (this.stream) {
            // Stop all tracks in the stream
            this.stream.getTracks().forEach(track => track.stop());
            this.video.srcObject = null;
            
            // Update UI
            this.isActive = false;
            this.startButton.textContent = 'Start Camera';
            this.captureButton.disabled = true;
            document.getElementById('detectButton').disabled = true;
            this.statusElement.textContent = 'Camera is off';
            this.statusElement.style.backgroundColor = '#f1f1f1'; // Light gray
        }
    }
    
    captureImage() {
        if (!this.isActive) return;
        
        // Set canvas dimensions to match the video
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        
        // Draw the current video frame on the canvas
        this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        
        // Convert canvas to image and display
        const imageDataURL = this.canvas.toDataURL('image/jpeg');
        this.capturedImage.src = imageDataURL;
        this.capturedImage.style.display = 'block';
        
        // Hide the processed image if it exists
        const processedImage = document.getElementById('processedImage');
        processedImage.style.display = 'none';
        
        // Update UI
        document.getElementById('detectButton').disabled = false;
        this.statusElement.textContent = 'Image captured';
        
        // Return the image data URL for further processing
        return imageDataURL;
    }
    
    getImageData() {
        // Return the data URL of the captured image
        return this.capturedImage.src;
    }
}

// Export the Camera class
window.Camera = Camera;