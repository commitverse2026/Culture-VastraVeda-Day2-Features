import { useParams, useNavigate } from "react-router-dom"
import { features, featureMap } from "../data/features"
import CommunityPortal from "../features/CommunityPortal/index.jsx"
import DatasetExportPanel from "../components/DatasetExportPanel"
import AISuggestions from "./AISuggestions"
import OpenAPI from "./OpenAPI"

export default function FeatureDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const meta = features.find((f) => f.id === Number(id))
  const detail = featureMap[Number(id)]

  if (!meta || !detail) {
    return (
      <div className="min-h-screen bg-black p-6">
        <p className="text-zinc-400">Feature not found</p>
      </div>
    )
  }

  if (meta.id === 13) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff" }}>
        <div style={{ padding: "16px", maxWidth: "672px", margin: "0 auto" }}>
          <button onClick={() => nav("/")}
            style={{ fontSize:"13px", color:"#71717a", background:"transparent", border:"1px solid #27272a",
              padding:"4px 12px", borderRadius:"8px", cursor:"pointer", marginBottom:"8px" }}>
            ← Back
          </button>
        </div>
        <AISuggestions />
      </div>
    )
  }

  if (meta.id === 15) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff" }}>
        <div style={{ padding: "16px", maxWidth: "720px", margin: "0 auto" }}>
          <button onClick={() => nav("/")}
            style={{ fontSize:"13px", color:"#71717a", background:"transparent", border:"1px solid #27272a",
              padding:"4px 12px", borderRadius:"8px", cursor:"pointer", marginBottom:"8px" }}>
            ← Back
          </button>
        </div>
        <OpenAPI />
      </div>
    )
  }

  const featureRoutes = { 8: "/feature/8/debate" }

  return (
    <div className="min-h-screen bg-black p-6 max-w-2xl mx-auto">
      <button onClick={() => nav("/")}
        className="text-sm text-zinc-400 mb-6 hover:text-white border border-zinc-800 px-3 py-1.5 rounded-lg">
        Back
      </button>

      {meta.id !== 1 && meta.id !== 14 && meta.id !== 5 && meta.id !== 7 && (
        <>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-4xl">{meta.icon}</span>
            <div>
              <p className="text-xs text-zinc-500">Feature {meta.id}</p>
              <h1 className="text-xl font-medium">{meta.title}</h1>
            </div>
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
              meta.difficulty === "Easy" ? "bg-green-900 text-green-300" :
              meta.difficulty === "Hard" ? "bg-red-900 text-red-300" :
              "bg-yellow-900 text-yellow-300"
            }`}>
              {meta.difficulty}
            </span>
          </div>
          <div className="space-y-6 mb-8">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Goal</p>
              <p className="text-zinc-200">{detail.goal}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Requirements</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-300">
                {detail.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Implementation Steps</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-300">
                {detail.steps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Expected Output</p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-300">
                {detail.output.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {featureRoutes[meta.id] && (
        <button
          onClick={() => nav(featureRoutes[meta.id])}
          className="w-full mb-6 bg-amber-600 hover:bg-amber-500 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
        >
          Launch Feature
        </button>
      )}

      {meta.id === 1 && <CommunityPortal />}

      {meta.id === 11 && (
        <div className="mt-8">
          <DatasetExportPanel />
        </div>
      )}
    </div>
  )
}
