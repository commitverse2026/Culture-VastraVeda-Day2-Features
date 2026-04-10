import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import FeatureDetail from "./pages/FeatureDetail"
import ClothingVersionControl from "./pages/ClothingVersionControl"
import OpenAPI from "./pages/OpenAPI"
import AISuggestions from "./pages/AISuggestions"
import DebateBoard from "./pages/DebateBoard"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feature/8/debate" element={<DebateBoard />} />
      <Route path="/feature/12" element={<ClothingVersionControl />} />
      <Route path="/feature/13" element={<AISuggestions />} />
      <Route path="/feature/15" element={<OpenAPI />} />
      <Route path="/feature/:id" element={<FeatureDetail />} />
    </Routes>
  )
}
