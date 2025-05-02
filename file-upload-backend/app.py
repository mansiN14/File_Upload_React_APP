from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from datetime import datetime
import shutil
import uuid

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def log_event(message):
    with open("upload_log.txt", "a") as log:
        log.write(f"[{datetime.now()}] {message}\n")

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'files' not in request.files or 'category' not in request.form:
        return jsonify({'success': False, 'message': 'Missing files or category'}), 400

    files = request.files.getlist('files')
    category = request.form['category']
    
    if not files or len(files) == 0:
        return jsonify({'success': False, 'message': 'No files selected'}), 400

    category_path = os.path.join(UPLOAD_FOLDER, category)
    os.makedirs(category_path, exist_ok=True)
    
    uploaded_count = 0
    errors = []
    
    for file in files:
        if file and allowed_file(file.filename):
            if file.content_length > MAX_FILE_SIZE:
                errors.append(f"{file.filename}: File too large (max 5MB)")
                continue
                
            # Generate a unique filename to prevent overwrites
            original_filename = file.filename
            filename_parts = os.path.splitext(original_filename)
            unique_filename = f"{filename_parts[0]}_{uuid.uuid4().hex[:8]}{filename_parts[1]}"
            
            filepath = os.path.join(category_path, unique_filename)
            file.save(filepath)
            
            log_event(f"Uploaded: {original_filename} as {unique_filename} | Category: {category}")
            uploaded_count += 1
        else:
            log_event(f"Rejected: {file.filename} | Category: {category} | Invalid type")
            errors.append(f"{file.filename}: Invalid file type")
    
    response = {
        'success': uploaded_count > 0,
        'message': f"{uploaded_count} file(s) uploaded successfully",
        'errors': errors if errors else None
    }
    
    if uploaded_count == 0 and errors:
        return jsonify(response), 400
        
    return jsonify(response)

@app.route('/files/<category>', methods=['GET'])
def list_files(category):
    category_path = os.path.join(UPLOAD_FOLDER, category)
    
    if not os.path.exists(category_path):
        return jsonify({'success': True, 'files': []})
        
    files = [f for f in os.listdir(category_path) if os.path.isfile(os.path.join(category_path, f))]
    
    return jsonify({'success': True, 'files': files})

@app.route('/files/<category>/<filename>', methods=['GET'])
def get_file(category, filename):
    return send_from_directory(os.path.join(UPLOAD_FOLDER, category), filename)

@app.route('/files/<category>/<filename>', methods=['DELETE'])
def delete_file(category, filename):
    file_path = os.path.join(UPLOAD_FOLDER, category, filename)
    
    if not os.path.exists(file_path):
        return jsonify({'success': False, 'message': 'File not found'}), 404
        
    try:
        os.remove(file_path)
        log_event(f"Deleted: {filename} | Category: {category}")
        return jsonify({'success': True, 'message': f"File {filename} deleted successfully"})
    except Exception as e:
        log_event(f"Delete Error: {filename} | Category: {category} | Error: {str(e)}")
        return jsonify({'success': False, 'message': f"Error deleting file: {str(e)}"}), 500

@app.route('/categories', methods=['GET'])
def list_categories():
    if not os.path.exists(UPLOAD_FOLDER):
        return jsonify({'success': True, 'categories': []})
        
    categories = [d for d in os.listdir(UPLOAD_FOLDER) if os.path.isdir(os.path.join(UPLOAD_FOLDER, d))]
    
    return jsonify({'success': True, 'categories': categories})

@app.route('/categories/<category>', methods=['DELETE'])
def delete_category(category):
    category_path = os.path.join(UPLOAD_FOLDER, category)
    
    if not os.path.exists(category_path):
        return jsonify({'success': False, 'message': 'Category not found'}), 404
        
    try:
        shutil.rmtree(category_path)
        log_event(f"Deleted Category: {category}")
        return jsonify({'success': True, 'message': f"Category {category} deleted successfully"})
    except Exception as e:
        log_event(f"Delete Category Error: {category} | Error: {str(e)}")
        return jsonify({'success': False, 'message': f"Error deleting category: {str(e)}"}), 500

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True, port=8000)