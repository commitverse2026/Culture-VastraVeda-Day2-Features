import { useParams, useNavigate } from "react-router-dom"
import { features, featureMap } from "../data/features"
import CommunityPortal from "../features/CommunityPortal/index.jsx"
import MediaContributionFeature from "../features/MediaContributionFeature/index.jsx"

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
        ← Back
      </button>

      {meta.id !== 1 && meta.id !== 5 && (
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

          {[
            detail.goal && ["Goal", detail.goal],
            detail.requirements && ["Requirements", detail.requirements],
            detail.steps && ["Steps", detail.steps],
            detail.output && ["Output", detail.output]
          ].filter(Boolean).map(([label, val]) => (
            <div key={label} className="bg-zinc-900 rounded-xl p-4 mb-4 border border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">{label}</p>
              {Array.isArray(val)
                ? <ul className="space-y-1">
                    {val.map((v, i) => (
                      <li key={i} className="text-sm text-zinc-300">• {v}</li>
                    ))}
                  </ul>
                : <p className="text-sm text-zinc-300">{val}</p>
              }
            </div>
          ))}
        </>
      )}

      {meta.id === 1 && (
        <CommunityPortal />
      )}

      {meta.id === 5 && (
        <MediaContributionFeature />
      )}
    </div>
  )
}