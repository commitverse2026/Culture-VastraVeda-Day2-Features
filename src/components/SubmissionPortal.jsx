import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'vastraveda_submissions';
const DRAFT_KEY = 'vastraveda_form_draft';

const SubmissionPortal = () => {
  const [step, setStep] = useState(1);
  const [viewMode, setViewMode] = useState('contributor'); // 'contributor', 'admin', 'translator'
  const [submissions, setSubmissions] = useState([]);
  const [galleryLanguage, setGalleryLanguage] = useState('English');
  const [translationTask, setTranslationTask] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    fabric: '',
    embroidery: '',
    occasion: '',
    gender: '',
    language: 'English',
  });
  const [transData, setTransData] = useState({
    name: '',
    region: '',
    fabric: '',
    embroidery: '',
    language: '',
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

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
      id: Date.now(),
      status: 'pending',
      timestamp: new Date().toISOString(),
      sourceLanguage: formData.language,
      translations: {
        [formData.language]: {
          name: formData.name,
          region: formData.region,
          fabric: formData.fabric,
          embroidery: formData.embroidery,
        }
      },
      occasion: formData.occasion,
      gender: formData.gender,
      language: formData.language, // Keep for backward compatibility/quick access
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

  const handleTranslationSubmit = (e) => {
    e.preventDefault();
    if (!transData.name || !transData.language) return;

    const updatedSubmissions = submissions.map(s => {
      if (s.id === translationTask.id) {
        return {
          ...s,
          translations: {
            ...s.translations,
            [transData.language]: {
              name: transData.name,
              region: transData.region,
              fabric: transData.fabric,
              embroidery: transData.embroidery,
            }
          }
        };
      }
      return s;
    });

    setSubmissions(updatedSubmissions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSubmissions));
    setTranslationTask(null);
    setTransData({ name: '', region: '', fabric: '', embroidery: '', language: '' });
  };

  const approvedSubmissions = submissions.filter(s => s.status === 'approved');
  
  const getDisplayContent = (sub) => {
    const translation = sub.translations?.[galleryLanguage];
    if (translation) {
       return { ...translation, isFallback: false };
    }
    // Fallback to source language
    const sourceTrans = sub.translations?.[sub.sourceLanguage || sub.language];
    return { ...sourceTrans, isFallback: true, sourceLang: sub.sourceLanguage || sub.language };
  };

  const languages = ['English', 'Hindi', 'Marathi', 'Tamil', 'Bengali', 'Gujarati'];

  return (
    <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <span className="text-orange-500 text-2xl">🌍</span> Community Heritage Portal
        </h2>
        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
          {['contributor', 'admin', 'translator'].map(role => (
            <button
              key={role}
              onClick={() => {
                setViewMode(role);
                setTranslationTask(null);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                viewMode === role ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {submitStatus === 'success' && (
        <div className="bg-green-900/20 border border-green-500/50 text-green-400 p-4 rounded-xl text-sm flex items-center gap-3 animate-in zoom-in duration-300">
          <span className="text-lg animate-bounce">✓</span>
          Contribution submitted! Our curators and translators will review it shortly.
        </div>
      )}

      {viewMode === 'admin' ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-[0.2em]">Moderation Queue</h3>
            <span className="text-xs bg-zinc-800 px-3 py-1 rounded-full text-zinc-300">{submissions.length} total entries</span>
          </div>
          {submissions.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-zinc-800 rounded-3xl bg-zinc-950/50">
              <p className="text-zinc-500 text-sm">No submissions available for moderation</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {submissions.map(sub => (
                <div key={sub.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-zinc-700 transition-colors">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-white">{sub.translations[sub.sourceLanguage]?.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md uppercase font-bold tracking-wider ${
                        sub.status === 'pending' ? 'bg-yellow-900/40 text-yellow-500 border border-yellow-800/50' :
                        sub.status === 'approved' ? 'bg-green-900/40 text-green-500 border border-green-800/50' :
                        'bg-red-900/40 text-red-500 border border-red-800/50'
                      }`}>
                        {sub.status}
                      </span>
                      <span className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-md border border-zinc-700">
                        {sub.sourceLanguage}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 flex items-center gap-2">
                      <span className="w-1 h-1 bg-zinc-700 rounded-full"></span> {sub.translations[sub.sourceLanguage]?.region} 
                      <span className="w-1 h-1 bg-zinc-700 rounded-full"></span> {sub.translations[sub.sourceLanguage]?.fabric}
                      <span className="w-1 h-1 bg-zinc-700 rounded-full"></span> {Object.keys(sub.translations || {}).length} Languages
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {sub.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleModeration(sub.id, 'approved')}
                          className="text-xs bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-green-900/20 active:scale-95"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleModeration(sub.id, 'rejected')}
                          className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all active:scale-95"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {sub.status !== 'pending' && (
                      <button 
                        onClick={() => handleModeration(sub.id, 'pending')}
                        className="text-xs text-zinc-500 hover:text-white underline underline-offset-4 decoration-zinc-800 hover:decoration-white transition-all"
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
      ) : viewMode === 'translator' ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-[0.2em]">Translation Dashboard</h3>
          </div>
          
          {translationTask ? (
            <div className="bg-zinc-900/80 border border-orange-500/30 p-8 rounded-3xl backdrop-blur-md">
              <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                <h4 className="text-lg font-semibold text-white">Translating: {translationTask.translations[translationTask.sourceLanguage].name}</h4>
                <button onClick={() => setTranslationTask(null)} className="text-zinc-500 hover:text-white text-sm">✕ Close</button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                 <div className="space-y-4">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Source Content ({translationTask.sourceLanguage})</p>
                    <div className="bg-black/40 p-5 rounded-2xl border border-zinc-800/50 space-y-4">
                       <div>
                          <label className="text-[10px] text-zinc-600 block mb-1">NAME</label>
                          <p className="text-sm text-zinc-300">{translationTask.translations[translationTask.sourceLanguage].name}</p>
                       </div>
                       <div>
                          <label className="text-[10px] text-zinc-600 block mb-1">REGION</label>
                          <p className="text-sm text-zinc-300">{translationTask.translations[translationTask.sourceLanguage].region}</p>
                       </div>
                       <div>
                          <label className="text-[10px] text-zinc-600 block mb-1">EMBROIDERY</label>
                          <p className="text-sm text-zinc-300 leading-relaxed italic">"{translationTask.translations[translationTask.sourceLanguage].embroidery}"</p>
                       </div>
                    </div>
                 </div>

                 <form onSubmit={handleTranslationSubmit} className="space-y-4">
                    <p className="text-[10px] text-orange-500 uppercase tracking-widest font-bold">Target Translation</p>
                    <div className="space-y-4">
                       <select 
                         value={transData.language}
                         onChange={(e) => setTransData({...transData, language: e.target.value})}
                         className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-orange-500/50 outline-none"
                         required
                       >
                         <option value="">Select Target Language</option>
                         {languages.filter(l => l !== translationTask.sourceLanguage && !translationTask.translations[l]).map(l => (
                           <option key={l} value={l}>{l}</option>
                         ))}
                       </select>
                       <input 
                         type="text" 
                         value={transData.name}
                         onChange={(e) => setTransData({...transData, name: e.target.value})}
                         placeholder="Translated Name"
                         className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-orange-500/50 transition-colors outline-none"
                         required
                       />
                        <input 
                         type="text" 
                         value={transData.region}
                         onChange={(e) => setTransData({...transData, region: e.target.value})}
                         placeholder="Translated Region"
                         className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-orange-500/50 transition-colors outline-none"
                       />
                       <textarea 
                         value={transData.embroidery}
                         onChange={(e) => setTransData({...transData, embroidery: e.target.value})}
                         placeholder="Description Translation..."
                         rows={4}
                         className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-orange-500/50 transition-colors outline-none resize-none"
                       />
                       <button 
                         type="submit"
                         className="w-full bg-orange-600 hover:bg-orange-500 text-white rounded-xl py-3 text-sm font-bold transition-all shadow-xl shadow-orange-950/20"
                       >
                         Store Translation
                       </button>
                    </div>
                 </form>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {approvedSubmissions.map(sub => (
                <div key={sub.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-white mb-1">{sub.translations[sub.sourceLanguage]?.name}</h4>
                    <div className="flex flex-wrap gap-2">
                       {languages.map(lang => (
                          <span key={lang} className={`text-[9px] px-2 py-0.5 rounded-full border ${
                            sub.translations[lang] ? 'bg-green-900/20 text-green-500 border-green-800/30' : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                          }`}>
                            {lang}
                          </span>
                       ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                       setTranslationTask(sub);
                       setTransData(prev => ({ ...prev, name: '', region: '', language: '', fabric: sub.translations[sub.sourceLanguage].fabric, embroidery: '' }));
                    }}
                    className="text-xs bg-zinc-800 hover:bg-white hover:text-black text-white px-5 py-2.5 rounded-xl font-semibold transition-all"
                  >
                    Translate
                  </button>
                </div>
              ))}
              {approvedSubmissions.length === 0 && (
                <div className="text-center py-16 border border-dashed border-zinc-800 rounded-3xl bg-zinc-950/50">
                  <p className="text-zinc-500 text-sm">Approved entries will appear here for translation</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Multi-step Form */}
          <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm self-start shadow-inner">
            <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-3 shrink-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    step === s ? 'bg-orange-600 text-white rotate-12 scale-110 shadow-lg shadow-orange-950/40' : 
                    step > s ? 'bg-green-600/20 text-green-500 border border-green-800/50' : 'bg-zinc-800/50 text-zinc-500 border border-zinc-800'
                  }`}>
                    {step > s ? '✓' : s}
                  </div>
                  {s < 3 && <div className={`w-12 h-0.5 rounded-full ${step > s ? 'bg-green-600/40' : 'bg-zinc-800'}`} />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">Identify the Garment</h3>
                    <p className="text-xs text-zinc-500">Let's start with the basics of this cultural treasure.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-2 font-bold">Local Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Bandhani Saree"
                        className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-orange-500/50 transition-all outline-none"
                      />
                      {errors.name && <p className="text-red-500 text-[10px] mt-1.5 flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full"></span> {errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-2 font-bold">Ideal for</label>
                        <select 
                          value={formData.gender}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                          className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-orange-500/50 appearance-none outline-none"
                        >
                          <option value="">Select</option>
                          <option value="Unisex">Unisex</option>
                          <option value="Men">Men</option>
                          <option value="Women">Women</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-[10px] mt-1.5">{errors.gender}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-2 font-bold">Input Language</label>
                        <select 
                          value={formData.language}
                          onChange={(e) => setFormData({...formData, language: e.target.value})}
                          className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-orange-500/50 appearance-none outline-none text-orange-400"
                        >
                          {languages.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">Provenance</h3>
                    <p className="text-xs text-zinc-500">Where does this style originate and what is it made of?</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-2 font-bold">Originating Region</label>
                      <input 
                        type="text" 
                        value={formData.region}
                        onChange={(e) => setFormData({...formData, region: e.target.value})}
                        placeholder="e.g. Gujarat, India"
                        className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-orange-500/50 outline-none"
                      />
                      {errors.region && <p className="text-red-500 text-[10px] mt-1.5">{errors.region}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-2 font-bold">Primary Fabric</label>
                      <input 
                        type="text" 
                        value={formData.fabric}
                        onChange={(e) => setFormData({...formData, fabric: e.target.value})}
                        placeholder="e.g. Mulberry Silk"
                        className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-orange-500/50 outline-none"
                      />
                      {errors.fabric && <p className="text-red-500 text-[10px] mt-1.5">{errors.fabric}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-2 font-bold">Social Context</label>
                      <select 
                        value={formData.occasion}
                        onChange={(e) => setFormData({...formData, occasion: e.target.value})}
                        className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-orange-500/50 appearance-none outline-none"
                      >
                        <option value="">Select Occasion</option>
                        <option value="Daily Wear">Daily Wear</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Festivals">Festivals</option>
                        <option value="Ceremonial">Ceremonial</option>
                      </select>
                      {errors.occasion && <p className="text-red-500 text-[10px] mt-1.5">{errors.occasion}</p>}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">Artisanal Details</h3>
                    <p className="text-xs text-zinc-500">Describe the specific craftsmanship or symbolism.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-2 font-bold">Embroidery & Motifs</label>
                    <textarea 
                      value={formData.embroidery}
                      onChange={(e) => setFormData({...formData, embroidery: e.target.value})}
                      placeholder="e.g. Intricate mirror work used in folk ceremonies..."
                      rows={5}
                      className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-orange-500/50 outline-none resize-none leading-relaxed"
                    />
                    {errors.embroidery && <p className="text-red-500 text-[10px] mt-1.5">{errors.embroidery}</p>}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                {step > 1 && (
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="flex-1 bg-zinc-800/80 hover:bg-zinc-700 text-white rounded-2xl py-4 text-sm font-bold transition-all border border-zinc-700/50"
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="flex-1 bg-white text-black hover:bg-orange-500 hover:text-white rounded-2xl py-4 text-sm font-bold transition-all shadow-lg active:scale-95"
                  >
                    Continue
                  </button>
                ) : (
                  <button 
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl py-4 text-sm font-bold transition-all shadow-2xl shadow-orange-950/40 active:scale-95"
                  >
                    Submit Heritage
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Guidelines & Public View */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 blur-[80px]"></div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                 <span className="w-4 h-px bg-zinc-800"></span> Contribution Guide
              </h3>
              <ul className="space-y-5 text-sm text-zinc-400">
                <li className="flex gap-4 group">
                  <span className="w-6 h-6 rounded-lg bg-zinc-800/50 flex items-center justify-center text-[10px] font-bold text-orange-500 shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">01</span>
                  <p className="leading-relaxed">Provide the local name in the <span className="text-orange-400">original language</span> for cultural accuracy.</p>
                </li>
                <li className="flex gap-4 group">
                  <span className="w-6 h-6 rounded-lg bg-zinc-800/50 flex items-center justify-center text-[10px] font-bold text-orange-500 shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">02</span>
                  <p className="leading-relaxed">Include <span className="text-zinc-200 font-medium">fabric origins</span> (e.g., Ahimsa silk, Khadi cotton) to help our weavers.</p>
                </li>
                <li className="flex gap-4 group">
                  <span className="w-6 h-6 rounded-lg bg-zinc-800/50 flex items-center justify-center text-[10px] font-bold text-orange-500 shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">03</span>
                  <p className="leading-relaxed">Translators will enrich your post so global users can discover it.</p>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Latest Heritage</h3>
                <div className="relative group">
                   <select 
                     value={galleryLanguage}
                     onChange={(e) => setGalleryLanguage(e.target.value)}
                     className="bg-zinc-900 border border-zinc-800 text-[10px] px-3 py-1.5 rounded-lg outline-none appearance-none pr-8 hover:border-zinc-700 transition-all font-bold cursor-pointer"
                   >
                     {languages.map(l => <option key={l} value={l}>{l}</option>)}
                   </select>
                   <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-zinc-500 transition-transform group-hover:translate-y-[-2px]">▼</span>
                </div>
              </div>
              
              {approvedSubmissions.length === 0 ? (
                <div className="p-12 text-center border border-zinc-900 rounded-3xl bg-zinc-950/20">
                   <p className="text-xs text-zinc-600 italic">The digital vault is waiting for your submission...</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {approvedSubmissions.map(sub => {
                    const content = getDisplayContent(sub);
                    return (
                      <div key={sub.id} className="group bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-2xl hover:border-orange-500/20 hover:bg-zinc-900/60 transition-all duration-300 relative overflow-hidden">
                        {content.isFallback && (
                           <div className="absolute top-0 right-0">
                              <span className="bg-orange-600/10 text-orange-500 text-[8px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-orange-500/20 uppercase">
                                Translated from {content.sourceLang}
                              </span>
                           </div>
                        )}
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors tracking-tight">{content.name}</h4>
                          <span className="bg-zinc-800/80 text-zinc-500 text-[9px] px-2 py-1 rounded-md uppercase font-bold border border-zinc-700/50">{content.region}</span>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4 group-hover:text-zinc-300 transition-colors italic">
                          "{content.embroidery}"
                        </p>
                        <div className="flex gap-2">
                           {Object.keys(sub.translations || {}).map(lang => (
                              <div key={lang} className={`w-1 h-1 rounded-full ${lang === galleryLanguage ? 'bg-orange-500' : 'bg-zinc-700'}`}></div>
                           ))}
                        </div>
                      </div>
                    );
                  })}
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
