import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Pricing from './pages/Pricing'
import Demo from './pages/Demo'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'

function App() {
  return (
    <div className="min-h-screen bg-cream-100">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </div>
  )
}

export default App
