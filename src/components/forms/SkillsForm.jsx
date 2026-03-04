import { useState, useEffect } from 'react'
import { FiPlus, FiX, FiTrash2, FiMoreVertical } from 'react-icons/fi'

function SkillsForm({ data, updateData }) {
  const [draggedCategoryIndex, setDraggedCategoryIndex] = useState(null)
  const [draggedSkillIndex, setDraggedSkillIndex] = useState(null)
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(null)
  const [skillInputs, setSkillInputs] = useState({})

  // Migrate old format to new format if needed (only once)
  useEffect(() => {
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
      // Old format: array of strings
      updateData([{ category: 'Languages', items: data }])
    } else if (!Array.isArray(data) || data.length === 0) {
      // Empty or invalid data
      updateData([{ category: 'Languages', items: [] }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  // Ensure data is in the new format
  const skillsData = Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0].category
    ? data
    : [{ category: 'Languages', items: [] }]

  const addCategory = () => {
    const newCategory = {
      category: 'New Category',
      items: []
    }
    updateData([...skillsData, newCategory])
    setActiveCategoryIndex(skillsData.length)
  }

  const removeCategory = (index) => {
    updateData(skillsData.filter((_, i) => i !== index))
    if (activeCategoryIndex === index) setActiveCategoryIndex(null)
  }

  const updateCategoryName = (index, newName) => {
    const updated = [...skillsData]
    updated[index] = {
      ...updated[index],
      category: newName
    }
    updateData(updated)
  }

  const addSkillToCategory = (categoryIndex, skillInput) => {
    if (!skillInput.trim()) return
    
    const updated = [...skillsData]
    const category = updated[categoryIndex]
    if (!category.items.includes(skillInput.trim())) {
      category.items.push(skillInput.trim())
      updateData(updated)
      // Clear input for this category
      setSkillInputs({ ...skillInputs, [categoryIndex]: '' })
    }
  }

  const updateSkillInput = (categoryIndex, value) => {
    setSkillInputs({ ...skillInputs, [categoryIndex]: value })
  }

  const getSkillInput = (categoryIndex) => {
    return skillInputs[categoryIndex] || ''
  }

  const removeSkillFromCategory = (categoryIndex, skillIndex) => {
    const updated = [...skillsData]
    updated[categoryIndex].items.splice(skillIndex, 1)
    updateData(updated)
  }

  const handleCategoryDragStart = (e, index) => {
    setDraggedCategoryIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleCategoryDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleCategoryDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedCategoryIndex === null) return

    const newData = [...skillsData]
    const draggedItem = newData[draggedCategoryIndex]
    newData.splice(draggedCategoryIndex, 1)
    newData.splice(dropIndex, 0, draggedItem)
    
    updateData(newData)
    setDraggedCategoryIndex(null)
  }

  const handleSkillDragStart = (e, categoryIndex, skillIndex) => {
    setDraggedSkillIndex({ categoryIndex, skillIndex })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleSkillDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleSkillDrop = (e, categoryIndex, dropSkillIndex) => {
    e.preventDefault()
    if (!draggedSkillIndex) return

    const { categoryIndex: sourceCategoryIndex, skillIndex: sourceSkillIndex } = draggedSkillIndex
    
    if (sourceCategoryIndex === categoryIndex && sourceSkillIndex === dropSkillIndex) {
      setDraggedSkillIndex(null)
      return
    }

    const updated = [...skillsData]
    const skill = updated[sourceCategoryIndex].items[sourceSkillIndex]
    
    // Remove from source
    updated[sourceCategoryIndex].items.splice(sourceSkillIndex, 1)
    
    // Insert at destination
    const insertIndex = sourceCategoryIndex === categoryIndex && sourceSkillIndex < dropSkillIndex 
      ? dropSkillIndex - 1 
      : dropSkillIndex
    updated[categoryIndex].items.splice(insertIndex, 0, skill)
    
    updateData(updated)
    setDraggedSkillIndex(null)
  }

  return (
    <div className="form-section-content">
      <div className="form-header">
        <h3>Technical Skills</h3>
        <button onClick={addCategory} className="add-btn">
          <FiPlus /> Add Category
        </button>
      </div>
      
      {skillsData.length === 0 ? (
        <p className="empty-state">No skill categories added yet. Click "Add Category" to get started.</p>
      ) : (
        <div className="skills-categories-list">
          {skillsData.map((skillCategory, categoryIdx) => (
              <div 
                key={categoryIdx} 
                className={`skill-category-card ${draggedCategoryIndex === categoryIdx ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleCategoryDragStart(e, categoryIdx)}
                onDragOver={handleCategoryDragOver}
                onDrop={(e) => handleCategoryDrop(e, categoryIdx)}
              >
                <div className="category-header">
                  <FiMoreVertical className="drag-handle" />
                  <input
                    type="text"
                    value={skillCategory.category}
                    onChange={(e) => updateCategoryName(categoryIdx, e.target.value)}
                    className="category-name-input"
                    placeholder="Category Name"
                  />
                  <button onClick={() => removeCategory(categoryIdx)} className="delete-btn">
                    <FiTrash2 />
                  </button>
                </div>
                
                <div className="form-group">
                  <label>Add Skill</label>
                  <div className="input-with-button">
                    <input
                      type="text"
                      value={getSkillInput(categoryIdx)}
                      onChange={(e) => updateSkillInput(categoryIdx, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSkillToCategory(categoryIdx, getSkillInput(categoryIdx))
                        }
                      }}
                      placeholder="e.g., JavaScript, React"
                    />
                    <button 
                      onClick={() => {
                        addSkillToCategory(categoryIdx, getSkillInput(categoryIdx))
                      }} 
                      className="add-btn-small"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                {skillCategory.items.length > 0 && (
                  <div className="skills-list-editor">
                    {skillCategory.items.map((skill, skillIdx) => (
                      <span 
                        key={skillIdx} 
                        className={`skill-tag-editable ${draggedSkillIndex?.categoryIndex === categoryIdx && draggedSkillIndex?.skillIndex === skillIdx ? 'dragging' : ''}`}
                        draggable
                        onDragStart={(e) => handleSkillDragStart(e, categoryIdx, skillIdx)}
                        onDragOver={handleSkillDragOver}
                        onDrop={(e) => handleSkillDrop(e, categoryIdx, skillIdx)}
                      >
                        <FiMoreVertical className="skill-drag-handle" />
                        {skill}
                        <button onClick={() => removeSkillFromCategory(categoryIdx, skillIdx)} className="remove-skill-btn">
                          <FiX />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SkillsForm
