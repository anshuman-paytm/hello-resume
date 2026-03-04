import { useState } from 'react'
import { FiPlus, FiTrash2, FiMoreVertical } from 'react-icons/fi'

function ProjectsForm({ data, updateData }) {
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
  const addProject = () => {
    const newProject = {
      name: '',
      description: '',
      url: '',
      technologies: [],
      startDate: '',
      endDate: ''
    }
    updateData([...data, newProject])
  }

  const updateProject = (index, field, value) => {
    const updated = [...data]
    updated[index] = {
      ...updated[index],
      [field]: value
    }
    updateData(updated)
  }

  const updateTechnologies = (index, techString) => {
    const technologies = techString.split(',').map(t => t.trim()).filter(t => t)
    updateProject(index, 'technologies', technologies)
  }

  const removeProject = (index) => {
    updateData(data.filter((_, i) => i !== index))
  }

  return (
    <div className="form-section-content">
      <div className="form-header">
        <h3>Projects</h3>
        <button onClick={addProject} className="add-btn">
          <FiPlus /> Add Project
        </button>
      </div>
      {data.length === 0 ? (
        <p className="empty-state">No projects added yet. Click "Add Project" to get started.</p>
      ) : (
        <div className="items-list">
          {data.map((project, idx) => (
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
                <h4>{project.name || 'New Project'}</h4>
                <button onClick={() => removeProject(idx)} className="delete-btn">
                  <FiTrash2 />
                </button>
              </div>
              <div className="form-group">
                <label>Project Name *</label>
                <input
                  type="text"
                  value={project.name || ''}
                  onChange={(e) => updateProject(idx, 'name', e.target.value)}
                  placeholder="Project Name"
                />
              </div>
              <div className="form-group">
                <label>Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={project.technologies?.join(', ') || ''}
                  onChange={(e) => updateTechnologies(idx, e.target.value)}
                  placeholder="Python, Flask, React, PostgreSQL, Docker"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="text"
                    value={project.startDate || ''}
                    onChange={(e) => updateProject(idx, 'startDate', e.target.value)}
                    placeholder="June 2020"
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="text"
                    value={project.endDate || ''}
                    onChange={(e) => updateProject(idx, 'endDate', e.target.value)}
                    placeholder="Present"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description (one bullet point per line)</label>
                <textarea
                  value={project.description || ''}
                  onChange={(e) => updateProject(idx, 'description', e.target.value)}
                  placeholder="• Developed a full-stack web application&#10;• Implemented GitHub OAuth&#10;• Visualized GitHub data"
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

export default ProjectsForm
