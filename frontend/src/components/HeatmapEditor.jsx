import { motion } from 'framer-motion'
import { useState } from 'react'

export default function HeatmapEditor({ data }) {
  const [tooltip, setTooltip] = useState(null)

  if (!data) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#475569',
      fontSize: '14px'
    }}>
      Run analysis to see the heatmap
    </div>
  )

  const { results, integrity_score } = data
  const getColor = (status) => {
    if (status === 'verified') return 'rgba(34,197,94,0.25)'
    if (status === 'weak') return 'rgba(234,179,8,0.25)'
    return 'rgba(239,68,68,0.25)'
  }

  const getBorder = (status) => {
    if (status === 'verified') return '1px solid rgba(34,197,94,0.5)'
    if (status === 'weak') return '1px solid rgba(234,179,8,0.5)'
    return '1px solid rgba(239,68,68,0.5)'
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Score Bar */}
      <div style={{
        padding: '12px 24px',
        borderBottom: '1px solid #1e3a5f',
        display: 'flex',
        gap: '12px',
        background: '#111827'
      }}>
        <span style={{
          background: 'rgba(34,197,94,0.2)',
          color: '#22c55e',
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          ✓ {integrity_score.verified}% Verified
        </span>
        <span style={{
          background: 'rgba(234,179,8,0.2)',
          color: '#eab308',
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          ⚠ {integrity_score.weak}% Weak
        </span>
        <span style={{
          background: 'rgba(239,68,68,0.2)',
          color: '#ef4444',
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          ✗ {integrity_score.hallucinated}% Hallucinated
        </span>
      </div>

      {/* Essay with highlights */}
      <div style={{
        padding: '24px',
        overflowY: 'auto',
        flex: 1,
        lineHeight: '2',
        fontSize: '15px',
        color: '#f1f5f9',
        position: 'relative'
      }}>
        {results.map((result, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            onMouseEnter={(e) => setTooltip({
              text: result.source_quote,
              x: e.clientX,
              y: e.clientY,
              status: result.status
            })}
            onMouseLeave={() => setTooltip(null)}
            style={{
              background: getColor(result.status),
              border: getBorder(result.status),
              borderRadius: '4px',
              padding: '2px 4px',
              margin: '0 2px',
              cursor: 'pointer',
              display: 'inline'
            }}>
            {result.sentence}.{' '}
          </motion.span>
        ))}

        {/* Tooltip */}
        {tooltip && (
          <div style={{
            position: 'fixed',
            left: tooltip.x + 10,
            top: tooltip.y - 80,
            background: '#1a2235',
            border: '1px solid #1e3a5f',
            borderRadius: '8px',
            padding: '12px',
            maxWidth: '300px',
            fontSize: '12px',
            color: '#94a3b8',
            zIndex: 1000,
            pointerEvents: 'none',
            lineHeight: '1.6'
          }}>
            <div style={{
              color: tooltip.status === 'verified' ? '#22c55e' :
                     tooltip.status === 'weak' ? '#eab308' : '#ef4444',
              fontWeight: '600',
              marginBottom: '6px',
              textTransform: 'uppercase',
              fontSize: '10px'
            }}>
              {tooltip.status}
            </div>
            {tooltip.text}
          </div>
        )}
      </div>
    </div>
  )
}