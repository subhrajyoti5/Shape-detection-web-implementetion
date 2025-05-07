
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import base64
import cv2
import numpy as np
from detector.face_detector import FaceDetector
import uuid
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='../frontend')
CORS(app)  # Enable CORS for all routes

# Initialize the face detector
face_detector = FaceDetector()

# Create a folder to store temporary images
UPLOAD_FOLDER = 'temp_images'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../frontend', path)

@app.route('/api/detect', methods=['POST'])
def detect_face():
    try:
        # Get the image data from the request
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode the base64 image
        image_data = data['image'].split(',')[1] if ',' in data['image'] else data['image']
        image_bytes = base64.b64decode(image_data)
        
        # Convert to numpy array for OpenCV
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({'error': 'Invalid image data'}), 400
        
        # Process the image with your face detector
        result = face_detector.detect(img)
        
        # Generate a unique filename
        filename = f"{uuid.uuid4()}.jpg"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        # Save the processed image
        cv2.imwrite(filepath, result['image'])
        
        # Return the results
        return jsonify({
            'faces_detected': result['num_faces'],
            'processed_image': f'/api/images/{filename}',
            'bounding_boxes': result['bounding_boxes']
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/images/<filename>')
def get_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)