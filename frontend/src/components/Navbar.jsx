import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/dashboard', label: 'OVERVIEW', icon: '⚡' },
  { path: '/upload', label: 'UPLOAD', icon: '📄' },
  { path: '/heatmap', label: 'HEATMAP', icon: '🌡️' },
  { path: '/dna', label: 'DNA', icon: '🧬' },
  { path: '/graph', label: 'GRAPH', icon: '🕸️' },
  { path: '/plagiarism', label: 'PLAGIARISM', icon: '📊' },
  { path: '/report', label: 'REPORT', icon: '📑' },
]

export default function Navbar({ score = 0 }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const scoreColor = score > 75 ? '#059669' : score > 50 ? '#d97706' : score > 0 ? '#ef4444' : '#9ca3af'

  if (isLanding) return null

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      background: 'rgba(255,255,255,0.95)',
      borderBottom: '1px solid #e7e5e4',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
    }}>

      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{
          fontSize: '16px', fontWeight: '800',
          color: '#1c1917', letterSpacing: '0.05em',
          cursor: 'pointer', display: 'flex',
          alignItems: 'center', gap: '8px',
          minWidth: '120px'
        }}>
        ⚖️ <span style={{ color: '#f97316' }}>Veritas</span>
      </div>

      {/* Nav Items */}
      <div style={{
        display: 'flex', alignItems: 'center',
        gap: '4px', overflowX: 'auto'
      }}>
        {navItems.map(item => {
          const isActive = location.pathname === item.path
          return (
            <motion.button
              key={item.path}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(item.path)}
              style={{
                background: isActive ? '#fff7ed' : 'transparent',
                border: isActive ? '1px solid #fed7aa' : '1px solid transparent',
                color: isActive ? '#f97316' : '#78716c',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '11px',
                letterSpacing: '0.08em',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s'
              }}>
              {item.icon} {item.label}
            </motion.button>
          )
        })}
      </div>

      {/* Score */}
      <div style={{ minWidth: '120px', display: 'flex', justifyContent: 'flex-end' }}>
        {score > 0 ? (
          <div style={{
            background: `${scoreColor}15`,
            border: `1px solid ${scoreColor}40`,
            color: scoreColor,
            padding: '5px 14px', borderRadius: '999px',
            fontSize: '11px', fontWeight: '800',
            letterSpacing: '0.08em',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: scoreColor
            }} />
            {score}% INTEGRITY
          </div>
        ) : (
          <div style={{
            color: '#9ca3af', fontSize: '11px',
            letterSpacing: '0.1em', fontWeight: '600'
          }}>
            RESEARCH INTEGRITY
          </div>
        )}
      </div>
    </nav>
  )
}