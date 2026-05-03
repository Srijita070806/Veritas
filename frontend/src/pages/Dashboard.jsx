import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useVeritas } from '../App'
import Navbar from '../components/Navbar'
import ScoreRing from '../components/ScoreRing'

const features = [
  { path: '/upload', icon: '📄', title: 'Upload Sources', desc: 'Upload PDF or capture with camera', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
  { path: '/heatmap', icon: '🌡️', title: 'Heatmap', desc: 'Detect hallucinated sentences', color: '#ef4444', bg: '#fff1f2', border: '#fecaca' },
  { path: '/dna', icon: '🧬', title: 'Knowledge DNA', desc: 'Map topic coverage gaps', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  { path: '/graph', icon: '🕸️', title: 'Knowledge Graph', desc: 'Trace claims to sources', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  { path: '/plagiarism', icon: '📊', title: 'Plagiarism', desc: 'Check similarity score', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
  { path: '/report', icon: '📑', title: 'Export Report', desc: 'Download full analysis', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
]

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' }
  })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { paperText, essayText, analysisData } = useVeritas()
  const score = analysisData?.integrity_score?.verified || 0

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafaf8',
      fontFamily: 'Inter, sans-serif'
    }}>
      <Navbar score={score} />

      <div style={{
        padding: '80px 48px 48px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}>
          <p style={{
            color: '#f97316', fontSize: '13px',
            fontWeight: '700', letterSpacing: '0.1em',
            marginBottom: '8px'
          }}>
            VERITAS DASHBOARD
          </p>
          <h1 style={{
            fontSize: '36px', fontWeight: '800',
            color: '#1c1917', lineHeight: '1.2',
            marginBottom: '8px'
          }}>
            Welcome to Veritas! 👋
          </h1>
          <p style={{
            color: '#78716c', fontSize: '15px'
          }}>
            {paperText
              ? '✅ Paper loaded — select a feature below to analyse'
              : '⚡ Start by uploading your research paper'}
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '220px 1fr',
            gap: '20px',
            marginBottom: '32px'
          }}>

          {/* Score Ring */}
          <div style={{
            background: '#fff',
            border: '1px solid #e7e5e4',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
          }}>
            <ScoreRing score={score} />
            <p style={{
              color: '#78716c', fontSize: '12px',
              marginTop: '8px', letterSpacing: '0.05em',
              fontWeight: '600'
            }}>INTEGRITY SCORE</p>
          </div>

          {/* Status Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            {[
              { label: 'Paper Status', value: paperText ? 'Loaded' : 'Empty', color: paperText ? '#059669' : '#9ca3af', icon: '📄', bg: paperText ? '#ecfdf5' : '#f9fafb' },
              { label: 'Essay Status', value: essayText ? 'Ready' : 'Empty', color: essayText ? '#059669' : '#9ca3af', icon: '✏️', bg: essayText ? '#ecfdf5' : '#f9fafb' },
              { label: 'Analysis', value: analysisData ? 'Complete' : 'Pending', color: analysisData ? '#7c3aed' : '#9ca3af', icon: '⚡', bg: analysisData ? '#f5f3ff' : '#f9fafb' },
              { label: 'Verified', value: analysisData ? `${analysisData.integrity_score?.verified || 0}%` : '—', color: '#059669', icon: '✓', bg: '#ecfdf5' },
              { label: 'Weak', value: analysisData ? `${analysisData.integrity_score?.weak || 0}%` : '—', color: '#d97706', icon: '⚠', bg: '#fffbeb' },
              { label: 'Hallucinated', value: analysisData ? `${analysisData.integrity_score?.hallucinated || 0}%` : '—', color: '#ef4444', icon: '✗', bg: '#fff1f2' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                style={{
                  background: stat.bg,
                  border: '1px solid #e7e5e4',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}>
                <div style={{
                  color: '#78716c', fontSize: '11px',
                  fontWeight: '600', marginBottom: '6px',
                  letterSpacing: '0.05em'
                }}>
                  {stat.icon} {stat.label.toUpperCase()}
                </div>
                <div style={{
                  color: stat.color,
                  fontSize: '22px', fontWeight: '800'
                }}>
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{
            color: '#78716c', fontSize: '12px',
            fontWeight: '700', letterSpacing: '0.1em',
            marginBottom: '16px'
          }}>
            SELECT A FEATURE
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            {features.map((feature, i) => (
              <motion.div
                key={feature.path}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{
                  scale: 1.04,
                  boxShadow: `0 8px 30px ${feature.color}25`,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(feature.path)}
                style={{
                  background: '#fff',
                  border: `1px solid ${feature.border}`,
                  borderRadius: '16px',
                  padding: '28px 24px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>

                {/* Colored top bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: '3px', background: feature.color,
                  borderRadius: '16px 16px 0 0'
                }} />

                {/* Icon circle */}
                <div style={{
                  width: '52px', height: '52px',
                  borderRadius: '14px',
                  background: feature.bg,
                  border: `1px solid ${feature.border}`,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '16px'
                }}>
                  {feature.icon}
                </div>

                <div style={{
                  color: '#1c1917', fontSize: '16px',
                  fontWeight: '700', marginBottom: '6px'
                }}>
                  {feature.title}
                </div>

                <div style={{
                  color: '#78716c', fontSize: '13px',
                  lineHeight: '1.6', marginBottom: '16px'
                }}>
                  {feature.desc}
                </div>

                {/* Bottom action */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: '6px', color: feature.color,
                  fontSize: '13px', fontWeight: '700'
                }}>
                  Open
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}>
                    →
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {analysisData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              background: '#fff',
              border: '1px solid #e7e5e4',
              borderRadius: '16px',
              padding: '24px',
              marginTop: '20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
            }}>
            <p style={{
              color: '#78716c', fontSize: '12px',
              fontWeight: '700', letterSpacing: '0.1em',
              marginBottom: '16px'
            }}>
              LAST ANALYSIS RESULTS
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {[
                { label: `${analysisData.integrity_score?.verified || 0}% Verified`, color: '#059669', bg: '#ecfdf5' },
                { label: `${analysisData.integrity_score?.weak || 0}% Weak`, color: '#d97706', bg: '#fffbeb' },
                { label: `${analysisData.integrity_score?.hallucinated || 0}% Hallucinated`, color: '#ef4444', bg: '#fff1f2' },
              ].map(item => (
                <div key={item.label} style={{
                  background: item.bg, color: item.color,
                  padding: '8px 16px', borderRadius: '999px',
                  fontSize: '13px', fontWeight: '700'
                }}>
                  {item.label}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}