import { useState } from 'react'
import { FiPlus, FiTrash2, FiMoreVertical } from 'react-icons/fi'

function ExperienceForm({ data, updateData }) {
  const [editingIndex, setEditingIndex] = useState(null)
  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedIndex === null) return

    const newData = [...data]
    const draggedItem = newData[draggedIndex]
    newData.splice(draggedIndex, 1)
    newData.splice(dropIndex, 0, draggedItem)
    
    updateData(newData)
    setDraggedIndex(null)
  }

  const addExperience = () => {
    const newExp = {
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    }
    updateData([...data, newExp])
    setEditingIndex(data.length)
  }

  const updateExperience = (index, field, value) => {
    const updated = [...data]
    updated[index] = {
      ...updated[index],
      [field]: value
    }
    updateData(updated)
  }

  const removeExperience = (index) => {
    updateData(data.filter((_, i) => i !== index))
    if (editingIndex === index) setEditingIndex(null)
  }

  return (
    <div className="form-section-content">
      <div className="form-header">
        <h3>Work Experience</h3>
        <button onClick={addExperience} className="add-btn">
          <FiPlus /> Add Experience
        </button>
      </div>
      {data.length === 0 ? (
        <p className="empty-state">No experience added yet. Click "Add Experience" to get started.</p>
      ) : (
        <div className="items-list">
          {data.map((exp, idx) => (
            <div 
              key={idx} 
              className={`item-card ${draggedIndex === idx ? 'dragging' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
            >
              <div className="item-card-header">
                <FiMoreVertical className="drag-handle" />
                <h4>{exp.title || 'New Experience'}</h4>
                <button onClick={() => removeExperience(idx)} className="delete-btn">
                  <FiTrash2 />
                </button>
              </div>
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  value={exp.title || ''}
                  onChange={(e) => updateExperience(idx, 'title', e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
              <div className="form-group">
                <label>Company *</label>
                <input
                  type="text"
                  value={exp.company || ''}
                  onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                  placeholder="Company Name"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={exp.location || ''}
                  onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                  placeholder="City, State"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="text"
                    value={exp.startDate || ''}
                    onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                    placeholder="MM/YYYY"
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="text"
                    value={exp.endDate || ''}
                    onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                    placeholder="MM/YYYY or Present"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description (one bullet point per line)</label>
                <textarea
                  value={exp.description || ''}
                  onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                  placeholder="• Developed a REST API using FastAPI&#10;• Implemented new features&#10;• Collaborated with team members"
                  rows={6}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExperienceForm
