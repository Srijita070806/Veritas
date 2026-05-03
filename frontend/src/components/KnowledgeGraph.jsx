import ReactFlow, {
  MiniMap,
  Controls,
  Background
} from 'reactflow'
import 'reactflow/dist/style.css'

export default function KnowledgeGraph({ data }) {
  if (!data) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#475569',
      fontSize: '14px'
    }}>
      Run analysis to see the knowledge graph
    </div>
  )

  const nodes = data.nodes.map((node, i) => ({
    id: node.id,
    position: {
      x: node.type === 'essay' ? 100 : 500,
      y: i * 80
    },
    data: { label: node.label },
    style: {
      background: node.type === 'essay' ? '#1e40af' : '#6d28d9',
      color: 'white',
      border: data.unverified_ids?.includes(node.id)
        ? '2px solid #ef4444'
        : '1px solid transparent',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '11px',
      maxWidth: '180px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }))

  const edges = data.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    style: {
      stroke: '#3b82f6',
      strokeWidth: edge.stroke_width || 1
    },
    animated: true
  }))

  return (
    <div style={{ height: '100%', background: '#0a0f1e' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        style={{ background: '#0a0f1e' }}>
        <MiniMap
          style={{ background: '#111827' }}
          nodeColor={(node) =>
            node.style?.background || '#3b82f6'
          }
        />
        <Controls />
        <Background color="#1e3a5f" gap={16} />
      </ReactFlow>
    </div>
  )
}