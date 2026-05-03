import { motion } from 'framer-motion'

const colorMap = {
  teal: '#14b8a6',
  purple: '#8b5cf6',
  amber: '#f59e0b',
  coral: '#f97316',
  blue: '#3b82f6',
  green: '#22c55e'
}

export default function DNAStrand({ data }) {
  if (!data) return null

  const { paper_topics, essay_topics, missing_topics } = data
  const blockHeight = 50
  const gap = 8

  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px'
      }}>
        <span style={{ color: '#475569', fontSize: '10px', fontWeight: '600' }}>PAPER</span>
        <span style={{ color: '#475569', fontSize: '10px', fontWeight: '600' }}>ESSAY</span>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>

        {/* Paper Strand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, flex: 1 }}>
          {paper_topics.map((topic, i) => (
            <motion.div
              key={topic.name}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: colorMap[topic.color] || '#3b82f6',
                height: `${(topic.score / 100) * blockHeight}px`,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '8px',
                fontSize: '9px',
                color: 'white',
                fontWeight: '600',
                overflow: 'hidden',
                transformOrigin: 'top'
              }}>
              {topic.name}
            </motion.div>
          ))}
        </div>

        {/* Essay Strand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, flex: 1 }}>
          {paper_topics.map((paperTopic, i) => {
            const isMissing = missing_topics?.includes(paperTopic.name)
            const essayTopic = essay_topics[i]

            if (isMissing) {
              return (
                <div
                  key={paperTopic.name}
                  style={{
                    height: `${(paperTopic.score / 100) * blockHeight}px`,
                    borderRadius: '4px',
                    border: '2px dashed #ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    color: '#ef4444',
                    fontWeight: '600'
                  }}>
                  Missing
                </div>
              )
            }

            return (
              <motion.div
                key={paperTopic.name}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  background: colorMap[essayTopic?.color || paperTopic.color] || '#3b82f6',
                  height: `${((essayTopic?.score || 0) / 100) * blockHeight}px`,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '8px',
                  fontSize: '9px',
                  color: 'white',
                  fontWeight: '600',
                  overflow: 'hidden',
                  transformOrigin: 'top'
                }}>
                {essayTopic?.name || ''}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}