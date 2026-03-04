import { useState, useEffect } from 'react'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import './App.css'

// Default values for initial state
const defaultSectionOrder = {
  education: 1,
  experience: 2,
  projects: 3,
  skills: 4,
  certifications: 5
}

const defaultResumeData = {
  personalInfo: {
    fullName: 'Jake Ryan',
    email: 'jake@su.edu',
    phone: '123-456-7890',
    location: '',
    linkedin: 'linkedin.com/in/jake',
    github: 'github.com/jake',
    website: ''
  },
  summary: '',
  experience: [
    {
      title: 'Undergraduate Research Assistant',
      company: 'Texas A&M University',
      location: 'College Station, TX',
      startDate: 'June 2020',
      endDate: 'Present',
      description: '• Developed a REST API using FastAPI and PostgreSQL to store data from learning management systems\n• Developed a full-stack web application using Flask, React, PostgreSQL and Docker to analyze GitHub data\n• Explored ways to visualize GitHub collaboration in a classroom setting'
    },
    {
      title: 'Information Technology Support Specialist',
      company: 'Southwestern University',
      location: 'Georgetown, TX',
      startDate: 'Sep. 2018',
      endDate: 'Present',
      description: '• Communicate with managers to set up campus computers used on campus\n• Assess and troubleshoot computer problems brought by students, faculty and staff\n• Maintain upkeep of computers, classroom equipment, and 200 printers across campus'
    }
  ],
  education: [
    {
      degree: 'Bachelor of Arts in Computer Science',
      school: 'Southwestern University',
      location: 'Georgetown, TX',
      minor: 'Business',
      startDate: 'Aug. 2018',
      endDate: 'May 2021',
      gpa: ''
    }
  ],
  skills: [
    {
      category: 'Languages',
      items: ['Java', 'Python', 'C/C++', 'SQL (Postgres)', 'JavaScript', 'HTML/CSS', 'R']
    },
    {
      category: 'Frameworks',
      items: ['React', 'Node.js', 'Flask', 'JUnit', 'WordPress', 'Material-UI', 'FastAPI']
    },
    {
      category: 'Developer Tools',
      items: ['Git', 'Docker', 'TravisCI', 'Google Cloud Platform', 'VS Code', 'Visual Studio', 'PyCharm', 'IntelliJ', 'Eclipse']
    },
    {
      category: 'Libraries',
      items: ['pandas', 'NumPy', 'Matplotlib']
    }
  ],
  projects: [
    {
      name: 'Gitlytics',
      description: '• Developed a full-stack web application using with Flask serving a REST API with React as the frontend\n• Implemented GitHub OAuth to get data from user\'s repositories\n• Visualized GitHub data to show collaboration\n• Used Celery and Redis for asynchronous tasks',
      url: '',
      technologies: ['Python', 'Flask', 'React', 'PostgreSQL', 'Docker'],
      startDate: 'June 2020',
      endDate: 'Present'
    },
    {
      name: 'Simple Paintball',
      description: '• Developed a Minecraft server plugin to entertain kids during free time for a previous job\n• Published plugin to websites gaining 2K+ downloads and an average 4.5/5-star review\n• Implemented continuous delivery using TravisCI to build the plugin upon new a release\n• Collaborated with Minecraft server administrators to suggest features and get feedback about the plugin',
      url: '',
      technologies: ['Spigot API', 'Java', 'Maven', 'TravisCI', 'Git'],
      startDate: 'May 2018',
      endDate: 'May 2020'
    }
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '03/2022',
      url: 'https://aws.amazon.com/certification'
    },
    {
      name: 'React Developer Certification',
      issuer: 'Meta',
      date: '11/2021',
      url: 'https://www.coursera.org'
    }
  ]
}

// LocalStorage keys
const STORAGE_KEYS = {
  RESUME_DATA: 'resumeBuilder_resumeData',
  SECTION_ORDER: 'resumeBuilder_sectionOrder'
}

// Load data from localStorage
const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key)
    if (item) {
      return JSON.parse(item)
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
  }
  return defaultValue
}

// Save data to localStorage
const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

function App() {
  // Initialize state from localStorage or use defaults
  const [sectionOrder, setSectionOrder] = useState(() => 
    loadFromLocalStorage(STORAGE_KEYS.SECTION_ORDER, defaultSectionOrder)
  )

  const [resumeData, setResumeData] = useState(() => 
    loadFromLocalStorage(STORAGE_KEYS.RESUME_DATA, defaultResumeData)
  )

  // Save sectionOrder to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.SECTION_ORDER, sectionOrder)
  }, [sectionOrder])

  // Save resumeData to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.RESUME_DATA, resumeData)
  }, [resumeData])

  // Convert order object to sorted array
  const getSectionOrderArray = () => {
    return Object.entries(sectionOrder)
      .sort(([, a], [, b]) => a - b)
      .map(([key]) => key)
  }

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📄 Resume Builder</h1>
        <p>Create your professional resume dynamically</p>
      </header>
      <div className="app-container">
        <div className="form-section">
          <ResumeForm 
            resumeData={resumeData} 
            updateResumeData={updateResumeData}
            sectionOrder={sectionOrder}
            setSectionOrder={setSectionOrder}
            getSectionOrderArray={getSectionOrderArray}
          />
        </div>
        <div className="preview-section">
          <ResumePreview 
            resumeData={resumeData} 
            sectionOrder={getSectionOrderArray()}
          />
        </div>
      </div>
    </div>
  )
}

export default App
