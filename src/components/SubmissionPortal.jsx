import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'vastraveda_submissions';
const DRAFT_KEY = 'vastraveda_form_draft';

const SubmissionPortal = () => {
  const [step, setStep] = useState(1);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    fabric: '',
    embroidery: '',
    occasion: '',
    gender: '',
    language: 'English',
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error'

  // Load submissions and draft on mount
  useEffect(() => {
    const savedSubmissions = localStorage.getItem(STORAGE_KEY);
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }

    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.language) newErrors.language = 'Language is required';
    } else if (currentStep === 2) {
      if (!formData.region) newErrors.region = 'Region is required';
      if (!formData.fabric) newErrors.fabric = 'Fabric is required';
      if (!formData.occasion) newErrors.occasion = 'Occasion is required';
    } else if (currentStep === 3) {
      if (!formData.embroidery) newErrors.embroidery = 'Embroidery detail is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    const newSubmission = {
      ...formData,
      id: Date.now(),
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    const updatedSubmissions = [...submissions, newSubmission];
    setSubmissions(updatedSubmissions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSubmissions));
    localStorage.removeItem(DRAFT_KEY);

    setSubmitStatus('success');
    setFormData({
      name: '',
      region: '',
      fabric: '',
      embroidery: '',
      occasion: '',
      gender: '',
      language: 'English',
    });
    setStep(1);

    setTimeout(() => setSubmitStatus(null), 3000);
  };

  const handleModeration = (id, newStatus) => {
    const updatedSubmissions = submissions.map(s => 
      s.id === id ? { ...s, status: newStatus } : s
    );
    setSubmissions(updatedSubmissions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSubmissions));
  };

  const approvedSubmissions = submissions.filter(s => s.status === 'approved');

  return (
    <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-semibold text-white">Community Portal</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">{isAdminMode ? 'Admin View' : 'Contributor View'}</span>
          <button 
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${isAdminMode ? 'bg-orange-600' : 'bg-zinc-700'}`}
          >
            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isAdminMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {submitStatus === 'success' && (
        <div className="bg-green-900/20 border border-green-500/50 text-green-400 p-4 rounded-xl text-sm flex items-center gap-3 animate-in zoom-in duration-300">
          <span className="text-lg">✓</span>
          Submission sent successfully! It is now pending moderation.
        </div>
      )}

      {isAdminMode ? (
        <div className="space-y-6">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Moderation Queue ({submissions.filter(s => s.status === 'pending').length})</h3>
          {submissions.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
              <p className="text-zinc-500 text-sm">No submissions to moderate</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {submissions.map(sub => (
                <div key={sub.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white">{sub.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                        sub.status === 'pending' ? 'bg-yellow-900/50 text-yellow-500' :
                        sub.status === 'approved' ? 'bg-green-900/50 text-green-500' :
                        'bg-red-900/50 text-red-500'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">{sub.region} • {sub.fabric} • {sub.language}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {sub.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleModeration(sub.id, 'approved')}
                          className="text-xs bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleModeration(sub.id, 'rejected')}
                          className="text-xs bg-zinc-800 hover:bg-red-900/50 border border-transparent hover:border-red-500/50 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {sub.status !== 'pending' && (
                      <button 
                        onClick={() => handleModeration(sub.id, 'pending')}
                        className="text-xs text-zinc-500 hover:text-white underline underline-offset-4"
                      >
                        Reset to Pending
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Multi-step Form */}
          <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-3xl backdrop-blur-sm self-start">
            <div className="flex items-center gap-4 mb-8">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s ? 'bg-white text-black scale-110' : 
                    step > s ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {step > s ? '✓' : s}
                  </div>
                  {s < 3 && <div className={`w-8 h-px ${step > s ? 'bg-green-600' : 'bg-zinc-800'}`} />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <div>
                    <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">Clothing Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Pashmina Shawl"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none"
                    />
                    {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">Gender</label>
                      <select 
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none appearance-none"
                      >
                        <option value="">Select</option>
                        <option value="Unisex">Unisex</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                      </select>
                      {errors.gender && <p className="text-red-500 text-[10px] mt-1">{errors.gender}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">Language</label>
                      <select 
                        value={formData.language}
                        onChange={(e) => setFormData({...formData, language: e.target.value})}
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none appearance-none"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Marathi">Marathi</option>
                        <option value="Tamil">Tamil</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg font-medium">Origin & Details</h3>
                  <div>
                    <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">Region</label>
                    <input 
                      type="text" 
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                      placeholder="e.g. Kashmir, India"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none"
                    />
                    {errors.region && <p className="text-red-500 text-[10px] mt-1">{errors.region}</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">Fabric Type</label>
                    <input 
                      type="text" 
                      value={formData.fabric}
                      onChange={(e) => setFormData({...formData, fabric: e.target.value})}
                      placeholder="e.g. Hand-spun Wool"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none"
                    />
                    {errors.fabric && <p className="text-red-500 text-[10px] mt-1">{errors.fabric}</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">Occasion</label>
                    <select 
                      value={formData.occasion}
                      onChange={(e) => setFormData({...formData, occasion: e.target.value})}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none appearance-none"
                    >
                      <option value="">Select Occasion</option>
                      <option value="Daily Wear">Daily Wear</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Festivals">Festivals</option>
                      <option value="Ceremonial">Ceremonial</option>
                    </select>
                    {errors.occasion && <p className="text-red-500 text-[10px] mt-1">{errors.occasion}</p>}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg font-medium">Craftsmanship & Review</h3>
                  <div>
                    <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-2">Embroidery / Artform</label>
                    <textarea 
                      value={formData.embroidery}
                      onChange={(e) => setFormData({...formData, embroidery: e.target.value})}
                      placeholder="Describe the specialized work involved..."
                      rows={4}
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-white transition-colors outline-none resize-none"
                    />
                    {errors.embroidery && <p className="text-red-500 text-[10px] mt-1">{errors.embroidery}</p>}
                  </div>
                  
                  <div className="bg-zinc-800/50 p-4 rounded-2xl space-y-2">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-tighter">Summary</p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                      <span className="text-zinc-500">Name:</span> <span className="text-white">{formData.name || '-'}</span>
                      <span className="text-zinc-500">Region:</span> <span className="text-white">{formData.region || '-'}</span>
                      <span className="text-zinc-500">Fabric:</span> <span className="text-white">{formData.fabric || '-'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-zinc-800">
                {step > 1 && (
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl py-3 text-sm font-medium transition-colors"
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="flex-1 bg-white text-black hover:bg-zinc-200 rounded-xl py-3 text-sm font-medium transition-colors"
                  >
                    Next Step
                  </button>
                ) : (
                  <button 
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-500 text-white rounded-xl py-3 text-sm font-medium transition-colors shadow-lg shadow-orange-900/20"
                  >
                    Submit Data
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Guidelines & Public View */}
          <div className="space-y-8">
            <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-4">Submission Guidelines</h3>
              <ul className="space-y-3 text-sm text-zinc-500">
                <li className="flex gap-3">
                  <span className="text-orange-500">01</span>
                  Ensure the region or community origin is accurate.
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-500">02</span>
                  Describe fabric and embroidery in detail for better approval chances.
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-500">03</span>
                  Only approved entries will appear in the public heritage gallery.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Recent Contributions ({approvedSubmissions.length})</h3>
              {approvedSubmissions.length === 0 ? (
                <p className="text-xs text-zinc-600 italic">No approved submissions yet. Be the first!</p>
              ) : (
                <div className="grid gap-3">
                  {approvedSubmissions.map(sub => (
                    <div key={sub.id} className="group bg-zinc-950 border border-zinc-900 p-4 rounded-2xl hover:border-zinc-700 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors uppercase tracking-wide">{sub.name}</h4>
                        <span className="bg-zinc-800 text-zinc-400 text-[9px] px-1.5 py-0.5 rounded uppercase">{sub.region}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 line-clamp-2">{sub.embroidery}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionPortal;
