import { useState } from 'react'
import { FiMoreVertical } from 'react-icons/fi'

function SectionOrderManager({ sectionOrder, setSectionOrder }) {
  const [draggedSection, setDraggedSection] = useState(null)

  const handleDragStart = (e, index) => {
    setDraggedSection(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedSection === null) return

    const newOrder = [...sectionOrder]
    const draggedItem = newOrder[draggedSection]
    newOrder.splice(draggedSection, 1)
    newOrder.splice(dropIndex, 0, draggedItem)
    
    setSectionOrder(newOrder)
    setDraggedSection(null)
  }

  const sectionLabels = {
    education: 'Education',
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Technical Skills',
    certifications: 'Certifications'
  }

  return (
    <div className="section-order-manager">
      <h3>Section Order</h3>
      <p className="order-hint">Drag sections to reorder them on your resume</p>
      <div className="section-order-list">
        {sectionOrder.map((sectionKey, index) => (
          <div
            key={sectionKey}
            className={`section-order-item ${draggedSection === index ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <FiMoreVertical className="drag-handle" />
            <span>{sectionLabels[sectionKey] || sectionKey}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionOrderManager
