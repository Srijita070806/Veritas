import { useState } from 'react'
import { motion } from 'framer-motion'
import { useVeritas } from '../App'
import Navbar from '../components/Navbar'
import axios from 'axios'

export default function Plagiarism() {
  const { paperText, essayText } = useVeritas()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const runPlagiarism = async () => {
    if (!paperText || !essayText) { alert('Please upload paper and paste essay first!'); return }
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:8000/api/analyze/plagiarism', {
        paper_text: paperText, essay_text: essayText
      })
      setResult(res.data)
    } catch (e) { alert('Check failed: ' + e.message) }
    finally { setLoading(false) }
  }

  const scoreColor = result
    ? result.similarity > 70 ? '#ef4444'
      : result.similarity > 40 ? '#d97706'
      : '#059669'
    : '#9ca3af'

  const scoreBg = result
    ? result.similarity > 70 ? '#fff1f2'
      : result.similarity > 40 ? '#fffbeb'
      : '#ecfdf5'
    : '#f9fafb'

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf8', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      <div style={{ padding: '80px 48px 48px', maxWidth: '900px', margin: '0 auto' }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '24px' }}>
          <p style={{ color: '#0891b2', fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '8px' }}>PLAGIARISM CHECKER</p>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1c1917', marginBottom: '8px' }}>
            Similarity Score 📊
          </h1>
          <p style={{ color: '#78716c', fontSize: '15px' }}>
            Measures how similar your essay is to the uploaded paper.
          </p>
        </motion.div>

        {!result && (
          <button onClick={runPlagiarism} disabled={loading} style={{
            background: '#0891b2', color: 'white', border: 'none',
            padding: '12px 32px', borderRadius: '10px', cursor: 'pointer',
            fontWeight: '700', fontSize: '14px', marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(8,145,178,0.3)'
          }}>
            {loading ? '⏳ Checking...' : '📊 Check Plagiarism'}
          </button>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

            {/* Big score */}
            <div style={{
              background: scoreBg,
              border: `1px solid ${scoreColor}30`,
              borderRadius: '20px', padding: '48px',
              textAlign: 'center', marginBottom: '20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
            }}>
              <div style={{
                fontSize: '88px', fontWeight: '900',
                color: scoreColor, lineHeight: '1', marginBottom: '8px'
              }}>
                {result.similarity}%
              </div>
              <p style={{ color: '#78716c', fontSize: '13px', fontWeight: '600', letterSpacing: '0.1em' }}>
                SIMILARITY SCORE
              </p>
              <div style={{
                display: 'inline-block',
                background: scoreBg, border: `1px solid ${scoreColor}40`,
                color: scoreColor, padding: '8px 20px',
                borderRadius: '999px', fontSize: '14px',
                fontWeight: '700', marginTop: '16px'
              }}>
                {result.similarity > 70 ? '🚨 High Similarity — Review Required'
                  : result.similarity > 40 ? '⚠️ Moderate Similarity'
                  : '✅ Low Similarity — Looks Original'}
              </div>
            </div>

            {/* Breakdown */}
            <div style={{
              background: '#fff', border: '1px solid #e7e5e4',
              borderRadius: '16px', overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
            }}>
              {result.breakdown?.map((item, i) => (
                <div key={i} style={{
                  padding: '14px 20px',
                  borderBottom: i < result.breakdown.length - 1 ? '1px solid #f3f4f6' : 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div style={{ color: '#44403c', fontSize: '13px', flex: 1, marginRight: '16px' }}>
                    {item.sentence}
                  </div>
                  <div style={{
                    color: item.score > 70 ? '#ef4444' : item.score > 40 ? '#d97706' : '#059669',
                    fontSize: '14px', fontWeight: '800', minWidth: '48px', textAlign: 'right'
                  }}>{item.score}%</div>
                </div>
              ))}
            </div>

            <button onClick={runPlagiarism} style={{
              marginTop: '12px', background: '#fff', color: '#78716c',
              border: '1px solid #e7e5e4', padding: '8px 20px',
              borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
            }}>🔄 Re-check</button>
          </motion.div>
        )}
      </div>
    </div>
  )
}