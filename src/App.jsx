import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import FeatureDetail from "./pages/FeatureDetail"
import ClothingVersionControl from "./pages/ClothingVersionControl"
import OpenAPI from "./pages/OpenAPI"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feature/12" element={<ClothingVersionControl />} />
      <Route path="/feature/15" element={<OpenAPI />} />
      <Route path="/feature/:id" element={<FeatureDetail />} />
    </Routes>
  )
}