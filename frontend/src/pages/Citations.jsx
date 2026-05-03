import { useState } from 'react'
import { motion } from 'framer-motion'
import { useVeritas } from '../App'
import Navbar from '../components/Navbar'
import axios from 'axios'

export default function Citations() {
  const { essayText } = useVeritas()
  const [loading, setLoading] = useState(false)
  const [citations, setCitations] = useState(null)

  const runCitations = async () => {
    if (!essayText) {
      alert('Please paste your essay first!')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(
        'http://localhost:8000/api/analyze/citations',
        { essay_text: essayText }
      )
      setCitations(res.data)
    } catch (e) {
      alert('Citation check failed: ' + e.message)
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
            color: 'rgba(249,115,22,0.6)',
            fontSize: '11px', letterSpacing: '0.3em',
            fontWeight: '700', marginBottom: '12px'
          }}>CITATION CHECKER</div>
          <h1 style={{
            fontSize: '42px', fontWeight: '900',
            color: '#fff', marginBottom: '8px'
          }}>
            DETECT FAKE <span style={{ color: '#f97316' }}>CITATIONS</span>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.3)', fontSize: '14px'
          }}>
            AI scans your essay for citations and checks if they are
            real, fabricated, or hallucinated by AI tools.
          </p>
        </motion.div>

        {!citations && (
          <button
            onClick={runCitations}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #c2410c, #f97316)',
              color: 'white', border: 'none',
              padding: '14px 40px', borderRadius: '6px',
              cursor: 'pointer', fontWeight: '800',
              fontSize: '13px', letterSpacing: '0.1em',
              marginBottom: '32px',
              boxShadow: '0 0 20px rgba(249,115,22,0.3)'
            }}>
            {loading ? '⏳ CHECKING CITATIONS...' : '🔍 CHECK CITATIONS'}
          </button>
        )}

        {citations && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            <div style={{
              display: 'flex', gap: '12px', marginBottom: '12px'
            }}>
              {[
                { label: `${citations.real?.length || 0} REAL`, color: '#22c55e' },
                { label: `${citations.suspicious?.length || 0} SUSPICIOUS`, color: '#eab308' },
                { label: `${citations.fake?.length || 0} FAKE`, color: '#ef4444' }
              ].map(s => (
                <div key={s.label} style={{
                  background: `${s.color}10`,
                  border: `1px solid ${s.color}30`,
                  color: s.color, padding: '8px 20px',
                  borderRadius: '4px', fontSize: '12px',
                  fontWeight: '800', letterSpacing: '0.1em'
                }}>{s.label}</div>
              ))}
            </div>

            {citations.citations?.map((cite, i) => (
              <div key={i} style={{
                background: cite.status === 'real'
                  ? 'rgba(34,197,94,0.04)'
                  : cite.status === 'suspicious'
                  ? 'rgba(234,179,8,0.04)'
                  : 'rgba(239,68,68,0.04)',
                border: `1px solid ${
                  cite.status === 'real' ? 'rgba(34,197,94,0.15)'
                  : cite.status === 'suspicious' ? 'rgba(234,179,8,0.15)'
                  : 'rgba(239,68,68,0.15)'
                }`,
                borderRadius: '8px', padding: '16px 20px',
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '13px', marginBottom: '4px'
                  }}>{cite.text}</div>
                  <div style={{
                    color: 'rgba(255,255,255,0.25)',
                    fontSize: '11px'
                  }}>{cite.reason}</div>
                </div>
                <span style={{
                  color: cite.status === 'real' ? '#22c55e'
                    : cite.status === 'suspicious' ? '#eab308'
                    : '#ef4444',
                  fontSize: '10px', fontWeight: '800',
                  letterSpacing: '0.1em',
                  background: cite.status === 'real' ? 'rgba(34,197,94,0.1)'
                    : cite.status === 'suspicious' ? 'rgba(234,179,8,0.1)'
                    : 'rgba(239,68,68,0.1)',
                  padding: '4px 10px', borderRadius: '4px'
                }}>
                  {cite.status.toUpperCase()}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}