// ─── Tiers ───────────────────────────────────────────────────────────────────
export const TIERS = {
  bronze:   { label: "Bronze",    color: "#cd7f32", bg: "bg-amber-950",  text: "text-amber-600",  ring: "ring-amber-700"  },
  silver:   { label: "Silver",    color: "#a8a9ad", bg: "bg-zinc-800",   text: "text-zinc-300",   ring: "ring-zinc-500"   },
  gold:     { label: "Gold",      color: "#ffd700", bg: "bg-yellow-950", text: "text-yellow-400", ring: "ring-yellow-500" },
  platinum: { label: "Platinum",  color: "#e5e4e2", bg: "bg-cyan-950",   text: "text-cyan-300",   ring: "ring-cyan-400"   },
  legendary:{ label: "Legendary", color: "#ff6b6b", bg: "bg-rose-950",   text: "text-rose-400",   ring: "ring-rose-500"   },
}

// ─── Categories ──────────────────────────────────────────────────────────────
export const CATEGORIES = {
  contribution: { label: "Contribution", icon: "📝" },
  media:        { label: "Media",        icon: "📸" },
  community:    { label: "Community",    icon: "💬" },
  knowledge:    { label: "Knowledge",    icon: "🔬" },
  milestone:    { label: "Milestone",    icon: "🌟" },
  special:      { label: "Special",      icon: "✨" },
}

// ─── Badge Rules ─────────────────────────────────────────────────────────────
export const BADGE_RULES = [
  // CONTRIBUTION
  { id:"first_thread",    icon:"🧵", name:"First Thread",      description:"Submit your very first garment to the heritage database.",     category:"contribution", tier:"bronze",   stat:"submissions",     threshold:1,   xp:50,   condition:(s)=>s.submissions>=1    },
  { id:"dedicated_weaver",icon:"🪡", name:"Dedicated Weaver",  description:"Submit 10 garments to the heritage database.",                  category:"contribution", tier:"silver",   stat:"submissions",     threshold:10,  xp:200,  condition:(s)=>s.submissions>=10   },
  { id:"master_archivist",icon:"📜", name:"Master Archivist",  description:"Submit 50 garments — a true heritage champion.",               category:"contribution", tier:"gold",     stat:"submissions",     threshold:50,  xp:1000, condition:(s)=>s.submissions>=50   },
  { id:"grand_custodian", icon:"🏛️", name:"Grand Custodian",   description:"Submit 200 garments. You are a pillar of VastraVeda.",         category:"contribution", tier:"legendary",stat:"submissions",     threshold:200, xp:5000, condition:(s)=>s.submissions>=200  },
  // TAGGING
  { id:"tagger",          icon:"🏷️", name:"Tagger",            description:"Tag your first 5 garments.",                                   category:"contribution", tier:"bronze",   stat:"tags",            threshold:5,   xp:30,   condition:(s)=>s.tags>=5           },
  { id:"tag_master",      icon:"🗂️", name:"Tag Master",        description:"Tag 50 garments with precision.",                              category:"contribution", tier:"silver",   stat:"tags",            threshold:50,  xp:250,  condition:(s)=>s.tags>=50          },
  // MEDIA
  { id:"visual_keeper",   icon:"📸", name:"Visual Keeper",     description:"Upload your first 5 fabric photos.",                           category:"media",        tier:"bronze",   stat:"photos",          threshold:5,   xp:75,   condition:(s)=>s.photos>=5         },
  { id:"lens_master",     icon:"🎞️", name:"Lens Master",       description:"Upload 50 high-quality fabric photos.",                        category:"media",        tier:"gold",     stat:"photos",          threshold:50,  xp:800,  condition:(s)=>s.photos>=50        },
  // KNOWLEDGE
  { id:"fabric_explorer", icon:"🔍", name:"Fabric Explorer",   description:"Identify 5 different fabric types.",                           category:"knowledge",    tier:"bronze",   stat:"fabricIds",       threshold:5,   xp:100,  condition:(s)=>s.fabricIds>=5      },
  { id:"fabric_expert",   icon:"🔬", name:"Fabric Expert",     description:"Identify 20 fabric types — a textile scholar.",                category:"knowledge",    tier:"gold",     stat:"fabricIds",       threshold:20,  xp:900,  condition:(s)=>s.fabricIds>=20     },
  { id:"sub_guru",        icon:"🧪", name:"Substitution Guru", description:"Suggest fabric substitutions for 10 garments.",               category:"knowledge",    tier:"silver",   stat:"substitutions",   threshold:10,  xp:300,  condition:(s)=>s.substitutions>=10 },
  // COMMUNITY
  { id:"debate_starter",  icon:"💬", name:"Debate Starter",    description:"Post your first comment on the debate board.",                 category:"community",    tier:"bronze",   stat:"comments",        threshold:1,   xp:20,   condition:(s)=>s.comments>=1       },
  { id:"debate_voice",    icon:"🗣️", name:"Debate Voice",      description:"Post 25 debate comments.",                                    category:"community",    tier:"silver",   stat:"comments",        threshold:25,  xp:400,  condition:(s)=>s.comments>=25      },
  { id:"issue_reporter",  icon:"🐛", name:"Issue Reporter",    description:"Report 5 data quality issues.",                               category:"community",    tier:"bronze",   stat:"issues",          threshold:5,   xp:60,   condition:(s)=>s.issues>=5         },
  // MILESTONE
  { id:"multilingual",    icon:"🌍", name:"Multilingual",      description:"Submit garments in 3 different languages.",                    category:"milestone",    tier:"silver",   stat:"languages",       threshold:3,   xp:350,  condition:(s)=>s.languages>=3      },
  { id:"century_mark",    icon:"💯", name:"Century Mark",      description:"Reach 100 total contributions.",                              category:"milestone",    tier:"gold",     stat:"total",           threshold:100, xp:1500, condition:(s)=>s.total>=100        },
  { id:"legend",          icon:"🌟", name:"Living Legend",     description:"Reach 500 total contributions. You are VastraVeda.",           category:"milestone",    tier:"legendary",stat:"total",           threshold:500, xp:10000,condition:(s)=>s.total>=500        },
  // SPECIAL
  { id:"speed_weaver",    icon:"⚡", name:"Speed Weaver",      description:"Submit 5 garments in a single day.",                          category:"special",      tier:"platinum", stat:"dailySubmissions", threshold:5,   xp:600,  condition:(s)=>s.dailySubmissions>=5},
  { id:"streak_keeper",   icon:"🔥", name:"Streak Keeper",     description:"Contribute 7 days in a row.",                                 category:"special",      tier:"gold",     stat:"streak",          threshold:7,   xp:700,  condition:(s)=>s.streak>=7         },
]

// ─── Engine ───────────────────────────────────────────────────────────────────
export function evaluateBadges(userStats, alreadyEarned = []) {
  return BADGE_RULES
    .filter((r) => !alreadyEarned.includes(r.id) && r.condition(userStats))
    .map((r) => r.id)
}

export function badgeProgress(badge, userStats) {
  const val = userStats[badge.stat] ?? 0
  return Math.min(100, Math.round((val / badge.threshold) * 100))
}

export function totalXP(earnedIds) {
  return BADGE_RULES
    .filter((b) => earnedIds.includes(b.id))
    .reduce((sum, b) => sum + b.xp, 0)
}

export function userRank(xp) {
  if (xp >= 10000) return { label: "Grand Master",     color: "text-rose-400"   }
  if (xp >= 5000)  return { label: "Platinum Keeper",  color: "text-cyan-300"   }
  if (xp >= 2000)  return { label: "Gold Weaver",      color: "text-yellow-400" }
  if (xp >= 500)   return { label: "Silver Artisan",   color: "text-zinc-300"   }
  return              { label: "Bronze Apprentice", color: "text-amber-600"  }
}
