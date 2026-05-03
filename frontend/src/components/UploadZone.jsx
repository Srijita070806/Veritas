import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'

export default function UploadZone({ onUpload }) {
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(null)
  const [error, setError] = useState(null)

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!file.name.endsWith('.pdf')) {
      setError('Only PDF files are accepted!')
      return
    }

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(
        'http://localhost:8000/api/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      onUpload(response.data.text)
      setUploaded({
        name: file.name,
        pages: response.data.page_count
      })
    } catch (err) {
      setError('Upload failed. Make sure backend is running!')
    } finally {
      setUploading(false)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  })

  return (
    <div>
      <label style={{
        color: '#94a3b8',
        fontSize: '13px',
        marginBottom: '8px',
        display: 'block'
      }}>
        Upload Research Paper (PDF)
      </label>

      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? '#3b82f6' : '#1e3a5f'}`,
          borderRadius: '10px',
          padding: '32px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragActive ? '#1a2235' : 'transparent',
          transition: 'all 0.2s'
        }}>
        <input {...getInputProps()} />
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
        {uploading ? (
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>Uploading...</p>
        ) : isDragActive ? (
          <p style={{ color: '#3b82f6', fontSize: '13px' }}>Drop it here!</p>
        ) : (
          <p style={{ color: '#475569', fontSize: '13px' }}>
            Drag & drop a PDF here<br />or click to browse
          </p>
        )}
      </div>

      {uploaded && (
        <div style={{
          marginTop: '12px',
          background: '#1a2235',
          border: '1px solid #166534',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: '#86efac', fontSize: '12px' }}>
            ✅ {uploaded.name}
          </span>
          <span style={{ color: '#475569', fontSize: '12px' }}>
            {uploaded.pages} pages
          </span>
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '12px',
          color: '#ef4444',
          fontSize: '12px',
          padding: '8px',
          background: '#1a2235',
          borderRadius: '6px',
          border: '1px solid #7f1d1d'
        }}>
          ❌ {error}
        </div>
      )}
    </div>
  )
}