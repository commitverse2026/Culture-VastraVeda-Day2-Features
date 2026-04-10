import React, { useState } from 'react';
import './styles.css';

export default function CommunityPortal() {
  const [view, setView] = useState('form'); // 'form', 'admin'
  const [submissions, setSubmissions] = useState([]);
  
  // Form State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    language: '',
    fabric: '',
    embroidery: '',
    occasion: '',
    gender: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.region.trim()) newErrors.region = 'Region is required';
      if (!formData.language.trim()) newErrors.language = 'Language is required';
    } else if (step === 2) {
      if (!formData.fabric.trim()) newErrors.fabric = 'Fabric is required';
      if (!formData.embroidery.trim()) newErrors.embroidery = 'Embroidery is required';
    } else if (step === 3) {
      if (!formData.occasion.trim()) newErrors.occasion = 'Occasion is required';
      if (!formData.gender.trim()) newErrors.gender = 'Gender is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      const newSubmission = {
        ...formData,
        id: Date.now(),
        status: 'pending',
        date: new Date().toLocaleDateString()
      };
      setSubmissions(prev => [newSubmission, ...prev]);
      
      // Reset form
      setFormData({
        name: '', region: '', language: '', fabric: '', 
        embroidery: '', occasion: '', gender: ''
      });
      setStep(1);
      setView('admin'); // redirect to admin to see it (or stay in public)
    }
  };

  const updateStatus = (id, newStatus) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: newStatus } : sub
    ));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="cp-form-group">
              <label className="cp-label">Contributor Name</label>
              <input className="cp-input" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Ananya Patel" />
              {errors.name && <span className="cp-error">{errors.name}</span>}
            </div>
            <div className="cp-form-group">
              <label className="cp-label">Region / State</label>
              <input className="cp-input" name="region" value={formData.region} onChange={handleInputChange} placeholder="e.g. Gujarat" />
              {errors.region && <span className="cp-error">{errors.region}</span>}
            </div>
            <div className="cp-form-group">
              <label className="cp-label">Language / Dialect</label>
              <input className="cp-input" name="language" value={formData.language} onChange={handleInputChange} placeholder="e.g. Gujarati" />
              {errors.language && <span className="cp-error">{errors.language}</span>}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="cp-form-group">
              <label className="cp-label">Primary Fabric</label>
              <input className="cp-input" name="fabric" value={formData.fabric} onChange={handleInputChange} placeholder="e.g. Mashru Silk" />
              {errors.fabric && <span className="cp-error">{errors.fabric}</span>}
            </div>
            <div className="cp-form-group">
              <label className="cp-label">Embroidery Style</label>
              <input className="cp-input" name="embroidery" value={formData.embroidery} onChange={handleInputChange} placeholder="e.g. Kutch Work" />
              {errors.embroidery && <span className="cp-error">{errors.embroidery}</span>}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="cp-form-group">
              <label className="cp-label">Occasion</label>
              <select className="cp-select" name="occasion" value={formData.occasion} onChange={handleInputChange}>
                <option value="">Select Occasion</option>
                <option value="Wedding">Wedding</option>
                <option value="Festival">Festival</option>
                <option value="Daily Wear">Daily Wear</option>
                <option value="Ritual">Ritual</option>
              </select>
              {errors.occasion && <span className="cp-error">{errors.occasion}</span>}
            </div>
            <div className="cp-form-group">
              <label className="cp-label">Gender</label>
              <select className="cp-select" name="gender" value={formData.gender} onChange={handleInputChange}>
                <option value="">Select Gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
              {errors.gender && <span className="cp-error">{errors.gender}</span>}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="cp-container">
      <nav className="cp-nav">
        <button className={`cp-nav-btn ${view === 'form' ? 'active' : ''}`} onClick={() => setView('form')}>Submit Entry</button>
        <button className={`cp-nav-btn ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}>Admin Moderation</button>
      </nav>

      {view === 'form' && (
        <div className="cp-card">
          <h2 className="cp-card-title">Submit Clothing Data</h2>
          <div className="cp-step-indicator">
            <div className={`cp-dot ${step >= 1 ? 'active' : ''}`}></div>
            <div className={`cp-dot ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`cp-dot ${step >= 3 ? 'active' : ''}`}></div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {renderStep()}
            
            <div className="cp-btn-group">
              <button 
                type="button" 
                className="cp-btn" 
                onClick={prevStep} 
                disabled={step === 1}
              >
                Previous
              </button>
              
              {step < 3 ? (
                <button type="button" className="cp-btn cp-btn-primary" onClick={nextStep}>
                  Next Step
                </button>
              ) : (
                <button type="submit" className="cp-btn cp-btn-primary">
                  Submit Entry
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {view === 'admin' && (
        <div>
          <h2 className="cp-card-title">Moderation Queue</h2>
          {submissions.length === 0 ? (
            <div className="cp-empty-state">No submissions yet.</div>
          ) : (
            <div className="cp-list">
              {submissions.map(sub => (
                <div key={sub.id} className="cp-list-item">
                  <div className="cp-item-details">
                    <h3>{sub.region} - {sub.fabric}</h3>
                    <p className="cp-item-meta">Submitted by {sub.name} on {sub.date}</p>
                    <div className="cp-item-tags">
                      <span className="cp-tag">{sub.occasion}</span>
                      <span className="cp-tag">{sub.gender}</span>
                      <span className="cp-tag">{sub.embroidery}</span>
                      <span className="cp-tag">{sub.language}</span>
                      <span className={`cp-status cp-status-${sub.status}`}>{sub.status}</span>
                    </div>
                  </div>
                  <div className="cp-admin-actions">
                    {sub.status === 'pending' && (
                      <>
                        <button className="cp-btn cp-btn-approve" onClick={() => updateStatus(sub.id, 'approved')}>Approve</button>
                        <button className="cp-btn cp-btn-reject" onClick={() => updateStatus(sub.id, 'rejected')}>Reject</button>
                      </>
                    )}
                    {sub.status === 'rejected' && (
                      <button className="cp-btn cp-btn-approve" onClick={() => updateStatus(sub.id, 'approved')}>Approve</button>
                    )}
                    {sub.status === 'approved' && (
                      <button className="cp-btn cp-btn-reject" onClick={() => updateStatus(sub.id, 'rejected')}>Reject</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
