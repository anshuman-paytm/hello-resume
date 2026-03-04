import { useState } from 'react'
import { FiPlus, FiTrash2, FiMoreVertical } from 'react-icons/fi'

function EducationForm({ data, updateData }) {
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
  const addEducation = () => {
    const newEdu = {
      degree: '',
      school: '',
      location: '',
      minor: '',
      startDate: '',
      endDate: '',
      gpa: ''
    }
    updateData([...data, newEdu])
  }

  const updateEducation = (index, field, value) => {
    const updated = [...data]
    updated[index] = {
      ...updated[index],
      [field]: value
    }
    updateData(updated)
  }

  const removeEducation = (index) => {
    updateData(data.filter((_, i) => i !== index))
  }

  return (
    <div className="form-section-content">
      <div className="form-header">
        <h3>Education</h3>
        <button onClick={addEducation} className="add-btn">
          <FiPlus /> Add Education
        </button>
      </div>
      {data.length === 0 ? (
        <p className="empty-state">No education added yet. Click "Add Education" to get started.</p>
      ) : (
        <div className="items-list">
          {data.map((edu, idx) => (
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
                <h4>{edu.degree || 'New Education'}</h4>
                <button onClick={() => removeEducation(idx)} className="delete-btn">
                  <FiTrash2 />
                </button>
              </div>
              <div className="form-group">
                <label>Degree *</label>
                <input
                  type="text"
                  value={edu.degree || ''}
                  onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>
              <div className="form-group">
                <label>School/University *</label>
                <input
                  type="text"
                  value={edu.school || ''}
                  onChange={(e) => updateEducation(idx, 'school', e.target.value)}
                  placeholder="University Name"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={edu.location || ''}
                  onChange={(e) => updateEducation(idx, 'location', e.target.value)}
                  placeholder="City, State"
                />
              </div>
              <div className="form-group">
                <label>Degree *</label>
                <input
                  type="text"
                  value={edu.degree || ''}
                  onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                  placeholder="Bachelor of Arts in Computer Science"
                />
              </div>
              <div className="form-group">
                <label>Minor (Optional)</label>
                <input
                  type="text"
                  value={edu.minor || ''}
                  onChange={(e) => updateEducation(idx, 'minor', e.target.value)}
                  placeholder="Business"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="text"
                    value={edu.startDate || ''}
                    onChange={(e) => updateEducation(idx, 'startDate', e.target.value)}
                    placeholder="MM/YYYY"
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="text"
                    value={edu.endDate || ''}
                    onChange={(e) => updateEducation(idx, 'endDate', e.target.value)}
                    placeholder="MM/YYYY or Present"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>GPA (Optional)</label>
                <input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(idx, 'gpa', e.target.value)}
                  placeholder="3.8/4.0"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EducationForm
