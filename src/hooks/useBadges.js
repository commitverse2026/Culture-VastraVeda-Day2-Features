import { useState, useEffect } from "react"
import { BADGE_RULES, evaluateBadges, totalXP } from "../data/badges"

// ─── Mock data — swap these three functions for real API calls ─────────────
const MOCK_STATS = {
  submissions:      12,
  photos:           5,
  tags:             31,
  languages:        1,
  substitutions:    3,
  fabricIds:        7,
  total:            62,
  comments:         4,
  issues:           2,
  dailySubmissions: 3,
  streak:           4,
}

const MOCK_EARNED_IDS = ["first_thread", "dedicated_weaver", "visual_keeper", "tagger", "tag_master", "debate_starter", "fabric_explorer"]

const MOCK_ACTIVITY = [
  { id:1, type:"badge_earned", badge:"tag_master",      text:"Earned Tag Master badge",           time:"2 hours ago"   },
  { id:2, type:"submission",   badge:null,               text:"Submitted Banarasi Silk saree",     time:"3 hours ago"   },
  { id:3, type:"badge_earned", badge:"fabric_explorer",  text:"Earned Fabric Explorer badge",      time:"Yesterday"     },
  { id:4, type:"tag",          badge:null,               text:"Tagged 3 garments",                 time:"Yesterday"     },
  { id:5, type:"submission",   badge:null,               text:"Submitted Chanderi cotton dupatta", time:"2 days ago"    },
  { id:6, type:"badge_earned", badge:"visual_keeper",    text:"Earned Visual Keeper badge",        time:"3 days ago"    },
]

async function fetchUserStats()       { return MOCK_STATS }
async function fetchEarnedBadgeIds()  { return MOCK_EARNED_IDS }
async function fetchActivity()        { return MOCK_ACTIVITY }
async function awardBadges()          { /* POST to backend */ }
// ─────────────────────────────────────────────────────────────────────────────

export function useBadges(userId = "demo") {
  const [earnedIds, setEarnedIds] = useState([])
  const [userStats, setUserStats] = useState(null)
  const [newBadges, setNewBadges] = useState([])
  const [activity,  setActivity ] = useState([])
  const [loading,   setLoading  ] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const [stats, earned, act] = await Promise.all([
        fetchUserStats(userId),
        fetchEarnedBadgeIds(userId),
        fetchActivity(userId),
      ])
      if (cancelled) return

      setUserStats(stats)
      setEarnedIds(earned)
      setActivity(act)

      const fresh = evaluateBadges(stats, earned)
      if (fresh.length > 0) {
        await awardBadges(userId, fresh)
        if (!cancelled) {
          setEarnedIds((prev) => [...prev, ...fresh])
          setNewBadges(fresh)
        }
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [userId])

  const earnedBadges = BADGE_RULES.filter((b) => earnedIds.includes(b.id))
  const lockedBadges = BADGE_RULES.filter((b) => !earnedIds.includes(b.id))
  const xp           = totalXP(earnedIds)

  return { earnedBadges, lockedBadges, newBadges, userStats, activity, xp, loading }
}
