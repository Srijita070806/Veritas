import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { useVeritas } from '../App'
import Navbar from '../components/Navbar'
import axios from 'axios'

export default function Upload() {
  const navigate = useNavigate()
  const { setPaperText, setEssayText, setFilename, essayText } = useVeritas()
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(null)
  const [error, setError] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [localEssay, setLocalEssay] = useState(essayText || '')
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const onDrop = async (files) => {
    const file = files[0]
    if (!file || !file.name.endsWith('.pdf')) { setError('Only PDF files accepted!'); return }
    setUploading(true); setError(null)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setPaperText(res.data.text)
      setFilename(file.name)
      setUploaded({ name: file.name, pages: res.data.page_count })
    } catch { setError('Upload failed. Make sure backend is running!') }
    finally { setUploading(false) }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false
  })

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      setCameraActive(true)
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play() } }, 100)
    } catch { setError('Camera access denied!') }
  }

  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    setCameraActive(false)
  }

  const capturePhoto = () => {
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    canvas.toBlob(async (blob) => {
      stopCamera(); setUploading(true)
      setUploaded({ name: 'Camera Capture', pages: 1 })
      setPaperText('Camera capture processed')
      setUploading(false)
    }, 'image/jpeg')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf8', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      <div style={{ padding: '80px 48px 48px', maxWidth: '1000px', margin: '0 auto' }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <p style={{ color: '#f97316', fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '8px' }}>STEP 1 OF 2</p>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1c1917', marginBottom: '8px' }}>
            Upload Your Sources
          </h1>
          <p style={{ color: '#78716c', fontSize: '15px' }}>Upload a research PDF or capture a document with your camera</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

          {/* PDF Upload */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <p style={{ color: '#78716c', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '10px' }}>📄 UPLOAD PDF</p>
            <div {...getRootProps()} style={{
              border: `2px dashed ${isDragActive ? '#f97316' : '#e7e5e4'}`,
              borderRadius: '16px', padding: '40px 24px', textAlign: 'center',
              cursor: 'pointer', background: isDragActive ? '#fff7ed' : '#fff',
              minHeight: '200px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
            }}>
              <input {...getInputProps()} />
              <div style={{ fontSize: '40px' }}>{uploading ? '⏳' : isDragActive ? '📂' : '📄'}</div>
              {uploading ? (
                <p style={{ color: '#f97316', fontSize: '14px', fontWeight: '700' }}>Processing PDF...</p>
              ) : isDragActive ? (
                <p style={{ color: '#f97316', fontSize: '14px', fontWeight: '700' }}>Drop it here!</p>
              ) : (
                <>
                  <p style={{ color: '#1c1917', fontSize: '14px', fontWeight: '600' }}>Drag & drop your PDF here</p>
                  <p style={{ color: '#9ca3af', fontSize: '13px' }}>or click to browse files</p>
                  <div style={{
                    background: '#fff7ed', border: '1px solid #fed7aa',
                    color: '#f97316', padding: '8px 20px', borderRadius: '8px',
                    fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', marginTop: '4px'
                  }}>BROWSE FILES</div>
                </>
              )}
            </div>
            {uploaded && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
                marginTop: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0',
                borderRadius: '10px', padding: '12px 16px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <span style={{ color: '#059669', fontSize: '13px', fontWeight: '700' }}>✅ {uploaded.name}</span>
                <span style={{ color: '#6b7280', fontSize: '12px' }}>{uploaded.pages} pages</span>
              </motion.div>
            )}
            {error && (
              <div style={{
                marginTop: '10px', background: '#fff1f2', border: '1px solid #fecaca',
                borderRadius: '10px', padding: '10px 14px', color: '#ef4444', fontSize: '13px'
              }}>❌ {error}</div>
            )}
          </motion.div>

          {/* Camera */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <p style={{ color: '#78716c', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '10px' }}>📷 CAMERA CAPTURE</p>
            <div style={{
              border: '2px dashed #e7e5e4', borderRadius: '16px',
              minHeight: '200px', background: '#fff',
              overflow: 'hidden', position: 'relative',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
            }}>
              {cameraActive ? (
                <>
                  <video ref={videoRef} style={{ width: '100%', height: '200px', objectFit: 'cover' }} autoPlay playsInline />
                  <div style={{ position: 'absolute', bottom: '12px', display: 'flex', gap: '10px' }}>
                    <button onClick={capturePhoto} style={{
                      background: '#f97316', color: 'white', border: 'none',
                      padding: '8px 18px', borderRadius: '8px', cursor: 'pointer',
                      fontWeight: '700', fontSize: '12px'
                    }}>📸 CAPTURE</button>
                    <button onClick={stopCamera} style={{
                      background: '#fff1f2', color: '#ef4444', border: '1px solid #fecaca',
                      padding: '8px 18px', borderRadius: '8px', cursor: 'pointer',
                      fontWeight: '700', fontSize: '12px'
                    }}>CANCEL</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '40px' }}>📷</div>
                  <p style={{ color: '#1c1917', fontSize: '14px', fontWeight: '600' }}>Capture a document</p>
                  <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', padding: '0 20px' }}>
                    Point camera at any printed research paper
                  </p>
                  <button onClick={startCamera} style={{
                    background: '#fff7ed', border: '1px solid #fed7aa',
                    color: '#f97316', padding: '8px 20px', borderRadius: '8px',
                    cursor: 'pointer', fontWeight: '700', fontSize: '12px', marginTop: '4px'
                  }}>OPEN CAMERA</button>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Essay */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginBottom: '24px' }}>
          <p style={{ color: '#78716c', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '10px' }}>✏️ STEP 2 — PASTE YOUR ESSAY</p>
          <textarea
            value={localEssay}
            onChange={e => setLocalEssay(e.target.value)}
            placeholder="Paste your essay, draft, or AI-generated text here..."
            style={{
              width: '100%', height: '180px',
              background: '#fff', border: '1px solid #e7e5e4',
              borderRadius: '12px', padding: '16px',
              color: '#1c1917', fontSize: '14px',
              resize: 'vertical', outline: 'none',
              fontFamily: 'Inter, sans-serif', lineHeight: '1.8',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => { setEssayText(localEssay); navigate('/dashboard') }} style={{
            background: '#f97316', color: 'white', border: 'none',
            padding: '12px 32px', borderRadius: '10px', cursor: 'pointer',
            fontWeight: '700', fontSize: '14px',
            boxShadow: '0 4px 12px rgba(249,115,22,0.3)'
          }}>Save & Go to Dashboard →</button>
          <button onClick={() => { setEssayText(localEssay); navigate('/heatmap') }} style={{
            background: '#fff1f2', color: '#ef4444', border: '1px solid #fecaca',
            padding: '12px 24px', borderRadius: '10px', cursor: 'pointer',
            fontWeight: '700', fontSize: '14px'
          }}>Run Heatmap →</button>
        </motion.div>
      </div>
    </div>
  )
}