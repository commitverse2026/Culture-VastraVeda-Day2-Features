import React, { useState, useRef } from 'react';
import './styles.css';

export default function MediaContributionFeature() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'gallery'
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [expandedMedia, setExpandedMedia] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Date.now() + Math.random(),
        file,
        previewUrl: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'image'
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removePreview = (id) => {
    setSelectedFiles(prev => prev.filter(f => {
      if (f.id === id) {
        URL.revokeObjectURL(f.previewUrl);
        return false;
      }
      return true;
    }));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const submitMedia = () => {
    if (selectedFiles.length === 0) return;
    
    // Simulate uploading by transferring to gallery state directly
    setGallery(prev => [...selectedFiles, ...prev]);
    setSelectedFiles([]);
    setActiveTab('gallery');
  };

  return (
    <div className="mc-container">
      <nav className="mc-nav">
        <button 
          className={`mc-nav-btn ${activeTab === 'upload' ? 'active' : ''}`} 
          onClick={() => setActiveTab('upload')}
        >
          Contribute Media
        </button>
        <button 
          className={`mc-nav-btn ${activeTab === 'gallery' ? 'active' : ''}`} 
          onClick={() => setActiveTab('gallery')}
        >
          Media Gallery
        </button>
      </nav>

      {activeTab === 'upload' && (
        <div className="mc-card">
          <h2 className="mc-card-title">Upload Photos & Videos</h2>
          
          <div className="mc-upload-area" onClick={handleUploadClick}>
            <span className="mc-upload-icon">📸</span>
            <p className="mc-upload-text">Click or drag files to upload</p>
            <p className="mc-upload-subtext">Supports PNG, JPG, GIF up to 10MB and MP4 up to 50MB</p>
            <input 
              type="file" 
              className="mc-file-input" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*,video/*" 
              multiple 
            />
          </div>

          {selectedFiles.length > 0 && (
            <>
              <div className="mc-preview-grid">
                {selectedFiles.map(fileObj => (
                  <div key={fileObj.id} className="mc-preview-item">
                    <button className="mc-preview-remove" onClick={() => removePreview(fileObj.id)}>×</button>
                    {fileObj.type === 'video' ? (
                      <video className="mc-preview-media" src={fileObj.previewUrl} autoPlay muted loop />
                    ) : (
                      <img className="mc-preview-media" src={fileObj.previewUrl} alt="preview" />
                    )}
                  </div>
                ))}
              </div>

              <button className="mc-btn-primary" onClick={submitMedia}>
                Submit {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''} to Gallery
              </button>
            </>
          )}
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="mc-card">
          <h2 className="mc-card-title">Community Gallery</h2>
          
          {gallery.length === 0 ? (
            <div className="mc-empty-state">
              No media has been contributed yet.
            </div>
          ) : (
            <div className="mc-gallery-grid">
              {gallery.map(item => (
                <div key={item.id} className="mc-gallery-item" onClick={() => setExpandedMedia(item)}>
                  <div className="mc-gallery-media-wrapper">
                    {item.type === 'video' ? (
                      <>
                        <video className="mc-gallery-media" src={item.previewUrl} />
                        <span className="mc-gallery-video-icon">🎥 Video</span>
                      </>
                    ) : (
                      <img className="mc-gallery-media" src={item.previewUrl} alt="gallery item" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expanded Modal */}
      {expandedMedia && (
        <div className="mc-modal-overlay" onClick={() => setExpandedMedia(null)}>
          <div className="mc-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="mc-modal-close" onClick={() => setExpandedMedia(null)}>×</button>
            {expandedMedia.type === 'video' ? (
              <video className="mc-modal-media" src={expandedMedia.previewUrl} controls autoPlay loop />
            ) : (
              <img className="mc-modal-media" src={expandedMedia.previewUrl} alt="expanded item" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
