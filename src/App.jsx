import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import FeatureDetail from "./pages/FeatureDetail"
import Feature3Page from "./pages/Feature3Page"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feature/3" element={<Feature3Page />} />
      <Route path="/feature/:id" element={<FeatureDetail />} />
      <Route path="/feature/8/debate" element={<DebateBoard />} />
  
    </Routes>
  )
}