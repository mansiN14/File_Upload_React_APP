import React from "react";

function UploadForm({ onFileChange, onUpload, isUploading, filesSelected }) {
  return (
    <div className="upload-form">
      <h3>Upload Files</h3>
      
      <div className="form-group">
        <label htmlFor="file-input" className="form-label">
          Select Files (PDF, JPG, JPEG - max 5MB):
        </label>
        <input
          id="file-input"
          type="file"
          onChange={onFileChange}
          multiple
          className="file-input"
          accept=".pdf,.jpg,.jpeg"
          disabled={isUploading}
        />
      </div>
      
      <div className="form-actions">
        <button
          onClick={onUpload}
          disabled={isUploading || !filesSelected}
          className={`upload-btn ${isUploading ? "uploading" : ""}`}
        >
          {isUploading ? "Uploading..." : "Upload Files"}
        </button>
      </div>
      
      {!filesSelected && (
        <div className="form-help">
          <p>Please select at least one file to upload</p>
        </div>
      )}
    </div>
  );
}

export default UploadForm;