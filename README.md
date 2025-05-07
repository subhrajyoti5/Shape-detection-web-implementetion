
# Face Detection Web Application

This project integrates a Python-based face detection system with a web application, allowing users to capture images from their camera, detect faces, and display the results in real-time.

## Features

- Camera capture directly from the browser
- Real-time face detection using OpenCV (or your custom model)
- Display of detection results with bounding boxes
- Responsive web interface

## Project Structure

```
face_detection_web/
│
├── backend/               # Flask server
│   ├── app.py            # Main application
│   ├── detector/         # Face detection logic
│   └── api/              # API endpoints
│
├── frontend/             # Web interface
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
│
├── Dockerfile            # Docker configuration
└── docker-compose.yml    # Docker compose setup
```

## Prerequisites

- Python 3.8+ 
- Node.js (optional, for development)
- Docker (for containerized deployment)
- Web browser with camera access support

## Setup and Installation

### Option 1: Local Development

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd face_detection_web
   ```

2. Set up the Python environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Run the Flask application:
   ```bash
   python app.py
   ```

4. Access the application in your browser:
   ```
   http://localhost:5000
   ```

### Option 2: Docker Deployment

1. Make sure Docker and Docker Compose are installed on your system.

2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

3. Access the application in your browser:
   ```
   http://localhost:5000
   ```

## Integrating Your Custom Face Detection Model

The project includes a placeholder for your face detection model in `backend/detector/face_detector.py`. You can integrate your custom model by following these steps:

1. Place your model files in the `backend/detector/` directory.

2. Modify the `FaceDetector` class in `face_detector.py` to use your model:
   ```python
   def __init__(self, model_path='path/to/your/model'):
       # Load your custom model here
       self.model = YourCustomModel.load(model_path)
   
   def detect(self, img):
       # Replace with your model's detection logic
       results = self.model.process(img)
       # Process and return results in the expected format
       # ...
   ```

3. Update the return format to match the expected structure:
   ```python
   return {
       'image': processed_image,
       'num_faces': number_of_faces_detected,
       'bounding_boxes': list_of_bounding_boxes
   }
   ```

## API Endpoints

- `GET /` - Serves the main web application
- `POST /api/detect` - Face detection endpoint
  - Input: JSON with base64-encoded image
  - Output: JSON with detection results and processed image path
- `GET /api/images/<filename>` - Retrieve processed images

## Customizing the UI

The frontend is built with vanilla JavaScript and CSS for simplicity. To customize:

- Edit `frontend/css/style.css` to change the appearance
- Modify `frontend/index.html` to adjust the page structure
- Update JavaScript files in `frontend/js/` for behavior changes

## Troubleshooting

### Camera Access Issues
- Ensure your browser allows camera access
- Application must be served over HTTPS in production (browsers require this for camera access)
- Check browser console for specific error messages

### Face Detection Problems
- Verify lighting conditions are adequate
- Ensure faces are clearly visible in the frame
- Adjust detection parameters in `face_detector.py` for better accuracy

## Security Considerations

For a production deployment:

1. Implement user authentication if needed
2. Set up HTTPS using a reverse proxy like Nginx
3. Add rate limiting to the API endpoints
4. Implement proper validation for all user inputs
5. Regularly clean up temporary image files

## License

[Your License Information]

## Acknowledgments

- OpenCV for computer vision capabilities
- Flask for the backend framework