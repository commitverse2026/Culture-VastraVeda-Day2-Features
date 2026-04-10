import { useState } from "react"
import { useNavigate } from "react-router-dom"

const BADGE_RULES = [
  {
    id: "first_step",
    icon: "🌱",
    name: "First Step",
    description: "Made your first contribution",
    condition: (count) => count >= 1,
    color: "border-green-700 bg-green-900/30",
    labelColor: "text-green-400",
  },
  {
    id: "rising_star",
    icon: "⭐",
    name: "Rising Star",
    description: "Contributed 3 times",
    condition: (count) => count >= 3,
    color: "border-yellow-700 bg-yellow-900/30",
    labelColor: "text-yellow-400",
  },
  {
    id: "culture_keeper",
    icon: "🏛️",
    name: "Culture Keeper",
    description: "Contributed 5 times",
    condition: (count) => count >= 5,
    color: "border-orange-700 bg-orange-900/30",
    labelColor: "text-orange-400",
  },
  {
    id: "heritage_hero",
    icon: "🦁",
    name: "Heritage Hero",
    description: "Contributed 10 times",
    condition: (count) => count >= 10,
    color: "border-purple-700 bg-purple-900/30",
    labelColor: "text-purple-400",
  },
  {
    id: "veda_master",
    icon: "🏅",
    name: "Veda Master",
    description: "Contributed 20 times",
    condition: (count) => count >= 20,
    color: "border-red-700 bg-red-900/30",
    labelColor: "text-red-400",
  },
]

const MILESTONES = [1, 3, 5, 10, 20]

export default function Feature6Page() {
  const nav = useNavigate()
  const [contributions, setContributions] = useState(0)
  const [history, setHistory] = useState([])
  const [lastBadge, setLastBadge] = useState(null)

  const contribute = () => {
    const newCount = contributions + 1
    setContributions(newCount)
    setHistory((prev) => [
      { id: Date.now(), label: `Contribution #${newCount}`, time: new Date().toLocaleTimeString() },
      ...prev,
    ])

    // Check if this count just crossed a milestone
    const newBadge = [...BADGE_RULES]
      .reverse()
      .find((b) => b.condition(newCount) && !b.condition(newCount - 1))
    if (newBadge) {
      setLastBadge(newBadge)
      setTimeout(() => setLastBadge(null), 3000)
    }
  }

  const reset = () => {
    setContributions(0)
    setHistory([])
    setLastBadge(null)
  }

  const earnedBadges = BADGE_RULES.filter((b) => b.condition(contributions))
  const nextMilestone = MILESTONES.find((m) => m > contributions) ?? null
  const progress = nextMilestone
    ? Math.round((contributions / nextMilestone) * 100)
    : 100

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-3xl mx-auto">
      {/* Header */}
      <button
        onClick={() => nav("/")}
        className="text-sm text-zinc-400 mb-6 hover:text-white border border-zinc-800 px-3 py-1.5 rounded-lg"
      >
        ← Back
      </button>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl">🏅</span>
        <div>
          <p className="text-xs text-zinc-500">Feature 6</p>
          <h1 className="text-xl font-medium">Clothing Heritage Badges</h1>
        </div>
      </div>
      <p className="text-sm text-zinc-400 mb-8">
        Earn badges by contributing cultural clothing data.
      </p>

      {/* Badge Unlock Toast */}
      {lastBadge && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-orange-500 rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="text-3xl">{lastBadge.icon}</span>
          <div>
            <p className="text-orange-400 font-semibold text-sm">Badge Unlocked!</p>
            <p className="text-white font-bold">{lastBadge.name}</p>
          </div>
        </div>
      )}

      {/* Profile Stats Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
              Total Contributions
            </p>
            <p className="text-5xl font-bold text-orange-400">{contributions}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 mb-1">Badges Earned</p>
            <p className="text-3xl font-bold text-white">{earnedBadges.length}</p>
          </div>
        </div>

        {/* Progress Bar */}
        {nextMilestone && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-zinc-500 mb-1">
              <span>Progress to next badge</span>
              <span>{contributions} / {nextMilestone}</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        {!nextMilestone && (
          <p className="text-green-400 text-sm mb-4">🎉 All badges unlocked!</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={contribute}
            className="flex-1 bg-orange-700 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            + Make a Contribution
          </button>
          <button
            onClick={reset}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-4 py-2.5 rounded-xl text-sm"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Badge Shelf */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Badge Shelf</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BADGE_RULES.map((badge) => {
            const earned = badge.condition(contributions)
            return (
              <div
                key={badge.id}
                className={`rounded-xl p-4 border transition-all duration-300 ${
                  earned
                    ? badge.color
                    : "border-zinc-800 bg-zinc-800/30 opacity-40 grayscale"
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <p className={`text-sm font-semibold mb-1 ${earned ? badge.labelColor : "text-zinc-500"}`}>
                  {badge.name}
                </p>
                <p className="text-xs text-zinc-500">{badge.description}</p>
                {earned && (
                  <span className="inline-block mt-2 text-xs bg-zinc-700 px-2 py-0.5 rounded-full text-zinc-300">
                    ✓ Earned
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Contribution History */}
      {history.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
            Contribution History
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between text-sm bg-zinc-800 rounded-lg px-3 py-2"
              >
                <span className="text-zinc-300">{h.label}</span>
                <span className="text-zinc-500 text-xs">{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}