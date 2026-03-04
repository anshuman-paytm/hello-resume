import { useState } from 'react'
import PersonalInfoForm from './forms/PersonalInfoForm'
import SummaryForm from './forms/SummaryForm'
import ExperienceForm from './forms/ExperienceForm'
import EducationForm from './forms/EducationForm'
import SkillsForm from './forms/SkillsForm'
import ProjectsForm from './forms/ProjectsForm'
import CertificationsForm from './forms/CertificationsForm'
import { FiUser, FiBriefcase, FiBook, FiCode, FiAward, FiFileText } from 'react-icons/fi'

function ResumeForm({ resumeData, updateResumeData, sectionOrder, setSectionOrder, getSectionOrderArray }) {
  const [activeSection, setActiveSection] = useState('personal')

  // Fixed sections (not reorderable)
  const fixedSections = [
    { id: 'personal', label: 'Personal Info', icon: FiUser },
    { id: 'summary', label: 'Summary', icon: FiFileText }
  ]

  // Reorderable sections mapping
  const reorderableSectionMap = {
    experience: { id: 'experience', label: 'Experience', icon: FiBriefcase },
    education: { id: 'education', label: 'Education', icon: FiBook },
    skills: { id: 'skills', label: 'Skills', icon: FiCode },
    projects: { id: 'projects', label: 'Projects', icon: FiCode },
    certifications: { id: 'certifications', label: 'Certifications', icon: FiAward }
  }

  // Get all reorderable sections
  const reorderableSections = Object.keys(reorderableSectionMap)

  const handleOrderChange = (sectionKey, newOrder) => {
    const numValue = Math.max(1, Math.min(parseInt(newOrder) || 1, reorderableSections.length))
    const newSectionOrder = { ...sectionOrder }
    
    // Check if another section already has this number
    const existingSection = Object.keys(newSectionOrder).find(
      key => key !== sectionKey && newSectionOrder[key] === numValue
    )
    
    if (existingSection) {
      // Swap the numbers
      newSectionOrder[existingSection] = sectionOrder[sectionKey]
    }
    
    newSectionOrder[sectionKey] = numValue
    setSectionOrder(newSectionOrder)
  }

  return (
    <div className="resume-form">
      <div className="form-nav">
        {/* Fixed sections (not draggable) */}
        {fixedSections.map(section => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              className={`nav-btn ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <Icon />
              <span>{section.label}</span>
            </button>
          )
        })}
        
        {/* Reorderable sections with numbers */}
        {reorderableSections
          .sort((a, b) => sectionOrder[a] - sectionOrder[b])
          .map((sectionKey) => {
            const section = reorderableSectionMap[sectionKey]
            const Icon = section.icon
            const currentOrder = sectionOrder[sectionKey] || 1
            
            return (
              <div key={sectionKey} className="reorderable-nav-item">
                <input
                  type="number"
                  min="1"
                  max={reorderableSections.length}
                  value={currentOrder}
                  onChange={(e) => handleOrderChange(sectionKey, e.target.value)}
                  className="section-order-input"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  className={`nav-btn reorderable-nav-btn ${activeSection === sectionKey ? 'active' : ''}`}
                  onClick={() => setActiveSection(sectionKey)}
                >
                  <Icon />
                  <span>{section.label}</span>
                </button>
              </div>
            )
          })}
      </div>

      <div className="form-content">
        {activeSection === 'personal' && (
          <PersonalInfoForm
            data={resumeData.personalInfo}
            updateData={(data) => updateResumeData('personalInfo', data)}
          />
        )}
        {activeSection === 'summary' && (
          <SummaryForm
            data={resumeData.summary}
            updateData={(data) => updateResumeData('summary', data)}
          />
        )}
        {activeSection === 'experience' && (
          <ExperienceForm
            data={resumeData.experience}
            updateData={(data) => updateResumeData('experience', data)}
          />
        )}
        {activeSection === 'education' && (
          <EducationForm
            data={resumeData.education}
            updateData={(data) => updateResumeData('education', data)}
          />
        )}
        {activeSection === 'skills' && (
          <SkillsForm
            data={resumeData.skills}
            updateData={(data) => updateResumeData('skills', data)}
          />
        )}
        {activeSection === 'projects' && (
          <ProjectsForm
            data={resumeData.projects}
            updateData={(data) => updateResumeData('projects', data)}
          />
        )}
        {activeSection === 'certifications' && (
          <CertificationsForm
            data={resumeData.certifications}
            updateData={(data) => updateResumeData('certifications', data)}
          />
        )}
      </div>
    </div>
  )
}

export default ResumeForm
