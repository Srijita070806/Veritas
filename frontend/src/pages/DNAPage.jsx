import { useState } from 'react'
import { motion } from 'framer-motion'
import { useVeritas } from '../App'
import Navbar from '../components/Navbar'
import DNAStrand from '../components/DNAStrand'
import axios from 'axios'

export default function DNAPage() {
  const { paperText, essayText, analysisData, setAnalysisData } = useVeritas()
  const [loading, setLoading] = useState(false)
  const [dnaData, setDnaData] = useState(analysisData?.dna || null)
  const score = analysisData?.integrity_score?.verified || 0

  const runDNA = async () => {
    if (!paperText || !essayText) { alert('Please upload a paper and paste your essay first!'); return }
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:8000/api/analyze/dna', {
        paper_text: paperText, essay_text: essayText
      })
      setDnaData(res.data)
      setAnalysisData(prev => ({ ...prev, dna: res.data }))
    } catch (e) { alert('Analysis failed: ' + e.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf8', fontFamily: 'Inter, sans-serif' }}>
      <Navbar score={score} />
      <div style={{ padding: '80px 48px 48px', maxWidth: '1100px', margin: '0 auto' }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '24px' }}>
          <p style={{ color: '#d97706', fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '8px' }}>KNOWLEDGE DNA</p>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1c1917', marginBottom: '8px' }}>
            Map the Knowledge Gaps 🧬
          </h1>
          <p style={{ color: '#78716c', fontSize: '15px' }}>
            Topics visualized as DNA strands. Red dashes show what topics you missed.
          </p>
        </motion.div>

        {!dnaData && (
          <button onClick={runDNA} disabled={loading} style={{
            background: '#d97706', color: 'white', border: 'none',
            padding: '12px 32px', borderRadius: '10px', cursor: 'pointer',
            fontWeight: '700', fontSize: '14px', marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(217,119,6,0.3)'
          }}>
            {loading ? '⏳ Extracting Topics...' : '🧬 Run DNA Analysis'}
          </button>
        )}

        {dnaData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

            {dnaData.missing_topics?.length > 0 && (
              <div style={{
                background: '#fff1f2', border: '1px solid #fecaca',
                borderRadius: '12px', padding: '16px 20px', marginBottom: '20px'
              }}>
                <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '10px' }}>⚠ MISSING TOPICS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {dnaData.missing_topics.map(t => (
                    <span key={t} style={{
                      background: '#fff', border: '1px solid #fecaca',
                      color: '#ef4444', padding: '4px 12px',
                      borderRadius: '999px', fontSize: '13px', fontWeight: '600'
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{
              background: '#fff', border: '1px solid #e7e5e4',
              borderRadius: '16px', padding: '32px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <p style={{ color: '#78716c', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em' }}>📄 RESEARCH PAPER</p>
                <p style={{ color: '#78716c', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em' }}>✏️ YOUR ESSAY</p>
              </div>
              <DNAStrand data={dnaData} />
            </div>

            <button onClick={runDNA} style={{
              marginTop: '12px', background: '#fff', color: '#78716c',
              border: '1px solid #e7e5e4', padding: '8px 20px',
              borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
            }}>🔄 Re-run</button>
          </motion.div>
        )}
      </div>
    </div>
  )
}