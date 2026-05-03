import { useState } from 'react'
import { motion } from 'framer-motion'
import { useVeritas } from '../App'
import Navbar from '../components/Navbar'
import axios from 'axios'

export default function Summary() {
  const { paperText } = useVeritas()
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState(null)

  const runSummary = async () => {
    if (!paperText) {
      alert('Please upload a paper first!')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(
        'http://localhost:8000/api/analyze/summary',
        { paper_text: paperText }
      )
      setSummary(res.data)
    } catch (e) {
      alert('Summary failed: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050510',
      fontFamily: 'Inter, sans-serif'
    }}>
      <Navbar />
      <div style={{
        padding: '80px 48px 48px',
        maxWidth: '900px', margin: '0 auto'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}>
          <div style={{
            color: 'rgba(34,197,94,0.6)',
            fontSize: '11px', letterSpacing: '0.3em',
            fontWeight: '700', marginBottom: '12px'
          }}>AI SUMMARY</div>
          <h1 style={{
            fontSize: '42px', fontWeight: '900',
            color: '#fff', marginBottom: '8px'
          }}>
            UNDERSTAND YOUR <span style={{ color: '#22c55e' }}>PAPER</span>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.3)', fontSize: '14px'
          }}>
            Get an instant AI-generated summary of your research paper
            with key findings, methodology, and conclusions.
          </p>
        </motion.div>

        {!summary && (
          <button
            onClick={runSummary}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #15803d, #22c55e)',
              color: 'white', border: 'none',
              padding: '14px 40px', borderRadius: '6px',
              cursor: 'pointer', fontWeight: '800',
              fontSize: '13px', letterSpacing: '0.1em',
              marginBottom: '32px',
              boxShadow: '0 0 20px rgba(34,197,94,0.3)'
            }}>
            {loading ? '⏳ GENERATING SUMMARY...' : '📝 GENERATE AI SUMMARY'}
          </button>
        )}

        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {[
              { key: 'overview', label: '📋 OVERVIEW', color: '#22c55e' },
              { key: 'methodology', label: '🔬 METHODOLOGY', color: '#3b82f6' },
              { key: 'findings', label: '💡 KEY FINDINGS', color: '#FFD700' },
              { key: 'conclusion', label: '🎯 CONCLUSION', color: '#8b5cf6' }
            ].map(section => (
              summary[section.key] && (
                <div key={section.key} style={{
                  background: `${section.color}05`,
                  border: `1px solid ${section.color}20`,
                  borderRadius: '10px',
                  padding: '24px'
                }}>
                  <div style={{
                    color: section.color,
                    fontSize: '10px', letterSpacing: '0.2em',
                    fontWeight: '700', marginBottom: '12px'
                  }}>{section.label}</div>
                  <p style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '15px', lineHeight: '1.8'
                  }}>{summary[section.key]}</p>
                </div>
              )
            ))}

            <button
              onClick={runSummary}
              style={{
                background: 'transparent',
                color: 'rgba(255,255,255,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '10px 24px', borderRadius: '4px',
                cursor: 'pointer', fontSize: '11px',
                fontWeight: '700', letterSpacing: '0.1em',
                alignSelf: 'flex-start'
              }}>
              🔄 REGENERATE
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}