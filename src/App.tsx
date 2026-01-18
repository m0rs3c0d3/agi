import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Notes from './pages/Notes'
import Settings from './pages/Settings'
import NeuralNetwork from './pages/NeuralNetwork'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/neural" element={<NeuralNetwork />} />
      <Route element={<Layout />}>
        <Route path="projects" element={<Projects />} />
        <Route path="notes" element={<Notes />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
