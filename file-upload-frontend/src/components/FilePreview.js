import React from "react";

function FilePreview({ previews }) {
  if (!previews || previews.length === 0) {
    return null;
  }

  return (
    <div className="preview-container">
      {previews.map((preview, index) => (
        <div key={index} className="preview-item">
          <div className="preview-header">
            <span className="preview-name" title={preview.name}>
              {preview.name}
            </span>
            <span className="preview-type">
              {preview.type.split("/")[1].toUpperCase()}
            </span>
          </div>
          
          <div className="preview-content">
            {preview.type.includes("pdf") ? (
              <iframe 
                src={preview.url} 
                width="100%" 
                height="150px" 
                title={`PDF Preview ${index}`} 
                className="pdf-preview"
              />
            ) : (
              <img 
                src={preview.url} 
                alt={preview.name} 
                className="image-preview" 
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FilePreview;