import { motion } from 'framer-motion'

export default function ScoreRing({ score }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score > 75 ? '#22c55e' : score > 50 ? '#eab308' : '#ef4444'

  return (
    <div style={{ textAlign: 'center', padding: '10px 0' }}>
      <svg width="140" height="140" style={{ margin: '0 auto', display: 'block' }}>
        {/* Background circle */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="#1e3a5f"
          strokeWidth="10"
        />
        {/* Animated score circle */}
        <motion.circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
        />
        {/* Score text */}
        <text
          x="70" y="65"
          textAnchor="middle"
          fill={color}
          fontSize="28"
          fontWeight="700"
          fontFamily="Inter">
          {score}
        </text>
        <text
          x="70" y="85"
          textAnchor="middle"
          fill="#475569"
          fontSize="11"
          fontFamily="Inter">
          INTEGRITY
        </text>
      </svg>
    </div>
  )
}