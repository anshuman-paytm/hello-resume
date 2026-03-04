import { useRef } from 'react'
import { FiDownload } from 'react-icons/fi'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

function ResumePreview({ resumeData, sectionOrder }) {
  const resumeRef = useRef(null)

  const exportToPDF = async () => {
    const element = resumeRef.current
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 0
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    pdf.save(`${resumeData.personalInfo.fullName || 'resume'}-resume.pdf`)
  }

  return (
    <div className="resume-preview-container">
      <div className="preview-header">
        <h2>Resume Preview</h2>
        <button onClick={exportToPDF} className="export-btn">
          <FiDownload /> Export PDF
        </button>
      </div>
      <div className="resume-preview" ref={resumeRef}>
        <div className="resume-content">
          {/* Header Section */}
          <div className="resume-header">
            <h1 className="resume-name">
              {resumeData.personalInfo.fullName || 'Your Name'}
            </h1>
            <div className="contact-info">
              {[
                resumeData.personalInfo.phone,
                resumeData.personalInfo.email,
                resumeData.personalInfo.location,
                resumeData.personalInfo.linkedin,
                resumeData.personalInfo.github,
                resumeData.personalInfo.website
              ].filter(Boolean).map((info, idx, arr) => (
                <span key={idx}>
                  {info}
                  {idx < arr.length - 1 && <span className="contact-separator"> | </span>}
                </span>
              ))}
            </div>
          </div>

          {/* Single Column Layout */}
          <div className="resume-body">
            {sectionOrder.map((sectionKey) => {
              // Education Section
              if (sectionKey === 'education' && resumeData.education.length > 0) {
                return (
                  <div key="education" className="resume-section">
                    <h2 className="section-title">Education</h2>
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} className="education-item">
                        <div className="education-header">
                          <span className="item-school">{edu.school}</span>
                          {edu.location && <span className="item-location">{edu.location}</span>}
                        </div>
                        <div className="education-details">
                          <span>
                            <span className="item-degree">{edu.degree}</span>
                            {edu.minor && <span className="item-minor">, Minor in {edu.minor}</span>}
                          </span>
                          <span className="item-date">{edu.startDate} - {edu.endDate || 'Present'}</span>
                        </div>
                        {edu.gpa && <div className="item-gpa">GPA: {edu.gpa}</div>}
                      </div>
                    ))}
                  </div>
                )
              }

              // Experience Section
              if (sectionKey === 'experience' && resumeData.experience.length > 0) {
                return (
                  <div key="experience" className="resume-section">
                    <h2 className="section-title">Experience</h2>
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx} className="experience-item">
                        <div className="experience-header">
                          <span className="item-title">{exp.title}</span>
                          <span className="item-date">{exp.startDate} - {exp.endDate || 'Present'}</span>
                        </div>
                        <div className="item-company-location">
                          <span className="item-company">{exp.company}</span>
                          {exp.location && <span className="item-location">{exp.location}</span>}
                        </div>
                        {exp.description && (
                          <ul className="item-description-list">
                            {exp.description.split('\n').filter(line => line.trim()).map((line, lineIdx) => (
                              <li key={lineIdx}>{line.trim().replace(/^[-•]\s*/, '')}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )
              }

              // Projects Section
              if (sectionKey === 'projects' && resumeData.projects.length > 0) {
                return (
                  <div key="projects" className="resume-section">
                    <h2 className="section-title">Projects</h2>
                    {resumeData.projects.map((project, idx) => (
                      <div key={idx} className="project-item">
                        <div className="project-header">
                          <span>
                            <span className="item-title">{project.name}</span>
                            {project.technologies && project.technologies.length > 0 && (
                              <span className="project-tech-inline"> | {project.technologies.join(', ')}</span>
                            )}
                          </span>
                          {project.startDate && (
                            <span className="item-date">{project.startDate} - {project.endDate || 'Present'}</span>
                          )}
                        </div>
                        {project.description && (
                          <ul className="item-description-list">
                            {project.description.split('\n').filter(line => line.trim()).map((line, lineIdx) => (
                              <li key={lineIdx}>{line.trim().replace(/^[-•]\s*/, '')}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )
              }

              // Technical Skills Section
              if (sectionKey === 'skills' && resumeData.skills.length > 0) {
                // Handle both old format (array of strings) and new format (array of objects)
                const skillsToDisplay = Array.isArray(resumeData.skills) && resumeData.skills.length > 0 && typeof resumeData.skills[0] === 'string'
                  ? [{ category: 'Languages', items: resumeData.skills }]
                  : resumeData.skills

                return (
                  <div key="skills" className="resume-section">
                    <h2 className="section-title">Technical Skills</h2>
                    {skillsToDisplay.map((skillCategory, idx) => (
                      <div key={idx} className="skills-category">
                        <span className="skills-label">{skillCategory.category}:</span> {skillCategory.items.join(', ')}
                      </div>
                    ))}
                  </div>
                )
              }

              // Certifications Section
              if (sectionKey === 'certifications' && resumeData.certifications.length > 0) {
                return (
                  <div key="certifications" className="resume-section">
                    <h2 className="section-title">Certifications</h2>
                    {resumeData.certifications.map((cert, idx) => (
                      <div key={idx} className="certification-item">
                        <div className="certification-header">
                          <span className="item-title">{cert.name}</span>
                          {cert.date && <span className="item-date">{cert.date}</span>}
                        </div>
                        {cert.issuer && <div className="item-company">{cert.issuer}</div>}
                      </div>
                    ))}
                  </div>
                )
              }

              return null
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumePreview
