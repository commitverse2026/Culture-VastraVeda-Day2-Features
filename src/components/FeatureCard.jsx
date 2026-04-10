import { useNavigate } from "react-router-dom"

const IMPLEMENTED = [12]

export default function FeatureCard({ feature }) {
  const nav = useNavigate()
  const isImpl = IMPLEMENTED.includes(feature.id)

  return (
    <div
      onClick={() => nav(`/feature/${feature.id}`)}
      className={`bg-zinc-900 border rounded-xl p-4 cursor-pointer hover:scale-105 transition-all duration-200
        ${isImpl ? "border-violet-700 hover:border-violet-500 shadow-lg shadow-violet-900/20" : "border-zinc-800 hover:border-zinc-600"}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{feature.icon}</span>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            feature.difficulty === "Easy" ? "bg-green-900 text-green-300" :
            feature.difficulty === "Hard" ? "bg-red-900 text-red-300" :
            "bg-yellow-900 text-yellow-300"
          }`}>
            {feature.difficulty}
          </span>
          {isImpl && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-violet-900 text-violet-300 border border-violet-700">
              ✅ Live
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-zinc-500 mb-1">Feature {feature.id}</p>
      <h3 className="text-sm font-medium text-white">{feature.title}</h3>
      {isImpl && (
        <p className="text-xs text-violet-400 mt-2 font-medium">Launch Demo →</p>
      )}
    </div>
  )
}