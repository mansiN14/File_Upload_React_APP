# File Upload Application

A full-stack web application for managing file uploads across different categories, with a React frontend and Flask backend.

## Features

- **File Upload Management**: Upload PDF and image files (JPG/JPEG) with size validation
- **Category Organization**: Organize files into customizable categories
- **File Preview**: Preview selected files before uploading
- **Real-time Progress**: Track upload progress with a visual progress bar
- **File Search**: Search through uploaded files within each category
- **File Viewing**: Dedicated page to view all files in a selected category
- **File Management**: Delete individual files or entire categories
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend

- React.js
- React Router for navigation
- Axios for API requests
- CSS for styling

### Backend

- Flask (Python)
- Flask-CORS for cross-origin resource sharing
- File system management for storage

## Installation

### Prerequisites

- Node.js (v14+)
- Python (v3.6+)
- pip (Python package manager)

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/mansiN14/File_Upload_React_APP.git
   cd File_Upload_React_APP
   ```

2. Set up the Python environment:
   ```bash
   cd file-upload-backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Navigate to the Backend Directory:
   ```bash
   cd ../file-upload-backend
   ```
4. Start the Flask server:
   ```bash
   python app.py
   ```
   The backend server will run on http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../file-upload-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend application will run on http://localhost:3000

## Usage

### Main Upload Page

1. **Select a Category**: Choose or create a category for your files
2. **Select Files**: Click the file input to select PDF or JPG/JPEG files (up to 5MB each)
3. **Preview Files**: View file previews before uploading
4. **Upload**: Click the "Upload Files" button to upload files to the selected category

### File Viewing Page

1. **Browse Files**: See all files in the selected category
2. **Search Files**: Use the search box to filter files by name
3. **Delete Files**: Remove unwanted files using the delete button

### Category Management

1. **Select Category**: Click on a category to switch between different file categories
2. **Add Category**: Click the "Add Category" button to create a new category
3. **Delete Category**: Remove a category and all its files using the delete button next to the category name

## API Endpoints

### File Operations

- `POST /upload`: Upload files to a specific category
- `GET /files/<category>`: List all files in a category
- `GET /files/<category>/<filename>`: Get a specific file
- `DELETE /files/<category>/<filename>`: Delete a specific file

### Category Operations

- `GET /categories`: List all categories
- `DELETE /categories/<category>`: Delete a category and all its files

## Configuration

### Backend Configuration

- Default upload folder: `uploads/`
- Allowed file types: PDF, JPG, JPEG
- Maximum file size: 5MB

These settings can be modified in `file-upload-backend/app.py`.

### Frontend Configuration

- Backend API URL: `http://localhost:8000`
- Default categories: HR, IT, Sales, Finance, Marketing

These settings can be modified in `file-upload-frontend/src/App.js`.

## Project Structure

```
file-upload-app/
├── file-upload-backend/         # Flask backend
│   ├── app.py                   # Main server file
│   ├── requirements.txt         # Python dependencies
│   └── uploads/                 # File storage directory
│
└── file-upload-frontend/        # React frontend
    ├── public/                  # Static assets
    └── src/                     # Source code
        ├── components/          # React components
        │   ├── CategoryManager.js
        │   ├── FileList.js
        │   ├── FilePreview.js
        │   ├── ProgressBar.js
        │   ├── UploadForm.js
        ├── App.js               # Main React component
        ├── App.css              # Application styles
        └── index.js             # Entry point
```
