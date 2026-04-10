import { useParams, useNavigate } from "react-router-dom"
import { features, featureMap } from "../data/features"
import CommunityPortal from "../features/CommunityPortal/index.jsx"
import FabricIdentifierFeature from "../features/FabricIdentifierFeature/index.jsx"
import MediaContributionFeature from "../features/MediaContributionFeature/index.jsx"

const featureRoutes = {
  8: "/feature/8/debate",
}

export default function FeatureDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const meta = features.find(f => f.id === Number(id))
  const detail = featureMap[Number(id)]

  if (!meta || !detail) return (
    <div className="min-h-screen bg-black p-6">
      <p className="text-zinc-400">Feature not found</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-black p-6 max-w-2xl mx-auto">
      <button
        onClick={() => nav("/")}
        className="text-sm text-zinc-400 mb-6 hover:text-white border border-zinc-800 px-3 py-1.5 rounded-lg"
      >
        Back
      </button>

      {meta.id !== 1 && meta.id !== 14 && meta.id !== 5 && (
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

      {featureRoutes[meta.id] && (
        <button
          onClick={() => nav(featureRoutes[meta.id])}
          className="w-full mb-6 bg-amber-600 hover:bg-amber-500 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
        >
          Launch Feature
        </button>
      )}

      {meta.id === 1 && (
        <CommunityPortal />
      )}

      {meta.id === 14 && (
        <FabricIdentifierFeature />
      )}

      {meta.id === 5 && (
        <MediaContributionFeature />
      )}
    </div>
  )
}