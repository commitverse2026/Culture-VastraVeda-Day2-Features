import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

const MOCK_LABELS = [
  "Banarasi Silk",
  "Kanjeevaram Silk",
  "Ikat Cotton",
  "Mashru Fabric",
  "Pashmina Wool",
  "Ajrakh Block Print",
  "Chanderi Silk"
];

export default function FabricIdentifierFeature() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [resultLabel, setResultLabel] = useState(null);

  // Initialize Camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setError(null);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied or unavailable", err);
      setError("Unable to access camera. Please ensure permissions are granted.");
    }
  };

  useEffect(() => {
    startCamera();
    
    // Cleanup stream on dismount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const captureAndScan = () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Capture Frame to Canvas
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageDataUrl);
    
    // Stop live stream briefly while showing result
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    // Run Mock Classification
    setIsScanning(true);
    setResultLabel(null);

    setTimeout(() => {
      setIsScanning(false);
      const randomFabric = MOCK_LABELS[Math.floor(Math.random() * MOCK_LABELS.length)];
      setResultLabel(randomFabric);
    }, 2000); // 2 second fake ML processing delay
  };

  const resetScanner = () => {
    setCapturedImage(null);
    setResultLabel(null);
    setIsScanning(false);
    startCamera();
  };

  return (
    <div className="fi-container">
      <div className="fi-header">
        <h2 className="fi-title">AI Fabric Identifier</h2>
        <p className="fi-subtitle">Point your camera at a textile to identify its origin.</p>
      </div>

      <div className="fi-viewfinder">
        {!capturedImage ? (
          <video 
            ref={videoRef} 
            className="fi-video-feed" 
            autoPlay 
            playsInline 
            muted
          />
        ) : (
          <img src={capturedImage} alt="Captured textile" className="fi-image-preview" />
        )}

        {isScanning && (
          <div className="fi-scanner-overlay">
            <div className="fi-scanner-line"></div>
            <span className="fi-scanner-text">ANALYZING TEXTURE...</span>
          </div>
        )}
        
        {/* Hidden canvas for taking snapshot */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {error && <div className="fi-error">{error}</div>}

      <div className="fi-controls">
        {!capturedImage ? (
          <button className="fi-btn fi-btn-capture" onClick={captureAndScan} disabled={!stream}>
            📸 Analyze Fabric
          </button>
        ) : (
          <button className="fi-btn fi-btn-reset" onClick={resetScanner} disabled={isScanning}>
            🔄 Scan Another
          </button>
        )}
      </div>

      {resultLabel && !isScanning && (
        <div className="fi-results">
          <span className="fi-result-label">Detected Textile</span>
          <p className="fi-result-value">{resultLabel}</p>
        </div>
      )}
    </div>
  );
}
