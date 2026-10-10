import React, { useState, useEffect, useRef } from 'react';
import { defaultResumeData, ACCENT_COLORS } from './data/defaultData';
import { downloadCvPdf, printCv } from './utils/exportPdf';
import './App.css';

export default function App() {
  // Persistence with localStorage (versioned to ensure new template loads automatically)
  const [resumeData, setResumeData] = useState(() => {
    try {
      const templateVersion = localStorage.getItem('cv_builder_template_version');
      if (templateVersion === 'v2_sebastian') {
        const saved = localStorage.getItem('cv_builder_resume_data');
        if (saved) return JSON.parse(saved);
      } else {
        localStorage.setItem('cv_builder_template_version', 'v2_sebastian');
        localStorage.setItem('cv_builder_resume_data', JSON.stringify(defaultResumeData));
        return defaultResumeData;
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
    return defaultResumeData;
  });

  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('cv_builder_accent_color') || '#4e5159';
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cv_builder_resume_data', JSON.stringify(resumeData));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [resumeData]);

  useEffect(() => {
    localStorage.setItem('cv_builder_accent_color', accentColor);
    document.documentElement.style.setProperty('--color-primary', accentColor);
  }, [accentColor]);

  // Toast Helper
  const showToast = (msg, duration = 3000) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

  // Field change helpers
  const handleFieldChange = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Photo upload handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, or WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      handleFieldChange('photo', event.target?.result);
      showToast('Profile photo updated successfully!');
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    handleFieldChange('photo', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Profile photo removed.');
  };

  // Job item handlers
  const handleJobChange = (index, field, value) => {
    setResumeData((prev) => {
      const updatedJobs = [...prev.jobs];
      if (field === 'pointsText') {
        const lines = value.split('\n');
        updatedJobs[index] = {
          ...updatedJobs[index],
          points: lines
        };
      } else {
        updatedJobs[index] = {
          ...updatedJobs[index],
          [field]: value
        };
      }
      return { ...prev, jobs: updatedJobs };
    });
  };

  const addJob = () => {
    setResumeData((prev) => ({
      ...prev,
      jobs: [
        ...prev.jobs,
        {
          id: `job-${Date.now()}`,
          title: 'Senior Accountant',
          company: 'Salford & Co.',
          place: '',
          dates: '2030 - 2033',
          points: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
          ]
        }
      ]
    }));
    showToast('New position added!');
  };

  const removeJob = (index) => {
    if (resumeData.jobs.length <= 1) {
      alert('Please keep at least one work experience item.');
      return;
    }
    setResumeData((prev) => ({
      ...prev,
      jobs: prev.jobs.filter((_, i) => i !== index)
    }));
    showToast('Position removed.');
  };

  // Education item handlers
  const handleEduChange = (index, field, value) => {
    setResumeData((prev) => {
      const updatedEdu = [...prev.education];
      updatedEdu[index] = {
        ...updatedEdu[index],
        [field]: value
      };
      return { ...prev, education: updatedEdu };
    });
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu-${Date.now()}`,
          degree: 'Senior Accountant',
          school: 'Borcelle University',
          year: '2025-2026',
          note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
      ]
    }));
    showToast('New education entry added!');
  };

  const removeEducation = (index) => {
    if (resumeData.education.length <= 1) {
      alert('Please keep at least one education entry.');
      return;
    }
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
    showToast('Education entry removed.');
  };

  // Skill group handlers
  const handleSkillChange = (index, field, value) => {
    setResumeData((prev) => {
      const updatedSkills = [...prev.skillGroups];
      updatedSkills[index] = {
        ...updatedSkills[index],
        [field]: value
      };
      return { ...prev, skillGroups: updatedSkills };
    });
  };

  const addSkillGroup = () => {
    setResumeData((prev) => ({
      ...prev,
      skillGroups: [
        ...prev.skillGroups,
        {
          id: `skill-${Date.now()}`,
          name: 'Additional Skills',
          skills: 'Tax Advisory, Budgeting, Risk Analysis'
        }
      ]
    }));
    showToast('New skill category added!');
  };

  const removeSkillGroup = (index) => {
    if (resumeData.skillGroups.length <= 1) {
      alert('Please keep at least one skill entry.');
      return;
    }
    setResumeData((prev) => ({
      ...prev,
      skillGroups: prev.skillGroups.filter((_, i) => i !== index)
    }));
    showToast('Skill entry removed.');
  };

  // Helper to extract all skills for the 3-column bulleted grid
  const getAllSkills = () => {
    if (!Array.isArray(resumeData.skillGroups)) return [];
    const list = [];
    resumeData.skillGroups.forEach((group) => {
      if (group && group.skills) {
        const parts = group.skills
          .split(/[,\n]/)
          .map((s) => s.trim().replace(/^[•\-*]\s*/, ''))
          .filter(Boolean);
        list.push(...parts);
      }
    });
    return list.length > 0
      ? list
      : ['Auditing', 'Financial Accounting', 'Financial Reporting', 'Auditing', 'Financial Accounting'];
  };

  // PDF Export
  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    setIsDownloading(true);
    showToast('Generating high-resolution PDF...');

    const candidateName = `${resumeData.first || 'Candidate'}_${resumeData.last || 'Resume'}`;
    const filename = `${candidateName.replace(/\s+/g, '_')}_CV.pdf`;

    try {
      await downloadCvPdf(previewRef.current, filename);
      showToast('PDF downloaded successfully! 🎉');
    } catch (err) {
      console.error(err);
      showToast('Export failed. Opening print dialog as fallback.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Reset & Sample data
  const loadSampleData = () => {
    setResumeData(defaultResumeData);
    setAccentColor('#4e5159');
    showToast('Loaded Sebastian Bennett template sample! 📄');
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all fields and start fresh?')) {
      setResumeData({
        jobTitle: '',
        first: '',
        last: '',
        email: '',
        phone: '',
        address: '',
        photo: '',
        bio: '',
        education: [
          {
            id: 'edu-1',
            degree: '',
            school: '',
            year: '',
            note: ''
          }
        ],
        jobs: [
          {
            id: 'job-1',
            title: '',
            company: '',
            place: '',
            dates: '',
            points: ['']
          }
        ],
        skillGroups: [
          {
            id: 'skill-1',
            name: 'Skills',
            skills: ''
          }
        ]
      });
      setCurrentStep(0);
      showToast('Form cleared.');
    }
  };

  // Step information: Ordered matching the document visual hierarchy
  const steps = [
    { label: 'Your Details', head: 'Personal Details', sub: 'How do employers and clients reach you?' },
    { label: 'About Me', head: 'About Me', sub: 'Summarize your background and professional ethos.' },
    { label: 'Education', head: 'Your Education', sub: 'Add your universities, degrees, and academic achievements.' },
    { label: 'Experience', head: 'Work Experience', sub: 'List your past roles, responsibilities, and achievements.' },
    { label: 'Skills', head: 'Your Skills', sub: 'Highlight your core competencies and domain expertise.' }
  ];

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="app-wrapper">
      <div className="app-container">
        {/* =================================================================
            HEADER
           ================================================================= */}
        <header className="app-header">
          <div className="brand-area">
            <div className="brand-logo-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
            </div>
            <span className="brand-title">CV Builder</span>
          </div>

          <div className="header-actions">
            {/* Color Palette Picker */}
            <div className="color-picker-dropdown" title="Choose Accent Color">
              <span className="color-picker-label">Accent:</span>
              <div className="color-swatch-list">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    className={`color-swatch-dot ${accentColor === c.hex ? 'active' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    onClick={() => setAccentColor(c.hex)}
                    title={c.name}
                    aria-label={`Select ${c.name} accent`}
                  />
                ))}
              </div>
            </div>

            {/* Load Sample Data */}
            <button
              type="button"
              className="header-btn"
              onClick={loadSampleData}
              title="Load Sebastian Bennett sample data"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Sample Data
            </button>

            {/* Clear Form */}
            <button
              type="button"
              className="header-btn"
              onClick={clearAllData}
              title="Clear all fields"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-2 14H7L5 6m5 0V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
              </svg>
              Clear
            </button>

            {/* Print */}
            <button
              type="button"
              className="header-btn"
              onClick={printCv}
              title="Print directly or save via browser"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print
            </button>

            {/* Download PDF Button */}
            <button
              type="button"
              className="header-btn accent-pdf-btn"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              title="Export high-resolution PDF document"
            >
              {isDownloading ? (
                <>
                  <div className="spinner" />
                  Generating...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </div>
        </header>

        {/* =================================================================
            CHEVRON STEP BAR
           ================================================================= */}
        <nav className="app-nav" aria-label="Progress steps">
          <div className="steps-container">
            {steps.map((s, idx) => {
              const isDone = idx < currentStep;
              const isActive = idx === currentStep;
              return (
                <button
                  key={s.label}
                  type="button"
                  className={`step-btn ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
                  onClick={() => setCurrentStep(idx)}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isDone && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {s.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* =================================================================
            MAIN CONTENT: FORM & PREVIEW
           ================================================================= */}
        <div className="main-content">
          {/* LEFT: FORM WIZARD */}
          <section className="form-section">
            <div className="step-header">
              <h1 className="step-title">{steps[currentStep].head}</h1>
              <p className="step-subtitle">{steps[currentStep].sub}</p>
            </div>

            {/* STEP 0: YOUR DETAILS */}
            {currentStep === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* Photo uploader */}
                <div className="photo-upload-wrapper">
                  <div className="photo-preview-circle">
                    <div className="photo-circle-inner" role="img" aria-label="Candidate photo">
                      {resumeData.photo ? (
                        <img src={resumeData.photo} alt="Profile" className="uploaded-avatar-img" />
                      ) : (
                        <svg width="120" height="130" viewBox="0 0 120 130" aria-hidden="true">
                          <circle cx="60" cy="48" r="26" fill="#cfc6c2" />
                          <path d="M8 130c0-34 24-52 52-52s52 18 52 52z" fill="#cfc6c2" />
                        </svg>
                      )}
                    </div>
                    <button
                      type="button"
                      className="photo-add-btn"
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload photo"
                      aria-label="Upload photo"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handlePhotoUpload}
                    />
                  </div>

                  <div className="photo-action-buttons">
                    <button
                      type="button"
                      className="photo-action-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {resumeData.photo ? 'Change Photo' : 'Upload Photo (Optional)'}
                    </button>
                    {resumeData.photo && (
                      <button
                        type="button"
                        className="photo-action-btn photo-remove-btn"
                        onClick={removePhoto}
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="jobTitle">Professional Title</label>
                  <input
                    id="jobTitle"
                    className="field-input"
                    type="text"
                    value={resumeData.jobTitle}
                    placeholder="e.g. Professional Accountant"
                    onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                  />
                </div>

                <div className="grid-2-col">
                  <div className="field-group">
                    <label className="field-label" htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      className="field-input"
                      type="text"
                      value={resumeData.first}
                      placeholder="e.g. Sebastian"
                      onChange={(e) => handleFieldChange('first', e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      className="field-input"
                      type="text"
                      value={resumeData.last}
                      placeholder="e.g. Bennett"
                      onChange={(e) => handleFieldChange('last', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid-2-col">
                  <div className="field-group">
                    <label className="field-label" htmlFor="emailAddress">Email Address</label>
                    <input
                      id="emailAddress"
                      className="field-input"
                      type="email"
                      value={resumeData.email}
                      placeholder="e.g. hello@reallygreatsite.com"
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="phoneNumber">Phone Number</label>
                    <input
                      id="phoneNumber"
                      className="field-input"
                      type="tel"
                      value={resumeData.phone}
                      placeholder="e.g. +123-456-7890"
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="homeAddress">Address / Location</label>
                  <input
                    id="homeAddress"
                    className="field-input"
                    type="text"
                    value={resumeData.address}
                    placeholder="e.g. 123 Anywhere St., Any City"
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* STEP 1: ABOUT ME */}
            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="field-group">
                  <label className="field-label" htmlFor="bioTextarea">About Me / Summary</label>
                  <textarea
                    id="bioTextarea"
                    className="field-textarea"
                    rows="7"
                    value={resumeData.bio}
                    placeholder="Describe your career goals, background, and professional ethos..."
                    onChange={(e) => handleFieldChange('bio', e.target.value)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#7a7280', marginTop: '6px' }}>
                    <span>{resumeData.bio.length} characters</span>
                    <span>Clear, concise summary of 2-4 sentences works best.</span>
                  </div>
                </div>

                {/* Quick inspiration prompts */}
                <div style={{ background: '#f5f3f7', padding: '16px 20px', borderRadius: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#4a4350', marginBottom: '8px' }}>
                    💡 Quick Inspiration Prompts (Click to use):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <button
                      type="button"
                      style={{ fontSize: '13px', background: '#fff', border: '1px solid #dcd7e0', padding: '6px 12px', borderRadius: '14px', cursor: 'pointer' }}
                      onClick={() => handleFieldChange('bio', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.')}
                    >
                      Template Default
                    </button>
                    <button
                      type="button"
                      style={{ fontSize: '13px', background: '#fff', border: '1px solid #dcd7e0', padding: '6px 12px', borderRadius: '14px', cursor: 'pointer' }}
                      onClick={() => handleFieldChange('bio', 'Certified Professional Accountant with 8+ years of expertise in corporate tax strategy, risk mitigation, and end-to-end financial reporting. Dedicated to precision, transparency, and data-backed financial decision making.')}
                    >
                      Professional Accountant
                    </button>
                    <button
                      type="button"
                      style={{ fontSize: '13px', background: '#fff', border: '1px solid #dcd7e0', padding: '6px 12px', borderRadius: '14px', cursor: 'pointer' }}
                      onClick={() => handleFieldChange('bio', 'Senior Product Designer specialized in intuitive user experiences and design systems. Track record of improving user retention across web and mobile ecosystems.')}
                    >
                      Product Designer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: EDUCATION (Ordered before Work Experience to match visual layout) */}
            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {resumeData.education.map((edu, idx) => (
                  <div key={edu.id || idx} className="dynamic-card">
                    <div className="card-header-bar">
                      <span className="card-title-badge">{`Education #${idx + 1}`}</span>
                      {resumeData.education.length > 1 && (
                        <button
                          type="button"
                          className="card-delete-btn"
                          onClick={() => removeEducation(idx)}
                          title="Delete education entry"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-2 14H7L5 6m5 0V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
                          </svg>
                          Delete
                        </button>
                      )}
                    </div>

                    <div className="grid-2-col">
                      <div className="field-group">
                        <label className="field-label">School / University</label>
                        <input
                          className="field-input"
                          type="text"
                          value={edu.school}
                          placeholder="e.g. Borcelle University"
                          onChange={(e) => handleEduChange(idx, 'school', e.target.value)}
                        />
                      </div>
                      <div className="field-group">
                        <label className="field-label">Years / Graduation Period</label>
                        <input
                          className="field-input"
                          type="text"
                          value={edu.year}
                          placeholder="e.g. 2026-2030"
                          onChange={(e) => handleEduChange(idx, 'year', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label className="field-label">Degree / Qualification</label>
                      <input
                        className="field-input"
                        type="text"
                        value={edu.degree}
                        placeholder="e.g. Senior Accountant or B.S. Accounting"
                        onChange={(e) => handleEduChange(idx, 'degree', e.target.value)}
                      />
                    </div>

                    <div className="field-group">
                      <label className="field-label">Description / Academic Summary</label>
                      <textarea
                        className="field-textarea"
                        rows="3"
                        value={edu.note}
                        placeholder="Describe your focus or achievements..."
                        onChange={(e) => handleEduChange(idx, 'note', e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <button type="button" className="add-entry-btn" onClick={addEducation}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  + Add Another Education Entry
                </button>
              </div>
            )}

            {/* STEP 3: WORK EXPERIENCE */}
            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {resumeData.jobs.map((job, idx) => (
                  <div key={job.id || idx} className="dynamic-card">
                    <div className="card-header-bar">
                      <span className="card-title-badge">
                        {idx === 0 ? 'Current or Latest Position' : `Position #${idx + 1}`}
                      </span>
                      {resumeData.jobs.length > 1 && (
                        <button
                          type="button"
                          className="card-delete-btn"
                          onClick={() => removeJob(idx)}
                          title="Delete position"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-2 14H7L5 6m5 0V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
                          </svg>
                          Delete
                        </button>
                      )}
                    </div>

                    <div className="grid-2-col">
                      <div className="field-group">
                        <label className="field-label">Company / Firm</label>
                        <input
                          className="field-input"
                          type="text"
                          value={job.company}
                          placeholder="e.g. Salford & Co."
                          onChange={(e) => handleJobChange(idx, 'company', e.target.value)}
                        />
                      </div>
                      <div className="field-group">
                        <label className="field-label">Employment Dates</label>
                        <input
                          className="field-input"
                          type="text"
                          value={job.dates}
                          placeholder="e.g. 2033 - 2035"
                          onChange={(e) => handleJobChange(idx, 'dates', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="field-group">
                      <label className="field-label">Job Title</label>
                      <input
                        className="field-input"
                        type="text"
                        value={job.title}
                        placeholder="e.g. Senior Accountant"
                        onChange={(e) => handleJobChange(idx, 'title', e.target.value)}
                      />
                    </div>

                    <div className="field-group">
                      <label className="field-label">Achievements & Key Duties (one per line or paragraph)</label>
                      <textarea
                        className="field-textarea"
                        rows="4"
                        value={Array.isArray(job.points) ? job.points.join('\n') : ''}
                        placeholder="Describe your role responsibilities and results..."
                        onChange={(e) => handleJobChange(idx, 'pointsText', e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <button type="button" className="add-entry-btn" onClick={addJob}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  + Add Another Position
                </button>
              </div>
            )}

            {/* STEP 4: SKILLS */}
            {currentStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {resumeData.skillGroups.map((group, idx) => (
                  <div key={group.id || idx} className="dynamic-card">
                    <div className="card-header-bar">
                      <span className="card-title-badge">{group.name || `Skill Group #${idx + 1}`}</span>
                      {resumeData.skillGroups.length > 1 && (
                        <button
                          type="button"
                          className="card-delete-btn"
                          onClick={() => removeSkillGroup(idx)}
                          title="Delete skill category"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-2 14H7L5 6m5 0V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
                          </svg>
                          Delete
                        </button>
                      )}
                    </div>

                    <div className="field-group">
                      <label className="field-label">Category Name</label>
                      <input
                        className="field-input"
                        type="text"
                        value={group.name}
                        placeholder="e.g. Accounting, Auditing, Tools"
                        onChange={(e) => handleSkillChange(idx, 'name', e.target.value)}
                      />
                    </div>

                    <div className="field-group">
                      <label className="field-label">Skills (comma separated, displayed in 3 columns)</label>
                      <input
                        className="field-input"
                        type="text"
                        value={group.skills}
                        placeholder="e.g. Auditing, Financial Accounting, Financial Reporting"
                        onChange={(e) => handleSkillChange(idx, 'skills', e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <button type="button" className="add-entry-btn" onClick={addSkillGroup}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  + Add Skill Category
                </button>

                <div style={{ marginTop: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px 20px', borderRadius: '16px', color: '#065f46', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span style={{ fontSize: '15px', fontWeight: '500' }}>
                    Your CV is complete! Check the live preview on the right or click below to export as PDF.
                  </span>
                </div>
              </div>
            )}

            {/* WIZARD ACTIONS */}
            <div className="form-footer">
              <button
                type="button"
                className="btn-nav btn-nav-back"
                style={{ visibility: currentStep === 0 ? 'hidden' : 'visible' }}
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              >
                Back
              </button>

              <button
                type="button"
                className="btn-nav btn-nav-next"
                onClick={() => {
                  if (isLastStep) {
                    handleDownloadPdf();
                  } else {
                    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
                  }
                }}
              >
                {isLastStep ? 'Finish & Download PDF' : 'Save & Next'}
                {!isLastStep && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
              </button>
            </div>
          </section>

          {/* =================================================================
              RIGHT: LIVE CANVAS PREVIEW (MATCHING SEBASTIAN BENNETT TEMPLATE)
             ================================================================= */}
          <aside className="canvas-aside" aria-label="Real-time CV preview">
            <article
              id="cv-paper-preview"
              ref={previewRef}
              className="cv-preview-paper"
            >
              <div className="paper-body">
                {/* CENTERED HEADER */}
                <header className="paper-header-centered">
                  {resumeData.photo && (
                    <div className="paper-avatar-wrapper">
                      <img src={resumeData.photo} alt="Avatar" className="paper-avatar-img" />
                    </div>
                  )}

                  <h1 className="paper-name">
                    {resumeData.first || resumeData.last
                      ? `${resumeData.first || ''} ${resumeData.last || ''}`.trim()
                      : 'SEBASTIAN BENNETT'}
                  </h1>

                  <div className="paper-title">
                    {resumeData.jobTitle || 'Professional Accountant'}
                  </div>

                  {/* CONTACT INFO ROW WITH ICONS */}
                  <div className="paper-contact-row">
                    {(resumeData.phone || (!resumeData.phone && !resumeData.email && !resumeData.address)) && (
                      <div className="paper-contact-item">
                        <svg className="paper-contact-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <a href={`tel:${resumeData.phone || '+123-456-7890'}`} className="paper-contact-link">
                          {resumeData.phone || '+123-456-7890'}
                        </a>
                      </div>
                    )}

                    {(resumeData.email || (!resumeData.phone && !resumeData.email && !resumeData.address)) && (
                      <div className="paper-contact-item">
                        <svg className="paper-contact-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        <a href={`mailto:${resumeData.email || 'hello@reallygreatsite.com'}`} className="paper-contact-link">
                          {resumeData.email || 'hello@reallygreatsite.com'}
                        </a>
                      </div>
                    )}

                    {(resumeData.address || (!resumeData.phone && !resumeData.email && !resumeData.address)) && (
                      <div className="paper-contact-item">
                        <svg className="paper-contact-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{resumeData.address || '123 Anywhere St., Any City'}</span>
                      </div>
                    )}
                  </div>

                  <div className="paper-divider" />
                </header>

                {/* ABOUT ME SECTION */}
                {(resumeData.bio || currentStep === 1) && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">ABOUT ME</h2>
                    <p className="paper-bio-text">
                      {resumeData.bio || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
                    </p>
                    <div className="paper-divider" />
                  </section>
                )}

                {/* EDUCATION SECTION */}
                {resumeData.education && resumeData.education.length > 0 && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">EDUCATION</h2>
                    <div className="paper-items-stack">
                      {resumeData.education.map((edu, idx) => (
                        <div key={edu.id || idx} className="paper-item-block">
                          <div className="paper-item-meta">
                            {edu.school || 'Borcelle University'}{edu.school && edu.year ? ' | ' : ''}{edu.year || ''}
                          </div>
                          <div className="paper-item-title">
                            {edu.degree || 'Degree / Major'}
                          </div>
                          {edu.note && (
                            <p className="paper-item-desc">{edu.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="paper-divider" />
                  </section>
                )}

                {/* WORK EXPERIENCE SECTION */}
                {resumeData.jobs && resumeData.jobs.length > 0 && (
                  <section className="paper-section">
                    <h2 className="paper-section-heading">WORK EXPERIENCE</h2>
                    <div className="paper-items-stack">
                      {resumeData.jobs.map((job, idx) => (
                        <div key={job.id || idx} className="paper-item-block">
                          <div className="paper-item-meta">
                            {job.company || 'Salford & Co.'}{job.company && job.dates ? ' | ' : ''}{job.dates || ''}
                          </div>
                          <div className="paper-item-title">
                            {job.title || 'Senior Accountant'}
                          </div>
                          {Array.isArray(job.points) && job.points.length > 0 && (
                            <div className="paper-item-desc-stack">
                              {job.points.filter(Boolean).map((pt, pIdx) => (
                                <p key={pIdx} className="paper-item-desc">
                                  {pt.replace(/^[•\-*]\s*/, '')}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="paper-divider" />
                  </section>
                )}

                {/* SKILLS SECTION */}
                <section className="paper-section paper-skills-section">
                  <h2 className="paper-section-heading">SKILLS</h2>
                  <div className="paper-skills-grid">
                    {getAllSkills().map((skill, sIdx) => (
                      <div key={sIdx} className="paper-skill-item">
                        <span className="paper-skill-bullet">•</span>
                        <span className="paper-skill-name">{skill}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* SOLID BOTTOM ACCENT BAR */}
              <div className="paper-bottom-bar" />
            </article>
          </aside>
        </div>
      </div>

      {/* Floating Toast notification */}
      {toastMessage && (
        <div className="toast-notification" role="status">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
