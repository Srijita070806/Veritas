import { useState } from 'react'
import { motion } from 'framer-motion'
import { useVeritas } from '../App'
import Navbar from '../components/Navbar'
import HeatmapEditor from '../components/HeatmapEditor'
import axios from 'axios'

export default function HeatmapPage() {
  const { paperText, essayText, analysisData, setAnalysisData } = useVeritas()
  const [loading, setLoading] = useState(false)
  const [heatmapData, setHeatmapData] = useState(analysisData?.heatmap || null)
  const score = heatmapData?.integrity_score?.verified || 0

  const runHeatmap = async () => {
    if (!paperText || !essayText) { alert('Please upload a paper and paste your essay first!'); return }
    setLoading(true)
    try {
      const sentences = essayText.split('. ').filter(s => s.trim().length > 10)
      const res = await axios.post('http://localhost:8000/api/analyze/heatmap', {
        paper_text: paperText, essay_sentences: sentences
      })
      setHeatmapData(res.data)
      setAnalysisData(prev => ({ ...prev, heatmap: res.data, integrity_score: res.data.integrity_score }))
    } catch (e) { alert('Analysis failed: ' + e.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf8', fontFamily: 'Inter, sans-serif' }}>
      <Navbar score={score} />
      <div style={{ padding: '80px 48px 48px', maxWidth: '1100px', margin: '0 auto' }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '24px' }}>
          <p style={{ color: '#ef4444', fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '8px' }}>HALLUCINATION HEATMAP</p>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1c1917', marginBottom: '8px' }}>
            Catch the Hallucinations 🌡️
          </h1>
          <p style={{ color: '#78716c', fontSize: '15px' }}>
            Green = verified · Yellow = weak match · Red = hallucinated
          </p>
        </motion.div>

        {heatmapData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {[
              { label: `${heatmapData.integrity_score.verified}% Verified`, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
              { label: `${heatmapData.integrity_score.weak}% Weak`, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
              { label: `${heatmapData.integrity_score.hallucinated}% Hallucinated`, color: '#ef4444', bg: '#fff1f2', border: '#fecaca' }
            ].map(s => (
              <div key={s.label} style={{
                background: s.bg, border: `1px solid ${s.border}`,
                color: s.color, padding: '8px 20px', borderRadius: '999px',
                fontSize: '13px', fontWeight: '700'
              }}>{s.label}</div>
            ))}
          </motion.div>
        )}

        {!heatmapData && (
          <button onClick={runHeatmap} disabled={loading} style={{
            background: '#ef4444', color: 'white', border: 'none',
            padding: '12px 32px', borderRadius: '10px', cursor: 'pointer',
            fontWeight: '700', fontSize: '14px', marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(239,68,68,0.3)'
          }}>
            {loading ? '⏳ Analysing...' : '🌡️ Run Heatmap Analysis'}
          </button>
        )}

        <div style={{
          background: '#fff', border: '1px solid #e7e5e4',
          borderRadius: '16px', overflow: 'hidden', minHeight: '400px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <HeatmapEditor data={heatmapData} />
        </div>

        {heatmapData && (
          <button onClick={runHeatmap} style={{
            marginTop: '12px', background: '#fff', color: '#78716c',
            border: '1px solid #e7e5e4', padding: '8px 20px',
            borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
          }}>🔄 Re-run Analysis</button>
        )}
      </div>
    </div>
  )
}