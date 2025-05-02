import React, { useState } from "react";

function CategoryManager({ 
  categories, 
  currentCategory, 
  onCategoryChange, 
  onAddCategory,
  onDeleteCategory
}) {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState("");

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName("");
      setShowAddCategory(false);
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    onDeleteCategory(categoryToDelete);
    setShowConfirmDelete(false);
    setCategoryToDelete("");
  };

  return (
    <div className="category-manager">
      <h3>Categories</h3>
      
      <div className="category-list">
        {categories.map((category) => (
          <div 
            key={category}
            className={`category-item ${category === currentCategory ? 'active' : ''}`}
          >
            <button
              className="category-select-btn"
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
            <button
              className="category-delete-btn"
              onClick={() => handleDeleteClick(category)}
              title={`Delete ${category} category`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      {!showAddCategory ? (
        <button 
          className="add-category-btn"
          onClick={() => setShowAddCategory(true)}
        >
          + Add Category
        </button>
      ) : (
        <form onSubmit={handleAddSubmit} className="add-category-form">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            className="category-input"
            autoFocus
          />
          <div className="form-buttons">
            <button type="submit" className="confirm-btn">
              Add
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => {
                setShowAddCategory(false);
                setNewCategoryName("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      
      {showConfirmDelete && (
        <div className="confirm-dialog">
          <p>Delete category "{categoryToDelete}"?</p>
          <p className="warning">This will delete all files in this category!</p>
          <div className="dialog-buttons">
            <button onClick={confirmDelete} className="delete-confirm-btn">
              Delete
            </button>
            <button 
              onClick={() => setShowConfirmDelete(false)} 
              className="delete-cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryManager;