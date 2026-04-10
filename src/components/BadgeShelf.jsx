import { useState } from "react"
import { badgeProgress } from "../data/badges"

// ---------------------------------------------------------------------------
// BadgeTile
// ---------------------------------------------------------------------------
function BadgeTile({ badge, earned, isNew, userStats }) {
  const [hovered, setHovered] = useState(false)
  const pct = userStats ? badgeProgress(badge, userStats) : 0

  return (
    <div
      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border
        w-[88px] shrink-0 transition-all duration-200 cursor-default
        ${earned
          ? "bg-zinc-900 border-zinc-700"
          : "bg-zinc-950 border-zinc-800 opacity-50"
        }
        ${isNew ? "ring-2 ring-amber-400 ring-offset-1 ring-offset-black" : ""}
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isNew && (
        <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
          NEW
        </span>
      )}

      <span className="text-2xl">{badge.icon}</span>
      <span className="text-[11px] font-medium text-white text-center leading-tight">
        {badge.name}
      </span>

      {/* Tooltip on hover */}
      {hovered && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-10
          bg-zinc-800 border border-zinc-700 rounded-lg p-2 w-36 shadow-xl pointer-events-none">
          <p className="text-[11px] text-zinc-300 text-center leading-tight mb-1">
            {badge.description}
          </p>
          {!earned && userStats && (
            <>
              <div className="h-1 bg-zinc-700 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-500 text-center mt-1">
                {userStats[badge.stat] ?? 0} / {badge.threshold}
              </p>
            </>
          )}
          {earned && (
            <p className="text-[10px] text-green-400 text-center mt-1 font-medium">✓ Earned</p>
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ProgressRow — for locked badges
// ---------------------------------------------------------------------------
function ProgressRow({ badge, userStats }) {
  const val = userStats?.[badge.stat] ?? 0
  const pct = Math.min(100, Math.round((val / badge.threshold) * 100))
  const isClose = pct >= 60

  return (
    <div className="flex items-center gap-3">
      <span className="text-base w-5 text-center">{badge.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-zinc-400">{badge.name}</span>
          <span className="text-xs text-zinc-500">{val} / {badge.threshold}</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isClose ? "bg-amber-400" : "bg-zinc-600"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className="text-[10px] text-zinc-600 w-8 text-right">{pct}%</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// BadgeShelf — main export
// ---------------------------------------------------------------------------
export default function BadgeShelf({ earnedBadges, lockedBadges, newBadges, userStats, loading }) {
  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="w-[88px] h-24 bg-zinc-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Earned badges */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-zinc-500 uppercase tracking-widest">Earned badges</p>
          <span className="text-xs text-zinc-600">{earnedBadges.length} / {earnedBadges.length + lockedBadges.length}</span>
        </div>

        {earnedBadges.length === 0 ? (
          <p className="text-sm text-zinc-600 py-2">No badges yet — start contributing!</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {earnedBadges.map((badge) => (
              <BadgeTile
                key={badge.id}
                badge={badge}
                earned
                isNew={newBadges.includes(badge.id)}
                userStats={userStats}
              />
            ))}
          </div>
        )}
      </div>

      {/* Progress toward locked badges */}
      {lockedBadges.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Progress</p>
          <div className="space-y-3">
            {lockedBadges.map((badge) => (
              <ProgressRow key={badge.id} badge={badge} userStats={userStats} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
