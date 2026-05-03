import { useState } from 'react'
import { motion } from 'framer-motion'
import { useVeritas } from '../App'
import Navbar from '../components/Navbar'
import KnowledgeGraph from '../components/KnowledgeGraph'
import axios from 'axios'

export default function GraphPage() {
  const { paperText, essayText, analysisData, setAnalysisData } = useVeritas()
  const [loading, setLoading] = useState(false)
  const [graphData, setGraphData] = useState(analysisData?.graph || null)
  const score = analysisData?.integrity_score?.verified || 0

  const runGraph = async () => {
    if (!paperText || !essayText) { alert('Please upload a paper and paste your essay first!'); return }
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:8000/api/analyze/graph', {
        paper_text: paperText, essay_text: essayText
      })
      setGraphData(res.data)
      setAnalysisData(prev => ({ ...prev, graph: res.data }))
    } catch (e) { alert('Analysis failed: ' + e.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf8', fontFamily: 'Inter, sans-serif' }}>
      <Navbar score={score} />
      <div style={{ padding: '80px 48px 48px', maxWidth: '1200px', margin: '0 auto' }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '24px' }}>
          <p style={{ color: '#7c3aed', fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em', marginBottom: '8px' }}>KNOWLEDGE GRAPH</p>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1c1917', marginBottom: '8px' }}>
            Trace Every Claim 🕸️
          </h1>
          <p style={{ color: '#78716c', fontSize: '15px' }}>
            Blue = essay claims · Purple = paper sources · Red border = unverified
          </p>
        </motion.div>

        {!graphData && (
          <button onClick={runGraph} disabled={loading} style={{
            background: '#7c3aed', color: 'white', border: 'none',
            padding: '12px 32px', borderRadius: '10px', cursor: 'pointer',
            fontWeight: '700', fontSize: '14px', marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(124,58,237,0.3)'
          }}>
            {loading ? '⏳ Building Graph...' : '🕸️ Build Knowledge Graph'}
          </button>
        )}

        <div style={{
          height: '560px', background: '#fff',
          border: '1px solid #e7e5e4', borderRadius: '16px',
          overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <KnowledgeGraph data={graphData} />
        </div>

        {graphData && (
          <div style={{ marginTop: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <p style={{ color: '#9ca3af', fontSize: '13px' }}>
              {graphData.nodes?.filter(n => n.type === 'essay').length} essay claims ·&nbsp;
              {graphData.nodes?.filter(n => n.type === 'paper').length} paper sources ·&nbsp;
              {graphData.unverified_ids?.length} unverified
            </p>
            <button onClick={runGraph} style={{
              background: '#fff', color: '#78716c',
              border: '1px solid #e7e5e4', padding: '8px 20px',
              borderRadius: '8px', cursor: 'pointer',
              fontSize: '13px', fontWeight: '600'
            }}>🔄 Re-run</button>
          </div>
        )}
      </div>
    </div>
  )
}