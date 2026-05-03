import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Plagiarism from './pages/Plagiarism'
import Report from './pages/Report'
import HeatmapPage from './pages/HeatmapPage'
import DNAPage from './pages/DNAPage'
import GraphPage from './pages/GraphPage'
import { createContext, useContext, useState } from 'react'

export const VeritasContext = createContext(null)

export function useVeritas() {
  return useContext(VeritasContext)
}

function App() {
  const [paperText, setPaperText] = useState('')
  const [essayText, setEssayText] = useState('')
  const [filename, setFilename] = useState('')
  const [analysisData, setAnalysisData] = useState(null)

  return (
    <VeritasContext.Provider value={{
      paperText, setPaperText,
      essayText, setEssayText,
      filename, setFilename,
      analysisData, setAnalysisData
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/heatmap" element={<HeatmapPage />} />
          <Route path="/dna" element={<DNAPage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/plagiarism" element={<Plagiarism />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </BrowserRouter>
    </VeritasContext.Provider>
  )
}

export default App