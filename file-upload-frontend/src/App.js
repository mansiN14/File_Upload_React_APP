import React, { useState, useEffect } from "react";
import FilePreview from "./components/FilePreview";
import FileList from "./components/FileList";
import UploadForm from "./components/UploadForm";
import ProgressBar from "./components/ProgressBar";
import CategoryManager from "./components/CategoryManager";
import axios from "axios";
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("HR");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // "info", "success", "error"
  const [previews, setPreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState(["HR", "IT", "Sales", "Finance", "Marketing"]);

  // Fetch already uploaded files on component mount and category change
  useEffect(() => {
    fetchUploadedFiles();
  }, [category]);
  
  // Fetch available categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/categories`);
      // Only update if we have categories from the backend
      if (res.data.categories && res.data.categories.length > 0) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/files/${category}`);
      setUploadedFiles(res.data.files || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      setUploadedFiles([]);
    }
  };

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    // Auto-clear message after 5 seconds
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      
      // Generate previews
      const newPreviews = selectedFiles.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      }));
      
      setPreviews(newPreviews);
    }
  };

  const validateFiles = (filesToValidate) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const invalidFiles = filesToValidate.filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      const isValidType = ['pdf', 'jpg', 'jpeg'].includes(extension);
      const isValidSize = file.size <= maxSize;
      
      return !isValidType || !isValidSize;
    });
    
    return invalidFiles.length === 0;
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      showMessage("Please select at least one file.", "error");
      return;
    }

    if (!validateFiles(files)) {
      showMessage("Invalid file(s). Only PDF, JPG and JPEG files under 5MB are allowed.", "error");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    showMessage("Uploading...", "info");

    const formData = new FormData();
    files.forEach(file => {
      formData.append("files", file);
    });
    formData.append("category", category);

    try {
      const res = await axios.post("http://localhost:8000/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });
      
      showMessage(`${files.length} file(s) uploaded successfully`, "success");
      fetchUploadedFiles();
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      console.error("Upload error:", error);
      const errorMsg = error.response?.data?.message || error.message;
      showMessage("Upload failed: " + errorMsg, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`http://localhost:8000/files/${category}/${filename}`);
      showMessage(`Deleted ${filename} successfully`, "success");
      fetchUploadedFiles();
    } catch (error) {
      console.error("Delete error:", error);
      showMessage("Delete failed: " + error.message, "error");
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchTerm("");
  };

  const handleAddCategory = async (newCategory) => {
    if (categories.includes(newCategory)) {
      showMessage(`Category "${newCategory}" already exists`, "error");
      return;
    }
    
    setCategories(prev => [...prev, newCategory]);
    showMessage(`Category "${newCategory}" added`, "success");
  };

  const handleDeleteCategory = async (categoryToDelete) => {
    try {
      await axios.delete(`http://localhost:8000/categories/${categoryToDelete}`);
      setCategories(prev => prev.filter(cat => cat !== categoryToDelete));
      if (category === categoryToDelete) {
        setCategory(categories[0] || "HR");
      }
      showMessage(`Category "${categoryToDelete}" deleted`, "success");
    } catch (error) {
      console.error("Delete category error:", error);
      showMessage(`Failed to delete category: ${error.message}`, "error");
    }
  };

  const filteredFiles = uploadedFiles.filter(file => 
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>File Upload App</h1>
      </header>
      
      <main className="app-content">
        <div className="panel">
          <CategoryManager 
            categories={categories}
            currentCategory={category}
            onCategoryChange={handleCategoryChange}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </div>
        
        <div className="panel">
          <UploadForm 
            onFileChange={handleFileChange}
            onUpload={handleUpload}
            category={category}
            isUploading={isUploading}
            filesSelected={files.length > 0}
          />
          
          {isUploading && (
            <ProgressBar progress={uploadProgress} />
          )}
          
          {message && (
            <div className={`message message-${messageType}`}>
              {message}
            </div>
          )}
        </div>
        
        {previews.length > 0 && (
          <div className="panel">
            <h3>Selected Files Preview</h3>
            <FilePreview previews={previews} />
          </div>
        )}
        
        <div className="panel">
          <h3>Uploaded Files ({category})</h3>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <FileList 
            files={filteredFiles} 
            onDelete={handleDelete} 
          />
        </div>
      </main>
      
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} File Upload App</p>
      </footer>
    </div>
  );
}

export default App;