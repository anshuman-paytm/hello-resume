function PersonalInfoForm({ data, updateData }) {
  const handleChange = (field, value) => {
    updateData({
      ...data,
      [field]: value
    })
  }

  return (
    <div className="form-section-content">
      <h3>Personal Information</h3>
      <div className="form-group">
        <label>Full Name *</label>
        <input
          type="text"
          value={data.fullName || ''}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="John Doe"
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={data.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john.doe@email.com"
        />
      </div>
      <div className="form-group">
        <label>Phone</label>
        <input
          type="tel"
          value={data.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
      </div>
      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          value={data.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="City, Country"
        />
      </div>
      <div className="form-group">
        <label>LinkedIn</label>
        <input
          type="url"
          value={data.linkedin || ''}
          onChange={(e) => handleChange('linkedin', e.target.value)}
          placeholder="linkedin.com/in/yourprofile"
        />
      </div>
      <div className="form-group">
        <label>GitHub</label>
        <input
          type="url"
          value={data.github || ''}
          onChange={(e) => handleChange('github', e.target.value)}
          placeholder="github.com/yourusername"
        />
      </div>
      <div className="form-group">
        <label>Website/Portfolio</label>
        <input
          type="url"
          value={data.website || ''}
          onChange={(e) => handleChange('website', e.target.value)}
          placeholder="yourwebsite.com"
        />
      </div>
    </div>
  )
}

export default PersonalInfoForm
