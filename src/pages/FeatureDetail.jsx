import { useParams, useNavigate } from "react-router-dom"
import { features, featureMap } from "../data/features"
import SubmissionPortal from "../components/SubmissionPortal"

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
    <div className="min-h-screen bg-black p-6 max-w-4xl mx-auto">
      <button
        onClick={() => nav("/")}
        className="text-sm text-zinc-400 mb-6 hover:text-white border border-zinc-800 px-3 py-1.5 rounded-lg transition-colors"
      >
        ← Back to Overview
      </button>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">{meta.icon}</span>
        <div>
          <p className="text-xs text-zinc-500 font-mono tracking-tighter uppercase">Module {meta.id}</p>
          <h1 className="text-xl font-medium">{meta.title}</h1>
        </div>
        <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
          meta.difficulty === "Easy" ? "bg-green-900/40 text-green-400 border border-green-800" :
          meta.difficulty === "Hard" ? "bg-red-900/40 text-red-400 border border-red-800" :
          "bg-yellow-900/40 text-yellow-400 border border-yellow-800"
        }`}>
          {meta.difficulty}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          ["Goal", detail.goal],
          ["Requirements", detail.requirements],
        ].map(([label, val]) => (
          <div key={label} className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800/50 backdrop-blur-sm">
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-4 font-bold">{label}</p>
            {Array.isArray(val)
              ? <ul className="space-y-2">
                  {val.map((v, i) => (
                    <li key={i} className="text-xs text-zinc-400 flex gap-2">
                      <span className="text-orange-500 font-bold">/</span> {v}
                    </li>
                  ))}
                </ul>
              : <p className="text-sm text-zinc-300 leading-relaxed">{val}</p>
            }
          </div>
        ))}
      </div>

      {/* Feature Implementation */}
      {meta.id === 1 && <SubmissionPortal />}

      <div className="mt-12 pt-8 border-t border-zinc-900">
        <p className="text-[10px] text-zinc-600 font-mono text-center">VastraVeda Culture Engine v1.0.4 — CommitVerse Release</p>
      </div>
    </div>
  )
}