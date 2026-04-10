import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import FeatureDetail from "./pages/FeatureDetail"
import DebateBoard from "./pages/DebateBoard"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feature/12" element={<ClothingVersionControl />} />
      <Route path="/feature/:id" element={<FeatureDetail />} />
      <Route path="/feature/8/debate" element={<DebateBoard />} />
    </Routes>
  )
}