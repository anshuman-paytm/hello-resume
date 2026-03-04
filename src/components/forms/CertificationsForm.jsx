import { useState } from 'react'
import { FiPlus, FiTrash2, FiMoreVertical } from 'react-icons/fi'

function CertificationsForm({ data, updateData }) {
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
  const addCertification = () => {
    const newCert = {
      name: '',
      issuer: '',
      date: '',
      url: ''
    }
    updateData([...data, newCert])
  }

  const updateCertification = (index, field, value) => {
    const updated = [...data]
    updated[index] = {
      ...updated[index],
      [field]: value
    }
    updateData(updated)
  }

  const removeCertification = (index) => {
    updateData(data.filter((_, i) => i !== index))
  }

  return (
    <div className="form-section-content">
      <div className="form-header">
        <h3>Certifications</h3>
        <button onClick={addCertification} className="add-btn">
          <FiPlus /> Add Certification
        </button>
      </div>
      {data.length === 0 ? (
        <p className="empty-state">No certifications added yet. Click "Add Certification" to get started.</p>
      ) : (
        <div className="items-list">
          {data.map((cert, idx) => (
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
                <h4>{cert.name || 'New Certification'}</h4>
                <button onClick={() => removeCertification(idx)} className="delete-btn">
                  <FiTrash2 />
                </button>
              </div>
              <div className="form-group">
                <label>Certification Name *</label>
                <input
                  type="text"
                  value={cert.name || ''}
                  onChange={(e) => updateCertification(idx, 'name', e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                />
              </div>
              <div className="form-group">
                <label>Issuing Organization</label>
                <input
                  type="text"
                  value={cert.issuer || ''}
                  onChange={(e) => updateCertification(idx, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="text"
                  value={cert.date || ''}
                  onChange={(e) => updateCertification(idx, 'date', e.target.value)}
                  placeholder="MM/YYYY"
                />
              </div>
              <div className="form-group">
                <label>Certificate URL</label>
                <input
                  type="url"
                  value={cert.url || ''}
                  onChange={(e) => updateCertification(idx, 'url', e.target.value)}
                  placeholder="https://certificate-url.com"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CertificationsForm
