import React from "react";

function FileList({ files, onDelete }) {
  if (!files || files.length === 0) {
    return (
      <div className="empty-state">
        <p>No files found in this category</p>
      </div>
    );
  }

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    
    if (extension === 'pdf') {
      return "📄";
    } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
      return "🖼️";
    } else {
      return "📁";
    }
  };

  return (
    <div className="files-list">
      {files.map((file, index) => (
        <div key={index} className="file-item">
          <div className="file-info">
            <span className="file-icon">{getFileIcon(file)}</span>
            <span className="file-name" title={file}>
              {file}
            </span>
          </div>
          
          <div className="file-actions">
            <button 
              onClick={() => onDelete(file)}
              className="delete-btn"
              title="Delete file"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FileList;